import { Environment } from 'src/app/core/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class CustomerService {

  urlRef = new Environment();

  constructor(private http: HttpClient) {
  }

  getCountries() {
    return this.http.get(this.urlRef.url + 'getCountries');
  }

  getProvinces(country: Object) {
    return this.http.post(this.urlRef.url + 'getProvincebyid', country);
  }

  getRowDataFromServer() {
    return this.http.get(this.urlRef.url + 'getlimitedcustomerdata');
  }

  getRowDataFromServerToMapMembership() {
    return this.http.get(this.urlRef.url + 'getlimitedcustomerdata/tomap/membership');
  }

  getCustomerBySearch(key) {
    return this.http.get(this.urlRef.url + 'getcustomerdatabyname?key=' + key);
  }

  getCustomersFromDebitNote() {
    return this.http.get(this.urlRef.url + 'getCustomers/fromdebit');
  }

  getDebitNotesFromServer() {
    return this.http.get(this.urlRef.url + 'getcustomersfrom/creditnotes');
  }

  updateCustomer(selectedCustomer: any) {
    return this.http.put(this.urlRef.url + 'update/customer', selectedCustomer);
  }

  saveCustomer(customerInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/customer', customerInformation)
  }

  saveCustomerImage(customerInformation: Object) {
    return this.http.post(this.urlRef.url + 'savecustomerimage', customerInformation)
  }

  updateCustomerImage(customerImage: Object) {
    return this.http.post(this.urlRef.url + 'updatecustomerimage', customerImage);
  }

  getCustomerImageByCustomerId(customerId) {
    return this.http.get(this.urlRef.url + 'getcustomerimagebyid?customerId=' + customerId);
  }
  /* Customer Insurance API */

  saveCustomerInsurance(customerInsurance: Object) {
    return this.http.post(this.urlRef.url + 'save/customerinsurance', customerInsurance);
  }

  updateCustomerInsurance(customerInsurance: Object) {
    return this.http.put(this.urlRef.url + 'update/customerinsurance', customerInsurance);
  }

  getCustomerInsuranceByCustomerId(id) {
    return this.http.post(this.urlRef.url + 'getcustomerinsurancedatabyid', { customerId: id });
  }

  getInsuranceRowDataFromServer() {
    return this.http.get(this.urlRef.url + 'getcustomerinsurancedata');
  }


  /* Customer Membership API */

  saveCustomerMembership(customerMembership: Object) {
    return this.http.post(this.urlRef.url + 'save/customermembership', customerMembership);
  }

  updateCustomerMembership(customerMembership: Object) {
    return this.http.put(this.urlRef.url + 'update/customermembership', customerMembership);
  }

  getCustomerMembershipByCustomerId(id) {
    return this.http.post(this.urlRef.url + 'getcustomermembershipdatabyid', { customerId: id });
  }

  getMembershipRowDataFromServer() {
    return this.http.get(this.urlRef.url + 'getallcustomermembershipsdata');
  }

  getUniqueCardNumberId() {
    return this.http.get(this.urlRef.url + 'getuniqueid');
  }

  searchCustomer(key) {
    return this.http.get(this.urlRef.url + 'getcustomerdatabynamesearch?key=' + key);
  }

}
