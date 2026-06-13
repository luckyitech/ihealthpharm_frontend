import { Environment } from 'src/app/core/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  url = new Environment();
  constructor(private http: HttpClient) { }

  public saveMultipleStockRecords(payload) {
    return this.http.post(this.url.url + "save/multiplestocks", payload);
  }

  public updateStockRecord(payload) {
    return this.http.put(this.url.url + "update/stock", payload);
  }

  public itemSearchByItemCode(searchKey) {
    return this.http.get(this.url.url + "item/getallby/searchkey?searchTerm=" + searchKey);
  }

  public getLimitedItems(start, end) {
    return this.http.get(this.url.url + 'item/getitemdatabylimit?start=' + start + '&end=' + end);
  }

  public getLimitedSuppliers() {
    return this.http.get(this.url.url + "getlimitedsuppliersdata");
  }

  getItemsByLimit(start, end) {
    return this.http.get(this.url.url + 'getall/limitedsuppliersdata?start=' + start + '&end=' + end);
  }

  public getSuppliersByName(searchTerm) {
    return this.http.get(this.url.url + "getallSuppliers/byName?searchTerm=" + searchTerm);
  }

  public getIOSNumber() {
    return this.http.get(this.url.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=ST');
  }

  public getStockDataByItemAndPharmacyIdCount(searchTerm, searchCode, pharmacyId) {
    return this.http.get(this.url.url + 'getstockbyitemandpharmacyidcountInEditStock?searchTerm=' + searchTerm + "&searchCode=" +
      searchCode + "&pharmacyId=" + pharmacyId);
  }

  public getStockDataByItemAndPharmacyId(searchTerm, searchCode, pharmacyId, pageNumber, pageSize) {
    return this.http.get(this.url.url + 'getstockbyitemandpharmacyidInEditStock?searchTerm=' + searchTerm + "&searchCode=" +
      searchCode + "&pharmacyId=" + pharmacyId + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize);
  }

  getMaxDiscount() {
    return this.http.get(this.url.url + 'get/maxdiscount')
  }
  getAllDiscounts() {
    return this.http.get(this.url.url + 'getall/discounts')
  }

  getMargin() {
    return this.http.get(this.url.url + 'get/margin')
  }

  getConfigurationStatus() {
    return this.http.get(this.url.url + 'getconfigurationstatus');
  }

  getAllActiveSTaxes() {
    return this.http.get(this.url.url + 'getall/taxcategories/basedOnActive')
  }
  
}
