import { Environment } from 'src/app/core/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class ReceiptsService {

    urlRef = new Environment();

    constructor(private http: HttpClient) {
    }


    getRowDataFromAccountReceivables() {
        return this.http.get(this.urlRef.url + 'getaccountReceivablesdata');
    }
    getRowDataFromAccountReceivablesBills() {
        return this.http.get(this.urlRef.url + 'getaccountReceivablesBillsdata');
    }
    getBillsByCustomerId() {
        return this.http.get(this.urlRef.url + 'getbillsbycustomerid');

    }

    updateAccountReceivables(accountReceivablesModel: Object[]) {
        return this.http.put(this.urlRef.url + 'update/accountsReceivables', accountReceivablesModel);
    }

    saveAccountReceivables(AccountReceivablesInformation: Object) {
        return this.http.post(this.urlRef.url + 'save/accountReceivables', AccountReceivablesInformation)
    }
    saveAccountReceivablesBills(AccountReceivablesBillsInformation: Object) {
        return this.http.post(this.urlRef.url + 'save/accountReceivablesBills', AccountReceivablesBillsInformation)
    }

    deleteAccountReceivables(accountReceivablesId: number) {
        return this.http.post(this.urlRef.url + 'delete/accountReceivables', accountReceivablesId)
    }

    getCustomerIdSearch(customerName: string) {
        return this.http.get(`${this.urlRef.url}getAll/accountrecievables/basedon/customername?customerName=${customerName}`)
    }

    getCustomerBillIdSearch(customerId: number) {
        return this.http.get(`${this.urlRef.url}getbillsbycustomerid?customerId=${customerId}`)
    }

    getSalesDataBySearch(billCode: string, customerName: string) {
        return this.http.get(this.urlRef.url + 'getsalesbasedon/salesNumber?billCode=' + billCode
            + '&customerName=' + customerName);
    }

    getAllAccRecievablessBySearchCount(paymentStatus, paymentStartDate, paymentEndDate, SourceRef, pageNumber, pageSize, customerName) {
        return this.http.get(this.urlRef.url + 'getAccRecievables/forPopupSearchCount?paymentStatus=' + paymentStatus + '&paymentStartDate=' + paymentStartDate + '&paymentEndDate=' + paymentEndDate + '&SourceRef=' + SourceRef
            + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize + '&customerName=' + customerName);
    }

    getAllAccRecievablessBySearch(paymentStatus, paymentStartDate, paymentEndDate, SourceRef, pageNumber, pageSize, customerName) {
        return this.http.get(this.urlRef.url + 'getAccRecievables/forPopupSearch?paymentStatus=' + paymentStatus + '&paymentStartDate=' + paymentStartDate + '&paymentEndDate=' + paymentEndDate + '&SourceRef=' + SourceRef
            + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize + '&customerName=' + customerName);
    }

    public getAccountReceivablessNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AR');
    }

    public saveMultipleAccRecievables(generalLedgerModels: Object[]) {
        return this.http.post(this.urlRef.url + 'save/multipleAccountRecievabes/generalledgers', generalLedgerModels)
    }

    public getAllAccountPayables() {
        return this.http.get(this.urlRef.url + 'getAll/accountrecievables');
    }

    public getAllRecievablesSearchedCustomers(customerName) {
        //console.log(customerName)
        return this.http.get(this.urlRef.url + 'getAccountRecievables/customername/search?customerName=' + customerName)
    }

    public getCustomerByName(searchKey) {
        return this.http.get(this.urlRef.url + 'getcustomerdatabyname?key=' + searchKey);
    }

    public getAllAccountPayablesData() {
        return this.http.get(this.urlRef.url + 'getAll/accountrecievables/byDTO')
    }

    public getAllMasterAccounts(start, end) {
        return this.http.get(this.urlRef.url + 'get/masterAccountData/forAccRecievables?start=' + start + '&end=' + end)
    }

    public getMasterAccById(masterAccountId) {
        return this.http.get(this.urlRef.url + 'get/masteraccountbyid?masterAccountId=' + masterAccountId)
    }
    getAllMastersBySearch(creditNumber) {
        return this.http.get(this.urlRef.url + 'get/masterAccountData/forAccRecievables/bySearch?creditNumber=' + creditNumber)
    }

    // account recieables for accounts data
    getAllAccRecievablessBySearchCountForAccounts(paymentStatus, paymentStartDate, paymentEndDate, SourceRef, pageNumber, pageSize, creditNumber) {
        return this.http.get(this.urlRef.url + 'getAccRecievables/forPopupSearchCount/forAccounts?paymentStatus=' + paymentStatus + '&paymentStartDate=' + paymentStartDate + '&paymentEndDate=' + paymentEndDate + '&SourceRef=' + SourceRef
            + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize + '&creditNumber=' + creditNumber);
    }

    getAllAccRecievablessBySearchForAccounts(paymentStatus, paymentStartDate, paymentEndDate, SourceRef, pageNumber, pageSize, creditNumber) {
        return this.http.get(this.urlRef.url + 'getAccRecievables/forPopupSearch/forAccounts?paymentStatus=' + paymentStatus + '&paymentStartDate=' + paymentStartDate + '&paymentEndDate=' + paymentEndDate + '&SourceRef=' + SourceRef
            + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize + '&creditNumber=' + creditNumber);
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

    // unique unique for acc rec reciept
    public getUniqueNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=ARR');
    }

    public getCalculations(json) {
        return this.http.post(this.urlRef.url + 'getJsonDataForCaculations', json)
    }

    public getCreditNoteNumber() {
        return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=CN');
    }

    saveCreditNoteData(creditNote: Object) {
        return this.http.post(`${this.urlRef.url}save/creditNote`, creditNote);
    }

    getCustomerModelByCustomerName(customerName) {
        return this.http.get(this.urlRef.url + 'get/customermodelbyname?name=' + customerName);
    }

    getCustomerModelBySourceRefAndSourceType(sourceRef,sourceType){
        return this.http.get(this.urlRef.url + 'get/customerModelBySourceRefAndType?sourceRef=' + sourceRef + '&sourceType=' + sourceType);
    }

    public updateSaleReturnEntryWithRemarks(remarks, srNo) {
        return this.http.get(this.urlRef.url + 'update/salesReturnRemarks?remarks=' + remarks + '&srNo=' + srNo)
    }

    public updateCreditNoteEntryWithRemarks(remarks, crNo) {
        return this.http.get(this.urlRef.url + 'update/creditNoteRemarks?remarks=' + remarks + '&crNo=' + crNo)
    }

    public updateSalesBillRemarks(billCode, remarks) {
        return this.http.get(this.urlRef.url + 'update/billingRemarks?remarks=' + remarks + '&billCode=' + billCode)
    }
}