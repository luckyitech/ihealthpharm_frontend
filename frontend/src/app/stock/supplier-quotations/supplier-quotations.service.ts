import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';

@Injectable()
export class SupplierQuotationsService {
	urlRef = new Environment();

	constructor(private http: HttpClient) { }

	getreceivedpendingquotationbypharmacy(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}getreceivedpendingquotationbypharmacy?pharmacyId=${pharmacyId}`);
	}

	getreceivedapprovedquotationbypharmacy(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}getreceivedapprovedquotationbypharmacy?pharmacyId=${pharmacyId}`);
	}

	getreceivedrejectedquotationbypharmacy(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}getreceivedrejectedquotationbypharmacy?pharmacyId=${pharmacyId}`);
	}

	getrequestapprovedquotationbypharmacy(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}getrequestapprovedquotationbypharmacy?pharmacyId=${pharmacyId}`);
	}

	getrequestpendingquotationbypharmacy(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}getrequestpendingquotationbypharmacy?pharmacyId=${pharmacyId}`);
	}

	getrequestrejectedquotationbypharmacy(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}getrequestrejectedquotationbypharmacy?pharmacyId=${pharmacyId}`);
	}

	saverequestapprovedquotation(quotationModel) {
		return this.http.post(`${this.urlRef.url}save/requestapprovedquotation`, quotationModel);
	}

	saverequestrejectedquotation(quotationModel) {
		return this.http.post(`${this.urlRef.url}save/requestrejectedquotation`, quotationModel);
	}

	generateQuotationNo() {
		//return this.http.get(`${this.urlRef.url}generatequotationno?pharmacyId=${}`);
		return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=QT')
	}

	getactiveitemsdata() {
		return this.http.get(`${this.urlRef.url}item/getactiveitemsdata`);
	}

	getsentquotationbypharmacy(pharmacyId: number) {
		return this.http.get(`${this.urlRef.url}getsentquotationbypharmacy?pharmacyId=${pharmacyId}`);
	}

	getpendingquotationitems() {
		return this.http.get(`${this.urlRef.url}getpendingquotationitems`);
	}

	approvedquotationitem(quotationModel) {
		return this.http.put(`${this.urlRef.url}update/approvedquotationitem`, quotationModel);
	}

	rejectedquotationitem(quotationModel) {
		return this.http.put(`${this.urlRef.url}update/rejectedquotationitem`, quotationModel);
	}

	getapprovedquotationitems() {
		return this.http.get(`${this.urlRef.url}getapprovedquotationitems`);
	}

	getrejectedquotationitems() {
		return this.http.get(`${this.urlRef.url}getrejectedquotationitems`);
	}


	//Quotation Searches
	PendingRequestApprovalQuotationSearches(quotationNo) {
		return this.http.get(this.urlRef.url + 'getPendingApprovalQuotations/basedOnQtnNo?quotationNo=' + quotationNo)
	}

	approvedQuotationSearches(quotationNo) {
		return this.http.get(this.urlRef.url + 'getApprovedQuotations/basedOnQtnNo?quotationNo=' + quotationNo)
	}

	rejectedQuotationSearches(quotationNo) {
		return this.http.get(this.urlRef.url + 'getRejectededQuotations/basedOnQtnNo?quotationNo=' + quotationNo)
	}

	//sending qtns by mail
	public sendingQtnByMail(quotationModel) {
		return this.http.post(this.urlRef.url + 'save/sendingByMailQuotation', quotationModel)
	}

	public sendExcelFileInMailForQtn(formData:Object) {
		return this.http.post(this.urlRef.url + 'sent/sendingByMailQuotationExcel',formData)
	}

	public getAllSentMailQuotations() {
		return this.http.get(this.urlRef.url + 'getAll/sendByMailQuotation')
	}

	public approvedSupplierQuotation(quotationModel) {
		return this.http.post(this.urlRef.url + 'save/approvedSupplierQuotation', quotationModel)
	}
	public rejectSupplierQutation(quotationModel) {
		return this.http.post(this.urlRef.url + 'save/rejectedSupplierQuotation', quotationModel)
	}

	public getAllMailApprovedQuotations() {
		return this.http.get(this.urlRef.url + 'get/approvedSupplierQuotation')
	}

	public getAllMailRejectedQuotations() {
		return this.http.get(this.urlRef.url + 'get/rejectedSupplierQuotation')
	}

	// supplier Qtn Searches
	getQtnsBasedonQtnNoForOustanding(quotationNo) {
		return this.http.get(this.urlRef.url + 'getOutstandingQtns/basedOnQtnNo?quotationNo=' + quotationNo)
	}

	getQtnsBasedonQtnNoForApproved(quotationNo) {
		return this.http.get(this.urlRef.url + 'getApprovedSupplierQtns/basedOnQtnNo?quotationNo=' + quotationNo)
	}

	getQtnsBasedonQtnNoForRejected(quotationNo) {
		return this.http.get(this.urlRef.url + 'getRejectedSupplierQuotation/basedOnQtnNo?quotationNo=' + quotationNo)
	}

	public downloadPdfFile(encodeURI) {
		const httpOptions = {
			responseType: 'blob' as 'json',
			headers: new HttpHeaders({
				'Authorization': `Bearer localStorage.getItem('token')`,
			})
		};
		return this.http.get(this.urlRef.url + 'reports/generateReportPdf?inputJson=' + encodeURI, httpOptions);
	}
	public downloadExcelFile(encodeURI) {
		const httpOptions = {
			responseType: 'blob' as 'json',
			headers: new HttpHeaders({
				'Authorization': `Bearer localStorage.getItem('token')`,
			})
		};
		return this.http.get(this.urlRef.url + 'reports/generateReport?inputJson=' + encodeURI, httpOptions)
	}


	public getSuppliersListFortheQuotation(quotationNo){
		return this.http.get(this.urlRef.url + 'getSuppliersList/basedOnQtnNo?quotationNo=' + quotationNo)
	}
	public getSuppliersListFortheQuotationForPriceUpdate(quotationNo){
		return this.http.get(this.urlRef.url + 'getSuppliersList/basedOnQtnNoForUpdatePrice?quotationNo=' + quotationNo)
	}

	public updateListOfQuotationItems(quotationItemsModels:Object){
		return this.http.post(this.urlRef.url + 'update/multiplequotationitemsForPriceUpdate',quotationItemsModels)
	}
	
}