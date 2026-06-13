import { Environment } from 'src/app/core/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class ManufacturerService {

  urlRef = new Environment();

  constructor(private http: HttpClient) { }

  getCountries() {
    return this.http.get(this.urlRef.url + 'getCountries');
  }

  getProvinces(country: Object) {
    return this.http.post(this.urlRef.url + 'getProvincebyid', country);
  }

  getRowDataFromServer() {
    return this.http.get(this.urlRef.url + 'getallmanufacturersdata');
  }

  updateRowData(selectedManufacturers: any[]) {
    return this.http.put(this.urlRef.url + 'update/manufacturers', selectedManufacturers);
  }

  updateManufacturer(selectedManufacturer: any) {
    return this.http.put(this.urlRef.url + 'update/manufacturer', selectedManufacturer);
  }

  deleteRowData(selectedManufacturers) {

    return this.http.request('delete', this.urlRef.url + 'delete/manufacturers?manufacturerIds=' + selectedManufacturers);
  }

  saveFormChanges(manufacturerInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/manufacturer', manufacturerInformation);
  }

  getManufacturerByName(key) {
    return this.http.get(this.urlRef.url + 'getallmanufacturersdatabysearch?searchTerm=' + key);
  }

  getManufacturtersByLimit(start, end) {
    return this.http.get(this.urlRef.url + 'getmanufacturesdatabylimit?start=' + start + '&end=' + end);
  }

  getManufacturerById(manufacturerId) {
    return this.http.get(this.urlRef.url + 'getmanufacturerdatabyid?manufacturerId=' + manufacturerId);
  }

}
