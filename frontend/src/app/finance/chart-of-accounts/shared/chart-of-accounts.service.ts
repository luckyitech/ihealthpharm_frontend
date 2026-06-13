import { Injectable } from '@angular/core';
import { Environment } from 'src/app/core/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChartOfAccountsService {

  urlRef = new Environment();
  constructor(private http: HttpClient) { }

  public getAllAccountTypes() {
    return this.http.get(this.urlRef.url + 'getall/accounttypes');
  }
  public saveCOADetails(coaModel: Object) {
    return this.http.post(this.urlRef.url + 'save/COAdetails', coaModel);
  }
  public getTotalLimitFromGL() {
    return this.http.get(this.urlRef.url + 'gettotallimit');
  }
  public updateCOADetails(chartOfAccountsModel: Object) {
    return this.http.post(this.urlRef.url + 'update/COAdetails', chartOfAccountsModel);
  }
  public saveTillBal(tillBalModel: Object) {
    return this.http.post(this.urlRef.url + 'save/tillbalancedata', tillBalModel);
  }

  getAllCOA(accountNo: string) {
    return this.http.get(this.urlRef.url + 'getCOA/basedon/accountno?accountNo=' + accountNo);
  }
}
