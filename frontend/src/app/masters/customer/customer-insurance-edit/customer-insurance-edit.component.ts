import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../shared/customer.service';
import { InsuranceService } from '../../insurance/shared/insurance.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { GridOptions, ColDef, GridApi } from 'ag-grid-community';
import { EndDateValidator } from 'src/app/core/DOB Validator/endDate-validator';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-customer-insurance-edit',
  templateUrl: './customer-insurance-edit.component.html',
  styleUrls: ['./customer-insurance-edit.component.scss'],
  providers: [CustomerService, InsuranceService]
})

export class CustomerInsuranceEditComponent implements OnInit {

  constructor(private customerService: CustomerService, private insuranceService: InsuranceService, private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService
  ) {
    this.customerInsuranceGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };

    this.customerInsuranceGridOptions.rowSelection = 'single';
    this.customerInsuranceGridOptions.columnDefs = this.columnDefs;
    this.getPoliciesData();
    this.getCustomersData();

    this.customerInsuranceGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }
  }

  ngOnInit() {
    this.customerInsuranceInformationForm = new FormGroup(this.customerInsuranceInformationFormValidations);
    $(document).ready(function () {

      $("#common-grid-btn").click(function () {
        $("#common-grid").hide();
        $("#custInsurGrid").hide();
      });
      $("#common-grid-btn").click(function () {
        $("#hospital-Information").show();
      });

      $(".mu-adduser-save").click(function () {
        $("#common-grid").show();
        $("#custInsurGrid").show();
      });

      $(".mu-adduser-cancels").click(function () {
        $("#common-grid").show();
        $("#custInsurGrid").show();
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


  searchKey;
  gridApi: GridApi;
  customerInsuranceGridOptions: GridOptions;
  showGrid: boolean = true;
  showForm: boolean = false;
  name: string = "";
  policies: any[] = [];

  customers: any[] = [];
  customer: any[] = [];
  selectedCustomer: Object = {};
  selectedCustomerInsurance: Object = {};
  policySelected: any;

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
    { headerName: 'Policy Code', field: 'policyCode', sortable: true, resizable: true, filter: true },
    { headerName: 'Policy Number', field: 'customerPolicyNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Customer Name', field: 'customerName', sortable: true, resizable: true, filter: true },
    { headerName: 'Start Date', field: 'policyStartDate', sortable: true, resizable: true, filter: true },
    { headerName: 'End Date', field: 'policyEndDate', sortable: true, resizable: true, filter: true },
    { headerName: 'Duration', field: 'policyDurationInMonths', sortable: true, resizable: true, filter: true },
    { headerName: 'Contribution %', field: 'contributionPercentage', sortable: true, resizable: true, filter: true },
    { headerName: 'Medics', field: 'medicinesNotCovered', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount Limit', field: 'policyAmountLimit', sortable: true, resizable: true, filter: true }
  ];


  onGridReady(params) {
    this.gridApi = params.api;
  }

  resetGrid() {
    this.getGridRowData();
  }

  rowData = [];
  reset() {
    this.customerInsuranceInformationForm.controls.activeS.setValue('Y');
  }


  getPoliciesData() {
    this.insuranceService.getRowDataFromServerToMapCustomer().subscribe(
      getInsuranceResponse => {
        if (getInsuranceResponse instanceof Object) {
          if (getInsuranceResponse['responseStatus']['code'] === 200) {
            this.policies = getInsuranceResponse['result'];
          }
          else {
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

  getCustomersData() {
    this.customerService.getRowDataFromServerToMapMembership().subscribe(
      getCustomerResponse => {
        if (getCustomerResponse instanceof Object) {
          if (getCustomerResponse['responseStatus']['code'] === 200) {
            this.customer = getCustomerResponse['result'];
          }
          else {
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



  editGrid() {
    this.onCustomerInsuranceSelected(this.customerInsuranceGridOptions.api.getSelectedRows()[0].customerInsuranceId);
  }

  onCustomerInsuranceSelected(customerInsuranceId: string) {
    this.selectedCustomerInsurance = this.customers.find(cust => cust['customerInsuranceId'] === customerInsuranceId);

    let customerFormValues: Object = {
      customerInsuranceId: this.selectedCustomerInsurance['customerInsuranceId'],
      policyAmountLimit: this.selectedCustomerInsurance['policyAmountLimit'],
      policyEndDate: this.selectedCustomerInsurance['policyEndDate'],
      policyStartDate: this.selectedCustomerInsurance['policyStartDate'],
      medicinesNotCovered: this.selectedCustomerInsurance['insuranceModel']['medicinesNotCovered'],
      policyDurationInMonths: this.selectedCustomerInsurance['policyDurationInMonths'],
      contributionPercentage: this.selectedCustomerInsurance['contributionPercentage'],
      customerPolicyNumber: this.selectedCustomerInsurance['customerPolicyNumber'],
      policyCode: this.selectedCustomerInsurance['policyCode'],
      customerName: this.selectedCustomerInsurance['customerName'],
      activeS:this.selectedCustomerInsurance['activeS']
    }
    this.policySelected = this.selectedCustomerInsurance['policyCode'];
    this.selectedCustomer = this.selectedCustomerInsurance['customerName'];
    this.customerInsuranceInformationForm.setValue(customerFormValues);
  }


  diff_months(dt2, dt1) {
    let d1 = new Date(dt1);
    let d2 = new Date(dt2);
    var diff = (d2.getTime() - d1.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7 * 4);
    return Math.abs(Math.round(diff));
  }

  modelChanged(event) {
    this.customerInsuranceInformationForm.get('policyDurationInMonths').setValue(0);
  }

  selectedStartDate(event: Event) {
    if (this.customerInsuranceInformationForm.get('policyStartDate').value &&
      this.customerInsuranceInformationForm.get('policyEndDate').value) {
      let months = this.diff_months(this.customerInsuranceInformationForm.get('policyStartDate').value,
        this.customerInsuranceInformationForm.get('policyEndDate').value);

      this.customerInsuranceInformationForm.get('policyDurationInMonths').setValue(months);
    }
  }

  checkCustomerInsuranceFormDisability() {
    return (this.customerInsuranceInformationForm.get('policyCode').errors instanceof Object)
      || (this.customerInsuranceInformationForm.get('customerPolicyNumber').errors instanceof Object)
  }

  getGridRowData() {
    this.showGrid = true;
    this.customerService.getInsuranceRowDataFromServer().subscribe(
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
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
          }
          this.showGrid = true;
        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
        }
      }
    );
  }

  updateFormChanges(customerInsuranceInformationForm: Object) {
    this.showGrid = true;
    this.customerInsuranceInformationForm.get('customerPolicyNumber').setErrors({ 'incorrect': true })
    this.spinnerService.show();
    this.customerService.updateCustomerInsurance(customerInsuranceInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.customerInsuranceInformationForm.reset();
            this.spinnerService.hide();
            this.customerInsuranceInformationForm.controls.activeS.setValue('Y');
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
            this.selectedCustomer = undefined;
            this.policySelected = undefined;
            this.searchKey = null;
            this.getGridRowData();
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

  customerInsuranceInformationForm: FormGroup;
  customerInsuranceInformationFormValidations = {
    customerInsuranceId: new FormControl(''),
    policyCode: new FormControl('', [Validators.required]),
    customerPolicyNumber: new FormControl('', [Validators.required]),
    customerName: new FormControl(''),
    policyStartDate: new FormControl(''),
    policyEndDate: new FormControl('', [Validators.required, EndDateValidator]),
    medicinesNotCovered: new FormControl(''),
    policyDurationInMonths: new FormControl(''),
    contributionPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
    policyAmountLimit: new FormControl('', [Validators.pattern(/(\+(?:[0-9] ?){2,5}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{2,5})|(\+\([\d]{1,3}\)\s)([\d]{2,5})|(\([\d]{1,3}\)\s)([\d]{2,5})|(\([\d]{1,3}\))([\d]{2,5})|([\d]{1,3})([\d]{2,5})|(\([\d]{1,3}\)[-])([\d]{2,5})|([\d]{1,3}\s)([\d]{2,5})|([\d]{1,3}[-])([\d]{2,5})|(\+[\d]{1,3}\s)([\d]{2,5})|(\+[\d]{1,3})([\d]{2,5})|(\+[\d]{1,3}[-])([\d]{2,5})|([\d]{2,5})|(\s)+))$/)]),
    activeS: new FormControl('Y')
  };
  newSelectedInsurance: any;

  onInsuranceSelected(event: Event) {
    this.policySelected = event;
    this.customerInsuranceInformationForm.patchValue({
      policyCode: this.policySelected['policyCode'],
      policyAmountLimit: this.policySelected['policyAmountLimit'],
      policyEndDate: this.policySelected['policyEndDate'],
      policyStartDate: this.policySelected['policyStartDate'],
      medicinesNotCovered: this.policySelected['medicinesNotCovered'],
      policyDurationInMonths: this.policySelected['policyDurationInMonths'],
      contributionPercentage: this.policySelected['contributionPercentage'],
      activeS: this.policySelected['activeS']
    });
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

  onCustomerInsuranceSubmit() {
    let payload = Object.assign({}, this.customerInsuranceInformationForm.value);
    payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
    payload['insuranceModel'] = this.selectedCustomerInsurance['insuranceModel'];
    payload['customerModel'] = this.selectedCustomerInsurance['customerModel'];
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    this.updateFormChanges(payload);
  }


  /**
   * Form Changes
   * End
   */

  //i left heree tarun 25/01/2020 22:21 pm
  search() {
    if (this.searchKey != null && this.searchKey != undefined) {
      this.insuranceService.getInsurencesBySearchKey(this.searchKey).subscribe(
        gridRowDataResponse => {
          if (gridRowDataResponse instanceof Object) {
            if (gridRowDataResponse['responseStatus']['code'] === 200) {
              this.rowData = gridRowDataResponse['result'];
              this.customers = this.rowData;
              if (this.rowData.length == 0) {
                this.toasterService.warning('No Data Found With Search Criteria', 'No Data Found', {
                  timeOut: 5000
                }
                );
              }
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
    else {
      this.getGridRowData();
    }
  }

}
