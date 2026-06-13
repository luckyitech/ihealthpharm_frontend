import { HttpClient } from '@angular/common/http';
import { Environment } from '../core/environment';
import { Injectable } from '@angular/core';



@Injectable()
export class StockService {

  constructor(private http: HttpClient) { }
  urlRef = new Environment();

  getProfitOfSuppliers() {
    return this.http.get(`${this.urlRef.url}ProfitPercentage`)
  }
  getDrugSuppliersCount() {
    return this.http.get(`${this.urlRef.url}DrugSuppCount`)
  }
  getSupplierRevenue() {
    return this.http.get(`${this.urlRef.url}suppliersRevenue`)
  }


}
