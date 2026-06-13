import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../core/app.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ReportsGuard implements CanActivate {
  permissions: any;
  constructor(private toasterService: ToastrService, private appService: AppService) {
  };
  canActivate() {
    return this.appService.getPermissions().map(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];
        if (this.permissions instanceof Array) {
          if ((this.permissions[27] != undefined && this.permissions[27]['activeS'] === 'Y') ||
            (this.permissions[28] != undefined && this.permissions[28]['activeS'] === 'Y') ||
            (this.permissions[29] != undefined && this.permissions[29]['activeS'] === 'Y') ||
            (this.permissions[30] != undefined && this.permissions[30]['activeS'] === 'Y') ||
            (this.permissions[31] != undefined && this.permissions[31]['activeS'] === 'Y') ||
            (this.permissions[32] != undefined && this.permissions[32]['activeS'] === 'Y') ||
            (this.permissions[33] != undefined && this.permissions[33]['activeS'] === 'Y') ||
            (this.permissions[34] != undefined && this.permissions[34]['activeS'] === 'Y') ||
            (this.permissions[35] != undefined && this.permissions[35]['activeS'] === 'Y') ||
            (this.permissions[36] != undefined && this.permissions[36]['activeS'] === 'Y') ||
            (this.permissions[37] != undefined && this.permissions[37]['activeS'] === 'Y') ||
            (this.permissions[38] != undefined && this.permissions[38]['activeS'] === 'Y') ||
            (this.permissions[39] != undefined && this.permissions[39]['activeS'] === 'Y') ||
            (this.permissions[40] != undefined && this.permissions[40]['activeS'] === 'Y') ||
            (this.permissions[41] != undefined && this.permissions[41]['activeS'] === 'Y') ||
            (this.permissions[42] != undefined && this.permissions[42]['activeS'] === 'Y') ||
            (this.permissions[43] != undefined && this.permissions[43]['activeS'] === 'Y') ||
            (this.permissions[44] != undefined && this.permissions[44]['activeS'] === 'Y') ||
            (this.permissions[45] != undefined && this.permissions[45]['activeS'] === 'Y') ||
            (this.permissions[46] != undefined && this.permissions[46]['activeS'] === 'Y') ||
            (this.permissions[47] != undefined && this.permissions[47]['activeS'] === 'Y') ||
            (this.permissions[48] != undefined && this.permissions[48]['activeS'] === 'Y') ||
            (this.permissions[49] != undefined && this.permissions[49]['activeS'] === 'Y') ||
            (this.permissions[50] != undefined && this.permissions[50]['activeS'] === 'Y') ||
            (this.permissions[51] != undefined && this.permissions[51]['activeS'] === 'Y') ||
            (this.permissions[52] != undefined && this.permissions[52]['activeS'] === 'Y') ||
            (this.permissions[53] != undefined && this.permissions[53]['activeS'] === 'Y') ||
            (this.permissions[54] != undefined && this.permissions[54]['activeS'] === 'Y') ||
            (this.permissions[55] != undefined && this.permissions[55]['activeS'] === 'Y') ||
            (this.permissions[56] != undefined && this.permissions[56]['activeS'] === 'Y') ||
            (this.permissions[57] != undefined && this.permissions[57]['activeS'] === 'Y') ||
            (this.permissions[58] != undefined && this.permissions[58]['activeS'] === 'Y') ||
            (this.permissions[59] != undefined && this.permissions[59]['activeS'] === 'Y') ||
            (this.permissions[60] != undefined && this.permissions[60]['activeS'] === 'Y') ||
            (this.permissions[61] != undefined && this.permissions[61]['activeS'] === 'Y') ||
            (this.permissions[62] != undefined && this.permissions[62]['activeS'] === 'Y') ||
            (this.permissions[63] != undefined && this.permissions[63]['activeS'] === 'Y') ||
            (this.permissions[64] != undefined && this.permissions[64]['activeS'] === 'Y') ||
            (this.permissions[65] != undefined && this.permissions[65]['activeS'] === 'Y') ||
            (this.permissions[66] != undefined && this.permissions[66]['activeS'] === 'Y') ||
            (this.permissions[73] != undefined && this.permissions[73]['activeS'] === 'Y') ||
            (this.permissions[74] != undefined && this.permissions[74]['activeS'] === 'Y') ||
            (this.permissions[75] != undefined && this.permissions[75]['activeS'] === 'Y') ||
            (this.permissions[76] != undefined && this.permissions[76]['activeS'] === 'Y')||
            (this.permissions[77] != undefined && this.permissions[77]['activeS'] === 'Y') ||
            (this.permissions[78] != undefined && this.permissions[78]['activeS'] === 'Y')||
            (this.permissions[79] != undefined && this.permissions[79]['activeS'] === 'Y')||
            (this.permissions[80] != undefined && this.permissions[80]['activeS'] === 'Y')||
            (this.permissions[81] != undefined && this.permissions[81]['activeS'] === 'Y')||
            (this.permissions[82] != undefined && this.permissions[82]['activeS'] === 'Y')||
            (this.permissions[83] != undefined && this.permissions[83]['activeS'] === 'Y')||
            (this.permissions[84] != undefined && this.permissions[84]['activeS'] === 'Y')||
            (this.permissions[85] != undefined && this.permissions[85]['activeS'] === 'Y')||
            (this.permissions[89] != undefined && this.permissions[89]['activeS'] === 'Y')||
            (this.permissions[90] != undefined && this.permissions[90]['activeS'] === 'Y')||
            (this.permissions[92] != undefined && this.permissions[92]['activeS'] === 'Y')||
            (this.permissions[93] != undefined && this.permissions[93]['activeS'] === 'Y')||
            (this.permissions[95] != undefined && this.permissions[95]['activeS'] === 'Y')||
            (this.permissions[96] != undefined && this.permissions[96]['activeS'] === 'Y')||
            (this.permissions[98] != undefined && this.permissions[98]['activeS'] === 'Y')||
            (this.permissions[99] != undefined && this.permissions[99]['activeS'] === 'Y')||
            (this.permissions[102] != undefined && this.permissions[102]['activeS'] === 'Y') ||
            (this.permissions[103] != undefined && this.permissions[103]['activeS'] === 'Y')||
            (this.permissions[104] != undefined && this.permissions[104]['activeS'] === 'Y')||
            (this.permissions[105] != undefined && this.permissions[105]['activeS'] === 'Y')||
            (this.permissions[107] != undefined && this.permissions[107]['activeS'] === 'Y')||
            (this.permissions[108] != undefined && this.permissions[108]['activeS'] === 'Y')||
            (this.permissions[109] != undefined && this.permissions[109]['activeS'] === 'Y')||
            (this.permissions[110] != undefined && this.permissions[110]['activeS'] === 'Y')||
            (this.permissions[112] != undefined && this.permissions[112]['activeS'] === 'Y')||
            (this.permissions[114] != undefined && this.permissions[114]['activeS'] === 'Y')||
            (this.permissions[115] != undefined && this.permissions[115]['activeS'] === 'Y')||
            (this.permissions[116] != undefined && this.permissions[116]['activeS'] === 'Y')||
            (this.permissions[118] != undefined && this.permissions[118]['activeS'] === 'Y')||
            (this.permissions[119] != undefined && this.permissions[119]['activeS'] === 'Y')||
            (this.permissions[120] != undefined && this.permissions[120]['activeS'] === 'Y')) {
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
