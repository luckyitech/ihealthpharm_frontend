import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { PharmacyModel } from '../shared/pharmacy.model';
import { PharmacyService } from '../shared/pharmacy.service';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, ColDef } from 'ag-grid-community';
import { AppService } from 'src/app/core/app.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-edit-pharmacy',
  templateUrl: './edit-pharmacy.component.html',
  styleUrls: ['./edit-pharmacy.component.scss'],
  providers: [PharmacyService]
})
export class EditPharmacyComponent implements OnInit {

  @ViewChild('myInput', { static: false }) myInputVariable: ElementRef;
  editPharmacy: PharmacyModel[] = [];
  pharmacyLogoPath: File;
  pharmacyModel: PharmacyModel[] = [];

  constructor(private pharmacyService: PharmacyService, private toasterService: ToastrService, private appService: AppService, private spinnerService: Ng4LoadingSpinnerService) {
    this.pharmacyGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.pharmacyGridOptions.rowSelection = 'single';
    this.pharmacyGridOptions.columnDefs = this.columnDefs;
    this.getCountries();
    this.getPharmacyData();

    this.pharmacyGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }
  }

  ngOnInit() {
    this.pharmacyInformationForm = new FormGroup(this.pharmacyInformationFormValidations);
    $(document).ready(function () {
      $("#common-grid-btn").click(function () {
        $("#common-grid").hide();
      });
      $("#common-grid-btn").click(function () {
        $("#pharmacy-Information").show();
      });

      $(".btn-save-text").click(function () {
        $("#common-grid").show();
      });

      $(".btn-cancel-text").click(function () {
        $("#common-grid").show();

      });
      $("#common-grid-btn").click(function () {
        $("#pharmacy-Information").css("display", "block");
      });
      $(".btn-save-text").click(function () {
        $("#pharmacy-Information").css("display", "none");
      });
      $(".btn-cancel-text").click(function () {
        $("#pharmacy-Information").css("display", "none");
      });
    });
  }
  key;

  showGrid: boolean = false;
  pharmacyGridOptions: GridOptions;
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
    { headerName: 'Pharmacy Name', field: 'pharmacyName', sortable: true, resizable: true, filter: true },
    { headerName: 'Address Line 1', field: 'addressLine1', sortable: true, resizable: true, filter: true },
    { headerName: 'City ', field: 'cityName', sortable: true, resizable: true, filter: true },
    { headerName: 'Country', field: 'country.countryName', sortable: true, resizable: true, filter: true },
    { headerName: 'State ', field: 'state.provinceName', sortable: true, resizable: true, filter: true },
    { headerName: 'Pincode', field: 'zipCode', sortable: true, resizable: true, filter: true },
    { headerName: 'Phone Number', field: 'phoneNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Email ', field: 'emailId', sortable: true, resizable: true, filter: true },
    { headerName: 'Authorized Person FirstName', field: 'autherizedPersonFirstName', sortable: true, resizable: true, filter: true },
    { headerName: 'Authorized Person LastName', field: 'autherizedPersonLastName', sortable: true, resizable: true, filter: true },
    { headerName: 'Authorized Persone EmailId', field: 'authPersonEmail', sortable: true, resizable: true, filter: true },
    { headerName: 'Authorized Person PhoneNumber', field: 'autherizedPersonNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Status', field: 'Status', sortable: true, resizable: true, filter: true }
  ];

  resetGrid() {
    this.getPharmacyData();
  }

  reset() {
    this.pharmacyInformationForm.reset();
    this.pharmacyInformationForm.controls.activeS.setValue('Y');
  }


  editGrid() {
    this.onPharmacySelected(this.pharmacyGridOptions.api.getSelectedRows()[0].pharmacyId);
  }

  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.pharmacyGridOptions.api.setQuickFilter($event.target.value);
    if (this.pharmacyGridOptions.api.getDisplayedRowCount() == 0) {
      this.pharmacyGridOptions.api.showNoRowsOverlay();
    } else {
      this.pharmacyGridOptions.api.hideOverlay();
    }
  }

  changedMainPharmacy: any;
  onMainPharmacySelected(event) {
    this.changedMainPharmacy = event['mainPharmacyId'];

  }


  mainPharmacyArray: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  pharmacy: any[] = [];
  pharmacyImagePath: any = '';
  selectedPharmacy: Object = {};
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

  selectedState: any;
  country: any;
  pharmacySelected: any;
  rowData = [];
  onPharmacySelected(pharmacyId: any) {
    this.selectedPharmacy = this.pharmacy.find(pharmacy => pharmacy['pharmacyId'] === pharmacyId);
    this.pharmacyService.getProvinces(this.selectedPharmacy['country']).subscribe(
      getProvincesResponse => {
        if (getProvincesResponse instanceof Object) {
          if (getProvincesResponse['responseStatus']['code'] === 200) {
            this.states = getProvincesResponse['result'];
            let PharmacyFormValues: Object = {
              pharmacyName: this.selectedPharmacy['pharmacyName'],
              phoneNumber: this.selectedPharmacy['phoneNumber'],
              mainPharmacyId: this.selectedPharmacy['mainPharmacyId'],
              taxId: this.selectedPharmacy['taxId'],
              emailId: this.selectedPharmacy['emailId'],
              addressLine1: this.selectedPharmacy['addressLine1'],
              country: this.selectedPharmacy['country'],
              state: this.selectedPharmacy['state'],
              addressLine2: this.selectedPharmacy['addressLine2'],
              fax: this.selectedPharmacy['fax'],
              cityName: this.selectedPharmacy['cityName'],
              zipCode: this.selectedPharmacy['zipCode'],
              autherizedPersonFirstName: this.selectedPharmacy['autherizedPersonFirstName'],
              autherizedPersonLastName: this.selectedPharmacy['autherizedPersonLastName'],
              autherizedPersonMiddleName: this.selectedPharmacy['autherizedPersonMiddleName'],
              autherizedPersonNumber: this.selectedPharmacy['autherizedPersonNumber'],
              authPersonEmail: this.selectedPharmacy['authPersonEmail'],
              websiteUrl: this.selectedPharmacy['websiteUrl'],
              purchaseOrderApproval: this.selectedPharmacy['purchaseOrderApproval'],
              activeS: this.selectedPharmacy['activeS'],
            }
            this.country = this.selectedPharmacy['country'];
            this.getProvinces(this.country);
            this.selectedState = this.selectedPharmacy['state'];
            this.pharmacySelected = this.selectedPharmacy['pharmacyName']
            this.pharmacyLogoPath = this.selectedPharmacy['pharmacyLogoPath'];
            this.pharmacyInformationForm.setValue(PharmacyFormValues);
            this.pharmacyImagePath = ''
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

  checkFormDisability() {
    return (this.pharmacyInformationForm.get('pharmacyName').errors instanceof Object)
      || (this.pharmacyInformationForm.get('addressLine1').errors instanceof Object)
      || (this.pharmacyInformationForm.get('taxId').errors instanceof Object)
      || (this.pharmacyInformationForm.get('emailId').errors instanceof Object)
      || this.pharmacyInformationForm.get('fax').invalid
      || (this.pharmacyInformationForm.get('emailId').errors instanceof Object)
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


  onCountrySelected(event: Event) {
    this.getProvinces(this.country);
  }

  onStateSelected(event) {
  }

  onSubmit() {
    let payload = Object.assign({}, this.pharmacyInformationForm.value);
    payload['country'] = this.country;
    payload['state'] = this.selectedState;
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    payload['pharmacyId'] = this.selectedPharmacy['pharmacyId'];
    payload['mainPharmacyId'] = this.changedMainPharmacy != null && this.changedMainPharmacy != undefined ? this.changedMainPharmacy : this.selectedPharmacy['pharmacyId'];
    this.updateFormChanges(payload);
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

  getMainPharmacy(pharmacy: Object) {
    this.pharmacyService.getPharmacyById(pharmacy).subscribe(
      getPharmacyResponse => {
        if (getPharmacyResponse instanceof Object) {
          if (getPharmacyResponse['responseStatus']['code'] === 200) {
            this.mainPharmacyArray = getPharmacyResponse['result'];

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
    this.showGrid = true;
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

  onPharmacyLogoChange(event) {
    this.pharmacyLogoPath = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => this.pharmacyImagePath = reader.result;
    reader.readAsDataURL(this.pharmacyLogoPath);
  }

  updateFormChanges(pharmacyInformationForm: Object) {
    this.pharmacyInformationForm.get('zipCode').setErrors({ 'incorrect': true });
    if (this.pharmacyInformationForm.get('mainPharmacyId').value != null) {
      this.spinnerService.show();
      this.pharmacyService.updatePharmacy(pharmacyInformationForm).subscribe(
        saveFormResponse => {

          if (saveFormResponse instanceof Object) {
            if (saveFormResponse['responseStatus']['code'] === 200) {
              this.pharmacyInformationForm.reset();
              this.pharmacyImagePath = '';
              this.pharmacyInformationForm.controls.activeS.setValue('Y');
              this.pharmacyLogoPath = null;
              this.spinnerService.hide();
              this.getPharmacyData();
              this.key = null;
              this.selectedState = undefined;
              this.country = undefined;
              this.pharmacySelected = undefined;
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
      this.showGrid = true;
      const formData = new FormData();
      formData.append('pharmacyModel', JSON.stringify(pharmacyInformationForm));
      if (this.pharmacyLogoPath != null) {
        formData.append('pharmacyLogoPath', this.pharmacyLogoPath);
      }
      this.pharmacyInformationForm.get('zipCode').setErrors({ 'incorrect': true });
      this.spinnerService.show();
      this.pharmacyService.savePharmacyWithLogo(formData).subscribe(
        saveFormResponse => {
          if (saveFormResponse instanceof Object) {
            if (saveFormResponse['responseStatus']['code'] === 200) {
              this.pharmacyInformationForm.reset();
              this.pharmacyLogoPath = null;
              this.pharmacyInformationForm.controls.activeS.setValue('Y');
              this.pharmacyInformationForm.patchValue({
                'country': '',
                'state': ''

              });
              this.spinnerService.hide();
              this.selectedState = undefined;
              this.country = undefined;
              this.pharmacySelected = undefined;
              this.getPharmacyData();
              this.showGrid = true;
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
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
        }
      );

    }
  }
  search() {
    if (this.key != null && this.key != undefined && this.key != '') {
      this.pharmacyService.getPharmacyByName(this.key).subscribe(pharmacyRes => {
        if (pharmacyRes["responseStatus"]["code"] === 200) {
          this.pharmacy = pharmacyRes['result'];
          if (this.pharmacy.length == 0) {
            this.toasterService.warning("No Data Found With Search Criteria", "No Data To Show", {
              timeOut: 3000
            });
          }

        }
      },
        error => {
          this.pharmacy = [];
          this.toasterService.warning("No Data Found With Search Criteria", "No Data To Show",
            {
              timeOut: 3000
            });
        })
    }
    else {
      this.getPharmacyData();
    }
  }
}
