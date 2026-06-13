import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
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
    return next.handle(req);
  }

  constructor() { }
}
