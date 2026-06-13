import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, GridApi } from 'ag-grid-community';
import { AppService } from 'src/app/core/app.service';
import { ItemService } from '../shared/item.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
	selector: 'app-item-forum',
	templateUrl: './item-forum.component.html',
	styleUrls: ['./item-forum.component.scss'],
	providers: [ItemService]
})

export class ItemForumComponent implements OnInit {

	itemFormObj: FormGroup;
	itemFormList = [];
	medicalOrNonMedicalArray = ['M', 'N'];
	gridApi: GridApi;
	itemGridOptions: GridOptions;
	showGrid: boolean = true;

	constructor(private itemService: ItemService, private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder, private appService: AppService,
		private toasterService: ToastrService) {
		this.itemGridOptions = <GridOptions>{
			context: {
				componentParent: this
			}
		};
		this.itemGridOptions.rowSelection = 'single';
		this.itemGridOptions.singleClickEdit = true;
		this.itemGridOptions.enableRangeSelection = true;
		this.itemGridOptions.onRowSelected = this.rowSelection.bind(this);
		this.getGridRowData();
	}

	rowSelection(params: any) {
		if (!params.node.selected) {
			let resetData = this.appService.getInsertedRowData()
				.find(dataRow => dataRow.providerId === params.data.providerId);
			params.node.setData(JSON.parse(JSON.stringify(resetData)));
		}
	}

	getGridRowData() {
		this.showGrid = true;
	}

	ngOnInit() {
		this.itemFormObj = new FormGroup(this.itemFormInformationFormValidations);
	}

	checkFormDisability() {
		return (this.itemFormObj.get('form').errors instanceof Object)
			|| this.itemFormObj.get('form').invalid
	}

	itemFormInformationFormValidations = {
		formCode: new FormControl('', [Validators.required]),
		medicalOrNonMedical: new FormControl('M'),
		form: new FormControl('', Validators.required),
		activeS: new FormControl('Y')
	};
	getItemForms() {
		this.itemService.getItemForms().subscribe((res: any) => {
			this.itemFormList = res.result;
		},
			err => {
			});
	}

	onSubmit() {
		let payload = Object.assign({}, this.itemFormObj.value);
		payload['createdUser'] = localStorage.getItem('id');
		payload['lastUpdateUser'] = localStorage.getItem('id');
		this.saveFormChanges(payload);
	}

	saveFormChanges(itemFormObj: Object) {
		this.itemFormObj.get('form').setErrors({ 'incorrect': true });
		this.spinnerService.show();
		this.itemService.saveItemForm(itemFormObj).subscribe(
			saveItemFormResponse => {
				if (saveItemFormResponse instanceof Object) {
					if (saveItemFormResponse['responseStatus']['code'] === 200) {
						this.itemFormObj.reset();
						this.spinnerService.hide();
						this.itemFormObj.controls.activeS.setValue('Y');
						this.itemFormObj.controls.medicalOrNonMedical.setValue('M');
						this.toasterService.success(saveItemFormResponse['message'], 'Success', {
							timeOut: 3000
						});
					}
					else {
						this.toasterService.error('Please contact administrator', 'Error Occurred', {
							timeOut: 5000
						});
						this.spinnerService.hide();
					}
				} else {
					this.toasterService.error('Please contact administrator', 'Error Occurred', {
						timeOut: 5000
					});
					this.spinnerService.hide();
				}
			}, error => {
				this.spinnerService.hide();
				this.toasterService.error('Please contact administrator', 'Error Occurred', {
					timeOut: 5000
				});
			}
		);
	}

	get f() { return this.itemFormObj.controls; }

}
