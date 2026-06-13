import { ToastrService } from 'ngx-toastr';
import { HospitalService } from './../shared/hospital.service';
import { ColDef, GridOptions } from 'ag-grid-community';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-edit-hospital',
  templateUrl: './edit-hospital.component.html',
  styleUrls: ['./edit-hospital.component.scss'],
  providers: [HospitalService]
})

export class EditHospitalComponent implements OnInit {

  constructor(private hospitalService: HospitalService,
    private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.hospitalGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.hospitalGridOptions.rowSelection = 'single';
    this.hospitalGridOptions.columnDefs = this.columnDefs;
    this.getHospitalData();
    this.getCountries();

    this.hospitalGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }
  }

  ngOnInit() {
    this.hospitalInformationForm = new FormGroup(this.hospitalInformationFormValidations)
    $(document).ready(function () {
      $("#common-grid-btn").click(function () {
        $("#common-grid").hide();
        $("#editHospitalGrid").hide();
      });
      $("#common-grid-btn").click(function () {
        $("#hospital-Information").show();
      });

      $(".mu-adduser-save").click(function () {
        $("#common-grid").show();
        $("#editHospitalGrid").show();
      });

      $("#mu-adduser-cancel").click(function () {
        $("#common-grid").show();
        $("#editHospitalGrid").show();
      });
      $("#common-grid-btn").click(function () {
        $("#hospital-Information").css("display", "block");
      });
      $(".mu-adduser-save").click(function () {
        $("#hospital-Information").css("display", "none");
      });
      $("#mu-adduser-cancel").click(function () {
        $("#hospital-Information").css("display", "none");
      });

    });
  }

  ngOnDestroy(): void {


  }


	/**
	 * Grid Changes
	 * Start
	 */
  hospitalGridOptions: GridOptions;
  showGrid: boolean = false;

  key;

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
    { headerName: 'Hospital Name', field: 'hospitalName', sortable: true, resizable: true, filter: true },
    { headerName: 'License', field: 'license', sortable: true, resizable: true, filter: true },
    { headerName: 'Address Line 1', field: 'addressLine1', sortable: true, resizable: true, filter: true },
    { headerName: 'Address Line 2', field: 'addressLine2', sortable: true, resizable: true, filter: true },
    { headerName: 'City ', field: 'cityName', sortable: true, resizable: true, filter: true },
    { headerName: 'Country', field: 'country.countryName', sortable: true, resizable: true, filter: true },
    { headerName: 'State ', field: 'state.provinceName', sortable: true, resizable: true, filter: true },
    { headerName: 'Pincode', field: 'zipCode', sortable: true, resizable: true, filter: true },
    { headerName: 'Phone Number', field: 'phoneNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Fax Number', field: 'fax', sortable: true, resizable: true, filter: true },
    { headerName: 'Email ', field: 'emailId', sortable: true, resizable: true, filter: true },
    { headerName: 'Website ', field: 'website', sortable: true, resizable: true, filter: true },
    { headerName: 'Helpline Number', field: 'helpLine', sortable: true, resizable: true, filter: true },
    { headerName: 'Status', field: 'Status', sortable: true, resizable: true, filter: true }

  ];

  reset() {
    this.hospitalInformationForm.reset();
    this.hospitalInformationForm.controls.activeS.setValue('Y');

  }

  editGrid() {
    this.onHospitalSelected(this.hospitalGridOptions.api.getSelectedRows()[0].hospitalName);
  }

  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.hospitalGridOptions.api.setQuickFilter($event.target.value);
    if (this.hospitalGridOptions.api.getDisplayedRowCount() == 0) {
      this.hospitalGridOptions.api.showNoRowsOverlay();
    } else {
      this.hospitalGridOptions.api.hideOverlay();
    }
  }

	/**
	 * Grid Changes
	 * End
	 */

	/**
	 * Form Changes
	 * Start
	 */

  showForm: boolean = false;
  hospitals: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  selectedCountry: any;
  selectedState: any;


  hospitalName: string = "";
  selectedHospital: Object = {};
  hospitalInformationForm: FormGroup;
  hospitalInformationFormValidations = {
    hospitalName: new FormControl('', [Validators.required]),
    license: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    emailId: new FormControl('', [Validators.email, Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)]),
    addressLine1: new FormControl('', [Validators.required]),
    country: new FormControl([], [Validators.required]),
    state: new FormControl('', [Validators.required]),
    addressLine2: new FormControl(''),
    fax: new FormControl('', [Validators.pattern(/^\+?[0-9]+$/)]),
    cityName: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    helpLine: new FormControl('', [Validators.pattern(/^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+)$/)]),
    website: new FormControl('', [Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+(.com)|(.co)|(.in)|(.org)|(.ke)+$/)]),
    activeS: new FormControl('Y')
  };

  onSubmit() {
    let payload = Object.assign({}, this.hospitalInformationForm.value);
    payload['lastUpdatedUserId'] = localStorage.getItem('id');
    payload['createdUserId'] = localStorage.getItem('id');
    payload['country'] = this.selectedCountry;
    payload['state'] = this.selectedState;
    payload['hospitalId'] = this.selectedHospital['hospitalId'];
    this.updateHospital(payload);
  }

  onHospitalSelected(hospitalName: string) {
    this.selectedHospital = this.hospitals.find(hospital => hospital['hospitalName'] === hospitalName);
    this.hospitalService.getProvinces(this.selectedHospital['country']).subscribe(
      getProvincesResponse => {
        if (getProvincesResponse instanceof Object) {
          if (getProvincesResponse['responseStatus']['code'] === 200) {
            this.states = getProvincesResponse['result'];
            let hospitalFormValues: Object = {
              hospitalName: this.selectedHospital['hospitalName'],
              license: this.selectedHospital['license'],
              phoneNumber: this.selectedHospital['phoneNumber'],
              emailId: this.selectedHospital['emailId'],
              addressLine1: this.selectedHospital['addressLine1'],
              country: this.selectedHospital['country'],
              state: this.selectedHospital['state'],
              addressLine2: this.selectedHospital['addressLine2'],
              fax: this.selectedHospital['fax'],
              cityName: this.selectedHospital['cityName'],
              zipCode: this.selectedHospital['zipCode'],
              helpLine: this.selectedHospital['helpLine'],
              website: this.selectedHospital['website'],
              activeS: this.selectedHospital['activeS']
            }

            this.selectedCountry = this.selectedHospital['country'];
            this.getProvinces(this.selectedCountry);
            this.selectedState = this.selectedHospital['state']

            this.hospitalInformationForm.setValue(hospitalFormValues);
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

  checkFormDisability() {
    return (this.hospitalInformationForm.get('hospitalName').errors instanceof Object)
      || (this.hospitalInformationForm.get('cityName').errors instanceof Object)
      || (this.hospitalInformationForm.get('license').errors instanceof Object)
      || (this.hospitalInformationForm.get('addressLine1').errors instanceof Object)
      || (this.hospitalInformationForm.get('phoneNumber').errors instanceof Object)
      || this.hospitalInformationForm.get('emailId').invalid
      || this.hospitalInformationForm.get('phoneNumber').invalid
      || this.hospitalInformationForm.get('helpLine').invalid
      || this.hospitalInformationForm.get('website').invalid
      || (this.hospitalInformationForm.get('zipCode').errors instanceof Object)
      || this.hospitalInformationForm.get('zipCode').invalid
  }

	/**
	 * Form Changes
	 * End
	 */

	/**
	 * Service Changes
	 * Start
	 */

  rowData = [];
  getHospitalData() {
    this.showGrid = true;
    this.hospitalService.getRowDataFromServer().subscribe(
      getHospitalDataResponse => {
        if (getHospitalDataResponse instanceof Object) {
          if (getHospitalDataResponse['responseStatus']['code'] === 200) {
            this.rowData = getHospitalDataResponse['result'];
            this.hospitals = this.rowData;
            for (let i = 0; i < this.hospitals.length; i++) {
              if (this.hospitals[i].activeS == 'Y') {
                this.hospitals[i].Status = 'Active'
              }
              else if (this.hospitals[i].activeS == 'N') {
                this.hospitals[i].Status = 'DeActive'
              }
            }

            this.rowData = getHospitalDataResponse['result'];
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
    this.hospitalService.getCountries().subscribe(
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
    this.hospitalService.getProvinces(country).subscribe(
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

  updateHospital(hospitalInformationForm: Object) {
    this.hospitalInformationForm.get('hospitalName').setErrors({ 'incorrect': true });
    this.spinnerService.show();
    this.hospitalService.updateHospital(hospitalInformationForm).subscribe(
      updateHospitalResponse => {
        if (updateHospitalResponse instanceof Object) {
          if (updateHospitalResponse['responseStatus']['code'] === 200) {
            this.hospitalInformationForm.reset();
            this.spinnerService.hide();
            this.hospitalInformationForm.controls.activeS.setValue('Y');
            this.toasterService.success(updateHospitalResponse['message'], 'Success', {
              timeOut: 3000
            });
            this.selectedState = undefined;
            this.selectedCountry = undefined;
            this.key = null;
            this.getHospitalData();
            this.showGrid = true;
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

  checkHospitalName() {
    if (this.hospitals instanceof Array && typeof this.hospitalName === 'string') {
      return this.hospitals
        .filter(hospital => hospital.hospitalId !== this.selectedHospital['hospitalId'] && typeof hospital.hospitalName === 'string')
        .map(x => x.hospitalName)
        .some((name: string) => name.trim().toLowerCase() === this.hospitalName.trim().toLowerCase());
    }
  }

	/**
	 * Service Changes
	 * End
	 */
  search() {
    if (this.key != null && this.key != undefined && this.key != '') {
      this.hospitalService.getHospitalDataByName(this.key).subscribe(hospitalRes => {
        if (hospitalRes["responseStatus"]["code"] === 200) {
          this.rowData = hospitalRes['result'];

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
          this.toasterService.warning("Please contact administrator",
            "Error Occurred",
            {
              timeOut: 3000
            });
        })
    }
    else {
      this.getHospitalData();
    }
  }
}
