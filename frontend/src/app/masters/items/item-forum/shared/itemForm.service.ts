import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from 'src/app/core/environment';


@Injectable()
export class ItemFormService{
    constructor(private http:HttpClient){}

    urlRef = new Environment();
    getList() {
		return this.http.get('/api/list');
	}
}