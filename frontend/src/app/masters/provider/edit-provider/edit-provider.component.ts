import { Component, OnInit, Provider } from '@angular/core';
import * as $ from 'jquery';
import { EditProviderService } from './shared/edit-provider.service';
import { EditProvider } from './shared/edit-provider.model';
import { ProviderService } from '../shared/provider.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/core/app.service';
import { GridOptions, GridApi, ColDef } from 'ag-grid-community';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NumericEditor } from 'src/app/core/numeric-editor.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-edit-provider',
  templateUrl: './edit-provider.component.html',
  styleUrls: ['./edit-provider.component.scss'],
  providers: [EditProviderService, ProviderService]
})

export class EditProviderComponent implements OnInit {

  editProvider: EditProvider[] = [];
  provider: Provider[] = [];

  constructor(private providerService: ProviderService, private toasterService: ToastrService, private appService: AppService, private spinnerService: Ng4LoadingSpinnerService) {
    this.getCountries();
    this.getProviderLookup();
    this.getHospitals();

    this.providerGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };

    this.providerGridOptions.rowSelection = 'single';
    this.providerGridOptions.columnDefs = this.columnDefs;
    this.getGridRowData();

    this.providerGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }
  }

  ngOnInit() {
    this.providerInformationForm = new FormGroup(this.providerInformationFormValidations);
    $(document).ready(function () {
      $("#common-grid-btn").click(function () {
        $("#common-grid").hide();
        $("#editProGrid").hide();
      });
      $("#common-grid-btn").click(function () {
        $("#hospital-Information").show();
      });
      $(".mu-adduser-save").click(function () {
        $("#common-grid").show();
        $("#editProGrid").show();
      });
      $(".mu-adduser-cancels").click(function () {
        $("#common-grid").show();
        $("#editProGrid").show();
      });
      $("#common-grid-btn").click(function () {
        $("#hospital-Information").css("display", "block");
      });
      $(".mu-adduser-save").click(function () {
        $("#hospital-Information").css("display", "none");
      });
      $(".mu-adduser-cancels").click(function () {
        $("#hospital-Information").css("display", "none");
      });
    });
  }

  ngOnDestroy(): void {
    this.appService.clearInsertedRowData();
  }

  key;
  gridApi: GridApi;
  providerGridOptions: GridOptions;
  showGrid: boolean = true;
  countries: any[] = [];
  providerLookups: any[] = [];
  providers: any[] = [];
  selectedProvider: Object = {};
  states: any[] = [];
  hospitals: any[] = [];
  selectedState: any;
  selectedCountry: any;
  selectedHospital: any;
  selectedGender: any;
  selectedProviders: any;

  genders = [
    { name: 'Male' },
    { name: 'Female' }
  ];

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
    { headerName: 'First Name', field: 'firstName', sortable: true, resizable: true, filter: true },
    { headerName: 'Last Name', field: 'lastName', sortable: true, resizable: true, filter: true },
    { headerName: 'DEA Number', field: 'deaNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'License', field: 'licenseNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Gender', field: 'genderCode', sortable: true, resizable: true, filter: true },
    { headerName: 'Provider Type', field: 'providerLookupTypeModel.providerTypeDesc', sortable: true, resizable: true, filter: true },
    { headerName: 'Speciality', field: 'speciality', sortable: true, resizable: true, filter: true },
    { headerName: 'Credit', field: 'credit', sortable: true, resizable: true, filter: true },
    { headerName: 'Hospital Name', field: 'hospitalId.hospitalName', sortable: true, resizable: true, filter: true },
    { headerName: 'Phone', field: 'phoneNumber', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor },
    { headerName: 'Email', field: 'emailId', sortable: true, resizable: true, filter: true },
    { headerName: 'Country', field: 'country.countryName', sortable: true, resizable: true, filter: true },
    { headerName: 'State', field: 'state.provinceName', sortable: true, resizable: true, filter: true },
    { headerName: 'City', field: 'cityName', sortable: true, resizable: true, filter: true },
    { headerName: 'Pin Code', field: 'zipCode', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor },
    { headerName: 'Address Line 1', field: 'addressLine1', sortable: true, resizable: true, filter: true },
    { headerName: 'Status', field: 'Status', sortable: true, resizable: true, filter: true }
  ];

  onGridReady(params) {
    this.gridApi = params.api;
  }
  reset() {
    this.providerInformationForm.reset();
    this.providerInformationForm.controls.activeS.setValue('Y');
  }

  resetGrid() {
    this.getGridRowData();
  }

  rowData = [];

  rowSelection(params: any) {
    if (!params.node.selected) {
      let resetData = this.appService.getInsertedRowData()
        .find(dataRow => dataRow.providerId === params.data.providerId);
      params.node.setData(JSON.parse(JSON.stringify(resetData)));
    }
  }
	/**
    * Grid Changes
    * End
    */

  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.providerGridOptions.api.setQuickFilter($event.target.value);
    if (this.providerGridOptions.api.getDisplayedRowCount() == 0) {
      this.providerGridOptions.api.showNoRowsOverlay();
    } else {
      this.providerGridOptions.api.hideOverlay();
    }
  }

  editGrid() {
    this.onProviderSelected(this.providerGridOptions.api.getSelectedRows()[0].providerId);
  }

  getHospitals() {
    this.providerService.getHospitals().subscribe(
      getHospitalResponse => {
        if (getHospitalResponse instanceof Object) {
          if (getHospitalResponse['responseStatus']['code'] === 200) {
            this.hospitals = getHospitalResponse['result'];
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
          }
        } else {
          this.toasterService.error('Please contact Administrator', 'Error Occurred', {
            timeOut: 5000
          })
        }
      }
    )
  }


  onProviderSelected(providerId: string) {
    this.selectedProvider = this.providers.find(provider => provider['providerId'] == providerId);
    this.providerService.getProvinces(this.selectedProvider['country']).subscribe(
      getProvincesResponse => {
        if (getProvincesResponse instanceof Object) {
          if (getProvincesResponse['responseStatus']['code'] === 200) {
            this.states = getProvincesResponse['result'];
            let providerFormValues: Object = {
              providerId: this.selectedProvider['providerId'],
              firstName: this.selectedProvider['firstName'],
              lastName: this.selectedProvider['lastName'],
              middleName: this.selectedProvider['middleName'],
              phoneNumber: this.selectedProvider['phoneNumber'],
              emailId: this.selectedProvider['emailId'],
              addressLine1: this.selectedProvider['addressLine1'],
              country: this.selectedProvider['country'],
              state: this.selectedProvider['state'],
              addressLine2: this.selectedProvider['addressLine2'],
              cityName: this.selectedProvider['cityName'],
              credit: this.selectedProvider['credit'],
              licenseNumber: this.selectedProvider['licenseNumber'],
              deaNumber: this.selectedProvider['deaNumber'],
              genderCode: this.selectedProvider['genderCode'],
              speciality: this.selectedProvider['speciality'],
              zipCode: this.selectedProvider['zipCode'],
              providerLookupTypeModel: this.selectedProvider['providerLookupTypeModel'],
              activeS: this.selectedProvider['activeS'],
              hospitalId: this.selectedProvider['hospitalId'],
            }
            this.selectedCountry = this.selectedProvider['country'];
            this.getProvinces(this.selectedCountry);
            this.selectedState = this.selectedProvider['state'];
            this.selectedHospital = this.selectedProvider['hospitalId'];
            this.selectedGender = this.selectedProvider['genderCode'];
            this.selectedProviders = this.selectedProvider['providerLookupTypeModel'];

            this.providerInformationForm.setValue(providerFormValues);
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
    this.showGrid = true;
    this.providerService.getRowDataFromServer().subscribe(
      gridRowDataResponse => {
        if (gridRowDataResponse instanceof Object) {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridRowDataResponse['result'];
            this.providers = this.rowData;
            for (let i = 0; i < this.providers.length; i++) {
              if (this.providers[i].activeS == 'Y') {
                this.providers[i].Status = 'Active'
              }
              else if (this.providers[i].activeS == 'N') {
                this.providers[i].Status = 'DeActive'
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
    this.providerService.getCountries().subscribe(
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

  getProviderLookup() {
    this.providerService.getProviderTypeLookup().subscribe(
      getProviderTypeLookupResponse => {
        if (getProviderTypeLookupResponse instanceof Object) {
          if (getProviderTypeLookupResponse['responseStatus']['code'] === 200) {
            this.providerLookups = getProviderTypeLookupResponse['result'];
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
    this.providerService.getProvinces(country).subscribe(
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

  updateFormChanges(providerInformationForm: Object) {
    this.showGrid = true;
    this.providerInformationForm.get('firstName').setErrors({ 'incorrect': true })
    this.spinnerService.show();
    this.providerService.updateRowData(providerInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.providerInformationForm.reset();
            this.spinnerService.hide();
            this.providerInformationForm.patchValue({
              'country': '',
              'state': '',
              'genderCode': '',
              'providerLookupTypeModel': '',
              'hospitalId': ''
            });
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });

            this.selectedState = undefined;
            this.selectedCountry = undefined;
            this.selectedGender = undefined;
            this.showGrid = true;
            this.key = null;
            this.getGridRowData();
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
	/**
	 * Service Changes
	 * End
	 */


	/**
	 * Form Changes
	 * Start
	 */

  providerInformationForm: FormGroup;
  providerInformationFormValidations = {
    providerId: new FormControl(''),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    middleName: new FormControl(''),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    emailId: new FormControl('', [Validators.required, Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)]),
    addressLine1: new FormControl('', [Validators.required]),
    country: new FormControl([], [Validators.required]),
    state: new FormControl('', [Validators.required]),
    addressLine2: new FormControl(''),
    cityName: new FormControl(''),
    credit: new FormControl(''),
    licenseNumber: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
    deaNumber: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
    genderCode: new FormControl('', [Validators.required]),
    speciality: new FormControl(''),
    zipCode: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    providerLookupTypeModel: new FormControl('', [Validators.required]),
    activeS: new FormControl('Y'),
    hospitalId: new FormControl('')
  };

  onSubmit() {
    let payload = Object.assign({}, this.providerInformationForm.value);

    payload['country'] = this.selectedCountry;
    payload['state'] = this.selectedState;
    payload['providerLookupTypeModel'] = this.selectedProviders;
    payload['hospitalId'] = this.selectedHospital;
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    if (this.selectedGender instanceof Object) {
      payload['genderCode'] = (this.selectedGender['name'] == 'Male' || this.selectedGender['name'] == 'M') ? 'M' : 'F';
    }
    this.updateFormChanges(payload);
  }

  onCountrySelected(event: Event) {
    this.getProvinces(this.selectedCountry);
  }

  checkFormDisability() {
    return (this.providerInformationForm.get('firstName').errors instanceof Object)
      || (this.providerInformationForm.get('lastName').errors instanceof Object)
      || (this.providerInformationForm.get('licenseNumber').errors instanceof Object)
      || (this.providerInformationForm.get('addressLine1').errors instanceof Object)
      || (this.providerInformationForm.get('phoneNumber').errors instanceof Object)
      || this.providerInformationForm.get('emailId').invalid
      || this.providerInformationForm.get('phoneNumber').invalid
      || this.providerInformationForm.get('licenseNumber').invalid
      || this.providerInformationForm.get('speciality').invalid
      || (this.providerInformationForm.get('zipCode').errors instanceof Object)
      || this.providerInformationForm.get('zipCode').invalid

  }
	/**
	 * Form Changes
	 * End
	 */
  search() {
    if (this.key != null && this.key != undefined && this.key != '') {
      this.providerService.getProviderBySearch(this.key).subscribe(manufacturerRes => {
        if (manufacturerRes["responseStatus"]["code"] === 200) {
          this.rowData = manufacturerRes['result'];
          if (this.rowData.length == 0) {
            this.toasterService.warning("No Data Found With Search Criteria", "No Data To Show", {
              timeOut: 3000
            })
          }

        }
      },
        error => {
          this.rowData = [];
          this.toasterService.error("Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            });
        })
    }
    else {
      this.getGridRowData();
    }
  }
}
