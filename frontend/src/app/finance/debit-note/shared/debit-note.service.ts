import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';

@Injectable()
export class DebitNoteService {

    constructor(private http: HttpClient) { }

    urlRef = new Environment();

    saveDebitNoteData(debitNote: Object) {
        return this.http.post(`${this.urlRef.url}save/debitNote`, debitNote);
    }
    updateDebitNote(debitNoteModel: Object) {
        return this.http.put(`${this.urlRef.url}update/DebitNote`, debitNoteModel);
    }
    getDebitNoteData(debitNoteId: Object) {
        return this.http.get(`${this.urlRef.url}getDebitNote`, debitNoteId);
    }
    public getDebitNoteNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=DN');
    }

    public getAccountPayablesNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AP');
    }


    public getAccountReceivablessNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AR');
    }

    saveAccountPayables(AccountPayablesInformation: Object) {
        return this.http.post(this.urlRef.url + 'save/accountPayables', AccountPayablesInformation)
    }

    saveAccountReceivables(AccountReceivablesInformation: Object) {
        return this.http.post(this.urlRef.url + 'save/accountReceivables', AccountReceivablesInformation)
    }


    getRowDataFromServer() {
        return this.http.get(this.urlRef.url + 'getallsuppliersdata/foritemsuppliers');
    }

    getRowDataFromServerForCustomer() {
        return this.http.get(this.urlRef.url + 'getlimitedcustomerdata/forSalesbilling');
    }

    public getCustomerByName(searchKey) {
        return this.http.get(this.urlRef.url + 'getcustomerdatabyname?key=' + searchKey);
    }

    public getAllDebitNotes() {
        return this.http.get(this.urlRef.url + 'getAllDebitNotes');
    }

    public getAllBySearches(searchType, searchValue) {
        return this.http.get(this.urlRef.url + 'getAllDebitNotes/bySearch?searchType=' + searchType + '&searchValue=' + searchValue)
    }

    public getDNbyId(debitNoteId) {
        return this.http.get(this.urlRef.url + 'getDebitNote/byId?debitNoteId=' + debitNoteId)
    }

   public  getAllpurchaseReturnTypes(){
        return this.http.get(this.urlRef.url+'getAll/purchaseReturnTypes')
    }

    public getAllSalesReturnTypes() {
        return this.http.get(this.urlRef.url + 'getAll/salesReturnTypes')
    }

}