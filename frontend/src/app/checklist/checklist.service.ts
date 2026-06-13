import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';


@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  constructor(private http:HttpClient) { } 
  
  urlRef = new Environment();

  getCheckListItems(){
    return this.http.get(`${this.urlRef.url}getAllCheckList`)
  }
  saveCheckList(checkListModel:object[]){
    return this.http.post(this.urlRef.url +'save/checklist',checkListModel)
  }

  getCheckListPendingCount(){
    return this.http.get(`${this.urlRef.url}getCountPendings`);
}

addCheckListService(checkListModel:object){
  return this.http.post(`${this.urlRef.url}add/checklist`,checkListModel)
}
getOnlyTitles(){
  return this.http.get(`${this.urlRef.url}getTitle`);
}
getFilteredCheckLists(title){
  return this.http.get(`${this.urlRef.url}getFilteredCheckList?title=${title}`)
}


}
