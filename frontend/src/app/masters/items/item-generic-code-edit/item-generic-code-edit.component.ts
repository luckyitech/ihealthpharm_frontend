import { Component,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridOptions, ColDef } from 'ag-grid-community';
import { ItemService } from '../shared/item.service';
import { AppService } from 'src/app/core/app.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-item-generic-code-edit',
  templateUrl: './item-generic-code-edit.component.html',
  styleUrls: ['./item-generic-code-edit.component.scss']
})

export class ItemGenericCodeEditComponent implements OnInit {

  itemGenericForm: FormGroup;
  itemGenericList = [];
  medicalOrNonMedicalArray = ['M', 'N'];
  itemGroupList = [];
  itemGroups = [];
  itemFormGenerics = [];
  selectedItemGeneric;
  groupCode;
  rowData = [];
  itemGridOptions: GridOptions;
  showGrid: boolean = true;
  show: boolean = true;
  groupCodeSearchTerm: string = 'All';
  resetSearchTerm: boolean = false;
  showGroupCode: boolean = false;

  constructor(private itemService: ItemService, private formBuilder: FormBuilder,
    private toasterService: ToastrService, private appService: AppService, private spinnerService: Ng4LoadingSpinnerService) {
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
    { headerName: 'Medical or Non Medical', field: 'medicalOrNonMedical',resizable: true, sortable: true, filter: true },
    { headerName: 'Generic Code', field: 'genericCode', sortable: true, resizable: true,filter: true },
    { headerName: 'Generic Name', field: 'genericName', sortable: true,resizable: true, filter: true },
    { headerName: 'Group Code', field: 'itemGroupId.groupCode', sortable: true,resizable: true, filter: true },
    { headerName: 'Status', field: 'Status', sortable: true,resizable: true, filter: true },
  ];

