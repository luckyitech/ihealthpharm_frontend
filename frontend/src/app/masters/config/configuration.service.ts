import { HttpClient } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  urlRef = new Environment();

  constructor(private http: HttpClient) {
  }

  getAllDiscounts() {
    return this.http.get(this.urlRef.url + 'get/discountslist');
  }

  getDiscountById(dicountId) {
    return this.http.get(this.urlRef.url + 'get/discountbyid?discountId=' + dicountId);
  }

  saveDiscount(discount) {
    return this.http.post(this.urlRef.url + 'save/discount', discount);
  }

  updateDiscount(discount) {
    return this.http.put(this.urlRef.url + 'update/discount', discount);
  }

  deleteDiscount(discount) {
    return this.http.delete(this.urlRef.url + 'delete/discount', discount);
  }

  getAllConfigurations() {
    return this.http.get(this.urlRef.url + 'getall/configurations');
  }

  saveConfiguration(configuration) {
    return this.http.post(this.urlRef.url + 'save/configuration', configuration);
  }
  updateConfiguration(configuration) {
    return this.http.put(this.urlRef.url + 'update/configuration', configuration);
  }

  updaeStockPrice() {
    return this.http.get(this.urlRef.url + 'update/stockconfiguration');
  }

  saveConfigurationStatus(obj) {
    return this.http.post(this.urlRef.url + 'saveconfigurationstatus', obj);
  }

  updateConfigurationStatus(obj) {
    return this.http.put(this.urlRef.url + 'updateconfigurationstatus', obj);
  }

  getConfigurationStatus() {
    return this.http.get(this.urlRef.url + 'getconfigurationstatus');
  }


}
