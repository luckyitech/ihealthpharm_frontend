import { Environment } from 'src/app/core/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class TermsAndConditionsService {

  
    urlRef=new Environment

    constructor(private http:HttpClient){}


    getRowDataFromServer(){
        return this.http.get(this.urlRef.url+ 'getallcompanytermsdata');
    }

    updateRowData(selectedCompanyTerms: any[]) {
        return this.http.put(this.urlRef.url+ 'update/multiplecompanyterms', selectedCompanyTerms);
    }

    updateCompanyTerms(selectedCompanyTerms :any){
        return this.http.put(this.urlRef.url+'update/companyterms', selectedCompanyTerms);
    }

    deleteRowData(selectedCompanyTerms) {
        return this.http.request('delete',this.urlRef.url+ 'delete/multiplecompanyterms?companyTermsIds='+selectedCompanyTerms );
    }

    saveFormChanges(companyTermsInformation: Object) {
        return this.http.post(this.urlRef.url+'save/companyterms', companyTermsInformation);
    }

}