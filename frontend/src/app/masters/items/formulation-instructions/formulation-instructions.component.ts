import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PharmacyService } from '../../pharmacy/shared/pharmacy.service';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from '../shared/item.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-formulation-instructions',
  templateUrl: './formulation-instructions.component.html',
  styleUrls: ['./formulation-instructions.component.scss'],
  providers: [ItemService, PharmacyService, ItemService]
})

export class FormulationInstructionsComponent implements OnInit {

  constructor(private addFormulationInstructionsService: ItemService,
    private toasterService: ToastrService, private itemservice: ItemService, private spinnerService: Ng4LoadingSpinnerService,
    private pharmacyService: PharmacyService) {
    this.getItemsData();
    this.getFormulationData();
    this.getPharmacyData();
  }

  ngOnInit() {
    this.formulationInformationForm = new FormGroup(this.formulationInformationFormValidations);
  }

  items: any[] = [];
  pharmacy: any[] = [];
  formulation: any[] = [];
  formulationInformationForm: FormGroup;
  formulationInformationFormValidations =
    {
      formulationName: new FormControl('', [Validators.required]),
      instructions: new FormControl('', [Validators.required]),
      itemId: new FormControl(''),
      pharmacyId: new FormControl(''),
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

  getFormulationData() {
    this.addFormulationInstructionsService.getRowDataFromServer().subscribe(
      gridRowDataResponse => {
        if (gridRowDataResponse instanceof Object) {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.formulation = gridRowDataResponse['result'];
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

  formulationName: string = "";

  checkFormulationName(){
    if (this.formulation instanceof Array && typeof this.formulationName === 'string') {
			return this.formulation.map(x => x.formulationName)
				.some((name: string) => name.trim().toLowerCase() === this.formulationName.trim().toLowerCase());
		}
  }


  onSubmit() {
    let payload = Object.assign({}, this.formulationInformationForm.value);
    payload['itemId'] = this.selectedItem;
    payload['pharmacyId'] = this.selectedPharmacy;
    payload['createdUser']=localStorage.getItem('id');
    payload['lastUpdateUser']=localStorage.getItem('id');
    this.saveFormulationInstruction(payload);
  }

  selectedItem: any;
  selectedPharmacy: any;

  onItemChanged(event: Event) {
  }

  onPharmacyChanged(event: Event) {
  }

  getItemsData() {
    this.itemservice.getLimitedItems().subscribe(
      getItemResponse => {
        if (getItemResponse instanceof Object) {
          if (getItemResponse['responseStatus']['code'] === 200) {
            this.items = getItemResponse['result'];
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


  reset(){
    this.formulationInformationForm.reset();
    this.selectedItem=undefined;
    this.selectedPharmacy=undefined;
  }

  itemsArray: any[] = [];

  alternativeItemSearch(event) {
    this.spinnerService.show();
    this.itemservice.getItemsByItemName(event['target']['value']).subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.items = res['result'];
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

  saveFormulationInstruction(formulationInformationForm: Object) {
    this.formulationInformationForm.get('formulationName').setErrors({'incorrect':true})
    this.spinnerService.show();
    this.addFormulationInstructionsService.saveFormChanges(formulationInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.formulationInformationForm.reset();
            this.spinnerService.hide();
            this.formulationInformationForm.controls.activeS.setValue('Y');
            this.formulationInformationForm.controls.morning.setValue('N');
            this.formulationInformationForm.controls.evening.setValue('N');
            this.formulationInformationForm.controls.afterNoon.setValue('N');
            this.formulationInformationForm.controls.beforeBed.setValue('N');
            this.formulationInformationForm.controls.afterMeal.setValue('N');
            this.formulationInformationForm.controls.beforeMeal.setValue('N');
            this.formulationInformationForm.controls.anyTime.setValue('N');
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
            this.selectedItem = undefined;
            this.selectedPharmacy = undefined;
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
