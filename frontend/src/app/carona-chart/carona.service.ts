import { Injectable } from '@angular/core';
import { Environment } from '../core/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CaronaService {

  constructor(private http: HttpClient) { }
  urlRef = new Environment();

 /*  getCountryWiseData() {
    return this.http.get(`${this.urlRef.url}corona/getall/carona`)
  } */

 /*  getTopCountryAffected() {
    return this.http.get(`${this.urlRef.url}corona/getall/topMost`) //pie chart
  } */

  getCaronaLimitedData() {
    return this.http.get(`${this.urlRef.url}corona/getalllimited/caronadata`) // bar chart
  }
  GetStatusForPie(){
    return this.http.get(`${this.urlRef.url}corona/getall/countries/caronadata`) // pie chart
  }

  //for grid
  getAllCaronaData() {
    return this.http.get(`${this.urlRef.url}corona/getall/caronadata`)
  }
  //for grid
  updateCaronaData(caronaModel) {
    return this.http.put(`${this.urlRef.url}corona/update/caronadata`, caronaModel)
  }

}
