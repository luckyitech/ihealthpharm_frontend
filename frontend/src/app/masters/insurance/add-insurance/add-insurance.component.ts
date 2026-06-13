import { ItemService } from './../../items/shared/item.service';
import { ToastrService } from 'ngx-toastr';
import { InsuranceService } from './../shared/insurance.service';
import { Insurance } from './../shared/insurance.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EndDateValidator } from 'src/app/core/DOB Validator/endDate-validator';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-add-insurance',
  templateUrl: './add-insurance.component.html',
  styleUrls: ['./add-insurance.component.scss'],
  providers: [InsuranceService]
})

export class AddInsuranceComponent implements OnInit {

  termsAndConditionsFile: File;
  insuranceModel: Insurance[] = [];

  constructor(private insuranceService: InsuranceService, private toasterService: ToastrService,
    private itemService: ItemService, private spinnerService: Ng4LoadingSpinnerService) {
    this.getCountries();
  }

  ngOnInit() {
    this.insuranceInformationForm = new FormGroup(this.insuranceInformationFormValidations);
  }

  countries: any[] = [];
  states: any[] = [];
  selectedUnMappedMedicines: any[] = [];
  medicinesNotCovered: string = 'Select';
  unMappedItemSearchTerm: string = '';
  itemSearchTerm: string = '';
  selectedUnMappedItems: any[] = [];
  selectedCountry: any;
  selectedState: any;

  startDate;
  endDate;
  onCheckedItems(selectedItems: any[]) {
    this.selectedUnMappedItems = selectedItems;
    this.medicinesNotCovered = this.selectedUnMappedItems.map(x => x.name).join(",");
  }

  onUnMappedCheckedItems(selectedUnMappedItems: any[]) {
    this.selectedUnMappedItems = selectedUnMappedItems;
    this.medicinesNotCovered = this.selectedUnMappedItems.map(x => x.itemName).join(",")
  }

  onUnMappedItemSearchChanged(searchTerm) {
    this.unMappedItemSearchTerm = searchTerm;
  }

  resetSearchTerm: boolean = false;
  onUnMappedItemsSelected(event) {
  }

