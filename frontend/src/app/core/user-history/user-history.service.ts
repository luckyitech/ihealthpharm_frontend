import { HttpClient } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserHistoryService {
  urlRef = new Environment();
  constructor(private http: HttpClient, ) { }

  saveUserhistoryDetails(obj) {
    return this.http.post(this.urlRef.url + "user/saveuserhistory", obj);
  }

  // this methos is used to get ip address of user
  public getIPAddress() {
    return this.http.get("http://api.ipify.org/?format=json");
  }
}
