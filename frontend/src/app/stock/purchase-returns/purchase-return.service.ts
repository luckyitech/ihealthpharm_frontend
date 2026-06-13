import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../../../app/core/environment'

@Injectable({
  providedIn: 'root'
})
export class PurchaseReturnService {

  urlRef = new Environment();

  constructor(private http: HttpClient) { }

  fetchByInvoiceByNumber(invoiceId: number) {
    return this.http.get(`${this.urlRef.url}getinvoicebynum?invoiceNo=${invoiceId}`);
    // return this.http.get("../../../assets/data.json");
  }

  fetchPRNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=PR');
  }

  getInvoiceItems(searchTerm: string) {
    return this.http.get(`${this.urlRef.url}getinvoiceitembyid?invoiceItemId=${searchTerm}`);
  }

  getSuppliersData(searchTerm: string) {
    return this.http.get(`${this.urlRef.url}getallSuppliers/byName?searchTerm=${searchTerm}`);
  }

  retrieveStockItems(itemCd: number, batchNo: string) {
    return this.http.get(this.urlRef.url + 'getstockbyid?stockId=132');
    // return this.http.get(`${this.urlRef.url}getstockbyitemandbatch?itemId=${itemCd}&batchNo=${batchNo}`);
  }

  generatepurchasegrnno(pharmacyId: number) {
    return this.http.get(`${this.urlRef.url}generatepurchasegrnno?pharmacyId=${pharmacyId}`);
  }

  retrieveSupplierItems(supplierId: number) {
    return this.http.get(`${this.urlRef.url}getitemsuppliers/basedonSupplierId?supplierId=${supplierId}`);
  }

  fetchItemDetails(itemId: string) {
    return this.http.get(`${this.urlRef.url}getitemsbysupplier?supplierId=${itemId}`);
  }

  savePurchaseReturns(purchaseReturnspayload: any) {
    return this.http.post(`${this.urlRef.url}save/purchaseReturn`, purchaseReturnspayload);
  }

  savePurchaseReturnItem(prItem: any) {
    return this.http.post(`${this.urlRef.url}save/purchaseReturnItems`, prItem);
  }

  saveDebitNoteData(debitNote: Object) {
    return this.http.post(`${this.urlRef.url}save/debitNote`, debitNote);
  }

  public getDebitNoteNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=DN');
  }

  saveAccountPayables(AccountPayablesInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/accountPayables', AccountPayablesInformation)
  }

  public getAccountPayablesNumber() {
    return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=AP');
  }

  public getReturnQtyBasedonItemAndInvocie(itemId, invoiceId) {
    return this.http.get(this.urlRef.url + 'getreturnQty/basedon/invoiceIdandItemId?itemId=' + itemId + '&invoiceId=' + invoiceId)
  }

  getStockQty(batchNo, itemId, invoiceNo) {
    return this.http.get(this.urlRef.url + 'getLatestStockQty/forPurchaseRertun?batchNo=' + batchNo + '&itemId=' + itemId + '&invoiceNo=' + invoiceNo)
  }

  public fetchPurchaseReturnDataByInvoiceNo(invoiceNo) {
    return this.http.get(`${this.urlRef.url}getPurchaseReturnDataByInvoiceNo?invoiceNo=${invoiceNo}`);
  }

}
