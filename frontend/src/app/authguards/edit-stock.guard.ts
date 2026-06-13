import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../core/app.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EditStockGuard implements CanActivate {
  permissions:any;
  constructor(private appService: AppService,private toasterService:ToastrService) {

  }

  canActivate() {
    return this.appService.getPermissions().map(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];
        if (this.permissions instanceof Array) {
          if (this.permissions[88]&&this.permissions[88]['activeS'] === 'Y')
           {
            return true;
          }
          else {
            this.toasterService.warning('You dont have access', 'Please Contact Administrator', {
              timeOut: 3000
            });
            return false;
          }
        }
        else {
          
          this.toasterService.warning('You dont have access', 'Please Contact Administrator', {
            timeOut: 3000
          });
          return false;
        }
      }
    });
  }
}
