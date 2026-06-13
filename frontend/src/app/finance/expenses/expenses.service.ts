import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  constructor(private http: HttpClient) { }
  urlRef = new Environment();

  saveExpenses(expensesModel: Object) {
    return this.http.post(this.urlRef.url + 'save/expenses', expensesModel)
  }

  getAllPettyData() {
    return this.http.get(this.urlRef.url + 'getall/chartofaccounts')
  }

  public getExpensesNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=EX');
  }

  getBalanceFromChartAccount(accountId) {
    return this.http.get(this.urlRef.url + 'getaccountdetails/byid?accountId=' + accountId);
  }

  public getGeneralLedgerNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=GL');
  }

  public saveGeneralLedger(generaLedgerModel: Object) {
    return this.http.post(this.urlRef.url + 'save/generalledger', generaLedgerModel)
  }

  public getAccountPayablesNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AP');
  }
 getAllModes(){
  return this.http.get(this.urlRef.url + 'getAllModes/expenses')
 }

 getExpencesCount()
 {
  return this.http.get(this.urlRef.url + 'getall/expensescount');
 }
 getExpencesList(expensesHistoryPageNumber,limit){
  return this.http.get(this.urlRef.url + 'getall/expenses/bypagination?pageNumber='+expensesHistoryPageNumber+
"&limit="+limit);
 }

 getAllExpensesTransactionscount(formData){
  return this.http.post(this.urlRef.url + 'get/expensesTransactionsCountBySearch', formData);
 }

 getAllExpensesTransactionsBySearch(formData){
  return this.http.post(this.urlRef.url + 'getall/expensesBySearch',formData);
 }

}
