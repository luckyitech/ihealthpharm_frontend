import { Injectable } from '@angular/core';
import { Environment } from 'src/app/core/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PettyCashService {
  urlRef = new Environment();
  constructor(private http: HttpClient) {

  }
  public getAllAccounts() {
    return this.http.get(this.urlRef.url + 'getall/chartofaccounts');
  }
  public getAllAccountsById(pharmacyId) {
    return this.http.get(this.urlRef.url + 'getbypharmacyid/chartofaccounts?pharmacyId=' + pharmacyId);
  }
  public getAccountById(id) {
    return this.http.get(this.urlRef.url + 'getaccountdetails/byid?accountId=' + id);
  }
  savePettyCashDetails(pettyCashModel: Object) {
    return this.http.post(this.urlRef.url + 'save/pettycashdetails', pettyCashModel);
  }
  public getPettyCashNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=PC');
  }
  public saveGeneralLedgerEntry(generaLedgerModel) {
    return this.http.post(this.urlRef.url + 'save/generalledger', generaLedgerModel);
  }
  public getGeneralLedgerNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=GL');
  }
  public getAccountReceivablessNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AR');
  }

  public updateBalance(pettyCashId,balance){
    return this.http.get(this.urlRef.url + 'update/pettycash/balance?pettyCashId='+pettyCashId +'&balance='+balance);
  }

  getAllAccountsByType(accountType:String){
    return this.http.get(this.urlRef.url + 'getByType/byAccountType?accountType='+accountType);
  }

  getAllPettyCashTransactionsBySearch(formData){
    return this.http.post(this.urlRef.url + 'get/pettyCashTransactionsBySearch', formData);
  }

  getPettyCashTransactionById(pettyCashId){
    return this.http.get(this.urlRef.url + 'getpettycashdetails/byid?pettyCashId='+pettyCashId)
  }

  getAllPettyCashDetails(){
    return this.http.get(this.urlRef.url + 'getall/pettycashdetails')
  }


  updateCOABalanceWithPrevAmt(formData){
    return this.http.post(this.urlRef.url + 'update/pettyCashTransactionsWithPrevAmt', formData);
  }

  getPettyCashCount(){
    return this.http.get(this.urlRef.url + 'getall/pettycashdetailscount')
  }

  getAllPettyCashTxns(pettyCashHistoryPageNumber,limit){
    return this.http.get(this.urlRef.url + 'getall/pettyCashTxns/bypagination?pageNumber='+pettyCashHistoryPageNumber+
    "&limit="+limit);

  }
  getAllPettyCashTransactionsSearchCount(formData){
    return this.http.post(this.urlRef.url + 'get/pettyCashTransactionsBySearchCount', formData);
  }

}
