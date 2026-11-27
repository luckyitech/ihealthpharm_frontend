import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionService } from '../core/session/session.service';

const HTTP_UNAUTHORIZED = 401;
/** A 401 from sign-in means a wrong password or code, not a session that ran out. */
const SIGN_IN_PATH = '/authenticate';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorAuthService implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let token = localStorage.getItem('token');
    if(token != null)
    {
    req = req.clone({
      setHeaders:{
        Authorization:token
      }
    })
  }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // The server no longer accepts this session, so the screen must not stay open on it.
        if (token != null && error.status === HTTP_UNAUTHORIZED && req.url.indexOf(SIGN_IN_PATH) === -1) {
          const sessionService = this.injector.get(SessionService);
          if (sessionService.hasStoredSession()) {
            sessionService.signOutExpired();
          }
        }
        return throwError(error);
      })
    );
  }

  // SessionService is looked up when needed, not injected: it depends on the
  // router, which is not ready while the HTTP interceptors are being built.
  constructor(private injector: Injector) { }
}
