import { Component, OnInit } from '@angular/core';
import { GridApi, GridOptions, ColDef } from 'ag-grid-community';
import { ItemService } from '../shared/item.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AppService } from 'src/app/core/app.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-item-category-edit',
  templateUrl: './item-category-edit.component.html',
  styleUrls: ['./item-category-edit.component.scss'],
  providers: [ItemService]
})

export class ItemCategoryEditComponent implements OnInit {

  rowData = [];
  gridApi: GridApi;
  selectedItemCategory = [];
  itemCategorys = [];
  itemGridOptions: GridOptions;
  showGrid: boolean = true;
  show: boolean = true;
  itemCategoryForm: FormGroup;
  medicalOrNonMedicalArray = ['M', 'N'];

  constructor(private itemCategoryService: ItemService, private formBuilder: FormBuilder, private appService: AppService,
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
    { headerName: 'Category Code', field: 'categoryCode', sortable: true, resizable: true, filter: true },
    { headerName: 'Category Description', field: 'categoryDescription', resizable: true, sortable: true, filter: true },
    { headerName: 'Status', field: 'Status', sortable: true, resizable: true, filter: true },
  ];


  editGrid() {

    this.onItemCategorySelected(this.itemGridOptions.api.getSelectedRows()[0].itemCategoryId);
    this.show = false;
  }

  onItemCategorySelected(itemCategoryId: number) {
    this.selectedItemCategory = this.itemCategorys.find(itemCategory => itemCategory['itemCategoryId'] === itemCategoryId);
    this.itemCategoryService.getItemCategoryById(this.selectedItemCategory['itemCategoryId']).subscribe(
      getItemCategoryResponse => {
        if (getItemCategoryResponse instanceof Object) {
          if (getItemCategoryResponse['responseStatus']['code'] === 200) {
            let itemCategoryFormValues: Object = {
              itemCategoryId: this.selectedItemCategory['itemCategoryId'],
              categoryCode: this.selectedItemCategory['categoryCode'],
              medicalOrNonMedical: this.selectedItemCategory['medicalOrNonMedical'],
              categoryDescription: this.selectedItemCategory['categoryDescription'],
              activeS: this.selectedItemCategory['activeS'],
              marginPercentage: this.selectedItemCategory['marginPercentage']
            }
            this.itemCategoryForm.setValue(itemCategoryFormValues);
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

  getGridRowData() {
    this.showGrid = false;
    this.itemCategoryService.getItemCategories().subscribe(
      gridRowDataResponse => {
        if (gridRowDataResponse instanceof Object) {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridRowDataResponse['result'];
            this.itemCategorys = this.rowData;
            for (let i = 0; i < this.itemCategorys.length; i++) {
              if (this.itemCategorys[i].activeS == 'Y') {
                this.itemCategorys[i].Status = 'Active'
              }
              else if (this.itemCategorys[i].activeS == 'N') {
                this.itemCategorys[i].Status = 'DeActive'
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

  buildForm() {
    this.itemCategoryForm = this.formBuilder.group({
      itemCategoryId: [''],
      categoryCode: ['', Validators.required],
      medicalOrNonMedical: ['', Validators.required],
      categoryDescription: ["", Validators.required],
      activeS: ['Y'],
      marginPercentage: ['', Validators.pattern("^[0-9]*$")]
    });
  }

  ngOnInit() {
    this.buildForm();
    $(document).ready(function () {
      $("#common-item-grid-btn").click(function () {
        $("#common-item-grid-category").hide();
        $("#itemCatGrid").hide();
      });
      $("#common-item-grid-btn").click(function () {
        $("#itemCategory-Information").show();
      });
      $(".btn-save-text").click(function () {
        $("#common-item-grid-category").show();
        $("#itemCatGrid").show();
      });
      $(".btn-cancel-text").click(function () {
        $("#common-item-grid-category").show();
        $("#itemCatGrid").show();
      });
      $("#common-item-grid-btn").click(function () {
        $("#itemCategory-Information").css("display", "block");
      });
      $(".btn-save-text").click(function () {
        $("#itemCategory-Information").css("display", "none");
      });
      $(".btn-cancel-text").click(function () {
        $("#itemCategory-Information").css("display", "none");
      });
    });
  }
  get f() { return this.itemCategoryForm.controls; }

  onSubmit() {
    let payload = Object.assign({}, this.itemCategoryForm.value);
    payload['createdUser'] = localStorage.getItem('id');
    payload['lastUpdateUser'] = localStorage.getItem('id');
    this.updateItemCategory(payload);
  }

  reset() {
    this.itemCategoryForm.reset();
    this.itemCategoryForm.controls.activeS.setValue('Y');
    this.itemCategoryForm.controls.medicalOrNonMedical.setValue('M');
    this.show = true;
  }


  updateItemCategory(itemCategoryForm: Object) {
    this.itemCategoryForm.get('categoryDescription').setErrors({ 'incorrect': true })
    this.spinnerService.show();
    this.itemCategoryService.updateItemCategory(itemCategoryForm).subscribe(
      updateItemCategoryResponse => {
        if (updateItemCategoryResponse instanceof Object) {
          if (updateItemCategoryResponse['responseStatus']['code'] === 200) {
            this.itemCategoryForm.reset();
            this.spinnerService.hide();
            this.getGridRowData();
            this.toasterService.success(updateItemCategoryResponse['message'], 'Success', {
              timeOut: 3000
            });
            this.getGridRowData();
            this.show = true;
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
      }, error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      }
    );
  }

  checkFormDisability() {
    return (this.itemCategoryForm.get('categoryDescription').errors instanceof Object)
      || this.itemCategoryForm.get('categoryDescription').invalid
      || this.itemCategoryForm.get('marginPercentage').errors instanceof Object
      || this.itemCategoryForm.get('marginPercentage').invalid
      || this.itemCategoryForm.get('categoryCode').errors instanceof Object
      || this.itemCategoryForm.get('categoryCode').invalid
  }
}
