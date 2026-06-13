import { Environment } from 'src/app/core/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasterAccountService {

  constructor(private http: HttpClient) { }
  urlRef = new Environment();


  public getCreditNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=CR');
  }

  public getCustomersList() {
    return this.http.get(this.urlRef.url + 'get/customersnotinmasterandfamily');
  }

  public getCustomersByName(name) {
    return this.http.get(this.urlRef.url + 'get/customersbynamenotinmasterandfamily?name=' + name);
  }

  public saveMasterAccount(obj) {
    return this.http.post(this.urlRef.url + "save/masteraccount", obj);
  }

  public updateMasterAccount(obj) {
    return this.http.put(this.urlRef.url + "update/masteraccount", obj);
  }

  public getMastersAndFamilyList() {
    return this.http.get(this.urlRef.url + "get/masteraccount")
  }
}
