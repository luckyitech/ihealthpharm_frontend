import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PharmacyService } from '../shared/pharmacy.service';
import { PharmacyModel } from '../edit-pharmacy/shared/edit-pharmacy.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-add-pharmacy',
  templateUrl: './add-pharmacy.component.html',
  styleUrls: ['./add-pharmacy.component.scss'],
  providers: [PharmacyService]
})
export class AddPharmacyComponent implements OnInit {

  @ViewChild('myInput', { static: false }) myInputVariable: ElementRef;

  pharmacyLogoPath: File;
  pharmacyModel: PharmacyModel[] = [];
  country: any;
  constructor(private pharmacyService: PharmacyService, private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.getCountries();
    this.getPharmacyData();
  }

  ngOnInit() {
    this.pharmacyInformationForm = new FormGroup(this.pharmacyInformationFormValidations);
  }

  ngOnDestroy(): void {

  }
  retrievePharmacyData() {
    return this.pharmacy.filter((pharmacy: any) => pharmacy.pharmacyName.startsWith(this.pharmacyName));
  }
  mainPharmacyArray: any[] = [];
  pharmacyName: string = ""
  pharmacyInformationForm: FormGroup;
  pharmacyInformationFormValidations = {
    pharmacyName: new FormControl('', [Validators.required]),
    mainPharmacyId: new FormControl('', [Validators.required]),
    taxId: new FormControl('', Validators.required),
    activeS: new FormControl('Y'),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    emailId: new FormControl('', [Validators.required, Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)]),
    addressLine1: new FormControl('', [Validators.required]),
    country: new FormControl([], [Validators.required]),
    state: new FormControl('', [Validators.required]),
    addressLine2: new FormControl(''),
    fax: new FormControl('', [Validators.pattern(/^\+?[0-9]+$/)]),
    cityName: new FormControl(''),
    zipCode: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    autherizedPersonFirstName: new FormControl('', [Validators.required]),
    autherizedPersonLastName: new FormControl('', [Validators.required]),
    autherizedPersonMiddleName: new FormControl(''),
    autherizedPersonNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    authPersonEmail: new FormControl('', [Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    purchaseOrderApproval: new FormControl('Y'),
    websiteUrl: new FormControl('', [Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+(.com)|(.co)|(.in)|(.org)|(.ke)+$/)]),
  };

  checkFormDisability() {
    return (this.pharmacyInformationForm.get('pharmacyName').errors instanceof Object)
      || (this.pharmacyInformationForm.get('addressLine1').errors instanceof Object)
      || (this.pharmacyInformationForm.get('taxId').errors instanceof Object)
      || (this.pharmacyInformationForm.get('emailId').errors instanceof Object)
      || this.pharmacyInformationForm.get('fax').invalid
      || this.pharmacyInformationForm.get('emailId').invalid
      || (this.pharmacyInformationForm.get('phoneNumber').errors instanceof Object)
      || this.pharmacyInformationForm.get('phoneNumber').invalid
      || (this.pharmacyInformationForm.get('zipCode').errors instanceof Object)
      || this.pharmacyInformationForm.get('zipCode').invalid
      || (this.pharmacyInformationForm.get('autherizedPersonFirstName').errors instanceof Object)
      || this.pharmacyInformationForm.get('autherizedPersonFirstName').invalid
      || (this.pharmacyInformationForm.get('autherizedPersonLastName').errors instanceof Object)
      || this.pharmacyInformationForm.get('autherizedPersonLastName').invalid
      || (this.pharmacyInformationForm.get('autherizedPersonNumber').errors instanceof Object)
      || this.pharmacyInformationForm.get('autherizedPersonNumber').invalid
  }

  countries: any[] = [];
  returnCreditTypes: any[] = [];
  states: any[] = [];
  pharmacy: any[] = [];
  pharmacyImagePath: any = '';
  pharmacySelected: any;

  selectedState: any;
  onCountrySelected(event: Event) {
    this.getProvinces(this.country);
  }

