import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../shared/customer.service';
import { MembershipService } from '../../membership/shared/membership.service';
import * as $ from 'jquery';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  GridOptions, ColDef, GridApi
} from 'ag-grid-community';
import { EndDateValidator } from 'src/app/core/DOB Validator/endDate-validator';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-customer-membership-edit',
  templateUrl: './customer-membership-edit.component.html',
  styleUrls: ['./customer-membership-edit.component.scss'],
  providers: [CustomerService, MembershipService]
})
export class CustomerMembershipEditComponent implements OnInit {

  constructor(private customerService: CustomerService, private membershipService: MembershipService, private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService
  ) {

    this.customerMembershipGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.showGrid = true;
    this.getMembershipsData();
    this.getCustomersData();
    this.customerMembershipGridOptions.rowSelection = 'single';
    this.customerMembershipGridOptions.columnDefs = this.columnDefs;

    this.customerMembershipGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }
  }

  ngOnInit() {
    this.customerMembershipInformationForm = new FormGroup(this.customerMembershipInformationFormValidations);
    $(document).ready(function () {

      $("#common-grid-btn").click(function () {
        $("#common-grid").hide();
        $("#editCustMemGrid").hide();
      });
      $("#common-grid-btn").click(function () {
        $("#hospital-Information").show();
      });

      $("#mu-adduser-save").click(function () {
        $("#common-grid").show();
        $("#editCustMemGrid").show();
      });

      $("#mu-adduser-cancels").click(function () {
        $("#common-grid").show();
        $("#editCustMemGrid").show();
      });
      $("#common-grid-btn").click(function () {
        $("#hospital-Information").css("display", "block");
      });
      $("#mu-adduser-save").click(function () {
        $("#hospital-Information").css("display", "none");
      });
      $("#mu-adduser-cancels").click(function () {
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



  customerMembershipInformationForm: FormGroup;
  customerMembershipInformationFormValidations = {
    customerMembershipId: new FormControl(''),
    membershipModel: new FormControl('', Validators.required),
    membershipCardName: new FormControl(''),
    customerModel: new FormControl('', Validators.required),
    membershipCardNumber: new FormControl('', [Validators.required]),
    membershipStartDate: new FormControl(''),
    membershipEndDate: new FormControl('', [EndDateValidator]),
    membershipDurationInMonths: new FormControl(''),
    membershipCreditAmount: new FormControl('', [Validators.pattern(/(\+(?:[0-9] ?){2,5}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{2,5})|(\+\([\d]{1,3}\)\s)([\d]{2,5})|(\([\d]{1,3}\)\s)([\d]{2,5})|(\([\d]{1,3}\))([\d]{2,5})|([\d]{1,3})([\d]{2,5})|(\([\d]{1,3}\)[-])([\d]{2,5})|([\d]{1,3}\s)([\d]{2,5})|([\d]{1,3}[-])([\d]{2,5})|(\+[\d]{1,3}\s)([\d]{2,5})|(\+[\d]{1,3})([\d]{2,5})|(\+[\d]{1,3}[-])([\d]{2,5})|([\d]{2,5})|(\s)+))$/)]),
    membershipCreditDays: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    membershipDiscountPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
    membershipBonusPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
    activeS: new FormControl('Y'),
  };

  searchKey
  rowData = [];
  gridApi: GridApi;
  customerMembershipGridOptions: GridOptions;
  showGrid: boolean = true;
  customer: any[] = [];
  selectedCustomer: Object;
  membershipCardNumber: string;
  showForm: boolean = false;
  name: string = "";
  custmMembership: any[] = [];
  customers: any[] = [];
  selectedMembership: Object = {};
  memberships: any[] = [];
  customerMemberships: any[] = [];

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
    { headerName: 'Membership Card Name', field: 'membershipCardName', sortable: true, resizable: true, filter: true },
    { headerName: 'Membership Card Number', field: 'membershipCardNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Customer Name', field: 'customerModel.customerName', sortable: true, resizable: true, filter: true },
    { headerName: 'Start Date', field: 'membershipStartDate', sortable: true, resizable: true, filter: true },
    { headerName: 'End Date', field: 'membershipEndDate', sortable: true, resizable: true, filter: true },
    { headerName: 'Duration', field: 'membershipDurationInMonths', sortable: true, resizable: true, filter: true },
    { headerName: 'Disc %', field: 'membershipDiscountPercentage', sortable: true, resizable: true, filter: true },
    { headerName: 'Bonus % ', field: 'membershipBonusPercentage', sortable: true, resizable: true, filter: true },
    { headerName: 'Credit Amount', field: 'membershipCreditAmount', sortable: true, resizable: true, filter: true },
    { headerName: 'Credit Days', field: 'membershipCreditDays', sortable: true, resizable: true, filter: true },
  ];


  onGridReady(params) {
    this.gridApi = params.api;
  }

  resetGrid() {
    this.getMembershipsData();
    this.getGridRowData();
  }

  reset() {
    this.customerMembershipInformationForm.reset();
    this.customerMembershipInformationForm.controls.activeS.setValue('Y');
  }

  editGrid() {
    this.onCustomerMembershipSelected(this.customerMembershipGridOptions.api.getSelectedRows()[0].customerMembershipId);
  }


  onCustomerMembershipSelected(customerMembershipId: string) {

    this.selectedMembership = this.customerMemberships.find(customerMembership => customerMembership['customerMembershipId'] === customerMembershipId);
    let customerMembershipFormValues: Object = {
      customerMembershipId: this.selectedMembership['customerMembershipId'],
      membershipCardNumber: this.selectedMembership['membershipCardNumber'],
      membershipCardName: this.selectedMembership['membershipCardName'],
      membershipStartDate: this.selectedMembership['membershipStartDate'],
      membershipEndDate: this.selectedMembership['membershipEndDate'],
      membershipDurationInMonths: this.selectedMembership['membershipDurationInMonths'],
      membershipDiscountPercentage: this.selectedMembership['membershipDiscountPercentage'],
      membershipBonusPercentage: this.selectedMembership['membershipBonusPercentage'],
      membershipCreditAmount: this.selectedMembership['membershipCreditAmount'],
      membershipCreditDays: this.selectedMembership['membershipCreditDays'],
      membershipModel: this.selectedMembership['membershipModel'],
      customerModel: this.selectedMembership['customerModel'],
      activeS: this.selectedMembership['activeS']
    }

    this.customerMembershipInformationForm.setValue(customerMembershipFormValues);

  }
  onCustomerMemberShipSubmit() {
    let payload = Object.assign({}, this.customerMembershipInformationForm.value);
    payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');

    this.updateFormChanges(payload);
  }

  onChangeCustomer(event) {
    this.selectedCustomer = event;
  }


  updateFormChanges(customerMembershipInformationForm: Object) {
    this.showGrid = true;
    this.customerMembershipInformationForm.get('membershipCardNumber').setErrors({ 'incorrect': true })
    this.spinnerService.show();
    this.customerService.updateCustomerMembership(customerMembershipInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.customerMembershipInformationForm.reset();
            this.spinnerService.hide();
            this.customerMembershipInformationForm.controls.activeS.setValue('Y');
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });

            this.selectedMembership = undefined;
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



  changedMembership: any;
  onMembershipSelected(event) {
    this.changedMembership = event;
  }

  getGridRowData() {
    this.showGrid = true;
    this.customerService.getMembershipRowDataFromServer().subscribe(
      gridRowDataResponse => {
        if (gridRowDataResponse instanceof Object) {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridRowDataResponse['result'];
            this.customerMemberships = this.rowData;
            for (let i = 0; i < this.customerMemberships.length; i++) {
              if (this.customerMemberships[i].activeS == 'Y') {
                this.customerMemberships[i].Status = 'Active'
              }
              else if (this.customerMemberships[i].activeS == 'N') {
                this.customerMemberships[i].Status = 'DeActive'
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

  generateMembershipCardNumber() {
    if ((this.changedMembership != null && this.changedMembership != undefined) &&
      (this.changedMembership != null && this.changedMembership != undefined)) {
      let membershipCardNumber = 'DOC' + this.changedMembership['membershipCardName'] +
        this.selectedCustomer['customerId'];
      this.customerMembershipInformationForm.get('membershipCardNumber').setValue(membershipCardNumber);
    }
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

  getMembershipsData() {
    this.membershipService.getRowDataFromServerToMapCustomers().subscribe(
      getmembershipResponse => {
        if (getmembershipResponse instanceof Object) {
          if (getmembershipResponse['responseStatus']['code'] === 200) {
            this.memberships = getmembershipResponse['result'];
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

  diff_months(dt2, dt1) {
    let d1 = new Date(dt1);
    let d2 = new Date(dt2);
    var diff = (d2.getTime() - d1.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7 * 4);
    return Math.abs(Math.round(diff));
  }

  modelChanged(event) {
    this.customerMembershipInformationForm.get('membershipDurationInMonths').setValue(0);
  }

  selectedStartDate(event: Event) {
    if (this.customerMembershipInformationForm.get('membershipStartDate').value &&
      this.customerMembershipInformationForm.get('membershipEndDate').value) {
      let months = this.diff_months(this.customerMembershipInformationForm.get('membershipStartDate').value,
        this.customerMembershipInformationForm.get('membershipEndDate').value);

      this.customerMembershipInformationForm.get('membershipDurationInMonths').setValue(months);
    }
  }

  checkCustomerMemberShipFormDisability() {
    return (this.customerMembershipInformationForm.get('membershipCardName').errors instanceof Object)
      || (this.customerMembershipInformationForm.get('membershipCardNumber').errors instanceof Object)
      || (this.customerMembershipInformationForm.get('membershipBonusPercentage').invalid)
      || (this.customerMembershipInformationForm.get('membershipDiscountPercentage').invalid)
      || (this.customerMembershipInformationForm.get('membershipCreditDays').invalid)
      || (this.customerMembershipInformationForm.get('membershipCreditAmount').invalid)
  }


  search() {
    if (this.searchKey != null && this.searchKey != undefined) {
      this.membershipService.getMembershipDataBySearchKey(this.searchKey).subscribe(
        gridRowDataResponse => {
          if (gridRowDataResponse instanceof Object) {
            if (gridRowDataResponse['responseStatus']['code'] === 200) {
              this.rowData = gridRowDataResponse['result'];
              this.customerMemberships = this.rowData;
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

}
