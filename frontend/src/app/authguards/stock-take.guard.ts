import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from '../masters/employee/shared/employee.service';
import { AppService } from '../core/app.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class StockTakeGuard implements CanActivate {

  employeeObj;
  permissions:any;
  constructor(private appService: AppService,private toasterService:ToastrService) {

  }

  canActivate() {
    return this.appService.getPermissions().map(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];
        if (this.permissions instanceof Array) {
          if (this.permissions[72]['activeS'] === 'Y')
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
          return false;
        }
      }
    });
  }

}