  getGridRowData() {
    this.showGrid = true;
    this.spinnerService.show()
    this.itemService.getItemGenericaNames().subscribe(
      gridRowDataResponse => {
        if (gridRowDataResponse instanceof Object) {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.spinnerService.hide()
            this.rowData = gridRowDataResponse['result'];
            for (let i = 0; i < this.rowData.length; i++) {
              if (this.rowData[i].activeS == 'Y') {
                this.rowData[i].Status = 'Active'
              }
              else if (this.rowData[i].activeS == 'N') {
                this.rowData[i].Status = 'DeActive'
              }
            }
            this.itemGenericList = this.rowData
            this.showGrid = true;
            this.show= true;
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
            this.spinnerService.hide()
          }
        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
          this.spinnerService.hide()
        }
      }
    );

  }

  selectedGroupCode: any;

  ngOnInit() {
    this.buildForm();
    $(document).ready(function () {
      $(".common-grids-btn").click(function () {
        $(".commons-grid").hide();
        $("#itemGenericGrid").hide();
      });
      $(".common-grids-btn").click(function () {
        $("#generic-Information").show();
      });
      $(".gen-saved").click(function () {
        $(".commons-grid").show();
        $("#itemGenericGrid").show();
      });
      $(".cancel-gen").click(function () {
        $(".commons-grid").show();
        $("#itemGenericGrid").show();
      });
      $(".common-grids-btn").click(function () {
        $("#generic-Information").css("display", "block");
      });
      $(".gen-saved").click(function () {
        $("#generic-Information").css("display", "none");
      });
      $(".cancel-gen").click(function () {
        $("#generic-Information").css("display", "none");
      });
    });
  }

  buildForm() {
    this.itemGenericForm = this.formBuilder.group({
      itemGenericNameId: [''],
      itemGroupId: [''],
      genericCode: ['', Validators.required],
      genericName: ['', Validators.required],
      medicalOrNonMedical: ['', Validators.required],
      activeS: ['Y']
    });
  }

  getItemGroups() {
    this.itemService.getItemGroups().subscribe((res: any) => {
      this.itemGroupList = res.result;
    },
      err => {
      });
  }

  getItemGenerics() {
    this.itemService.getItemGenericaNames().subscribe((res: any) => {
      this.itemGenericList = res.result;
    },
      err => {
      });
  }
  checkFormDisability() {
    return (this.itemGenericForm.get('genericName').errors instanceof Object)
      || (this.itemGenericForm.get('genericCode').errors instanceof Object)
      || this.itemGenericForm.get('genericCode').invalid
  }

  onSubmit() {
    let payload = Object.assign({}, this.itemGenericForm.value);
    payload['itemGroupId'] = this.selectedGroupCode;
    payload['createdUser'] = localStorage.getItem('id');
    payload['lastUpdateUser'] = localStorage.getItem('id');
    this.updateItemGeneric(payload);
  }

	reset(){
		this. itemGenericForm.reset();
    this.itemGenericForm.controls.medicalOrNonMedical.setValue('M');
    this.itemGenericForm.controls.activeS.setValue('Y') ;
		this.show=true;
	}

  get f() { return this.itemGenericForm.controls; }

  getAllItemGroupsData(medicalOrNonMedical: string, groupCodeSearchTerm: string) {
    this.itemService.getAllItemGroupsData(medicalOrNonMedical, groupCodeSearchTerm).subscribe(
      itemResponse => {
        if (itemResponse instanceof Object) {
          if (itemResponse['responseStatus']['code'] === 200) {
            this.itemGroups = itemResponse['result'];
          }
        }
      }
    );
  }

  onGroupCodeSearchTermChanged(groupCodeSearchTerm: string) {
    this.groupCodeSearchTerm = groupCodeSearchTerm;
    this.getAllItemGroupsData(this.itemGenericForm.get('medicalOrNonMedical').value, this.groupCodeSearchTerm);
  }

  onItemTypeChanged(event) {
    this.itemGenericForm.patchValue({ 'itemGroupId': '' });
    this.getAllItemGroupsData(event.target.value, this.groupCodeSearchTerm);
  }

  editGrid() {
    this.onItemGenericSelected(this.itemGridOptions.api.getSelectedRows()[0].itemGenericNameId);
    this.show = false;
  }

  onItemGenericSelected(itemGenericNameId: string) {
    this.selectedItemGeneric = this.itemGenericList.find(itemFormGeneric => itemFormGeneric['itemGenericNameId'] == itemGenericNameId);
    this.itemService.getItemGenericaNameById(this.selectedItemGeneric['itemGenericNameId']).subscribe(
      getItemGenericResponse => {
        if (getItemGenericResponse instanceof Object) {
          if (getItemGenericResponse['responseStatus']['code'] === 200) {
            this.getAllItemGroupsData(this.selectedItemGeneric['medicalOrNonMedical'], this.groupCodeSearchTerm)
            let itemGenericFormValues: Object = {
              itemGenericNameId: this.selectedItemGeneric['itemGenericNameId'],
              itemGroupId: this.selectedItemGeneric['itemGroupId'],
              genericCode: this.selectedItemGeneric['genericCode'],
              genericName: this.selectedItemGeneric['genericName'],
              medicalOrNonMedical: this.selectedItemGeneric['medicalOrNonMedical'],
              activeS: this.selectedItemGeneric['activeS'],
            }
            this.selectedGroupCode = this.selectedItemGeneric['itemGroupId'],
            this.itemGenericForm.setValue(itemGenericFormValues);
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

  onGroupCodeChanged(item: any) {
    this.showGroupCode = false;
    this.groupCode = item;
    this.itemGenericForm.patchValue({ 'itemGroupId': item['groupCode'] });
  }
  
  updateItemGeneric(itemCategoryForm: Object) {
    this.itemGenericForm.get('genericCode').setErrors({'incorrect':true})
    this.spinnerService.show();
    this.itemService.updateItemGenericaName(itemCategoryForm).subscribe(
      updateItemCategoryResponse => {
        if (updateItemCategoryResponse instanceof Object) {
          if (updateItemCategoryResponse['responseStatus']['code'] === 200) {
            this.itemGenericForm.reset();
            this.spinnerService.hide();
            this.getGridRowData();
            this.toasterService.success(updateItemCategoryResponse['message'], 'Success', {
              timeOut: 3000
            });
            this.getGridRowData();
            this.show = true;
            this.selectedGroupCode = undefined;
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

}
