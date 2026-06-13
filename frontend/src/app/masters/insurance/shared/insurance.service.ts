import { HttpClient } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class InsuranceService {


  urlRef = new Environment();

  constructor(private http: HttpClient) { }



  getCountries() {
    return this.http.get(this.urlRef.url + 'getCountries');
  }

  getProvinces(country: Object) {
    return this.http.post(this.urlRef.url + 'getProvincebyid', country);
  }

  saveFormChanges(insuranceInfo: Object) {
    return this.http.post(this.urlRef.url + 'save/insurance', insuranceInfo)
  }

  saveInsuranceWithLogo(insuranceInfo: Object) {
    return this.http.post(this.urlRef.url + 'save/insurance/image', insuranceInfo)
  }

  getRowDataFromServer() {
    return this.http.get(this.urlRef.url + 'getinsurancies');
  }

  getRowDataFromServerToMapCustomer() {
    return this.http.get(this.urlRef.url + 'getinsurancies/mapCustomers');
  }
  

  updateRowData(selectedInsurance: Object) {
    return this.http.put(this.urlRef.url + 'update/insurance', selectedInsurance)
  }

  updateInsuranceWithLogo(insuranceModel: Object) {
    return this.http.put(this.urlRef.url + 'update/insurance/image', insuranceModel)
  }

  public getAllItemDataByItemNameSearch(searchTerm: string) {
    return this.http.get(`${this.urlRef.url}item/getallby/ItemNameSearch?searchTerm=${searchTerm}`);

  }

  getInsurencesBySearch(key) {
    return this.http.get(this.urlRef.url + 'getinsurance/bypolicycodeandpolicyname?searchTerm=' + key);
  }

  getInsurencesBySearchKey(key) {
    return this.http.get(this.urlRef.url + 'getcustomerinsurancedatabysearch?searchKey=' + key);
  }
}
