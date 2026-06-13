import { GridOptions, ColDef } from 'ag-grid-community';
import { MasterAccountService } from './masteraccount.service';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  customersList = [];
  selectedMaster = undefined;
  selectedFamily = [];
  masterGridOptions: GridOptions;
  masterColumnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "",
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40,
      checkboxSelection: true
    },
    {
      headerName: 'Account Number', field: 'creditNumber', sortable: true, resizable: true, filter: true
    },
    {
      headerName: 'Customer Name', field: "customerId.customerName", sortable: true, resizable: true, filter: true,
      valueGetter: function (params) {
        return params.data.customerId.customerName + " " + params.data.customerId.lastName
      }
    },
    {
      headerName: 'Credit Limit', field: 'creditLimit', sortable: true, resizable: true, filter: true, width: 120
    },
    {
      headerName: 'Credit Days', field: 'creditDays', sortable: true, resizable: true, filter: true, width: 120
    },
    {
      headerName: 'Credit Limit Left', field: 'creditLimitLeft', sortable: true, resizable: true, filter: true, width: 140
    },
    {
      headerName: 'Credit Days Left', field: 'creditDaysLeft', sortable: true, resizable: true, filter: true, width: 140
    }
  ]

  masterAccounts = [];

  familyGridOptions: GridOptions;
  familyColumnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "",
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40
    },
    {
      headerName: 'Account Number', field: 'creditNumber', sortable: true, resizable: true, filter: true
    },
    {
      headerName: 'Customer Name', field: "customerId.customerName", sortable: true, resizable: true, filter: true,
      valueGetter: function (params) {
        return params.data.customerId.customerName + " " + params.data.customerId.lastName
      }
    },
    {
      headerName: 'Credit Limit', field: 'creditLimit', sortable: true, resizable: true, filter: true,
    },
    {
      headerName: 'Credit Days', field: 'creditDays', sortable: true, resizable: true, filter: true,
    }
  ]

  familyAccounts = [];
  constructor(private toasterService: ToastrService,
    private spinnerService: Ng4LoadingSpinnerService, private masterAccountService: MasterAccountService) {

    this.masterAccountForm = new FormGroup(this.masterAccountFormValidations);
    this.familyAccountForm = new FormGroup(this.familyAccountFormValidations);
    this.getCreditNumber();
    this.getCustomersData();

    this.masterGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.masterGridOptions.columnDefs = this.masterColumnDefs;

    this.familyGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.familyGridOptions.columnDefs = this.familyColumnDefs;

  }

  ngOnInit() {
    this.getMastersAndFamilyList();
  }

  masterAccountForm: FormGroup;
  masterAccountFormValidations = {
    masterAccountId: new FormControl(),
    creditNumber: new FormControl('', Validators.required),
    customerId: new FormControl('', Validators.required),
    familyAccounts: new FormControl(''),
    creditLimit: new FormControl('', Validators.required),
    creditDays: new FormControl('', Validators.required),
    creditLimitLeft: new FormControl(''),
    creditDaysLeft: new FormControl(''),
    creationTimeStamp: new FormControl(new Date()),
    createdUser: new FormControl(localStorage.getItem('id')),
    lastUpdateTimestamp: new FormControl(new Date()),
    lastUpdateUser: new FormControl(localStorage.getItem('id')),
    pharmacyId: new FormControl(localStorage.getItem('pharmacyId')),
  }

  familyAccountForm: FormGroup;
  familyAccountFormValidations = {
    familyAccountId: new FormControl(),
    creditNumber: new FormControl('', Validators.required),
    customerId: new FormControl('', Validators.required),
    creditLimit: new FormControl('', Validators.required),
    creditDays: new FormControl('', Validators.required),
    masterAccountId: new FormControl(),
    creationTimeStamp: new FormControl(new Date()),
    createdUser: new FormControl(localStorage.getItem('id')),
    lastUpdateTimestamp: new FormControl(new Date()),
    lastUpdateUser: new FormControl(localStorage.getItem('id')),
    pharmacyId: new FormControl(localStorage.getItem('pharmacyId')),
  }
  disable = false;
  getFormValidationErrors() {
    this.disable = false;
    Object.keys(this.masterAccountForm.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.masterAccountForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {

          this.disable = true;
        });
      }

    });

  }
  onSubmit() {
    this.familyAccountForm.get('creditNumber').setValue(this.masterAccountForm.get('creditNumber').value);
    this.familyAccountForm.get('creditLimit').setValue(this.masterAccountForm.get('creditLimit').value);
    this.familyAccountForm.get('creditDays').setValue(this.masterAccountForm.get('creditDays').value);

    if (this.masterAccountForm.get('masterAccountId').value == null || this.masterAccountForm.get('masterAccountId').value == undefined ||
      this.masterAccountForm.get('masterAccountId').value == '') {
      this.masterAccountForm.get('creditLimitLeft').setValue(this.masterAccountForm.get('creditLimit').value);
      this.masterAccountForm.get('creditDaysLeft').setValue(this.masterAccountForm.get('creditDays').value);
    }

    let familyPayload = Object.assign({}, {});
    let familyPayloadArray = [];

    for (var i = 0; i < this.selectedFamily['length']; i++) {
      familyPayloadArray.push({
        'customerId': this.selectedFamily[i],
        'creditNumber': this.masterAccountForm.get('creditNumber').value,
        'creditLimit': this.masterAccountForm.get('creditLimit').value,
        'creditDays': this.masterAccountForm.get('creditDays').value,
        'creationTimeStamp': new Date(),
        'createdUser': localStorage.getItem('id'),
        'lastUpdateTimestamp': new Date(),
        'lastUpdateUser': localStorage.getItem('id'),
        'pharmacyId': localStorage.getItem('pharmacyId')
      });
    }

    this.masterAccountForm.get('familyAccounts').setValue(familyPayloadArray);
    this.getFormValidationErrors();

    if (this.disable) {
      this.toasterService.error("", "Please Fill Required Fields", {
        timeOut: 5000
      });
      return;
    }

    if (this.masterAccountForm.get('masterAccountId').value != null && this.masterAccountForm.get('masterAccountId').value != undefined &&
      this.masterAccountForm.get('masterAccountId').value != '') {
      this.masterAccountService.updateMasterAccount(this.masterAccountForm.value).subscribe(masterAccountResponse => {
        if (masterAccountResponse['responseStatus']['code'] === 200) {
          this.toasterService.success(masterAccountResponse['message'], '', {
            timeOut: 5000
          });
          this.resetMasterForm()
          this.getMastersAndFamilyList();
        }
      }, error => {
        this.toasterService.error(error.error['message'], "Can't Update", {
          timeOut: 5000
        });
      })
    }
    else {
      this.masterAccountService.saveMasterAccount(this.masterAccountForm.value).subscribe(masterAccountResponse => {
        if (masterAccountResponse['responseStatus']['code'] === 200) {
          this.toasterService.success(masterAccountResponse['message'], '', {
            timeOut: 5000
          });
          this.resetMasterForm()
          this.getMastersAndFamilyList();
        }
      }, error => {
        this.toasterService.error(error.error['message'], "Can't Save", {
          timeOut: 5000
        });
      })
    }
  }

  getCreditNumber() {
    this.masterAccountService.getCreditNumber().subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.masterAccountForm.get('creditNumber').setValue(res['result']);
      }
    })
  }

  getCustomersData() {
    this.masterAccountService.getCustomersList().subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.customersList = res['result'];
      }
    });
  }

  getCustomersDataByName(event) {
    this.masterAccountService.getCustomersByName(event['target']['value']).subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.customersList = res['result'];
      }
    })
  }

  getMastersAndFamilyList() {
    this.masterAccountService.getMastersAndFamilyList().subscribe(response => {
      if (response['responseStatus']['code'] === 200) {
        this.masterAccounts = response['result'];
      }
    });
  }

  onSelectionChanged(event) {

    this.familyAccounts = [];
    var i = this.masterGridOptions.api.getSelectedRows();

    for (var j = 0; j < i['length']; j++) {
      this.familyAccounts = i[0]['familyAccounts'];
    }
  }

  editMaster() {
    var i = this.masterGridOptions.api.getSelectedRows();
    this.masterAccountForm.patchValue({
      masterAccountId: i[0]['masterAccountId'],
      creditNumber: i[0]['creditNumber'],
      customerId: i[0]['customerId'],
      creditLimit: i[0]['creditLimit'],
      creditDays: i[0]['creditDays'],
      creditLimitLeft: i[0]['creditLimitLeft'],
      creditDaysLeft: i[0]['creditDaysLeft'],
      lastUpdateTimestamp: new Date(),
      lastUpdateUser: localStorage.getItem('id'),
      pharmacyId: localStorage.getItem('pharmacyId')
    });
    this.selectedMaster = i[0]['customerId'];
    let familyArray = [];
    for (var j = 0; j < i[0]['familyAccounts']['length']; j++) {
      familyArray.push(i[0]['familyAccounts'][j]['customerId']);
    }
    this.selectedFamily = familyArray;
  }

  resetMasterForm() {
    this.masterAccountForm.reset();
    this.masterAccountForm.patchValue({
      creationTimeStamp: new Date(),
      createdUser: localStorage.getItem('id'),
      lastUpdateTimestamp: new Date(),
      lastUpdateUser: localStorage.getItem('id'),
      pharmacyId: localStorage.getItem('pharmacyId')
    });
    this.selectedMaster = undefined;
    this.selectedFamily = [];
    this.getCreditNumber();
    this.disable = false;
  }

  familySelected() {

    if (this.selectedMaster == undefined || this.selectedMaster == null) {

      this.toasterService.error('Please Select Master Account', 'No Master Selected', {
        timeOut: 5000
      });


    }
    else {
      for (var i = 0; i < this.selectedFamily['length']; i++) {

        if (this.selectedMaster['customerId'] == this.selectedFamily[i]['customerId']) {

          this.toasterService.error('Can Not Select Master As Family', '', {
            timeOut: 5000
          });
          this.selectedFamily = this.selectedFamily.filter(s => s != this.selectedMaster);

        }

      }
    }
  }
}
