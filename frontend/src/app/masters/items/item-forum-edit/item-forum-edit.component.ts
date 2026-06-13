import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridApi, GridOptions, ColDef } from 'ag-grid-community';
import { ItemService } from '../shared/item.service';
import { AppService } from 'src/app/core/app.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
	selector: 'app-item-forum-edit',
	templateUrl: './item-forum-edit.component.html',
	styleUrls: ['./item-forum-edit.component.scss'],
	providers: [ItemService]
})

export class ItemForumEditComponent implements OnInit {

	itemFormObj: FormGroup;
	itemFormList = [];
	rowData = [];
	itemForms = [];
	medicalOrNonMedicalArray = ['M', 'N'];
	gridApi: GridApi;
	itemGridOptions: GridOptions;
	showGrid: boolean = true;
	show: boolean = true;
	selectedItemForm;

	constructor(private itemService: ItemService, private formBuilder: FormBuilder, private appService: AppService,
		private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
		this.itemGridOptions = <GridOptions>{
			context: {
				componentParent: this
			}
		};
		this.itemGridOptions.rowSelection = 'single';
		this.itemGridOptions.columnDefs = this.columnDefs;
		this.getGridRowData();

		this.itemGridOptions.getRowStyle = function (params) {
			if (params.node.rowIndex % 2 !== 0) {
			  return { background: '#cccccc' }
			}
		  }
	}

	columnDefs: ColDef[] = [
		{
			headerName: "",
			field: "",
			checkboxSelection: true,
			sortable: true,
			lockPosition: true,
			lockVisible: true,
			pinned: "left",
			lockPinned: true,
			width: 40
		},
		{ headerName: 'Medical or Non Medical', field: 'medicalOrNonMedical', sortable: true, resizable: true, filter: true },
		{ headerName: 'Form Code', field: 'formCode', sortable: true, resizable: true, filter: true },
		{ headerName: 'Form Description', field: 'form', sortable: true, resizable: true, filter: true },
		{ headerName: 'Status', field: 'Status', sortable: true, resizable: true, filter: true }
	];



	rowSelection(params: any) {
		if (!params.node.selected) {
			let resetData = this.appService.getInsertedRowData()
				.find(dataRow => dataRow.providerId === params.data.providerId);
			params.node.setData(JSON.parse(JSON.stringify(resetData)));
		}
	}

	getGridRowData() {
		this.showGrid = false;
		this.itemService.getItemForms().subscribe(
			gridRowDataResponse => {
				if (gridRowDataResponse instanceof Object) {
					if (gridRowDataResponse['responseStatus']['code'] === 200) {
						this.rowData = gridRowDataResponse['result'];
						this.itemForms = this.rowData;
						for (let i = 0; i < this.rowData.length; i++) {
							if (this.rowData[i].activeS == 'Y') {
								this.rowData[i].Status = 'Active'
							}
							else if (this.rowData[i].activeS == 'N') {
								this.rowData[i].Status = 'DeActive'
							}
						}
						this.showGrid = true;
						this.show = true;
					} else {
						this.toasterService.error('Please contact administrator', 'Error Occurred', {
							timeOut: 5000
						});
					}
				} else {
					this.toasterService.error('Please contact administrator', 'Error Occurred', {
						timeOut: 5000
					});
				}
			}
		);
	}

	editGrid() {
		this.onItemFormSelected(this.itemGridOptions.api.getSelectedRows()[0].itemformId);
		this.show = false;
	}

	onItemFormSelected(itemformId: number) {
		this.selectedItemForm = this.itemForms.find(itemForm => itemForm['itemformId'] === itemformId);
		this.itemService.getItemFormById(this.selectedItemForm['itemformId']).subscribe(
			getItemCategoryResponse => {
				if (getItemCategoryResponse instanceof Object) {
					if (getItemCategoryResponse['responseStatus']['code'] === 200) {
						let itemFormValues: Object = {
							itemformId: this.selectedItemForm['itemformId'],
							formCode: this.selectedItemForm['formCode'],
							medicalOrNonMedical: this.selectedItemForm['medicalOrNonMedical'],
							form: this.selectedItemForm['form'],
							activeS: this.selectedItemForm['activeS']
						}
						this.itemFormObj.setValue(itemFormValues);
					} else {
						this.toasterService.error('Please contact administrator', 'Error Occurred', {
							timeOut: 5000
						});
					}
				} else {
					this.toasterService.error('Please contact administrator', 'Error Occurred', {
						timeOut: 5000
					});
				}
			}
		);
	}


	ngOnInit() {
		$(document).ready(function () {
			$(".common-grid-btn").click(function () {
				$(".common-grid").hide();
				$("#itemFormGrid").hide();
			});
			$(".common-grid-btn").click(function () {
				$("#itemForm-Information").show();
			});
			$(".save-btn").click(function () {
				$(".common-grid").show();
				$("#itemFormGrid").show();
			});
			$(".mu-adduser-cancel").click(function () {
				$(".common-grid").show();
				$("#itemFormGrid").show();
			});
			$(".common-grid-btn").click(function () {
				$("#itemForm-Information").css("display", "block");
			});
			$(".save-btn").click(function () {
				$("#itemForm-Information").css("display", "none");
			});
			$(".mu-adduser-cancel").click(function () {
				$("#itemForm-Information").css("display", "none");
			});
		});
		this.buildForm();
	}

	buildForm() {
		this.itemFormObj = this.formBuilder.group({
			itemformId: [''],
			formCode: ['', Validators.required],
			medicalOrNonMedical: [''],
			form: ["", Validators.required],
			activeS: ['Y']
		});
	}

	getItemForms() {
		this.itemService.getItemForms().subscribe((res: any) => {
			this.itemFormList = res.result;
		},
			err => {
			});
	}

	checkFormDisability() {
		return (this.itemFormObj.get('form').errors instanceof Object)
			|| this.itemFormObj.get('form').invalid
	}

	reset() {
		this.itemFormObj.reset();
		this.itemFormObj.controls.activeS.setValue('Y');
		this.itemFormObj.controls.medicalOrNonMedical.setValue('M');
		this.show = true;
	}

	onSubmit() {
		if (this.itemFormObj.valid) {
			this.itemFormObj.get('form').setErrors({ 'incorrect': true })
			this.spinnerService.show();
			this.itemService.updateItemForm(this.itemFormObj.value).subscribe((res: any) => {
				let payload = Object.assign({}, this.itemFormObj.value);
				payload['lastUpdateUser'] = localStorage.getItem('id');
				payload['createdUser'] = localStorage.getItem('id');
				if (res instanceof Object) {
					if (res['responseStatus']['code'] === 200) {
						this.spinnerService.hide();
						this.itemFormList = res.result;
						this.itemFormObj.reset();
						this.getGridRowData();
						this.toasterService.success(res['message'], 'Success', {
							timeOut: 3000
						});
					}
				}
			},
				err => {
					this.spinnerService.hide();
				});
		} else {
			this.toasterService.error(
				'Please fill the mandatory fields', 'Error', {
				timeOut: 3000
			});
		}
	}

	get f() { return this.itemFormObj.controls; }
}
