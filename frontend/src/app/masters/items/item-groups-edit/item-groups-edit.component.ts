import { Component,OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridApi, GridOptions, ColDef } from 'ag-grid-community';
import { ItemService } from '../shared/item.service';
import { AppService } from 'src/app/core/app.service';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
	selector: 'app-item-groups-edit',
	templateUrl: './item-groups-edit.component.html',
	styleUrls: ['./item-groups-edit.component.scss'],
	providers: [ItemService]
})

export class ItemGroupsEditComponent implements OnInit {

	itemGroupForm: FormGroup;
	itemFormList = [];
	medicalOrNonMedicalArray = ['M', 'N'];
	gridApi: GridApi;
	itemGridOptions: GridOptions;
	showGrid: boolean = true;
	show: boolean = true;

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
			width: 40,
			headerCheckboxSelectionFilteredOnly: true
		},
		{ headerName: 'Medical or Non Medical', field: 'medicalOrNonMedical', sortable: true,resizable: true, filter: true },
		{ headerName: 'Group Code', field: 'groupCode', sortable: true,resizable: true, filter: true },
		{ headerName: 'Group Name', field: 'groupName', sortable: true,resizable: true, filter: true },
		{ headerName: 'Group Description', field: 'groupDescription', sortable: true,resizable: true, filter: true },
		{ headerName: 'Status', field: 'Status', sortable: true,resizable: true, filter: true }
	];

	rowData = [];
	getGridRowData() {
		this.showGrid = false;
		this.itemService.getItemGroups().subscribe(
			gridRowDataResponse => {
				if (gridRowDataResponse instanceof Object) {
					if (gridRowDataResponse['responseStatus']['code'] === 200) {
						this.rowData = gridRowDataResponse['result'];
						for (let i = 0; i < this.rowData.length; i++) {
							if (this.rowData[i].activeS == 'Y') {
								this.rowData[i].Status = 'Active'
							}
							else if (this.rowData[i].activeS == 'N') {
								this.rowData[i].Status = 'DeActive'
							}
						}
						this.showGrid = true;
						this.show= true;

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
		this.buildForm();
		$(document).ready(function () {
			$(".common-grid-itemgroup").click(function () {
				$(".common-grid-group").hide();
				$("#itemGroupGrid").hide();
			});
			$(".common-grid-itemgroup").click(function () {
				$("#itemgroup-Information").show();
			});

			$(".saves-itemgroup").click(function () {
				$(".common-grid-group").show();
				$("#itemGroupGrid").show();
			});

			$(".cancel-itemgroups").click(function () {
				$(".common-grid-group").show();
				$("#itemGroupGrid").show();
			});
			$(".common-grid-itemgroup").click(function () {
				$("#itemgroup-Information").css("display", "block");
			});
			$(".saves-itemgroup").click(function () {
				$("#itemgroup-Information").css("display", "none");
			});
			$(".cancel-itemgroups").click(function () {
				$("#itemgroup-Information").css("display", "none");
			});

		});
	}
	buildForm() {
		this.itemGroupForm = this.formBuilder.group({
			itemGroupId:[''],
			groupCode: [''],
			groupName: ['', Validators.required],
			medicalOrNonMedical: ['M'],
			groupDescription: ['', Validators.required],
			activeS: ['Y']
		});
	}


	checkFormDisability() {
		return (this.itemGroupForm.get('groupCode').errors instanceof Object)
			|| this.itemGroupForm.get('groupName').invalid
			|| this.itemGroupForm.get('groupDescription').invalid
	}

	onSubmit() {
		let payload = Object.assign({}, this.itemGroupForm.value);
		payload['createdUser']=localStorage.getItem('id');
        payload['lastUpdateUser']=localStorage.getItem('id');
		this.updateRowData(payload);
	}

	get f() { return this.itemGroupForm.controls; }

	reset(){
		this.itemGroupForm.reset();
		this.itemGroupForm.controls.activeS.setValue('Y');
		this.itemGroupForm.controls.medicalOrNonMedical.setValue('M');
		this.show=true;
	}


	resetGrid() {
		this.getGridRowData();
	}

	updateRowData(selectedRows: any[]) {
		this.showGrid = true;
		this.itemGroupForm.get('groupCode').setErrors({ 'incorrect': true })
		this.spinnerService.show();
		this.itemService.updateItemGroup(selectedRows).subscribe(
			updateRowDataResponse => {
				if (updateRowDataResponse instanceof Object) {
					if (updateRowDataResponse['responseStatus']['code'] === 200) {
						this.spinnerService.hide();
						this.getGridRowData();
						this.show= true;
						this.toasterService.success(updateRowDataResponse['message'], 'Success', {
							timeOut: 3000
						});
					} else {
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
			},error=>{
				this.spinnerService.hide();
				this.toasterService.error('Please contact administrator', 'Error Occurred', {
					timeOut: 5000
				});
			}
		);
	}

	editGrid() {
		this.onItemGroupSelected(this.itemGridOptions.api.getSelectedRows()[0].itemGroupId);
		this.show= false;
	}

	selectedObj: any;
	onItemGroupSelected(itemGroupId: number) {
		this.selectedObj = this.itemGridOptions.rowData.find(itemGroup => itemGroup['itemGroupId'] === itemGroupId);
		this.itemService.getItemGroupById(this.selectedObj['itemGroupId']).subscribe(
			getItemCategoryResponse => {
				if (getItemCategoryResponse instanceof Object) {
					if (getItemCategoryResponse['responseStatus']['code'] === 200) {
						let formvalue: Object = {
							itemGroupId: this.selectedObj['itemGroupId'],
							groupName: this.selectedObj['groupName'],
							groupCode: this.selectedObj['groupCode'],
							groupDescription: this.selectedObj['groupDescription'],
							medicalOrNonMedical: this.selectedObj['medicalOrNonMedical'],
							activeS: this.selectedObj['activeS']
						}
						this.itemGroupForm.setValue(formvalue);
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

}
