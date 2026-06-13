import { ToastrService } from 'ngx-toastr';
import { AppService } from './../core/app.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanceCreditnoteGuard implements CanActivate {
  permissions: any;
  constructor(private appService: AppService, private toasterService: ToastrService, ) {
  };
  canActivate() {
    return this.appService.getPermissions().map(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];


        if (this.permissions instanceof Array) {

          if (this.permissions[25]['activeS'] === 'Y') {

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
