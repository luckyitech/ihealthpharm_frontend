import { Environment } from 'src/app/core/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class PaymentsService {

  urlRef = new Environment();

  constructor(private http: HttpClient) {
  }


  getRowDataFromAccountPayables() {
    return this.http.get(this.urlRef.url + 'getaccountPayablesdata');
  }
  getRowDataFromAccountPayablesInvoices() {
    return this.http.get(this.urlRef.url + 'getaccountPayablesInvoicesdata');
  }
  getInvoicesBySupplierId() {
    return this.http.get(this.urlRef.url + 'getinvoicesbysupplierid');

  }

  updateAccountPayables(accountPayablesModels: Object[]) {
    return this.http.put(this.urlRef.url + 'update/accountPayables', accountPayablesModels);
  }

  updateAccountPayablesInvoices(selectedAccountPayablesInvoices: any) {
    return this.http.put(this.urlRef.url + 'update/accountPayablesInvoices', selectedAccountPayablesInvoices);
  }

  saveAccountPayables(accountPayablesModel: Object) {
    return this.http.post(this.urlRef.url + 'save/accountPayables', accountPayablesModel)
  }

  getInvoiceDataBySearch(invoiceNo: string) {
    return this.http.get(this.urlRef.url + 'getinvoicebasedon/InvoiceNumber?invoiceNo=' + invoiceNo);
  }

  /* getAllAccPayablesByInvoice(invoiceNo: string, supplierName: string) {
      return this.http.get(this.urlRef.url + 'getall/accpay/basedoninvoice?invoiceNo=' + invoiceNo
          + '&supplierName=' + supplierName)
  } */
  // getAccPayables/forPopupSearch

  public getAllAccPayablesBySeaches(selectedPaymentStatus, paymentStartDate, paymentEndDate, invoiceNo, pageNumber, pageSize, supplierName) {
    return this.http.get(this.urlRef.url + 'getAccPayables/forPopupSearch?selectedPaymentStatus=' + selectedPaymentStatus + '&paymentStartDate=' + paymentStartDate + '&paymentEndDate=' + paymentEndDate + '&invoiceNo=' + invoiceNo
      + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize + '&supplierName=' + encodeURIComponent(supplierName));
  }

  getAllAccPayablesBySeachCount(selectedPaymentStatus, paymentStartDate, paymentEndDate, invoiceNo, supplierName) {
    return this.http.get(this.urlRef.url + 'getAccPayables/forPopupSearchCount?selectedPaymentStatus=' + selectedPaymentStatus + '&paymentStartDate=' + paymentStartDate + '&paymentEndDate=' + paymentEndDate + '&invoiceNo=' + invoiceNo
      + '&supplierName=' + encodeURIComponent(supplierName));
  }

  deleteAccountPayables(accountPayablesId: number) {
    return this.http.post(this.urlRef.url + 'delete/accountPayables', accountPayablesId)
  }

  saveAccountPayablesInvoices(AccountPayablesInvoicesInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/accountPayablesInvoices', AccountPayablesInvoicesInformation)
  }

  getSupplierSearch(supplierName: string) {
    return this.http.get(`${this.urlRef.url}getAll/AccountPayables/basedonSupplier?supplierName=${supplierName}`)
  }

  getCustomerIdSearch(customerName: string) {
    return this.http.get(`${this.urlRef.url}getAll/Accountpayables/basedonCustomer?customerName=${customerName}`)
  }


  public getAccountPayablesNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AP');
  }

  public getGeneralLedgerNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=GL')
  }

  public saveMultipleLedgers(generalLedgerModels: Object[]) {
    return this.http.post(this.urlRef.url + 'save/multipleAccountPayables/generalledgers', generalLedgerModels)
  }

  public getAllAccountPayables() {
    return this.http.get(this.urlRef.url + 'getAll/accountpayables')
  }


  public getAllAccountPayablesForSuppliers() {
    return this.http.get(this.urlRef.url + 'getAll/AccountPayables/basedonsuppliers');
  }

  public getAllSuppliersBasedonNameSearch(supplierName) {
    return this.http.get(this.urlRef.url + 'getAll/suppliersby/nameSearch?supplierName=', supplierName)
  }

  saveChequeData(chequeModel) {
    return this.http.post(this.urlRef.url + 'save/cheque', chequeModel)
  }

  deleteAllChequeItems(chequeId) {
    return this.http.get(this.urlRef.url + 'delete/allChequeItems?chequeId=' + chequeId)
  }

  deleteChequeItem(accountPayableId) {
    return this.http.get(this.urlRef.url + 'delete/ChequeItem?accountPayableId=' + accountPayableId)
  }

  getCheques() {
    return this.http.get(this.urlRef.url + 'get/cheque')
  }

  updateChequeData(chequeModel) {
    return this.http.post(this.urlRef.url + 'update/cheque', chequeModel)
  }

  getApprovedCheques() {
    return this.http.get(this.urlRef.url + 'getAllApproved/cheques')
  }

  getAllPendingChequesBySearch(chequeNumber, employeeId) {
    return this.http.get(this.urlRef.url + 'getAllPending/cheques/basedOnSearch?chequeNumber=' + chequeNumber + '&employeeId=' + employeeId)
  }

  getAllChequesByInvoiceNo(invoiceNo, status) {
    return this.http.get(this.urlRef.url + 'getAllPending/cheques/basedOnInvoiceNo?invoiceNo=' + invoiceNo + "&status=" + status)
  }

  getAllApprovedChequesBySearch(chequeNumber) {
    return this.http.get(this.urlRef.url + 'getAllApproved/cheques/basedOnSearch?chequeNumber=' + chequeNumber)
  }

  getEmployeeAccessForCheques(employeeId) {
    return this.http.get(this.urlRef.url + 'getChequeApprovalStatus/byEmpId?employeeId=' + employeeId)
  }

  getInvoiceSearch(invoiceNo) {
    return this.http.get(this.urlRef.url + 'getinvoicebynum?invoiceNo=' + invoiceNo)
  }
  getMaxDiscount() {
    return this.http.get(this.urlRef.url + 'get/maxdiscount')
  }

  getMargin() {
    return this.http.get(this.urlRef.url + 'get/margin')
  }

  getConfigurationStatus() {
    return this.http.get(this.urlRef.url + 'getconfigurationstatus');
  }

  getallpaymenttypes() {
    return this.http.get(`${this.urlRef.url}getallpaymenttypes`);
  }

  getalldeliverytypes() {
    return this.http.get(`${this.urlRef.url}getalldeliverytypes`);
  }

  deleteChequeById(id) {
    return this.http.get(`${this.urlRef.url}delete/ChequeById?chequeId=${id}`);
  }
}