  insuranceInformationForm: FormGroup;
  insuranceInformationFormValidations = {
    policyCode: new FormControl('', [Validators.required]),
    policyDescription: new FormControl('', [Validators.required]),
    companyName: new FormControl('', Validators.required),
    activeS: new FormControl('Y'),
    policyStartDate: new FormControl('', Validators.required),
    policyEndDate: new FormControl('', [Validators.required, EndDateValidator]),
    policyDurationInMonths: new FormControl(''),
    policyAmountLimit: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){2,5}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{2,5})|(\+\([\d]{1,3}\)\s)([\d]{2,5})|(\([\d]{1,3}\)\s)([\d]{2,5})|(\([\d]{1,3}\))([\d]{2,5})|([\d]{1,3})([\d]{2,5})|(\([\d]{1,3}\)[-])([\d]{2,5})|([\d]{1,3}\s)([\d]{2,5})|([\d]{1,3}[-])([\d]{2,5})|(\+[\d]{1,3}\s)([\d]{2,5})|(\+[\d]{1,3})([\d]{2,5})|(\+[\d]{1,3}[-])([\d]{2,5})|([\d]{2,5})|(\s)+))$/)]),
    termsAndConditions: new FormControl(''),
    contactNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    emailId: new FormControl('', [Validators.email, Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)]),
    addressLine1: new FormControl('', [Validators.required]),
    country: new FormControl([], [Validators.required]),
    state: new FormControl('', [Validators.required]),
    addressLine2: new FormControl(''),
    cityName: new FormControl(''),
    zipCode: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    contactPersonFirstName: new FormControl('', [Validators.required]),
    conatctPersonLastName: new FormControl('', [Validators.required]),
    contactPersonPhoneNumber: new FormControl('', Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)),
    contactPersonEmailId: new FormControl('', [Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    termsAndConditionsFile: new FormControl(''),
    contributionPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/))
  };


  checkFormDisability() {
    return (this.insuranceInformationForm.get('policyCode').errors instanceof Object)
      || (this.insuranceInformationForm.get('policyStartDate').errors instanceof Object)
      || (this.insuranceInformationForm.get('policyEndDate').errors instanceof Object)
      || (this.insuranceInformationForm.get('addressLine1').errors instanceof Object)
      || (this.insuranceInformationForm.get('companyName').errors instanceof Object)
      || (this.insuranceInformationForm.get('policyDescription').errors instanceof Object)
      || (this.insuranceInformationForm.get('policyAmountLimit').errors instanceof Object)
      || (this.insuranceInformationForm.get('policyAmountLimit').invalid)
      || (this.insuranceInformationForm.get('country').errors instanceof Object)
      || (this.insuranceInformationForm.get('state').errors instanceof Object)
      || (this.insuranceInformationForm.get('contactNumber').errors instanceof Object)
      || this.insuranceInformationForm.get('contactNumber').invalid
      || (this.insuranceInformationForm.get('zipCode').errors instanceof Object)
      || this.insuranceInformationForm.get('zipCode').invalid
      || (this.insuranceInformationForm.get('contactPersonFirstName').errors instanceof Object)
      || this.insuranceInformationForm.get('contactPersonFirstName').invalid
      || (this.insuranceInformationForm.get('conatctPersonLastName').errors instanceof Object)
      || this.insuranceInformationForm.get('conatctPersonLastName').invalid
      || this.insuranceInformationForm.get('companyName').invalid
  }


  onInsuranceLogoChange(event) {
    if (event.target.files[0].size > 4194304) {
      this.toasterService.error('Image size must be  < 4 MB', 'Error Occurred', {
        timeOut: 5000
      });
      event.target.value = '';
    }
    else {
      this.termsAndConditionsFile = event.target.files[0];
    }
  }

  getCountries() {
    this.insuranceService.getCountries().subscribe(
      getCountriesResponse => {
        if (getCountriesResponse instanceof Object) {
          if (getCountriesResponse['responseStatus']['code'] === 200) {
            this.countries = getCountriesResponse['result'];
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

  onCountrySelected(event: Event) {
    this.getProvinces(this.selectedCountry);
  }

  onStateSelected(event: Event) {
  }

  getProvinces(country: Object) {
    this.insuranceService.getProvinces(this.selectedCountry).subscribe(
      getProvincesResponse => {
        if (getProvincesResponse instanceof Object) {
          if (getProvincesResponse['responseStatus']['code'] === 200) {
            this.states = getProvincesResponse['result'];
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
    let itemSelected = this.selectedUnMappedItems.find(y => y.medicinesNotCovered === this.insuranceInformationForm.value['itemName']);
    this.insuranceInformationForm.get('termsAndConditionsFile').setValue(null);
    let payload = Object.assign({}, this.insuranceInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    payload['country'] = this.selectedCountry;
    payload['state'] = this.selectedState;
    payload['medicinesNotCovered'] = this.medicinesNotCovered;
    this.saveFormChanges(payload);
  }


  saveFormChanges(insuranceInformationForm: Object) {
    this.insuranceInformationForm.get('contactPersonFirstName').setErrors({ 'incorrect': true })
    if (this.termsAndConditionsFile == null) {
      this.spinnerService.show();
      this.insuranceService.saveFormChanges(insuranceInformationForm).subscribe(
        saveFormResponse => {
          if (saveFormResponse instanceof Object) {
            if (saveFormResponse['responseStatus']['code'] === 200) {
              this.insuranceInformationForm.reset();
              this.insuranceInformationForm.controls.activeS.setValue('Y');
              this.spinnerService.hide();
              this.insuranceInformationForm.patchValue({
                'country': '',
                'state': '',
                'medicinesNotCovered': ''
              });
              this.states = undefined;
              this.termsAndConditionsFile = null;
              this.selectedState = undefined;
              this.selectedCountry = undefined;
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
        }
      );
    }
    else {
      const formData = new FormData();
      formData.append('insuranceModel', JSON.stringify(insuranceInformationForm));
      if (this.termsAndConditionsFile != null) {
        formData.append('termsAndConditionsFile', this.termsAndConditionsFile);
      }
      this.spinnerService.show();
      this.insuranceService.saveInsuranceWithLogo(formData).subscribe(
        saveFormResponse => {
          if (saveFormResponse instanceof Object) {
            if (saveFormResponse['responseStatus']['code'] === 200) {
              this.spinnerService.hide();
              this.insuranceInformationForm.controls.activeS.setValue('Y');
              this.termsAndConditionsFile = null;
              this.selectedState = [];
              this.selectedCountry = [];
              this.toasterService.success(saveFormResponse['message'], 'Success', {
                timeOut: 3000
              });
              this.insuranceInformationForm.reset();
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
          this.toasterService.warning('Please contact administrator', 'Error Occurred', {
            timeOut: 3000
          });
        }
      );
    }
  }

  reset() {
    this.insuranceInformationForm.reset();
    this.insuranceInformationForm.patchValue({
      'country': '',
      'state': '',
      'medicinesNotCovered': ''
    });
    this.termsAndConditionsFile = null;
  }

  diff_months(dt2, dt1) {
    let d1 = new Date(dt1);
    let d2 = new Date(dt2);
    var diff = (d2.getTime() - d1.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7 * 4);
    return Math.abs(Math.round(diff));
  }

  modelChanged(event) {
    this.insuranceInformationForm.get('policyDurationInMonths').setValue(0);
  }

  selectedStartDate(event: Event) {
    if (this.insuranceInformationForm.get('policyStartDate').value &&
      this.insuranceInformationForm.get('policyEndDate').value) {
      let months = this.diff_months(this.insuranceInformationForm.get('policyStartDate').value,
        this.insuranceInformationForm.get('policyEndDate').value);
      this.insuranceInformationForm.get('policyDurationInMonths').setValue(months);
    }
  }

}
