import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../shared/customer.service';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, ColDef, GridApi } from 'ag-grid-community';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { AppService } from 'src/app/core/app.service';
import { NumericEditor } from 'src/app/core/numeric-editor.component';
import { DobValidator } from 'src/app/core/DOB Validator/dob-validator';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-customer-single-edit',
  templateUrl: './customer-single-edit.component.html',
  styleUrls: ['./customer-single-edit.component.scss'],
  providers: [CustomerService]
})

export class CustomerSingleEditComponent implements OnInit {
  cIdImage = false;
  idImage = undefined;
  constructor(private customerService: CustomerService, private toasterService: ToastrService, private appService: AppService, private spinnerService: Ng4LoadingSpinnerService) {
    this.getCountries();

    this.customerGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.customerGridOptions.rowSelection = 'single';
    this.customerGridOptions.columnDefs = this.columnDefs;

    this.customerGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }

  }

  ngOnInit() {
    this.customerInformationForm = new FormGroup(this.customerInformationFormValidations);
    this.customerIdForm = new FormGroup(this.customerIdFormValidations);
    $(document).ready(function () {

      $("#common-grid-btn").click(function () {
        $("#common-grid").hide();
        $("#editCustGrid").hide();
      });
      $("#common-grid-btn").click(function () {
        $("#customer-Information").show();
      });

      $("#mu-adduser-save").click(function () {
        $("#common-grid").show();
        $("#editCustGrid").show();
      });

      $("#mu-adduser-cancel").click(function () {
        $("#common-grid").show();
        $("#editCustGrid").show();
      });
      $("#common-grid-btn").click(function () {
        $("#customer-Information").css("display", "block");
      });
      $("#mu-adduser-save").click(function () {
        $("#customer-Information").css("display", "none");
      });
      $("#mu-adduser-cancel").click(function () {
        $("#customer-Information").css("display", "none");
      });

    });
  }

  ngOnDestroy(): void {
    this.appService.clearInsertedRowData();
  }

  searchKey;
  paginationSize = 50;
  gridApi: GridApi;
  customerGridOptions: GridOptions;
  showGrid: boolean = true;
  customers: any[] = [];
  countries: any[] = [];

  selectedPharmacy: any;

  states: any[] = [];
  selectedCustomer: Object = {};
  selectedGender: any;
  selectedState: any;
  selectedCountry: any;
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
    { headerName: 'First Name', field: 'customerName', sortable: true, resizable: true, filter: true, },
    { headerName: 'Last Name', field: 'lastName', sortable: true, resizable: true, filter: true, },
    { headerName: 'Gender', field: 'genderCode', sortable: true, resizable: true, filter: true, },
    { headerName: 'Phone', field: 'phoneNumber', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor },
    { headerName: 'Status', field: 'Status', sortable: true, resizable: true, filter: true, },
    { headerName: 'Date Of Birth', field: 'dateOfBirth', sortable: true, resizable: true, filter: true, },
    { headerName: 'Email', field: 'emailId', sortable: true, resizable: true, filter: true, },
    { headerName: 'Country', field: 'country.countryName', sortable: true, resizable: true, filter: true },
    { headerName: 'State', field: 'state.provinceName', sortable: true, resizable: true, filter: true },
    { headerName: 'Address Line 1', field: 'addressLine1', sortable: true, resizable: true, filter: true, },
    { headerName: 'City', field: 'city', sortable: true, resizable: true, filter: true, },
    { headerName: 'Address Line 2', field: 'addressLine2', sortable: true, resizable: true, filter: true, },
    { headerName: 'Pin Code', field: 'pinCode', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor },
    { headerName: 'Credit Limit', field: 'creditLimit', sortable: true, resizable: true, filter: true, },
    { headerName: 'Credit Days', field: 'creditDays', sortable: true, resizable: true, filter: true, },
    { headerName: 'Discount Percentage', field: 'discountPercentage', sortable: true, resizable: true, filter: true, },
    { headerName: 'Discount Amount', field: 'discountAmount', sortable: true, resizable: true, filter: true, },
    { headerName: 'Organisation', field: 'organisation', sortable: true, resizable: true, filter: true, },

  ];

  onGridReady(params) {
    this.gridApi = params.api;
  }

  fileName: any;

  reset() {
    this.customerInformationForm.reset();
    this.customerIdForm.reset();
    this.customerInformationForm.controls.activeS.setValue('Y');
    this.customerInformationForm.get('corporate').setValue('N');
    document.getElementById("addCustomerIdImage")['value'] = "";
    this.cIdImage = false;
    this.idImage = undefined;
    this.uploadingImg = undefined;
    this.fileName = undefined;
    this.imagedata = false;

  }


  resetGrid() {
    // this.getGridRowData();
  }

  rowData = [];

  rowSelection(params: any) {
    if (!params.node.selected) {
      let resetData = this.appService.getInsertedRowData()
        .find(dataRow => dataRow.customerId === params.data.customerId);
      params.node.setData(JSON.parse(JSON.stringify(resetData)));
    }
  }


  public onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.customerGridOptions.api.setQuickFilter($event.target.value);
    if (this.customerGridOptions.api.getDisplayedRowCount() == 0) {
      this.customerGridOptions.api.showNoRowsOverlay();
    } else {
      this.customerGridOptions.api.hideOverlay();
    }
  }

  editGrid() {
    this.onCustomerSelected(this.customerGridOptions.api.getSelectedRows()[0].customerId);

  }


  imagedata = false;
  onCustomerSelected(customerId: string) {
    this.selectedCustomer = this.customers.find(customer => customer['customerId'] == customerId);
    this.customerService.getProvinces(this.selectedCustomer['country']).subscribe(
      getProvincesResponse => {
        if (getProvincesResponse instanceof Object) {
          if (getProvincesResponse['responseStatus']['code'] === 200) {
            this.states = getProvincesResponse['result'];
            let customerFormValues: Object = {
              customerId: this.selectedCustomer['customerId'],
              customerName: this.selectedCustomer['customerName'],
              lastName: this.selectedCustomer['lastName'],
              genderCode: this.selectedCustomer['genderCode'],
              phoneNumber: this.selectedCustomer['phoneNumber'],
              dateOfBirth: this.selectedCustomer['dateOfBirth'],
              emailId: this.selectedCustomer['emailId'],
              country: this.selectedCustomer['country'],
              state: this.selectedCustomer['state'],
              addressLine1: this.selectedCustomer['addressLine1'],
              city: this.selectedCustomer['city'],
              addressLine2: this.selectedCustomer['addressLine2'],
              pinCode: this.selectedCustomer['pinCode'],
              activeS: this.selectedCustomer['activeS'],
              creditLimit: this.selectedCustomer['creditLimit'],
              creditDays: this.selectedCustomer['creditDays'],
              discountPercentage: this.selectedCustomer['discountPercentage'],
              discountAmount: this.selectedCustomer['discountAmount'],
              organisation: this.selectedCustomer['organisation'],
              corporate: this.selectedCustomer['corporate'],
              taxNumber: this.selectedCustomer['taxNumber'],
              contactFirstName: this.selectedCustomer['contactFirstName'],
              contactLastName: this.selectedCustomer['contactLastName']
            }

            this.selectedCountry = this.selectedCustomer['country'];
            this.getProvinces(this.selectedCountry);
            this.selectedState = this.selectedCustomer['state'];
            this.selectedGender = this.selectedCustomer['genderCode'];
            this.customerInformationForm.setValue(customerFormValues);
            if (this.selectedCustomer['corporate'] === 'Y') {
              this.corporateData = true
            } else {
              this.corporateData = false
            }

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

    this.customerService.getCustomerImageByCustomerId(customerId).subscribe(customerImageRes => {

      if (customerImageRes['responseStatus']['code'] === 200) {
        if (customerImageRes['result'])
          this.imagedata = true;
        this.customerIdForm.setValue(customerImageRes['result']);
        if (customerImageRes['result']['customerImage'] != undefined) {
          if (customerImageRes['result']['fileType'] === 'application/pdf') {
            this.cIdImage = false;
            this.fileName = customerImageRes['result']['fileName'];
            this.idImage = customerImageRes['result']['customerImage'];

          } else {

            if (this.customerIdForm.get('customerImage').value) {
              this.cIdImage = true;
              this.idImage = this.customerIdForm.get('customerImage').value;

            }
          }

        }


      }
    });
  }

  onDownloadPdf(event) {
    this.showPdf();
  }

  showPdf() {
    const linkSource = 'data:application/pdf;base64,' + this.idImage;
    const downloadLink = document.createElement("a");
    const fileName = "sample.pdf";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  getGridRowData() {
    this.showGrid = true;
    this.customerService.getRowDataFromServer().subscribe(
      gridRowDataResponse => {
        if (gridRowDataResponse instanceof Object) {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridRowDataResponse['result'];
            this.customers = this.rowData;
            for (let i = 0; i < this.customers.length; i++) {
              if (this.customers[i].activeS == 'Y') {
                this.customers[i].Status = 'Active'
              }
              else if (this.customers[i].activeS == 'N') {
                this.customers[i].Status = 'DeActive'
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
    this.customerService.getCountries().subscribe(
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
    this.customerService.getProvinces(country).subscribe(
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

  updateCustomer(customerInformationForm: Object) {
    this.customerInformationForm.get('customerName').setErrors({ 'incorrect': true });
    this.spinnerService.show();
    this.customerService.updateCustomer(customerInformationForm).subscribe(
      updateCustomerResponse => {
        if (updateCustomerResponse instanceof Object) {
          if (updateCustomerResponse['responseStatus']['code'] === 200) {
            this.customerInformationForm.reset();
            this.spinnerService.hide();
            this.customerInformationForm.controls.activeS.setValue('Y');

            if ((this.customerIdForm.get('customerImage').value != null && this.customerIdForm.get('customerImage').value != undefined) && (this.uploadingImg != null && this.uploadingImg != undefined)) {
              const formData = new FormData();
              formData.append('customerId', updateCustomerResponse['result']['customerId'])
              if (this.customerIdForm.get('customerImagesId').value)
                formData.append('customerImageId', this.customerIdForm.get('customerImagesId').value)
              formData.append('customerImage', this.customerIdForm.get('customerImage').value)
              formData.append('fileName', this.fileName)
              formData.append('fileType', this.fileType)
              this.customerService.updateCustomerImage(formData).subscribe(res => {


              }, error => {

                this.toasterService.error(error.error['message'], 'Error', {
                  timeOut: 3000
                });
              })
            }
            this.toasterService.success(updateCustomerResponse['message'], 'Success', {
              timeOut: 3000
            });

            this.selectedState = undefined;
            this.selectedCountry = undefined;
            this.idImage = undefined;
            this.uploadingImg = undefined;
            this.fileName = undefined;
            this.getGridRowData();
            this.searchKey = null;
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

  customerInformationForm: FormGroup;
  customerInformationFormValidations = {
    customerName: new FormControl('', [Validators.required]),
    lastName: new FormControl(''),
    genderCode: new FormControl(''),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    dateOfBirth: new FormControl('', [Validators.required, DobValidator]),
    customerId: new FormControl(''),
    emailId: new FormControl('', [Validators.email, Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)]),
    country: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    city: new FormControl(''),
    pinCode: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    addressLine1: new FormControl(''),
    addressLine2: new FormControl(''),
    activeS: new FormControl('Y'),
    creditLimit: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    creditDays: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    discountPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
    discountAmount: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    organisation: new FormControl(''),
    corporate: new FormControl('N'),
    taxNumber: new FormControl(''),
    contactFirstName: new FormControl(''),
    contactLastName: new FormControl('')
  };
  customerIdForm: FormGroup;
  customerIdFormValidations = {
    customerImagesId: new FormControl(),
    customerId: new FormControl(),
    customerImage: new FormControl(),
    fileName: new FormControl(),
    fileType: new FormControl()
  }

	/**
    * Grid Changes
    * End
    */



	/**
	 * Service Changes
	 * End
	 */


	/**
	 * Form Changes
	 * Start
	 */


  onCustomerSubmit() {
    let payload = Object.assign({}, this.customerInformationForm.value);
    payload['country'] = this.selectedCountry;
    payload['state'] = this.selectedState;
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
    payload['customerId'] = this.selectedCustomer['customerId'];
    if (this.selectedGender instanceof Object) {
      payload['genderCode'] = this.selectedGender['name'] == 'Male' ? 'M' : 'F';
    }

    this.updateCustomer(payload);
  }

  search() {
    if (this.searchKey != null && this.searchKey != undefined) {
      this.customerService.searchCustomer(this.searchKey).subscribe(
        gridRowDataResponse => {
          if (gridRowDataResponse instanceof Object) {
            if (gridRowDataResponse['responseStatus']['code'] === 200) {
              this.rowData = gridRowDataResponse['result'];
              this.customers = this.rowData;

              for (let i = 0; i < this.customers.length; i++) {
                if (this.customers[i].activeS == 'Y') {
                  this.customers[i].Status = 'Active'
                }
                else if (this.customers[i].activeS == 'N') {
                  this.customers[i].Status = 'DeActive'
                }
              }

              if (this.rowData.length == 0) {
                this.toasterService.warning('No Data Found With Search Criteria', 'No Data To Show', {
                  timeOut: 3000
                }
                );
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
    else {
      this.getGridRowData();
    }

  }
  onCountrySelected(event: Event) {
    let selectedCoutry = this.countries.find(country => country['countryName'] == event.target['value']);
    this.getProvinces(this.selectedCountry);
  }

  checkFormDisability() {
    return (this.customerInformationForm.get('customerName').errors instanceof Object)
      || (this.customerInformationForm.get('dateOfBirth').errors instanceof Object)
      || (this.customerInformationForm.get('dateOfBirth').invalid)
      || (this.customerInformationForm.get('country').errors instanceof Object)
      || (this.customerInformationForm.get('state').errors instanceof Object)
      || (this.customerInformationForm.get('phoneNumber').errors instanceof Object)
      || this.customerInformationForm.get('discountPercentage').invalid
      || this.customerInformationForm.get('creditDays').invalid
  }

	/**
	 * Form Changes
	 * End
	 */

  uploadingImg = undefined;
  fileType: any;

  selectedImage(event) {
    this.customerIdForm.get('customerImage').setValue(event.target.files[0])
    this.uploadingImg = event['target']['files'][0]

    this.fileName = event['target']['files'][0].name;
    this.fileType = event['target']['files'][0].type;
  }

  corporateData: boolean = false;

  onChangeCorporate(event) {
    this.corporateData = true;

  }

  nonCorporate(event) {
    this.corporateData = false;
    // this.resetCorporateFields();

  }


}
