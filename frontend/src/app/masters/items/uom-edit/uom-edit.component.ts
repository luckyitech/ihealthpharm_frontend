import { Component,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridApi, GridOptions, ColDef } from 'ag-grid-community';
import { AppService } from 'src/app/core/app.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { ItemService } from '../shared/item.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-uom-edit',
  templateUrl: './uom-edit.component.html',
  styleUrls: ['./uom-edit.component.scss'],
  providers:[ItemService]
})

export class UomEditComponent implements OnInit {

  itemUOMForm : FormGroup;
	gridApi: GridApi;
	gridOptions: GridOptions;
	showGrid: boolean = true;
	show:boolean=true;

  constructor(private itemService: ItemService,private formBuilder: FormBuilder, private appService: AppService,
	  private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) { 
		this.gridOptions = <GridOptions>{
		  context: {
			componentParent: this
		  }
		};
		this.gridOptions.rowSelection = 'single';
		this.gridOptions.columnDefs = this.columnDefs;
		this.getGridRowData();

		this.gridOptions.getRowStyle = function (params) {
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
		{ headerName: 'UOM Code', field: 'measurementCode', resizable: true,sortable: true, filter: true },
		{ headerName: 'UOM Description', field: 'measurementDesc', resizable: true,sortable: true, filter: true},
		{ headerName: 'Status', field: 'Status', sortable: true,resizable: true, filter: true}
	  ];
  

	  checkFormDisability(){
		return (this.itemUOMForm.get('measurementCode').errors instanceof Object)
		|| this.itemUOMForm.get('measurementCode').invalid
	  }

	  rowData = [];
	  getGridRowData() {
		this.showGrid = false;
		this.itemService.getAllItemUOMs().subscribe(
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
						this.show=true;
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
	  $(document).ready(function(){
		$(".common-grid-buttons").click(function(){
		  $(".common-uom").hide();
		  $("#uomEditGrid").hide();
		});
		$(".common-grid-buttons").click(function(){
		  $("#uom-Information").show();
		  });
		$(".uom-save").click(function(){
		  $(".common-uom").show();
		  $("#uomEditGrid").show();
		});
		 $(".cancelled-uom").click(function(){
		  $(".common-uom").show();
		  $("#uomEditGrid").show();
		  }); 
		  $(".common-grid-buttons").click(function(){
		  $("#uom-Information").css("display", "block");
		});
		$(".uom-save").click(function(){
		  $("#uom-Information").css("display", "none");
		  });
			$(".cancelled-uom").click(function(){
		  $("#uom-Information").css("display", "none");
		});
		});
	}
  
	buildForm() {
		this.itemUOMForm = this.formBuilder.group({
			unitMeasurementId : [],
			measurementCode: ['', Validators.required],
			measurementDesc: ["", Validators.required],
			activeS : ['Y',Validators.required ]
		});
	  }
   
	 
	reset(){
		this.itemUOMForm.reset();
		this.itemUOMForm.controls.activeS.setValue('Y');
		this.show=true;
	}


	onSubmit() {
	  let payload=Object.assign({},this.itemUOMForm.value);
	  payload['createdUser']=localStorage.getItem('id');
      payload['lastUpdateUser']=localStorage.getItem('id');
	  this.updateRowData(payload)
	  }
  
	get f() { return this.itemUOMForm.controls; }

	onGridReady(params) {
		this.gridApi = params.api;
	}

	updateGrid() {
		this.updateRowData(this.gridApi.getSelectedRows());
	}

	updateRowData(selectedRows: any[]) {
		this.showGrid = true;
		this.itemUOMForm.get('measurementCode').setErrors({'incorrect':true})
		this.spinnerService.show();
		this.itemService.updateItemUOM(selectedRows).subscribe(
			updateRowDataResponse => {
				if (updateRowDataResponse instanceof Object) {
					if (updateRowDataResponse['responseStatus']['code'] === 200) {
						this.spinnerService.hide();
						this.getGridRowData();
						this.toasterService.success(updateRowDataResponse['message'], 'Success', {
							timeOut: 3000
						});
                        this.show=true;
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

	deleteRowData(selectedRows) {
		this.showGrid = true;
		let ids = [];
		for (var i = 0; i < selectedRows.length; i++) {
			ids.push(selectedRows[i].unitMeasurementId);	
		}
		this.itemService.deleteItemUOMs(ids).subscribe(
			deleteRowDataResponse => {
				if (deleteRowDataResponse instanceof Object) {
					if (deleteRowDataResponse['responseStatus']['code'] === 200) {
						this.getGridRowData();
						this.toasterService.success(deleteRowDataResponse['message'], 'Success', {
							timeOut: 3000
						});
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
		this.onitemUOMSelected(this.gridOptions.api.getSelectedRows()[0].unitMeasurementId);
		this.show=false;
	}

	onQuickFilterChanged($event) {
		this.onQuickFilterChanged["searchEvent"] = $event;
		this.gridOptions.api.setQuickFilter($event.target.value);
		if (this.gridOptions.api.getDisplayedRowCount() == 0) {
			this.gridOptions.api.showNoRowsOverlay();
		} else {
			this.gridOptions.api.hideOverlay();
		}
	}

	selectedObj : any;
	onitemUOMSelected(unitMeasurementId: number) {
		this.selectedObj = this.gridOptions.rowData.find(itemUOM => itemUOM['unitMeasurementId'] === unitMeasurementId);
		this.itemService.getUOMById(this.selectedObj['unitMeasurementId']).subscribe(
			getItemCategoryResponse => {
				if (getItemCategoryResponse instanceof Object) {
					if (getItemCategoryResponse['responseStatus']['code'] === 200) {
						let formvalue: Object = {
							unitMeasurementId: this.selectedObj['unitMeasurementId'],
							measurementCode: this.selectedObj['measurementCode'],
							measurementDesc:  this.selectedObj['measurementDesc'],
							activeS :  this.selectedObj['activeS']
						}
						this.itemUOMForm.setValue(formvalue);
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
