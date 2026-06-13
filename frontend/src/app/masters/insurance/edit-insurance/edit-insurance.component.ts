import { Insurance } from './../shared/insurance.model';
import { InsuranceService } from './../shared/insurance.service';
import { ToastrService } from 'ngx-toastr';
import { ColDef, GridOptions } from 'ag-grid-community';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { EndDateValidator } from 'src/app/core/DOB Validator/endDate-validator';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-edit-insurance',
  templateUrl: './edit-insurance.component.html',
  styleUrls: ['./edit-insurance.component.scss'],
  providers: [InsuranceService]
})

export class EditInsuranceComponent implements OnInit {

  insuranceModel: Insurance[] = [];
  termsAndConditionsFile;
  termsAndAgreement;
  termsAgrrementImage;
  termsAndConditionsFiles;

  constructor(private insuranceService: InsuranceService,
    private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.insuranceGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.insuranceGridOptions.rowSelection = 'single';
    this.insuranceGridOptions.columnDefs = this.columnDefs;
    this.getInsuranceData()
    this.getCountries();

    this.insuranceGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }
  }

  ngOnInit() {
    this.insuranceInformationForm = new FormGroup(this.insuranceInformationFormValidations);
    $(document).ready(function () {
      $("#common-grid-btn").click(function () {
        $("#common-grid").hide();
        $("#editInsurGrid").hide();

      });
      $("#common-grid-btn").click(function () {
        $("#insurance-Information").show();
      });

      $(".mu-adduser-save").click(function () {
        $("#common-grid").show();
        $("#editInsurGrid").show();
      });

      $("#mu-adduser-cancel").click(function () {
        $("#common-grid").show();
        $("#editInsurGrid").show();
      });
      $("#common-grid-btn").click(function () {
        $("#insurance-Information").css("display", "block");
      });
      $(".mu-adduser-save").click(function () {
        $("#insurance-Information").css("display", "none");
      });
      $("#mu-adduser-cancel").click(function () {
        $("#insurance-Information").css("display", "none");
      });

    });
  }


  key;
  insuranceGridOptions: GridOptions;
  showGrid: boolean = false;
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
    { headerName: 'Policy Description ', field: 'policyDescription', sortable: true, resizable: true, filter: true },
    { headerName: 'Policy Code', field: 'policyCode', sortable: true, resizable: true, filter: true },
    { headerName: 'City ', field: 'cityName', sortable: true, resizable: true, filter: true },
    { headerName: 'Country', field: 'country.countryName', sortable: true, resizable: true, filter: true },
    { headerName: 'State ', field: 'state.provinceName', sortable: true, resizable: true, filter: true },
    { headerName: 'Pincode', field: 'zipCode', sortable: true, resizable: true, filter: true },
    { headerName: 'Phone Number', field: 'contactNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Email ', field: 'emailId', sortable: true, resizable: true, filter: true },
    { headerName: 'Start Date', field: 'policyStartDate', sortable: true, resizable: true, filter: true },
    { headerName: 'End Date', field: 'policyEndDate', sortable: true, resizable: true, filter: true },
    { headerName: 'Contact Person FirstName', field: 'contactPersonFirstName', sortable: true, resizable: true, filter: true },
    { headerName: 'Contact Person LastName', field: 'conatctPersonLastName', sortable: true, resizable: true, filter: true },
    { headerName: 'Contact Persone EmailId', field: 'contactPersonEmailId', sortable: true, resizable: true, filter: true },
    { headerName: 'Contact Person PhoneNumber', field: 'contactPersonPhoneNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Status', field: 'Status', sortable: true, resizable: true, filter: true }
  ];



  resetGrid() {
    this.getInsuranceData();
  }
  editGrid() {
    this.onInsuranceSelected(this.insuranceGridOptions.api.getSelectedRows()[0].insurancePolicyId);
  }
  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.insuranceGridOptions.api.setQuickFilter($event.target.value);
    if (this.insuranceGridOptions.api.getDisplayedRowCount() == 0) {
      this.insuranceGridOptions.api.showNoRowsOverlay();
    } else {
      this.insuranceGridOptions.api.hideOverlay();
    }
  }

  showForm: boolean = false;
  countries: any[] = [];
  states: any[] = [];
  pharmacies: any[] = [];
  pharmacyName: string = "";
  selectedPharmacy: Object = {};
  insuranceInformationForm: FormGroup;
  selectedInsurance: Object = {};
  selectedCountry: any;
  selectedState: any;

  insuranceInformationFormValidations = {
    policyCode: new FormControl('', [Validators.required]),
    policyDescription: new FormControl(''),
    companyName: new FormControl('', Validators.required),
    activeS: new FormControl('Y'),
    policyStartDate: new FormControl('', Validators.required),
    policyEndDate: new FormControl('', [Validators.required, EndDateValidator]),
    policyDurationInMonths: new FormControl(''),
    policyAmountLimit: new FormControl('', [Validators.pattern(/(\+(?:[0-9] ?){2,5}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{2,5})|(\+\([\d]{1,3}\)\s)([\d]{2,5})|(\([\d]{1,3}\)\s)([\d]{2,5})|(\([\d]{1,3}\))([\d]{2,5})|([\d]{1,3})([\d]{2,5})|(\([\d]{1,3}\)[-])([\d]{2,5})|([\d]{1,3}\s)([\d]{2,5})|([\d]{1,3}[-])([\d]{2,5})|(\+[\d]{1,3}\s)([\d]{2,5})|(\+[\d]{1,3})([\d]{2,5})|(\+[\d]{1,3}[-])([\d]{2,5})|([\d]{2,5})|(\s)+))$/)]),
    termsAndConditions: new FormControl(''),
    contactNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    emailId: new FormControl('', [Validators.email, Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)]),
    addressLine1: new FormControl('', [Validators.required]),
    country: new FormControl([], [Validators.required]),
    state: new FormControl('', [Validators.required]),
    addressLine2: new FormControl(''),
    contributionPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
    cityName: new FormControl(''),
    zipCode: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    contactPersonFirstName: new FormControl('', [Validators.required]),
    conatctPersonLastName: new FormControl('', [Validators.required]),
    contactPersonPhoneNumber: new FormControl('', [Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    contactPersonEmailId: new FormControl('', [Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    termsAndConditionsFile: new FormControl(''),

  };
  onPharmacyLogoChange(event) {
    this.termsAndConditionsFile = event.target.files[0];
  }

  onSubmit() {
    let payload = Object.assign({}, this.insuranceInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    payload['country'] = this.selectedCountry;
    payload['state'] = this.selectedState;
    payload['insurancePolicyId'] = this.selectedInsurance['insurancePolicyId'];
    this.updateInsuranceData(payload);
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

  onInsuranceSelected(insurancePolicyId: any) {
    this.selectedInsurance = this.insurances.find(insurance => insurance['insurancePolicyId'] === insurancePolicyId);
    this.insuranceService.getProvinces(this.selectedInsurance['country']).subscribe(
      getProvincesResponse => {
        if (getProvincesResponse instanceof Object) {
          if (getProvincesResponse['responseStatus']['code'] === 200) {
            this.states = getProvincesResponse['result'];
            let InsuranceFormValues: Object = {
              policyCode: this.selectedInsurance['policyCode'],
              policyDescription: this.selectedInsurance['policyDescription'],
              companyName: this.selectedInsurance['companyName'],
              activeS: this.selectedInsurance['activeS'],
              policyStartDate: this.selectedInsurance['policyStartDate'],
              policyEndDate: this.selectedInsurance['policyEndDate'],
              policyDurationInMonths: this.selectedInsurance['policyDurationInMonths'],
              policyAmountLimit: this.selectedInsurance['policyAmountLimit'],
              termsAndConditions: this.selectedInsurance['termsAndConditions'],
              termsAndConditionsFile: this.selectedInsurance['termsAndConditionsFile'],
              contactNumber: this.selectedInsurance['contactNumber'],
              emailId: this.selectedInsurance['emailId'],
              addressLine1: this.selectedInsurance['addressLine1'],
              country: this.selectedInsurance['country'],
              state: this.selectedInsurance['state'],
              addressLine2: this.selectedInsurance['addressLine2'],
              cityName: this.selectedInsurance['cityName'],
              zipCode: this.selectedInsurance['zipCode'],
              contributionPercentage: this.selectedInsurance['contributionPercentage'],
              contactPersonFirstName: this.selectedInsurance['contactPersonFirstName'],
              conatctPersonLastName: this.selectedInsurance['conatctPersonLastName'],
              contactPersonPhoneNumber: this.selectedInsurance['contactPersonPhoneNumber'],
              contactPersonEmailId: this.selectedInsurance['contactPersonEmailId'],
            }
            this.selectedCountry = this.selectedInsurance['country'];
            this.getProvinces(this.selectedCountry);
            this.selectedState = this.selectedInsurance['state'];
            this.termsAgrrementImage = this.selectedInsurance['termsAndConditionsFile'];
            this.termsAndAgreement = 'data:image/jpeg;base64,' + this.selectedInsurance['termsAndConditionsFile'];
            this.insuranceInformationForm.setValue(InsuranceFormValues);
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

  termsImage = true;
  termsConditionImage1 = false;
  onInsuranceLogoChange(event) {
    if (event.target.files[0].size > 4194304) {
      this.toasterService.error('Image size must be < 4 MB', 'Error Occurred', {
        timeOut: 5000
      });
      document.getElementById('mu-adduser-logo')['value'] = '';
      try {
        event.target.value = undefined;
      }
      catch (error) { }

    }
    else {
      this.termsAndConditionsFile = event.target.files[0];
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.termsAndConditionsFile);
    reader.onload = (_event) => {
      this.termsAndConditionsFiles = reader.result;
      reader.readAsDataURL(this.termsAndConditionsFiles);

    }
    let TAFile = this.termsAndAgreement;
    let newTAFile = this.termsAndConditionsFile;
    if (newTAFile == null && newTAFile == undefined) {
      this.termsConditionImage1 = false;
      this.termsImage = true;

    }

    else if (TAFile !== null && TAFile !== undefined) {
      this.termsConditionImage1 = true;
      this.termsImage = false;
    }
  }
  onCountrySelected(event: Event) {
    this.getProvinces(this.selectedCountry);
  }

  onStateSelected(event: Event) {
  }

  checkFormDisability() {
    return (this.insuranceInformationForm.get('policyCode').errors instanceof Object)
      || (this.insuranceInformationForm.get('policyStartDate').errors instanceof Object)
      || (this.insuranceInformationForm.get('policyEndDate').errors instanceof Object)
      || (this.insuranceInformationForm.get('addressLine1').errors instanceof Object)
      || (this.insuranceInformationForm.get('policyDescription').errors instanceof Object)
      || (this.insuranceInformationForm.get('companyName').errors instanceof Object)
      || (this.insuranceInformationForm.get('policyAmountLimit').errors instanceof Object)
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


  rowData: [] = [];
  insurances: any[] = [];

  getInsuranceData() {
    this.showGrid = true;
    this.insuranceService.getRowDataFromServer().subscribe(
      getInsuranceDataResponse => {
        if (getInsuranceDataResponse instanceof Object) {
          if (getInsuranceDataResponse['responseStatus']['code'] === 200) {
            this.rowData = getInsuranceDataResponse['result'];
            this.insurances = this.rowData;
            for (let i = 0; i < this.insurances.length; i++) {
              if (this.insurances[i].activeS == 'Y') {
                this.insurances[i].Status = 'Active'
              }
              else if (this.insurances[i].activeS == 'N') {
                this.insurances[i].Status = 'De-Active'
              }
            }
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

  getProvinces(country: Object) {
    this.insuranceService.getProvinces(country).subscribe(
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
    this.insuranceInformationForm.reset();
    this.insuranceInformationForm.controls.activeS.setValue('Y');
    document.getElementById('mu-adduser-logo')['value'] = '';
  }



  updateInsuranceData(insuranceInformationForm: Object) {
    this.insuranceInformationForm.get('contactPersonFirstName').setErrors({ 'incorrect': true })
    this.showGrid = true;
    if (this.termsAndConditionsFile == null) {
      this.spinnerService.show();
      this.insuranceService.updateRowData(insuranceInformationForm).subscribe(
        updateInsuranceResponse => {
          if (updateInsuranceResponse instanceof Object) {
            if (updateInsuranceResponse['responseStatus']['code'] === 200) {
              this.insuranceInformationForm.reset();
              this.insuranceInformationForm.controls.activeS.setValue('Y');
              this.termsAndConditionsFile = null;
              this.spinnerService.hide();
              this.key = null;
              this.getInsuranceData();
              this.selectedState = undefined;
              this.selectedCountry = undefined;
              this.showGrid = true;

              this.toasterService.success(updateInsuranceResponse['message'], 'Success', {
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
      formData.append("insuranceModel", JSON.stringify(insuranceInformationForm));
      if (this.termsAndConditionsFile != null) {
        formData.append("termsAndConditionsFile", this.termsAndConditionsFile);
      } else {
        formData.append("termsAndConditionsFile", this.termsAgrrementImage);
      }
      this.spinnerService.show();
      this.insuranceService.updateInsuranceWithLogo(formData).subscribe(
        updateInsuranceResponse => {
          if (updateInsuranceResponse instanceof Object) {
            if (updateInsuranceResponse['responseStatus']['code'] === 200) {
              this.insuranceInformationForm.reset();
              this.spinnerService.hide();
              this.insuranceInformationForm.controls.activeS.setValue('Y');

              this.insuranceInformationForm.patchValue({
                'country': '',
                'state': ''
              });
              this.key = null;
              this.termsAndConditionsFile = null;
              this.getInsuranceData();
              this.selectedState = [];
              this.showGrid = true;
              this.toasterService.success(updateInsuranceResponse['message'], 'Success', {
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
        , error => {
          this.spinnerService.hide();
          this.toasterService.warning('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
        });
    }
  }

  search() {
    if (this.key != null && this.key != undefined && this.key != '') {
      this.insuranceService.getInsurencesBySearch(this.key).subscribe(insuranceRes => {
        if (insuranceRes["responseStatus"]["code"] === 200) {
          this.rowData = insuranceRes['result'];
          if (this.rowData.length == 0) {
            this.toasterService.warning("No Data Found With Search Criteria", "No Data To Show",
              {
                timeOut: 3000
              });
          }
        }
      },
        error => {
          this.rowData = [];
          this.toasterService.warning("Please contact administrator", "Error Occurred", {
            timeOut: 3000
          });
        })
    }
    else {
      this.getInsuranceData();
    }
  }
}
