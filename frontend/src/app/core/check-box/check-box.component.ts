import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/core/app.service';

@Component({
	selector: 'check-box',
	templateUrl: './check-box.component.html',
	styleUrls: ['./check-box.component.css']
})

export class CheckBoxComponent {
	params: any;
	constructor(private appService: AppService) {

	}

	agInit(params: any): void {
		this.params = params
	}

	deleteRow() {
		this.appService.setPurchaseOrderDeletedRow(this.params);
	}

}