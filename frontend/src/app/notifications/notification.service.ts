import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../core/environment';


@Injectable({
    providedIn: 'root'
})
export class NotificationService{

    constructor(private http:HttpClient){}
    urlRef = new Environment();

    saveNotification(notificationModel:object[]){
        return this.http.post(this.urlRef.url+'save/notification',notificationModel)
    }
}