import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from 'src/app/core/environment';


@Injectable()
export class HospitalService {
  constructor(private http: HttpClient) { }

  urlRef = new Environment();

  getCountries() {
    return this.http.get(this.urlRef.url + 'getCountries');
  }

  getProvinces(country: Object) {
    return this.http.post(this.urlRef.url + 'getProvincebyid', country);
  }

  getRowDataFromServer() {
    return this.http.get(this.urlRef.url + 'getallhospitaldata');
  }

  updateRowData(selectedHospitals: any[]) {
    return this.http.put(this.urlRef.url + 'update/hospitals', selectedHospitals)
  }

  updateHospital(selectedHospital: any) {
    return this.http.put(this.urlRef.url + 'update/hospital', selectedHospital);
  }

  deleteRowData(selectedHospitals: number[]) {
    return this.http.request('delete', this.urlRef.url + 'delete/hospitals?hospitalIds=' + selectedHospitals.join());
  }

  saveFormChanges(hospitalInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/hospital', hospitalInformation)
  }

  getHospitalDataByName(key) {
    return this.http.get(this.urlRef.url + 'gethospitaldatabyname/edithospital?key=' + key);
  }
}
