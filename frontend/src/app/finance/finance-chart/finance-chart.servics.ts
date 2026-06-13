import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';


@Injectable()
export class FinanceChartService{

    constructor(private http:HttpClient){}
    urlRef = new Environment();

    pendingDetails(){
        return this.http.get(`${this.urlRef.url}getPendingCount`)
    }
    partiallyPaidDetails(){
        return this.http.get(`${this.urlRef.url}getPartallyPaidCount`)
    }
    paidDetails(){
        return this.http.get(`${this.urlRef.url}getPaidCount`)
    }
}