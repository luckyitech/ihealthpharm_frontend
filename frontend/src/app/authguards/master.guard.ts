import { ToastrService } from 'ngx-toastr';
import { AppService } from './../core/app.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterGuard implements CanActivate {
  permissions: any;
  constructor(private toasterService: ToastrService, private appService: AppService) {
  };
  canActivate() {
    return this.appService.getPermissions().map(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];
        if (this.permissions instanceof Array) {

          if (this.permissions[0]['activeS'] === 'Y' ||
            this.permissions[1]['activeS'] === 'Y' ||
            this.permissions[2]['activeS'] === 'Y' ||
            this.permissions[3]['activeS'] === 'Y' ||
            this.permissions[4]['activeS'] === 'Y') {
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
