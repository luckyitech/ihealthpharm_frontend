import { HttpClient } from '@angular/common/http';
import { Environment } from 'src/app/core/environment';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable()
export class HomeService {

	constructor(private http: HttpClient) { }

	urlRef = new Environment();


	getMonthlySalesData() {
		return this.http.get(`${this.urlRef.url}monthly/totalSales`)

	}
	getEmployeeNames() {
		return this.http.get(`${this.urlRef.url}getallemployeesdata`)
	}
	getSalesByNameInDuration(fromDate, toDate, empId) {
		return this.http.get(this.urlRef.url + 'chart/getSales/byDates?fromDate=' + fromDate + '&toDate=' + toDate + '&empId=' + empId)
	}
	getSalesByPersons() {
		return this.http.get(this.urlRef.url + 'charts/getSales/byPerson')
	}
	arr = [];
	getChartSalesByEmplyee(selectedChartEmployee: Number, empName: String, date, fromTime: Number, toTime: Number, timeArray: any[]) {
		return this.http.get(this.urlRef.url + 'getSalesByHours?date=' + date
			+ '&selectedChartEmployee=' + selectedChartEmployee + '&empName=' + empName + "&fromTime=" + fromTime + "&toTime=" + toTime + "&timeArray=" + timeArray);
	}

}