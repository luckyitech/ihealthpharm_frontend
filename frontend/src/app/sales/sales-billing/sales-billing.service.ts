import { Environment } from 'src/app/core/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalesBillingService {

  constructor(private http: HttpClient) { }
  urlRef = new Environment();

  public getCustomersData() {
    return this.http.get(this.urlRef.url + 'getlimitedcustomerdata/forSalesbilling');
  }

  public getCorporateCustomersData() {
    return this.http.get(this.urlRef.url + 'getlimitedcorporatecustomerdata/forSalesbilling');
  }

  public getStaffCustomersData() {
    return this.http.get(this.urlRef.url + 'getLimited/StaffCustomersData/forSalesbilling');
  }

  public getDoctorsData() {
    return this.http.get(this.urlRef.url + 'getlimitedprovidersdata/forsalesbilling');
  }

  public getHospitalsData() {
    return this.http.get(this.urlRef.url + 'getlimitedhospitaldata/forsalesbilling');
  }

  public getItemssData() {
    return this.http.get(this.urlRef.url + 'item/getactiveitemsdata');
  }

  public getStockData() {
    return this.http.get(this.urlRef.url + 'getallstockitems');
  }

  public getSupplierDataByItemId(itemId) {
    return this.http.get(this.urlRef.url + 'getitemsuppliersbyitemid?itemId=' + itemId);
  }

  public getBatchNumbersDataByItemId(itemId) {
    return this.http.post(this.urlRef.url + 'getitembatchnumbers', itemId);
  }

  public getStockDataByItemIdAndBatchNo(itemId, batchNo) {
    return this.http.get(this.urlRef.url + 'getstockbyitemandbatch?itemId=' + itemId + '&batchNo=' + batchNo);
  }

  public getStockDataByItem(itemId) {
    return this.http.post(this.urlRef.url + 'getstockbyitem', itemId);
  }

  public getStockDataByItemName(itemName) {
    return this.http.post(this.urlRef.url + 'getstockbyitemnamesearch', itemName);
  }

  public getItemDataByItemName(searchTerm) {
    return this.http.get(this.urlRef.url + 'item/getallby/ItemNameSearch?searchTerm=' + searchTerm);
  }

  public getItemDataByItemCode(searchTerm) {
    return this.http.get(this.urlRef.url + 'item/getallby/searchkey?searchTerm=' + searchTerm);
  }

  public getStockDataByItemAndPharmacy(payload) {
    return this.http.post(this.urlRef.url + 'getstockbyitemandpharmacy', payload);
  }

  public getStockDataByItemAndPharmacyId(searchTerm, searchCode, pharmacyId, pageNumber, pageSize) {
    return this.http.get(this.urlRef.url + 'getstockbyitemandpharmacyid?searchTerm=' + searchTerm + "&searchCode=" +
      searchCode + "&pharmacyId=" + pharmacyId + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize);
  }

  public getStockDataByItemAndPharmacyIdCount(searchTerm, searchCode, pharmacyId) {
    return this.http.get(this.urlRef.url + 'getstockbyitemandpharmacyidcount?searchTerm=' + searchTerm + "&searchCode=" +
      searchCode + "&pharmacyId=" + pharmacyId);
  }

  public getInsurenceDataByPolicyCode(policyCode) {
    return this.http.get(this.urlRef.url + 'getcustomerinsurancedatabypolicycode?policyCode=' + policyCode);
  }

  public getMembershipDataByMembershipCardNumber(membershipCardNumber) {
    return this.http.get(this.urlRef.url + 'getbymembershipcardnumber?membershipCardNumber=' + membershipCardNumber);
  }

  public getSalesBillingNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=SB');
  }

  public getAllLablesForSalesBilling() {
    return this.http.get(this.urlRef.url + 'getallformulationinstructions')
  }

  public saveSales(payload) {
    return this.http.post(this.urlRef.url + 'save/sales', payload);
  }

  public updateSales(payload) {
    return this.http.post(this.urlRef.url + 'update/sales', payload);
  }

  public savePrescription(payload) {
    return this.http.post(this.urlRef.url + 'save/prescription', payload);
  }

  public saveSalesItems(payload) {
    return this.http.post(this.urlRef.url + 'save/salesItems', payload);
  }

  public getAllSales() {
    return this.http.get(this.urlRef.url + 'get/allsales');
  }

  public getSalesBySearchkeys(formData) {
    return this.http.post(this.urlRef.url + 'get/bysalessearchkeys', formData);
  }

  public getSalesHistoryBySearch(status, code, codeValue, startDate, endDate, pageNumber, pageSize) {
    return this.http.get(this.urlRef.url + 'getsaleshistorybysearch?status=' + status + '&code=' + code + '&codeValue=' + codeValue + '&startDate=' + startDate +
      '&endDate=' + endDate + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize);
  }

  public getSalesHistoryBySearchCoun(status, code, codeValue, startDate, endDate) {
    return this.http.get(this.urlRef.url + 'getsaleshistorybysearchcount?status=' + status + '&code=' + code + '&codeValue=' + codeValue + '&startDate=' + startDate +
      '&endDate=' + endDate);
  }

  public getSalesIemsByStockId(stock) {
    return this.http.post(this.urlRef.url + 'get/salesitemsbybillid', stock);
  }
  public getCustomerByName(searchKey) {
    return this.http.get(this.urlRef.url + 'getcustomerdatabyname?key=' + searchKey);
  }

  public getCorporateCustomerByName(searchKey) {
    return this.http.get(this.urlRef.url + 'getcorporatecustomerdatabyname?key=' + searchKey);
  }

  public getStaffCustomerByName(searchKey) {
    return this.http.get(this.urlRef.url + 'getStaff/byCustomerByName?key=' + searchKey);
  }

  public getCustomerByPhNo(searchKey) {
    return this.http.get(this.urlRef.url + 'getcustomerdatabyphno?key=' + searchKey);
  }

  public getCorporateCustomerByPhNo(searchKey) {
    return this.http.get(this.urlRef.url + 'getcorporatecustomerdatabyphno?key=' + searchKey);
  }

  public getStaffCustomerByPhNo(searchKey) {
    return this.http.get(this.urlRef.url + 'getStaff/CustomerDataByPhNo?key=' + searchKey);
  }


  public getHospitalByName(searchKey) {
    return this.http.get(this.urlRef.url + 'gethospitaldatabyname?key=' + searchKey);
  }

  public getPreviousBillCodeByKey(key) {
    return this.http.get(this.urlRef.url + 'getpreviousbillcodesbysearch?key=' + key);
  }

  public getPreviousBillCodes() {
    return this.http.get(this.urlRef.url + 'getpreviousbillcodes');
  }

  public getProviderByName(searchKey) {
    return this.http.get(this.urlRef.url + 'getprovidersdatabyname?key=' + searchKey);
  }

  /* sales return urls */
  public getSalesReturnBillNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=SR');
  }

  public getSalesItemsBasedOnBillCode(sales) {
    return this.http.post(this.urlRef.url + 'get/salesitemsbybillid', sales);
  }

  getPrescription(payload) {
    return this.http.post(this.urlRef.url + 'getbycustomeranddate', payload);
  }

  getInsurenceByCustomer(customer) {
    return this.http.post(this.urlRef.url + 'getcustomerinsurancedatabycustomer', customer);
  }
  public saveSalesReturnData(salesReturnModel) {
    return this.http.post(this.urlRef.url + 'save/salesreturns', salesReturnModel);
  }

  public getCreditNoteNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=CN');
  }

  public saveCreditNote(creditNoteModel) {
    return this.http.post(this.urlRef.url + 'save/creditNote', creditNoteModel);
  }

  public getAccountPaybalesBasedOnBillCode(salesModel: number) {
    return this.http.get(`${this.urlRef.url}getaccreceipts/basedonbillid?salesModel=${salesModel}`);
  }
  public saveSalesReturnItemsData(salesReturnItemsModel) {
    return this.http.post(this.urlRef.url + 'save/salesreturnitems', salesReturnItemsModel);
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

  getSalesBySearchNumber(key) {
    return this.http.get(this.urlRef.url + 'get/allsalesbasedonsearch?key=' + key)
  }

  saveCustomer(customerInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/customer', customerInformation)
  }

  saveProvider(providerInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/provider', providerInformation)
  }
  getEmployeeById() {
    return this.http.get(this.urlRef.url + 'getemployeedatabyid?employeeId=' + localStorage.getItem('id'))
  }

  public getAccountReceivablessNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AR');
  }

  saveAccountReceivables(AccountReceivablesInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/accountReceivables', AccountReceivablesInformation)
  }

  public saveGeneralLedger(generalLedgerModel: object) {
    return this.http.post(this.urlRef.url + 'save/recievableLedger/fomSalesBilling', generalLedgerModel)
  }

  public getReturnQtyBasedOnId(itemId, billId) {
    return this.http.get(this.urlRef.url + 'getReturnQty/basedon/ItemId?itemId=' + itemId + '&billId=' + billId);
  }

  public saveItemInstructions(itemInstructionsModel: Object[]) {
    return this.http.post(this.urlRef.url + 'save/iteminstructions', itemInstructionsModel)
  }

  public getEmployeeName(employeeId) {
    return this.http.get(this.urlRef.url + 'getEmployeeName/byEmpId?employeeId=' + employeeId)
  }

  //get limited bills data
  getBillsByLimit(start, end) {
    return this.http.get(this.urlRef.url + 'getbills/databylimit?start=' + start + '&end=' + end);
  }

  getBillsByBillNo(key) {
    return this.http.get(this.urlRef.url + 'getbills/DataByName?key=' + key)
  }

  getMaxDiscount() {
    return this.http.get(this.urlRef.url + 'get/maxdiscount')
  }
  getAllDiscounts() {
    return this.http.get(this.urlRef.url + 'getall/discounts')
  }

  getMargin() {
    return this.http.get(this.urlRef.url + 'get/margin')
  }

  getConfigurationStatus() {
    return this.http.get(this.urlRef.url + 'getconfigurationstatus');
  }

  getMasterByCustomerId(customerId) {
    return this.http.get(this.urlRef.url + 'get/masterbycustomer?customerId=' + customerId);
  }

  updateMasterByAccountId(masterAccountId, creditLimitLeft, entryType, salesBillNo) {
    return this.http.get(this.urlRef.url + 'update/masteraccountbyaccountid?masterAccountId=' + masterAccountId + '&creditLimitLeft=' + creditLimitLeft +
      '&lastUpdatedUser=' + localStorage.getItem('id') + '&entryType=' + entryType + '&salesBillNo=' + salesBillNo);
  }

  getSalesReturnHistory() {
    return this.http.get(this.urlRef.url + 'getAllSalesReturn/historyData')
  }

  getSalesReturnDatabyId(salesReturnId) {
    return this.http.get(this.urlRef.url + 'getSalesReturnItems?salesReturnId=' + salesReturnId)
  }

  getSaleItemsById(billId) {
    return this.http.get(this.urlRef.url + 'getAll/salesItemsbyBillId?billId=' + billId)
  }

  getCustomerCreditNotes(customerId) {
    return this.http.get(this.urlRef.url + 'getCreditNotesByCustomerIdPending?customerId=' + customerId)
  }

  public getCreditNoteNumberByBillType(type) {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=' + type);
  }

  updateCreditNoteAndAddNewCreditNoteWithLeftAmount(leftAmount, prevCreditNoteNo, newCreditNoteNo, billCode, netAmount) {
    return this.http.get(this.urlRef.url + 'updateCreditNoteAndAddNewCreditNote?leftAmount=' + leftAmount +
      '&prevCreditNoteNo=' + prevCreditNoteNo + '&newCreditNoteNo=' + newCreditNoteNo + '&billCode=' + billCode + '&netAmount=' + netAmount);
  }

  getBillTypes() {
    return this.http.get(this.urlRef.url + 'getallBillTypes');
  }


  getallpaymenttypes() {
    return this.http.get(`${this.urlRef.url}getallpaymenttypes`);
  }
  updateCreditNotePaymentStatus(creditNoteId, paymentStatus) {
    return this.http.get(this.urlRef.url + 'updateCreditNote/paymentStatus?creditNoteId=' + creditNoteId + '&paymentStatus=' + paymentStatus)
  }
}
