import {Component,OnInit} from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ItemService } from '../shared/item.service';
import { AppService } from 'src/app/core/app.service';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, GridApi, ColDef } from 'ag-grid-community';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-specialization-edit',
  templateUrl: './specialization-edit.component.html',
  styleUrls: ['./specialization-edit.component.scss'],
  providers: [ItemService]
})
export class SpecializationEditComponent implements OnInit {

  specializationForm: FormGroup;
	specializationList = [];
	gridApi: GridApi;
	itemGridOptions: GridOptions;
	showGrid: boolean = true;
	show: boolean = true;

	constructor(private itemService: ItemService, private formBuilder: FormBuilder, 
		private appService: AppService, private spinnerService: Ng4LoadingSpinnerService,
		private toasterService: ToastrService) {
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
		{ headerName: 'Specialization Code', field: 'specializationCode', sortable: true,resizable: true, filter: true },
		{ headerName: 'Specialization Name', field: 'specializationName', sortable: true,resizable: true, filter: true },
		{ headerName: 'Status', field: 'Status', sortable: true,resizable: true, filter: true }
	];


	specializations: any[] = [];
	rowData = [];

	checkFormDisability() {
		return (this.specializationForm.get('specializationCode').errors instanceof Object)
			|| this.specializationForm.get('specializationCode').invalid
	}


	getGridRowData() {	
		this.showGrid = false;
		this.itemService.getSpecializations().subscribe(
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



	ngOnInit() {
		this.buildForm();
		$(document).ready(function () {
	$(".common-grid-btns").click(function () {
				$(".common-grids").hide();
				$("#specialEditGrid").hide();
			});
			$(".common-grid-btns").click(function () {
				$("#specialization-Information").show();
			});
			$(".saved-button").click(function () {
				$(".common-grids").show();
				$("#specialEditGrid").show();
			});
			$(".btn-cancel-text").click(function () {
				$(".common-grids").show();
				$("#specialEditGrid").show();
			});
			$(".common-grid-btns").click(function () {
				$("#specialization-Information").css("display", "block");
			});
			$(".saved-button").click(function () {
				$("#specialization-Information").css("display", "none");
			});
			$(".btn-cancel-text").click(function () {
				$("#specialization-Information").css("display", "none");
			});
		});
	}

	buildForm() {
		this.specializationForm = this.formBuilder.group({
			specializationId: [''],
			specializationCode: ['', Validators.required],
			specializationName: ['', Validators.required],
			activeS: ['Y', Validators.required]
		});
	}

	reset(){
		this.specializationForm.reset();
		this.specializationForm.controls.activeS.setValue('Y');
		this.show=true;
	}

	onSubmit() {
			 let payload = Object.assign({}, this.specializationForm.value);
			 this.updateRowData(payload);
		 }

	get f() { return this.specializationForm.controls; }
	
	resetGrid() {
		this.getGridRowData();
	}

	updateRowData(selectedRows: any[]) {
		this.showGrid = true;
		this.specializationForm.get('specializationCode').setErrors({'incorrect':true})
		this.spinnerService.show();
		this.itemService.updateSpecialization(selectedRows).subscribe(
			updateRowDataResponse => {
				if (updateRowDataResponse instanceof Object) {
					if (updateRowDataResponse['responseStatus']['code'] === 200) {
						this.spinnerService.hide();
						this.getGridRowData();
						this.show=true;
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
		this.onSpecializationSelected(this.itemGridOptions.api.getSelectedRows()[0].specializationId);
		this.show = false;
	}

	selectedSpecialization: any;

	onSpecializationSelected(specializationId: number) {
		this.selectedSpecialization = this.itemGridOptions.rowData.find(specialization => specialization['specializationId'] === specializationId);
		this.itemService.getSpecializationById(this.selectedSpecialization['specializationId']).subscribe(
			getItemCategoryResponse => {
				if (getItemCategoryResponse instanceof Object) {
					if (getItemCategoryResponse['responseStatus']['code'] === 200) {
						let formvalue: Object = {
							specializationId: this.selectedSpecialization['specializationId'],
							specializationCode: this.selectedSpecialization['specializationCode'],
							specializationName: this.selectedSpecialization['specializationName'],
							activeS: this.selectedSpecialization['activeS']
						}
						this.specializationForm.setValue(formvalue);
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