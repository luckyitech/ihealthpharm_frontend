import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class CreditNoteService {
    
    constructor(private http: HttpClient) { }
    urlRef = new Environment();


    saveCreditNoteData(creditNote: Object) {
        return this.http.post(`${this.urlRef.url}save/creditNote`, creditNote);
    }
    updateCreditNote(creditNoteModel: Object) {
        return this.http.put(`${this.urlRef.url}update/creditNote`, creditNoteModel);
    }
    getCreditNoteData(creditNoteId: Object) {
        return this.http.get(`${this.urlRef.url}getCreditNote`, creditNoteId);
    }
    public getCreditNoteNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=CN');
    }

    public getCreditNoteNumberByBillType(type) {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=' + type);
    }

    getBillTypes() {
        return this.http.get(this.urlRef.url + 'getallBillTypes');
    }
    public getAccountReceivablessNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AR');
    }

    saveAccountReceivables(AccountReceivablesInformation: Object) {
        return this.http.post(this.urlRef.url + 'save/accountReceivables', AccountReceivablesInformation)
    }

    saveAccountPayables(AccountPayablesInformation: Object) {
        return this.http.post(this.urlRef.url + 'save/accountPayables', AccountPayablesInformation)
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

    public getAccountPayablesNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AP');
    }

    // getting all credit notes
    getAllCN() {
        return this.http.get(this.urlRef.url + 'getAllCreditNotes')
    }

    getAllCnForSearches(searchTerm, searchValue) {
        return this.http.get(this.urlRef.url + 'getAllCreditNotes/bySearch?searchTerm=' + searchTerm + '&searchValue=' + searchValue)
    }

    getCnDataById(creditNoteId) {
        return this.http.get(this.urlRef.url + 'getCreditNote/byId?creditNoteId=' + creditNoteId)
    }

    updateCreditNotePaymentStatus(creditNoteId, paymentStatus) {
        return this.http.get(this.urlRef.url + 'updateCreditNote/paymentStatus?creditNoteId=' + creditNoteId + '&paymentStatus=' + paymentStatus)
    }

    public getAllpurchaseReturnTypes() {
        return this.http.get(this.urlRef.url + 'getAll/purchaseReturnTypes')
    }

    public getAllSalesReturnTypes() {
        return this.http.get(this.urlRef.url + 'getAll/salesReturnTypes')
    }

    public checkSalesData(billNo) {
        return this.http.get(this.urlRef.url + 'getSalesBillData/inCreditNote?billNo=' + billNo)
    }

    getMasterByCustomerId(customerId) {
        return this.http.get(this.urlRef.url + 'get/masterbycustomer?customerId=' + customerId);
    }


    getSalesDataByCustomerAndBillCode(customerId, billCode) {
        return this.http.get(this.urlRef.url + 'get/salesDataByBillCodeAndCustomer?customerId=' + customerId + '&billCode=' + billCode);
    }
    getCustomerDataById(customerId) {
        return this.http.get(this.urlRef.url + 'getcustomerdatabyid?customerId=' + customerId);
    }

    getCustomerModelByBillCode(billCode) {
        return this.http.get(this.urlRef.url + 'getCustomerModelByBillCode?billCode=' + billCode);
    }

    downloadPdfFile(encodeURI) {
        const httpOptions = {
            responseType: 'blob' as 'json',
            headers: new HttpHeaders({
                'Authorization': `Bearer localStorage.getItem('token')`,
            })
        };
        return this.http.get(this.urlRef.url + 'reports/generateReportPdf?inputJson=' + encodeURI, httpOptions);
    }

    getExistingCreditNoteByInvoiceNo(invoiceNo) {
        return this.http.get(this.urlRef.url + 'getCreditNote/byInvoiceNo?invoiceNo=' + invoiceNo);
    }
}