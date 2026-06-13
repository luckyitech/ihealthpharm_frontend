import {Component,OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from '../shared/item.service';
import { PharmacyService } from '../../pharmacy/shared/pharmacy.service';
import { GridOptions, ColDef } from 'ag-grid-community';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-formulation-instructions-edit',
  templateUrl: './formulation-instructions-edit.component.html',
  styleUrls: ['./formulation-instructions-edit.component.scss'],
  providers: [ItemService, PharmacyService]
})

export class FormulationInstructionsEditComponent implements OnInit {

  constructor(private toasterService: ToastrService, private itemService: ItemService,
    private pharmacyService: PharmacyService,  private spinnerService: Ng4LoadingSpinnerService) {
    this.formulationGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.formulationGridOptions.rowSelection = 'single';
    this.formulationGridOptions.columnDefs = this.columnDefs;
    this.getFormulationData();
    this.getItemsData();
    this.getPharmacyData();

    this.formulationGridOptions.getRowStyle = function (params) {
			if (params.node.rowIndex % 2 !== 0) {
			  return { background: '#cccccc' }
			}
		  }
  }

  ngOnInit() {
    this.formulationInformationForm = new FormGroup(this.formulationInformationFormValidations);
    $(document).ready(function () {
      $(".common-grid-edit-formulation").click(function () {
        $(".common-gridformulas").hide();
        $("#itemFormulationGrid").hide();
      });
      $(".common-grid-edit-formulation").click(function () {
        $("#formulation-Information").show();
      });
      $("#mu-adduser-saving-Formula").click(function () {
        $(".common-gridformulas").show();
        $("#itemFormulationGrid").show();
      });
      $(".mu-adduser-cancel-formulation").click(function () {
        $(".common-gridformulas").show();
        $("#itemFormulationGrid").show();
      });
      $(".common-grid-edit-formulation").click(function () {
        $("#formulation-Information").css("display", "block");
      });
      $("#mu-adduser-saving-Formula").click(function () {
        $("#formulation-Information").css("display", "none");
      });
      $(".mu-adduser-cancel-formulation").click(function () {
        $("#formulation-Information").css("display", "none");
      });
    });
  }

  formulation: any[] = [];
  selectedFormulation: Object = {};
  formulationInformationForm: FormGroup;

  formulationInformationFormValidations = {
    formulationInstructionId: new FormControl(''),
    formulationName: new FormControl('', [Validators.required]),
    instructions: new FormControl('', [Validators.required]),
    activeS: new FormControl('Y'),
    morning: new FormControl('N'),
    afterNoon: new FormControl('N'),
    evening: new FormControl('N'),
    beforeBed: new FormControl('N'),
    afterMeal: new FormControl('N'),
    beforeMeal: new FormControl('N'),
    anyTime: new FormControl('N')
  };

