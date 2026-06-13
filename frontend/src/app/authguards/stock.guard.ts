import { AppService } from './../core/app.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class StockGuard implements CanActivate {
  permissions: any;
  constructor(private toasterService: ToastrService,private appService: AppService) {
  };
  canActivate() {
    return this.appService.getPermissions().map(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];
        if (this.permissions instanceof Array) {

          if (this.permissions[11]['activeS'] === 'Y' ||
            this.permissions[12]['activeS'] === 'Y' ||
            this.permissions[13]['activeS'] === 'Y' ||
            this.permissions[14]['activeS'] === 'Y' ||
            this.permissions[15]['activeS'] === 'Y' ||
            this.permissions[16]['activeS'] === 'Y' ||
            this.permissions[17]['activeS'] === 'Y' ||
            this.permissions[18]['activeS'] === 'Y' ||
            this.permissions[19]['activeS'] === 'Y' ||
            this.permissions[20]['activeS'] === 'Y'||
            this.permissions[72]['activeS'] === 'Y') {
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
          return false;
        }
      }
    });
  }

}
