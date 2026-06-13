import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from 'src/app/core/environment';

@Injectable()
export class SupplierService {


  constructor(private http: HttpClient) { }

  urlRef = new Environment();

  getallpaymenttypes() {
    return this.http.get(`${this.urlRef.url}getallpaymenttypes`);
  }

  getCountries() {
    return this.http.get(this.urlRef.url + 'getCountries');
  }

  getReturnCreditType() {
    return this.http.get(this.urlRef.url + 'getreturntredittype');
  }
  getProvinces(country: Object) {
    return this.http.post(this.urlRef.url + 'getProvincebyid', country);
  }
  getRowDataFromServer() {
    return this.http.get(this.urlRef.url + 'getallsuppliersdata');
  }

  updateRowData(selectedSuppliers) {
    return this.http.put(this.urlRef.url + 'update/supplier', selectedSuppliers)
  }

  deleteRowData(selectedSuppliers) {

    return this.http.request('delete', this.urlRef.url + 'delete/suppliers?supplierIds=' + selectedSuppliers);
  }

  saveFormChanges(supplierInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/supplier', supplierInformation)
  }

  searchSupplierByName(key) {
    return this.http.get(this.urlRef.url + 'getallSuppliers/byName/editsupplier?searchTerm=' + key);
  }
}
