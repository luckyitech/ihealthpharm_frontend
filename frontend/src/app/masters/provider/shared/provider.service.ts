import { Environment } from 'src/app/core/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ProviderService {

  urlRef = new Environment

  constructor(private http: HttpClient) {

  }
  getCountries() {
    return this.http.get(this.urlRef.url + 'getCountries');
  }

  getProviderTypeLookup() {
    return this.http.get(this.urlRef.url + 'getallprovidertypelookuptypedata');
  }


  getHospitals() {
    return this.http.get(this.urlRef.url + 'getallhospitaldata');
  }


  getProvinces(country: Object) {
    return this.http.post(this.urlRef.url + 'getProvincebyid', country);
  }
  
  getRowDataFromServer() {
    return this.http.get(this.urlRef.url + 'getallprovidersdata');
  }

  updateRowData(selectedProviders: any) {
    return this.http.put(this.urlRef.url + 'update/provider', selectedProviders)
  }

  deleteRowData(selectedProviders) {

    return this.http.request('delete', this.urlRef.url + 'delete/providers?providersId=' + selectedProviders);
  }

  saveFormChanges(providerInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/provider', providerInformation)
  }

  getProviderBySearch(key) {
    return this.http.get(this.urlRef.url + 'getprovidersdatabyname/editprovider?key=' + key);
  }
}
