import { AppService } from './../core/app.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SalesguardGuard implements CanActivate {
  permissions: any;
  constructor(private toasterService: ToastrService, private appService: AppService) {
  };
  canActivate() {
    return this.appService.getPermissions().map(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];
        if (this.permissions instanceof Array) {

          if (this.permissions[5]['activeS'] === 'Y' || this.permissions[6]['activeS'] === 'Y' || this.permissions[7]['activeS'] === 'Y') {
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