  checkFormDisability() {
    return (this.formulationInformationForm.get('formulationName').errors instanceof Object)
      || (this.formulationInformationForm.get('instructions').errors instanceof Object)
      ||(!this.selectedPharmacy)
  }
  items: any[] = [];
  pharmacy: any[] = [];
  showForm: boolean = false;
  formulationGridOptions: GridOptions;
  showGrid: boolean = false;
  show:boolean=true;
  tooltipRenderer = function(params)
  {
    
    if(params.value != null && params.value != undefined)
    {
      return '<span title="' + params.value + '">'+params.value+'</span>';
    }
    else{
      return '<span title="' + params.value + '">'+''+'</span>';
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
    { headerName: 'Formulation Name', field: 'formulationName', sortable: true,resizable: true, filter: true },
    { headerName: 'Instructions', field: 'instructions', sortable: true,resizable: true, filter: true },
    { headerName: 'Item Name', field: 'itemId.itemName', sortable: true, resizable: true,filter: true,cellRenderer: this.tooltipRenderer, },
    { headerName: 'Pharmacy Name', field: 'pharmacyId.pharmacyName',resizable: true, sortable: true, filter: true },
    { headerName: 'Morning', field: 'morning', sortable: true,resizable: true, filter: true },
    { headerName: 'Afternoon', field: 'afterNoon', sortable: true,resizable: true, filter: true },
    { headerName: 'Evening', field: 'evening', sortable: true,resizable: true, filter: true },
    { headerName: 'Before Bed', field: 'beforeBed', sortable: true, resizable: true,filter: true },
    { headerName: 'Any Time', field: 'anyTime', sortable: true,resizable: true, filter: true },
    { headerName: 'Status', field: 'Status', sortable: true,resizable: true, filter: true }
  ];

  selectedItem: any;
  selectedPharmacy: any;

  editGrid() {
    this.onFormulationSelected(this.formulationGridOptions.api.getSelectedRows()[0].formulationInstructionId);
    this.show=false;
  }

  getItemsData() {
    this.itemService.getLimitedItems().subscribe(
      getItemResponse => {
        if (getItemResponse instanceof Object) {
          if (getItemResponse['responseStatus']['code'] === 200) {
            this.itemsArray = getItemResponse['result'];
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

  alternativeItemSearch(event) {
    this.spinnerService.show();
    this.itemService.getItemsByItemName(event['target']['value']).subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.itemsArray = res['result']
        this.spinnerService.hide();
      }
    },
      error => {
        this.spinnerService.hide();
        this.items = [];
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          });
      })
  }

  getPharmacyData() {
    this.pharmacyService.getRowDataFromServer().subscribe(
      getPharmacyResponse => {
        if (getPharmacyResponse instanceof Object) {
          if (getPharmacyResponse['responseStatus']['code'] === 200) {
            this.pharmacy = getPharmacyResponse['result'];
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

  onFormulationSelected(formulationInstructionId: any) {
    this.selectedFormulation = this.formulation.find(formulation => formulation['formulationInstructionId'] === formulationInstructionId);
    let FormulationFormValues: Object = {
      formulationInstructionId: this.selectedFormulation['formulationInstructionId'],
      formulationName: this.selectedFormulation['formulationName'],
      instructions: this.selectedFormulation['instructions'],
      morning: this.selectedFormulation['morning'],
      afterNoon: this.selectedFormulation['afterNoon'],
      evening: this.selectedFormulation['evening'],
      beforeBed: this.selectedFormulation['beforeBed'],
      afterMeal: this.selectedFormulation['afterMeal'],
      beforeMeal: this.selectedFormulation['beforeMeal'],
      anyTime: this.selectedFormulation['anyTime'],
      activeS: this.selectedFormulation['activeS'],
    }
    this.formulationInformationForm.setValue(FormulationFormValues);
    this.selectedItem = this.selectedFormulation['itemId'];
    this.selectedPharmacy = this.selectedFormulation['pharmacyId'];
  }


  rowData = [];
  getFormulationData() {
    this.showGrid = true;
    this.itemService.getRowDataFromServer().subscribe(
      getFormlationDataResponse => {
        if (getFormlationDataResponse instanceof Object) {
          if (getFormlationDataResponse['responseStatus']['code'] === 200) {
            this.rowData = getFormlationDataResponse['result'];
            this.formulation = this.rowData;
            for (let i = 0; i < this.formulation.length; i++) {
              if (this.formulation[i].activeS == 'Y') {
                this.formulation[i].Status = 'Active'
              }
              else if (this.formulation[i].activeS == 'N') {
                this.formulation[i].Status = 'De-Active'
              }
            }
            this.show = true;
            this.showGrid = true;
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


  onSubmit() {
  let payload = Object.assign({}, this.formulationInformationForm.value);
  payload['createdUser']=localStorage.getItem('id');
  payload['lastUpdateUser']=localStorage.getItem('id');
    payload['itemId'] = this.selectedItem;
    payload['pharmacyId'] = this.selectedPharmacy;
    payload['formulationInstructionId'] = this.selectedFormulation['formulationInstructionId']
    this.updateFormulationInstruction(payload);
  }


  onItemChanged(event: Event) {
  }

  onPharmacyChanged(event: Event) {
  }


	reset(){
		this. formulationInformationForm.reset();
		this.formulationInformationForm.controls.activeS.setValue('Y');
		this.show=true;
	}

  itemsArray: any[] = [];

	searchItem(searchKey) {
		if (searchKey['term'] != "") {
		this.itemService.getItemsByItemName(searchKey['term']).subscribe(SearchRes => {
			if (SearchRes['responseStatus']['code'] == 200) {
			  this.itemsArray = SearchRes['result'];
			}
		  });
		}
	  }


  updateFormulationInstruction(formulationInformationForm: Object) {
    this.formulationInformationForm.get('formulationName').setErrors({'incorrect':true});
    this.showGrid = true;
    this.spinnerService.show();
    this.itemService.updateFormulation(formulationInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.formulationInformationForm.reset();
            this.spinnerService.hide();
            this.formulationInformationForm.patchValue({
              'selectedItem': '',
              'selectedPharmacy': ''
            })
            this.getFormulationData();
            this.showGrid = true;
            this.show= true;
            this.toasterService.success(saveFormResponse['message'], 'Success', {
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

}
