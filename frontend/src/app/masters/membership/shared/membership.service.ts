import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from 'src/app/core/environment';



@Injectable()
export class MembershipService {

  urlRef = new Environment();

  constructor(private http: HttpClient) { }


  saveFormChanges(membershipInfo: Object) {
    return this.http.post(this.urlRef.url + 'save/membership', membershipInfo)
  }


  getRowDataFromServer() {
    return this.http.get(this.urlRef.url + 'getmemberships');
  }

  getRowDataFromServerToMapCustomers(){
    return this.http.get(this.urlRef.url + 'getmemberships/forcustomers');
  }

  updateRowData(selectedMembership: Object) {
    return this.http.put(this.urlRef.url + 'update/membership', selectedMembership)
  }

  getMembershipDataBySearch(membershipName) {
    return this.http.get(this.urlRef.url + 'getmembership/byname?membershipName=' + membershipName);
  }

  getMembershipDataBySearchKey(key) {
    return this.http.get(this.urlRef.url + 'getbymembershipbysearch?key=' + key);
  }

  getCustomerMemebershipById(memebership){
    return this.http.post(this.urlRef.url + 'getProvincebyid', memebership);
  }

 
}
