import { Environment } from 'src/app/core/environment';
import { AppService } from 'src/app/core/app.service';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: "root" })

export class LoginService {
  url = new Environment();
  urlRef = new Environment();
  constructor(private http: HttpClient, private appservice: AppService) { }

  /*
   * withCredentials lets the trusted-device cookie be sent and set. In
   * production the Angular files and the API share an origin behind IIS, so
   * this is a no-op there; in development it is what makes "remember this
   * computer" work across localhost:4200 and localhost:6009.
   */
  private readonly withCookies = { withCredentials: true };

  /**
   * Step one: username and password.
   *
   * The response is NOT necessarily a session. An account enrolled for
   * two-factor gets back a next step carrying no token, so nothing is written
   * to localStorage until a token actually arrives - writing a half-session
   * here would leave the app believing it was logged in with no way to act.
   */
  authenticate(loginInformationForm: Object): Observable<any> {
    return this.http.post(this.url.url + "authenticate", loginInformationForm, this.withCookies).pipe(
      map(data => this.storeSessionIfPresent(data, loginInformationForm['userName']))
    )
  }

  /** Step two for an enrolled account: the emailed code. */
  verifyCode(challengeToken: string, code: string, rememberDevice: boolean, userName: string): Observable<any> {
    return this.http.post(this.url.url + "authenticate/2fa",
      { challengeToken, code, rememberDevice }, this.withCookies).pipe(
        map(data => this.storeSessionIfPresent(data, userName))
      )
  }

  /** Enrolment, part one: the address the user chooses for their codes. */
  submitTwoFactorEmail(challengeToken: string, email: string): Observable<any> {
    return this.http.post(this.url.url + "authenticate/2fa/email",
      { challengeToken, email }, this.withCookies);
  }

  /** Enrolment, part two: the code proving they can read that address. Signs them in. */
  confirmTwoFactorEmail(challengeToken: string, code: string, rememberDevice: boolean, userName: string): Observable<any> {
    return this.http.post(this.url.url + "authenticate/2fa/email/confirm",
      { challengeToken, code, rememberDevice }, this.withCookies).pipe(
        map(data => this.storeSessionIfPresent(data, userName))
      )
  }

  /** Another code for the same login, subject to the same hourly limit. */
  resendCode(challengeToken: string): Observable<any> {
    return this.http.post(this.url.url + "authenticate/2fa/resend",
      { challengeToken }, this.withCookies);
  }

  /**
   * Writes the session only when the server actually issued one.
   *
   * The single place a session is stored, so every route into the application -
   * no second factor, a code, or a completed enrolment - leaves localStorage in
   * the same state.
   */
  private storeSessionIfPresent(data: any, userName: string): any {
    const result = data && data['result'];
    if (result && result['token']) {
      localStorage.setItem("user", userName);
      localStorage.setItem("token", `Bearer ${result['token']}`);
      localStorage.setItem("id", `${result['id']}`);
      this.appservice.setPermissions(result['permissions']);
    }
    return data;
  }

  /** True when a response is a finished login rather than a next step. */
  isSession(data: any): boolean {
    return !!(data && data['result'] && data['result']['token']);
  }

  isLoggedIn() {
    if (localStorage.getItem("token") != null && localStorage.getItem("token") != '') {
      return true;
    } else {
      return false;
    }
  }
  getLoggedInUser() {
    const user = localStorage.getItem("user")
    return user
  }
  getEmployeeDataByEmployeeId(employeeId){
    return this.http.get(this.urlRef.url + 'getemployeedatabyid?employeeId='+employeeId);
  }
  isSetupDone() {
    return this.http.get(this.url.url + 'get/pharmacysetup');
  }

  getEmployeeImageByEmployeeIdAndImageDesc(employeeId,imageDesc){
    return this.http.get(this.urlRef.url + 'getimagesbyemployeeidandimagedesc?employeeId='+employeeId+'&imageDesc='+imageDesc);
  }

}
