import { Environment } from 'src/app/core/environment';
import { AppService } from 'src/app/core/app.service';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: "root" })

export class LoginService {
  url = new Environment();
  urlRef = new Environment();
  constructor(private http: HttpClient, private appservice: AppService) { }

  authenticate(loginInformationForm: Object): Observable<any> {
    return this.http.post(this.url.url + "authenticate", loginInformationForm).pipe(
      map(
        data => {
          localStorage.setItem("user", loginInformationForm['userName']);
          localStorage.setItem("token", `Bearer ${data['result']['token']}`);
          localStorage.setItem("id", `${data['result']['id']}`);
          this.appservice.setPermissions(data['result']['permissions']);
          return data;
        }
      )
    )
  }

  isLoggedIn() {
    if (localStorage.getItem("token") != null && localStorage.getItem("token") != '') {
      return true;
    } else {
      return false;
    }
  }
  getLoggedInUser() {
    const user = localStorage.getItem("user")
    return user
  }
  getEmployeeDataByEmployeeId(employeeId){
    return this.http.get(this.urlRef.url + 'getemployeedatabyid?employeeId='+employeeId);
  }
  isSetupDone() {
    return this.http.get(this.url.url + 'get/pharmacysetup');
  }

  getEmployeeImageByEmployeeIdAndImageDesc(employeeId,imageDesc){
    return this.http.get(this.urlRef.url + 'getimagesbyemployeeidandimagedesc?employeeId='+employeeId+'&imageDesc='+imageDesc);
  }

}
