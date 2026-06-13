import { HttpClient } from '@angular/common/http';
import { Environment } from '../core/environment';
import { Injectable } from '@angular/core';



@Injectable()
export class SalesService {

  constructor(private http: HttpClient) { }
  urlRef = new Environment();

  //charts
  todayDetails() {
    return this.http.get(`${this.urlRef.url}todaySales`)
  }
  cashCount() {
    return this.http.get(`${this.urlRef.url}cashCount`)
  }
  creditCount() {
    return this.http.get(`${this.urlRef.url}creditCount`)
  }
  upiCount() {
    return this.http.get(`${this.urlRef.url}upiCustomers`)
  }
  creditCardCount() {
    return this.http.get(`${this.urlRef.url}creditCardCustomers`)
  }
  chequeCount() {
    return this.http.get(`${this.urlRef.url}chequeCustomers`)
  }
  yesturdayDetails() {
    return this.http.get(`${this.urlRef.url}yesterdayDifference`)
  }
  cashAmount() {
    return this.http.get(`${this.urlRef.url}cashAmount`)
  }
  creditAmount() {
    return this.http.get(`${this.urlRef.url}creditAmount`)
  }
  upiAmount() {
    return this.http.get(`${this.urlRef.url}upiAmount`)
  }

  creditCardAmount() {
    return this.http.get(`${this.urlRef.url}creditCardAmount`)
  }
  chequeAmount() {
    return this.http.get(`${this.urlRef.url}chequeAmount`)
  }

  creditNoteCount() {
    return this.http.get(`${this.urlRef.url}creditNoteCustomers`)
  }

  creditNoteAmount() {
    return this.http.get(`${this.urlRef.url}creditNoteAmount`)
  }

  creditNoteIssuedCount() {
    return this.http.get(`${this.urlRef.url}creditNoteIssuedCount`)
  }

  creditNoteIssuedAmount() {
    return this.http.get(`${this.urlRef.url}creditNoteAmountIssued`)
  }


  salesReturnCount() {
    return this.http.get(`${this.urlRef.url}salesReturnCount`)
  }

  salesReturnAmount() {
    return this.http.get(`${this.urlRef.url}salesReturnAmount`)
  }
}





















