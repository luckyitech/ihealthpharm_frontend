import { Injectable, NgZone } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Environment } from 'src/app/core/environment';

const TOKEN_KEY = 'token';
/** When this browser received the current token, by this computer's clock. */
const TOKEN_RECEIVED_AT_KEY = 'tokenReceivedAt';
const TOKEN_PREFIX = 'Bearer ';

/** How often each open tab looks at the session. */
const CHECK_INTERVAL_MS = 15 * 1000;
/** An active user's token is renewed once it is at least this old, not on every click. */
const MIN_TOKEN_AGE_BEFORE_RENEWAL_MS = 30 * 1000;
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * 1000;

const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'wheel', 'touchstart'];

/**
 * Signs the user out after a period without activity.
 *
 * The length of that period is NOT set here. It is the lifetime the server
 * gives a token (jwt.token.expiration.in.seconds), read from the token itself,
 * so there is one setting and the screens can never disagree with the server.
 *
 * While the user is working the token is renewed in the background, which
 * pushes the deadline forward. When they stop, nothing renews it, the token
 * runs out, and the server refuses it from then on - so the sign-out holds
 * even if this code never runs (browser closed, computer asleep).
 *
 * Everything is kept in localStorage, which all tabs share: working in one tab
 * keeps the others signed in, and signing out in one signs them all out.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly environment = new Environment();
  /** Bypasses the interceptors: the 401 handler there calls back into this service. */
  private readonly http: HttpClient;
  private started = false;
  private activitySinceRenewal = false;
  private renewalInFlight = false;

  constructor(httpBackend: HttpBackend, private router: Router, private zone: NgZone,
    private toasterService: ToastrService) {
    this.http = new HttpClient(httpBackend);
  }

  /** Begins watching. Called once, when the application starts. */
  start(): void {
    if (this.started) {
      return;
    }
    this.started = true;
    // Outside Angular: these fire constantly and must not trigger change detection.
    this.zone.runOutsideAngular(() => {
      ACTIVITY_EVENTS.forEach(eventName =>
        document.addEventListener(eventName, () => this.activitySinceRenewal = true, { passive: true, capture: true }));
      setInterval(() => this.check(), CHECK_INTERVAL_MS);
      // A background tab's timers are slowed down, so look again the moment it is shown.
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.check();
        }
      });
    });
  }

  /** Records a token the server has just issued, at sign-in or renewal. */
  storeToken(rawToken: string): void {
    localStorage.setItem(TOKEN_KEY, `${TOKEN_PREFIX}${rawToken}`);
    localStorage.setItem(TOKEN_RECEIVED_AT_KEY, `${Date.now()}`);
  }

  /** True while there is a token the server would still accept. */
  isSignedIn(): boolean {
    const deadline = this.deadline();
    return deadline !== null && Date.now() < deadline;
  }

  /** True when a token is stored at all, usable or not. */
  hasStoredSession(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  /** Forgets the session and shows the login page. */
  signOut(): void {
    localStorage.clear();
    this.zone.run(() => this.router.navigate(['/login']));
  }

  /** Signs out because the session ran out, and tells the user why. */
  signOutExpired(): void {
    const minutes = this.idleMinutes();
    this.signOut();
    const period = minutes ? `${minutes} minutes` : 'a while';
    this.zone.run(() => this.toasterService.info(
      `You were signed out after ${period} without activity. Please sign in again.`, 'Signed out',
      { timeOut: 10000 }));
  }

  private check(): void {
    if (!this.hasStoredSession()) {
      // Signed out in another tab: leave whatever screen this tab was showing.
      if (!this.isOnLoginPage()) {
        this.signOut();
      }
      return;
    }
    if (!this.isSignedIn()) {
      this.signOutExpired();
      return;
    }
    if (this.activitySinceRenewal && !this.renewalInFlight && this.tokenAge() >= MIN_TOKEN_AGE_BEFORE_RENEWAL_MS) {
      this.renew();
    }
  }

  private renew(): void {
    const tokenAtRequest = localStorage.getItem(TOKEN_KEY);
    this.renewalInFlight = true;
    this.activitySinceRenewal = false;
    this.http.get(`${this.environment.url}refresh`, { headers: new HttpHeaders({ Authorization: tokenAtRequest }) })
      .subscribe(
        response => {
          this.renewalInFlight = false;
          // Skip if the user signed out, or another tab renewed, while this was on its way.
          if (response && response['token'] && localStorage.getItem(TOKEN_KEY) === tokenAtRequest) {
            this.storeToken(response['token']);
          }
        },
        () => {
          // Not fatal: the current token is still good, and the next check tries again.
          this.renewalInFlight = false;
          this.activitySinceRenewal = true;
        });
  }

  private isOnLoginPage(): boolean {
    const path = this.router.url.split('?')[0];
    return path === '/' || path === '/login';
  }

  private tokenAge(): number {
    return Date.now() - Number(localStorage.getItem(TOKEN_RECEIVED_AT_KEY));
  }

  /**
   * The moment the stored token stops working, by this computer's clock.
   *
   * Worked out from when the token arrived plus how long it lasts, never from
   * the expiry time written in the token: that is the server's clock, and a
   * counter PC whose clock is wrong would sign people out early or never.
   */
  private deadline(): number | null {
    const lifetime = this.tokenLifetimeMs();
    const receivedAt = Number(localStorage.getItem(TOKEN_RECEIVED_AT_KEY));
    if (lifetime === null || !receivedAt) {
      return null;
    }
    return receivedAt + lifetime;
  }

  private idleMinutes(): number | null {
    const lifetime = this.tokenLifetimeMs();
    // A token from before this feature has no arrival time and a weeks-long
    // lifetime; quoting that as the idle period would be nonsense.
    if (lifetime === null || !localStorage.getItem(TOKEN_RECEIVED_AT_KEY)) {
      return null;
    }
    return Math.round(lifetime / MS_PER_MINUTE);
  }

  /** How long the server made the stored token valid for, or null if it cannot be read. */
  private tokenLifetimeMs(): number | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }
    try {
      const payload = token.substring(TOKEN_PREFIX.length).split('.')[1];
      const claims = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      const lifetimeSeconds = claims['exp'] - claims['iat'];
      return lifetimeSeconds > 0 ? lifetimeSeconds * MS_PER_SECOND : null;
    } catch (e) {
      return null;
    }
  }
}