  onStateSelected(event) {
  }

  onMainPharmacy(event) {
  }


  onSubmit() {
    let payload = Object.assign({}, this.pharmacyInformationForm.value);
    payload['country'] = this.country;
    payload['state'] = this.selectedState;
    payload['mainPharmacyId'] = 1;
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');

    this.saveFormChanges(payload);
  }

  getCountries() {
    this.pharmacyService.getCountries().subscribe(
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

  getProvinces(country: Object) {
    this.pharmacyService.getProvinces(country).subscribe(
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

  getPharmacyData() {
    this.pharmacyService.getRowDataFromServer().subscribe(
      gridRowDataResponse => {
        if (gridRowDataResponse instanceof Object) {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.pharmacy = gridRowDataResponse['result'];
            for (let i = 0; i < this.pharmacy.length; i++) {
              if (this.pharmacy[i].activeS == 'Y') {
                this.pharmacy[i].Status = 'Active'
                this.pharmacy[i].Status = 'Active'
              }
              else if (this.pharmacy[i].activeS == 'N') {
                this.pharmacy[i].Status = 'De-Active'
              }
            }
            this.selectedState = undefined;
            this.country = undefined;

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

  onPharmacyLogoChange(event) {
    this.pharmacyLogoPath = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => this.pharmacyImagePath = reader.result;
    reader.readAsDataURL(this.pharmacyLogoPath);
  }

  saveFormChanges(pharmacyInformationForm: Object) {
    this.pharmacyInformationForm.get('autherizedPersonFirstName').setErrors({ 'incorrect': true });
    if (this.pharmacyInformationForm.get('mainPharmacyId').value != null) {
      this.spinnerService.show();
      this.pharmacyService.saveFormChanges(pharmacyInformationForm).subscribe(
        saveFormResponse => {
          if (saveFormResponse instanceof Object) {
            if (saveFormResponse['responseStatus']['code'] === 200) {
              this.pharmacyInformationForm.reset();
              this.pharmacyImagePath = '';
              this.myInputVariable.nativeElement.value = "";
              this.pharmacyInformationForm.controls.activeS.setValue('Y');
              this.pharmacyInformationForm.controls.purchaseOrderApproval.setValue('Y');
              this.pharmacyLogoPath = null;
              this.spinnerService.hide();
              this.pharmacyInformationForm.patchValue({
                'country': '',
                'state': '',
                'mainPharmacyId': ''
              });
              this.states = undefined;
              this.toasterService.success(saveFormResponse['message'], 'Success', {
                timeOut: 3000
              });
              this.pharmacySelected = undefined;
              this.selectedState = undefined;
              this.country = undefined;

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
      this.pharmacyInformationForm.get('autherizedPersonFirstName').setErrors({ 'incorrect': true });
      const formData = new FormData();
      formData.append('pharmacyModel', JSON.stringify(pharmacyInformationForm));
      if (this.pharmacyLogoPath != null) {
        formData.append('pharmacyLogoPath', this.pharmacyLogoPath);
      }
      this.spinnerService.show();
      this.pharmacyService.savePharmacyWithLogo(formData).subscribe(
        saveFormResponse => {
          if (saveFormResponse instanceof Object) {
            if (saveFormResponse['responseStatus']['code'] === 200) {
              this.pharmacyInformationForm.reset();
              this.pharmacyLogoPath = null;
              this.pharmacyInformationForm.controls.activeS.setValue('Y');
              this.pharmacyInformationForm.controls.purchaseOrderApproval.setValue('Y');
              this.spinnerService.hide();
              this.pharmacyInformationForm.patchValue({
                'country': '',
                'state': '',
                'mainPharmacyId': ''
              });
              this.pharmacySelected = undefined;
              this.selectedState = undefined;
              this.country = undefined;
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
    this.pharmacyInformationForm.reset();
    this.pharmacySelected = undefined;
    this.selectedState = undefined;
    this.country = undefined;
  }

}

