import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../shared/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss'],
  providers: [SupplierService]
})

export class AddSupplierComponent implements OnInit {

  constructor(private supplierService: SupplierService, private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.getCountries();
    this.getreturnCreditType();
    this.getPaymentTypes();
  }

  ngOnInit() {
    this.supplierInformationForm = new FormGroup(this.supplierInformationFormValidations)
  }

  selectedPaymentType: Object = undefined;
  paymentTypes: any[] = [];

  getPaymentTypes() {
    this.supplierService.getallpaymenttypes().subscribe(
      getallpaymenttypesResponse => {
        if (getallpaymenttypesResponse['responseStatus']['code'] === 200) {
          this.paymentTypes = getallpaymenttypesResponse['result'];
        }
      }
    );
  }

  countries: any[] = [];
  returnCreditTypes: any[] = [];
  states: any[] = [];
  selectedCoutry: any;
  stateSelected: any;
  returnCreditTypeSelected: any;

  /**
    * Grid Changes
    * End
    */

  supplierInformationForm: FormGroup;
  supplierInformationFormValidations = {

    name: new FormControl('', [Validators.required]),
    license: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    emailId: new FormControl('', [Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    addressLine1: new FormControl('', [Validators.required]),
    country: new FormControl([], [Validators.required]),
    state: new FormControl('', [Validators.required]),
    addressLine2: new FormControl(''),
    fax: new FormControl('', [Validators.pattern(/^\+?[0-9]+$/)]),
    cityName: new FormControl(''),
    zipCode: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    website: new FormControl('', [Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+(.com)|(.co)|(.in)|(.org)|(.ke)+$/)]),
    contactPersonFirstName: new FormControl('', [Validators.required]),
    contactPersonMiddleName: new FormControl(''),
    contactPersonLastName: new FormControl('', [Validators.required]),
    contactPersonEmailID: new FormControl('', [ Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    contactPersonEmailIdTwo:new FormControl('', [ Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    contactPersonEmailIdThree:new FormControl('', [ Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    contactPersonEmailIdFour:new FormControl('', [ Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    contactPersonPhoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    paymentTerms: new FormControl(''),
    paymentCreditNetDays: new FormControl(''),
    paymentType: new FormControl(''),
    latePaymentInterest: new FormControl(''),
    dlNo: new FormControl(''),
    cstNo: new FormControl(''),
    allowOnlineOrders: new FormControl('Y'),
    allowManualOrders: new FormControl('Y'),
    allowPhoneOrders: new FormControl('Y'),
    acceptExpireReturns: new FormControl('Y'),
    acceptDamagedReturns: new FormControl('Y'),
    acceptGoodReturns: new FormControl('Y'),
    supplierAlsoManufacturer: new FormControl('Y'),
    suppliesMedicalNonMedicalBoth: new FormControl('B'),
    returnCreditTypeId: new FormControl('', [Validators.required]),
    activeS: new FormControl('Y'),
    accountNumber: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    bankName: new FormControl(''),
    ifscCode: new FormControl('', Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)),
    micrCode: new FormControl('', Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/))
  };

  onSubmit() {
    let payload = Object.assign({}, this.supplierInformationForm.value);
    payload['country'] = this.selectedCoutry;
    payload['state'] = this.stateSelected;
    payload['returnCreditTypeId'] = this.returnCreditTypeSelected;
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');

    this.saveFormChanges(payload);
  }
  onCountrySelected(event: Event) {
    this.getProvinces(this.selectedCoutry);
  }

  onStateSelected(event) {
  }

  checkFormDisability() {
    return (this.supplierInformationForm.get('name').errors instanceof Object)
      || (this.supplierInformationForm.get('license').errors instanceof Object)
      || (this.supplierInformationForm.get('addressLine1').errors instanceof Object)
      || (this.supplierInformationForm.get('contactPersonFirstName').errors instanceof Object)
      || (this.supplierInformationForm.get('contactPersonLastName').errors instanceof Object)
      || (this.supplierInformationForm.get('phoneNumber').errors instanceof Object)
      || this.supplierInformationForm.get('emailId').invalid
      || this.supplierInformationForm.get('phoneNumber').invalid
      || this.supplierInformationForm.get('website').invalid
      || (this.supplierInformationForm.get('zipCode').errors instanceof Object)
      || this.supplierInformationForm.get('zipCode').invalid
      || this.supplierInformationForm.get('contactPersonEmailID').invalid
      || this.supplierInformationForm.get('contactPersonEmailIdTwo').invalid
      || this.supplierInformationForm.get('contactPersonEmailIdThree').invalid
      || this.supplierInformationForm.get('contactPersonEmailIdFour').invalid
      || this.supplierInformationForm.get('contactPersonPhoneNumber').invalid
      || this.supplierInformationForm.get('returnCreditTypeId').invalid
  }

  /**
   * Form Changes
   * End
   */


  getreturnCreditType() {
    this.supplierService.getReturnCreditType().subscribe(
      getReturnCreditTypeResponse => {
        if (getReturnCreditTypeResponse instanceof Object) {
          if (getReturnCreditTypeResponse['responseStatus']['code'] === 200) {
            this.returnCreditTypes = getReturnCreditTypeResponse['result'];
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

  getCountries() {
    this.supplierService.getCountries().subscribe(
      getReturnCreditTypeResponse => {
        if (getReturnCreditTypeResponse instanceof Object) {
          if (getReturnCreditTypeResponse['responseStatus']['code'] === 200) {
            this.countries = getReturnCreditTypeResponse['result'];
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
    this.supplierService.getProvinces(country).subscribe(
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

  reset() {
    this.supplierInformationForm.reset();
    this.selectedCoutry = undefined;
    this.stateSelected = undefined;
    this.returnCreditTypeSelected = undefined;
  }

  saveFormChanges(supplierInformationForm: Object) {
    this.supplierInformationForm.get('name').setErrors({ 'incorrect': true });
    this.spinnerService.show();
    this.supplierService.saveFormChanges(supplierInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.supplierInformationForm.reset();
            this.spinnerService.hide();
            this.supplierInformationForm.controls.activeS.setValue('Y');
            this.supplierInformationForm.controls.supplierAlsoManufacturer.setValue('Y');
            this.supplierInformationForm.controls.suppliesMedicalNonMedicalBoth.setValue('B');
            this.supplierInformationForm.controls.acceptGoodReturns.setValue('Y');
            this.supplierInformationForm.controls.allowManualOrders.setValue('Y');
            this.supplierInformationForm.controls.acceptDamagedReturns.setValue('Y');
            this.supplierInformationForm.controls.allowOnlineOrders.setValue('Y');
            this.supplierInformationForm.controls.acceptExpireReturns.setValue('Y');
            this.supplierInformationForm.controls.allowPhoneOrders.setValue('Y');

            this.selectedCoutry = undefined;
            this.stateSelected = undefined;
            this.states = undefined;
            this.returnCreditTypeSelected = undefined;
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
            this.supplierInformationForm.get('name').setErrors({ 'incorrect': false });
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
}
