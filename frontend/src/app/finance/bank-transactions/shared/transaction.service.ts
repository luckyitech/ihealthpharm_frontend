import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) {

  }
  urlRef = new Environment();

  getTransactions() {
    return this.http.get(this.urlRef.url + 'getall/chartofaccounts');
  }
  saveBankTransactionDetails(bankTransactionsModel: Object) {
    return this.http.post(this.urlRef.url + 'savebanktransactions', bankTransactionsModel);
  }
  getBalanceFromChartAccount(accountId) {
    return this.http.get(this.urlRef.url + 'getBalance?accountId=' + accountId);
  }
  getTransactionRefNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=BT');
  }
  getJournalId() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=GL');
  }
  getJournalRefNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AP');
  }
  saveToGenaralLedger(generaLedgerModel: Object){
    return this.http.post(this.urlRef.url + 'save/generalledger', generaLedgerModel);  
  }
  getTransactionIds(key){
    return this.http.get(this.urlRef.url + 'getall/transactionsIds?transactionId=' + key);
  }
  getAllTransactionIds(key){
    return this.http.get(this.urlRef.url + 'getall/expenses/transactionsIds?transactionId=' + key);
  }
  getModesOnCredit() {
    return this.http.get(this.urlRef.url + 'getAllModesOnCredit');
  }
  getModesOnDebit() {
    return this.http.get(this.urlRef.url + 'getAllModesOnDebit');
  }
  getAllBankTransactionsBySearch(txnRefNo){
    return this.http.get(this.urlRef.url + 'getall/bankTransactions/byRefNo?referenceNo=' + txnRefNo);
  }
  getAllTransactionsBySearchCount(formData){
    return this.http.post(this.urlRef.url + 'get/bankTransactionsBySearchCount', formData);
  }

  getBankTxnsListBySearch(formData){
    return this.http.post(this.urlRef.url + 'get/bankTransactionsBySearch', formData);
  }

  getBankTransactionDetailsById(bankTransactionId){
    return this.http.get(this.urlRef.url + 'get/bankTransactionDetails?bankTransactionId=' + bankTransactionId);
  }

  getAllBankTransactionsData(){
    return this.http.get(this.urlRef.url + 'getall/banktransactions');
  }

  getBankTxnCount(){
    return this.http.get(this.urlRef.url + 'getall/banktransactionscount');
  }
  getBankTxnsList(bankTxnHistoryPageNumber,limit){
    return this.http.get(this.urlRef.url + 'getall/banktransactions/byPagination?pageNumber='+bankTxnHistoryPageNumber+
    "&limit="+limit);
  }
  updateCOABalanceWithPreviousAmount(formData){
    
    return this.http.post(this.urlRef.url + 'update/chartOfAccountWithPreviousAmt', formData)
  }

  getChartOfAccountDetailsById(accountId){
    return this.http.get(this.urlRef.url + 'getaccountdetails/byid?accountid=' + accountId);
  }
}
