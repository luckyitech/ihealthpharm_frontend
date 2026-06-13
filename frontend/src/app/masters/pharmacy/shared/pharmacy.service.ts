import { Environment } from './../../../core/environment';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
@Injectable()
export class PharmacyService {

  urlRef = new Environment();

  constructor(private http: HttpClient) { }
  getCountries() {

    return this.http.get(this.urlRef.url + 'getCountries');
  }

  getProvinces(country: Object) {
    return this.http.post(this.urlRef.url + 'getProvincebyid', country);
  }

  getPharmacyById(pharmacy: Object) {
    return this.http.post(this.urlRef.url + 'getpharmacybyid', pharmacy);
  }

  getRowDataFromServer() {
    return this.http.get(this.urlRef.url + 'getallpharmacies');
  }

  updatePharmacy(selectedPharmacys: Object) {
    return this.http.put(this.urlRef.url + 'update/pharmacy', selectedPharmacys)
  }

  updatePharmacyWithLogo(selectedPharmacys: Object) {
    return this.http.put(this.urlRef.url + 'update/pharmacywithlogo', selectedPharmacys)
  }

  saveFormChanges(pharmacyInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/pharmacy', pharmacyInformation)
  }

  savePharmacyWithLogo(pharmacyInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/pharmacywithlogo', pharmacyInformation)
  }

  deleteRowData(selectedPharmacys: number[]) {
    return this.http.request('delete', this.urlRef.url + 'delete/pharmacy' + selectedPharmacys.join());
  }

  getPharmacyByName(key) {
    return this.http.get(this.urlRef.url + 'getpharmaciesbyname?pharmacyName=' + key);
  }
}
