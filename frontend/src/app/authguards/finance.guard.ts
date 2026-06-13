import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AppService } from '../core/app.service';

@Injectable({
  providedIn: 'root'
})
export class FinanceGuard implements CanActivate {
  permissions: any;
  constructor(private toasterService: ToastrService, private appService: AppService) {
  };
  canActivate() {
    return this.appService.getPermissions().map(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];
        if (this.permissions instanceof Array) {

          if (this.permissions[21]['activeS'] === 'Y' || this.permissions[22]['activeS'] === 'Y'
            || this.permissions[23]['activeS'] === 'Y' || this.permissions[24]['activeS'] === 'Y'
            || this.permissions[25]['activeS'] === 'Y' || this.permissions[26]['activeS'] === 'Y') {
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
