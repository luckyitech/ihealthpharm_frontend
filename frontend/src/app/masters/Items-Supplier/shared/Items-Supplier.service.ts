import { HttpClient } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

@Injectable()
export class ItemsSupplierService {


	constructor(private http: HttpClient) { }

	urlRef = new Environment();


	getUnMappedSuppliers(itemId: number, searchTerm: string) {
		return this.http.get(`${this.urlRef.url}getunmapped/suppliers?itemId=${itemId}`);
	}

	getUnMappedItemData(supplierId: number, searchTerm: string) {
		return this.http.get(`${this.urlRef.url}getunmapped/items?supplierId=${supplierId}`);
	}

	getItemSupplierData() {
		return this.http.get(`${this.urlRef.url}getitemsuppliers/mapppeddata`);
	}

	getSuppliersData(searchTerm: string) {
		return this.http.get(`${this.urlRef.url}getallSuppliers/byName?searchTerm=${searchTerm}`);
	}

	saveItemSuppliers(itemSupplier: Object) {
		return this.http.post(`${this.urlRef.url}save/itemsupplier`, itemSupplier);
	}

	getItemSupplierItemIdSearch(itemId: number) {
		return this.http.get(`${this.urlRef.url}getitemsuppliers/basedonItemId?itemId=${itemId}`);
	}

	getSupplierItemSupplierIdSearch(SupplierId: number) {
		return this.http.get(`${this.urlRef.url}getitemsuppliers/basedonSupplierId?supplierId=${SupplierId}`)
	}


	updateItemSupplierData(itemSupplierModel: Object) {
		return this.http.put(`${this.urlRef.url}update/itemsupplier`, itemSupplierModel);
	}


	public getItemByName(searchTerm: string) {
		return this.http.get(`${this.urlRef.url}item/getallby/ItemNameSearch/foritemsupplier?searchTerm=${searchTerm}`);
	}


	public getSupplierByName(searchKey: string) {
		return this.http.get(`${this.urlRef.url}getsuppliersdatabyname/forsupplieritem?key=${searchKey}`);
	}

	public getItemsByBarcode(barcode:string){
		return this.http.get(`${this.urlRef.url}item/getItemsByBarcode/forItemSupplier?barcode=${barcode}`);
	}

}