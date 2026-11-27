import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { SessionService } from '../core/session/session.service';

/**
 * Lets a screen open only for someone who is signed in. Anyone else is sent to
 * the login page, whichever address they typed.
 *
 * This is about being signed in at all. Whether the person may use a particular
 * module is still decided by that module's own guard.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private sessionService: SessionService, private router: Router) { }

  canActivate(): boolean {
    if (this.sessionService.isSignedIn()) {
      return true;
    }
    // Clear what is left of a session that ran out, or the login page would
    // see the old token and send the user straight back here.
    localStorage.clear();
    // Navigate and refuse, not "return the login address": when the login page
    // is already showing, a redirect to it is ignored and the typed address
    // would stay in the address bar. Refusing makes the router put it back.
    this.router.navigate(['/login']);
    return false;
  }

  canActivateChild(): boolean {
    return this.canActivate();
  }
}
