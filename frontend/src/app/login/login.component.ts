import { UserHistoryModel } from './../core/user-history/user-history.model';
import { UserHistoryService } from './../core/user-history/user-history.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from './shared/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/core/app.service';
import {
  Component,
  OnInit,
  Renderer2
} from '@angular/core';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

/**
 * The three things the login screen can be asking for.
 *
 * Only accounts enrolled for two-factor ever leave 'credentials'; for everyone
 * else the screen behaves exactly as it always has.
 */
type LoginStep = 'credentials' | 'captureEmail' | 'enterCode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  pharmacyList: any[] = [];
  userHistoryModel: UserHistoryModel;

  step: LoginStep = 'credentials';

  /** Handle for the next call. Opaque, single use, short lived. */
  challengeToken = '';
  maskedEmail = '';

  /** True when the code being entered confirms a new address rather than a login. */
  isEnrolment = false;

  rememberDevice = false;

  /** Kept only to label the stored session; never sent again after step one. */
  private userNameForSession = '';

  secondsLeft = 0;
  private countdownHandle: any;

  constructor(private renderer: Renderer2, private loginService: LoginService, private toasterService: ToastrService, private router: Router
    , private appService: AppService, private userHistoryService: UserHistoryService) {
    this.renderer.addClass(document.body, 'login-screen');
  }

  ngOnInit() {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['/master']);
    }
    this.loginInformationForm = new FormGroup(this.loginInformationFormValidations);
    this.twoFactorEmailForm = new FormGroup(this.twoFactorEmailFormValidations);
    this.twoFactorCodeForm = new FormGroup(this.twoFactorCodeFormValidations);
    $(document).ready(function () {

      $('.forgot-password-link').click(function (e) {
        e.preventDefault();
        $('.login-form').hide();
        $('.forgot-password-form').show();
        $(this).hide();
        $('.login-link').show();
      });
      $('.login-link').click(function (e) {
        e.preventDefault();
        $('.login-form').show();
        $('.forgot-password-form').hide();
        $(this).hide();
        $('.forgot-password-link').show();
      });

    });
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'login-screen');
    this.stopCountdown();
  }

  loginInformationForm: FormGroup;
  loginInformationFormValidations = {
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  }

  twoFactorEmailForm: FormGroup;
  twoFactorEmailFormValidations = {
    // Deliberately light: the confirmation code is the real check on whether
    // this address exists and belongs to them, not a regular expression.
    email: new FormControl('', [Validators.required, Validators.email]),
  }

  twoFactorCodeForm: FormGroup;
  twoFactorCodeFormValidations = {
    code: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
  }

  onSubmit() {
    let payload = Object.assign({}, this.loginInformationForm.value);
    this.login(payload);
  }

  login(loginInformationForm: Object) {
    this.loginInformationForm.get('password').setErrors({ 'incorrect': true })
    this.userNameForSession = loginInformationForm['userName'];

    this.loginService.authenticate(loginInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {

            // The password was right, but this may not be a session: an
            // enrolled account gets a next step and no token.
            if (this.handleIfNextStep(saveFormResponse)) {
              return;
            }

            this.loginInformationForm.reset();
            this.completeLogin(saveFormResponse);
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
          }
        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
        }
      }, (error) => {
        this.showError(error);
      }
    );
  }

  /** Enrolment: send the chosen address off and move to the code box. */
  submitTwoFactorEmail() {
    const email = this.twoFactorEmailForm.get('email').value;
    this.loginService.submitTwoFactorEmail(this.challengeToken, email).subscribe(
      response => {
        this.handleIfNextStep(response);
        this.toasterService.success(response['message'], 'Check your email', { timeOut: 6000 });
      },
      error => this.showError(error)
    );
  }

  /** The code, for either a login or an address confirmation. */
  submitCode() {
    const code = this.twoFactorCodeForm.get('code').value;
    const request = this.isEnrolment
      ? this.loginService.confirmTwoFactorEmail(this.challengeToken, code, this.rememberDevice, this.userNameForSession)
      : this.loginService.verifyCode(this.challengeToken, code, this.rememberDevice, this.userNameForSession);

    request.subscribe(
      response => {
        if (this.loginService.isSession(response)) {
          this.resetToCredentials();
          this.completeLogin(response);
        } else {
          // Should not happen: a 200 here without a token means the contract
          // changed. Say so rather than silently appearing to succeed.
          this.toasterService.error('Unexpected response from the server', 'Error Occurred', { timeOut: 5000 });
        }
      },
      error => {
        // Wrong code: stay on this step so they can try again, and clear the
        // box so the next attempt starts clean.
        this.twoFactorCodeForm.get('code').reset();
        this.showError(error);
      }
    );
  }

  resendCode() {
    this.loginService.resendCode(this.challengeToken).subscribe(
      response => {
        this.handleIfNextStep(response);
        this.toasterService.success('A new code has been sent', 'Sent', { timeOut: 4000 });
      },
      error => this.showError(error)
    );
  }

  /** Abandon the second factor and start again from the password. */
  backToLogin() {
    this.resetToCredentials();
    this.loginInformationForm.reset();
  }

  /**
   * Moves the screen on when the server asked for something more.
   *
   * @returns true when this response was a next step rather than a session,
   *          in which case the caller must not treat it as a login.
   */
  private handleIfNextStep(response: any): boolean {
    const result = response && response['result'];
    if (!result) {
      return false;
    }

    if (result['emailCaptureRequired']) {
      this.challengeToken = result['challengeToken'];
      this.isEnrolment = true;
      this.step = 'captureEmail';
      this.startCountdown(result['expiresInSeconds']);
      return true;
    }

    if (result['twoFactorRequired']) {
      this.challengeToken = result['challengeToken'];
      this.maskedEmail = result['maskedEmail'];
      this.step = 'enterCode';
      this.twoFactorCodeForm.reset();
      this.startCountdown(result['expiresInSeconds']);
      return true;
    }

    return false;
  }

  private resetToCredentials() {
    this.step = 'credentials';
    this.challengeToken = '';
    this.maskedEmail = '';
    this.isEnrolment = false;
    this.rememberDevice = false;
    this.twoFactorEmailForm.reset();
    this.twoFactorCodeForm.reset();
    this.stopCountdown();
  }

  /** The original post-login path, unchanged, reached from whichever step finished. */
  private completeLogin(saveFormResponse: any) {
    this.pharmacyList = saveFormResponse['result']['pharmacyModel'];
    if (this.pharmacyList.length == 1) {
      localStorage.setItem('pharmacyId', this.pharmacyList[0]['pharmacyId']);
      this.userHistoryModel = new UserHistoryModel("login", "Authentication", "login");
      this.userHistoryService.saveUserhistoryDetails(this.userHistoryModel).subscribe(res => {
      });
      this.checkSetup();
      this.toasterService.success(saveFormResponse['message'], 'Success', {
        timeOut: 3000
      });
    }
    else {

    }
  }

  private showError(error: any) {
    const message = (error && error['error'] && error['error']['message'])
      ? error['error']['message']
      : 'Please contact administrator';
    this.toasterService.error(message, 'Error Occurred', { timeOut: 5000 });
  }

  private startCountdown(seconds: number) {
    this.stopCountdown();
    this.secondsLeft = seconds || 0;
    this.countdownHandle = setInterval(() => {
      if (this.secondsLeft > 0) {
        this.secondsLeft--;
      } else {
        this.stopCountdown();
      }
    }, 1000);
  }

  private stopCountdown() {
    if (this.countdownHandle) {
      clearInterval(this.countdownHandle);
      this.countdownHandle = null;
    }
  }

  /** mm:ss for the countdown beside the code box. */
  get countdownLabel(): string {
    const minutes = Math.floor(this.secondsLeft / 60);
    const seconds = this.secondsLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  checkFormDisability() {
    return (
      this.loginInformationForm.get('userName').invalid
      || this.loginInformationForm.get('password').invalid)
  }
  checkSetup() {
    this.loginService.isSetupDone().subscribe(res => {
      if (res['result'].length > 0) {
        this.appService.setLogin(true);
        this.appService.getLogin().subscribe(res => {

        })
        this.router.navigate(['/home']);
      }
      else {
        this.router.navigate(['/setup']);
      }
    }
    );
  }
  pharmacySelected(event: Event) {
    this.toasterService.success("Login Successfull", 'Success', {
      timeOut: 3000
    });
    localStorage.setItem('pharmacyId', event['target']['value']);
    this.checkSetup();
  }

}
