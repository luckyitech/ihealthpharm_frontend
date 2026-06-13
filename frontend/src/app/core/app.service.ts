
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Environment } from './environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppService {
    editedObj = new BehaviorSubject<any>(undefined);
    url = new Environment();
    constructor(private http: HttpClient) {

    }
    // permissions = new BehaviorSubject<any>(undefined);

    // getPermissions()
    // {
    //     return this.permissions.asObservable();
    // }

    // setPermissions(permissions:Object){
    //     this.permissions.next(permissions);
    // }

    permissions: any[] = [];

    getPermissions() {
        return this.http.post(this.url.url + 'getemployeeaccessdatabyemployeeid', { 'employeeId': localStorage.getItem('id') });
    }

    setPermissions(permissions: any[]) {
        this.permissions = permissions;
    }

    fetchPermissions() {
        return this.permissions;
    }

    setEditedObj(obj) {
        this.editedObj.next(obj);
    }

    getEditedObj() {
        return this.editedObj.asObservable();
    }

    deleteObj = new BehaviorSubject<any>(undefined);

    setDeletedObj(obj) {
        this.deleteObj.next(obj);
    }

    getDeletedObj() {
        return this.deleteObj.asObservable();
    }

    private insertedRowData = [];

    getInsertedRowData() {
        return this.insertedRowData;
    }

    setInsertedRowData(rowData: any[]) {
        this.insertedRowData = rowData;
    }

    clearInsertedRowData() {
        this.insertedRowData = [];
    }

    private login = new BehaviorSubject<any>(false);

    setLogin(message: boolean) {
        this.login.next(message);
    }
    getLogin() {
        return this.login.asObservable();
    }

    private purchaseOrderDeletedObj = new Subject<any>();

    setPurchaseOrderDeletedRow(deleteObj: any) {
        this.purchaseOrderDeletedObj.next(deleteObj);
    }

    getPurchaseOrderDeletedRow() {
        return this.purchaseOrderDeletedObj.asObservable();
    }

    getCheckListPendingCount(){
        return this.http.get(`${this.url.url}getCountPendings`);
    }

    getEmployeePharmacyroleByEmployeeId(id) {
        return this.http.post(this.url.url + 'getemployeepharmacyroledatabyemployeeid', { employeeId: id });
      }
     
}