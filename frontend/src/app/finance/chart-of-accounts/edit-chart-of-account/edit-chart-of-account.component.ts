import { Component, OnInit } from '@angular/core';
import { PettyCashService } from '../../petty-cash/shared/petty-cash.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { GridOptions, ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { NumericEditor } from 'src/app/core/numeric-editor.component';
import { DatePipe } from '@angular/common';
import { ChartOfAccountsService } from '../shared/chart-of-accounts.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-edit-chart-of-account',
  templateUrl: './edit-chart-of-account.component.html',
  styleUrls: ['./edit-chart-of-account.component.scss'],
  providers: [PettyCashService]
})
export class EditChartOfAccountComponent implements OnInit {

  accounts: any[] = [];
  accountTypes;
  editCOAInformationForm: FormGroup;
  constructor(private pettyCashService: PettyCashService, private coaService: ChartOfAccountsService,
    private toasterService: ToastrService, private datePipe: DatePipe, private spinnerService: Ng4LoadingSpinnerService) {
    this.COAGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };

    this.COAGridOptions.rowSelection = 'single';
    this.COAGridOptions.columnDefs = this.columnDefs;
    this.getGridRowData();
    this.coaService.getAllAccountTypes().subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.accountTypes = res['result']
        }
      }
    })
    this.COAGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
      }
  }
  ngOnInit() {
    this.editCOAInformationForm = new FormGroup(this.editCOAInformationFormValidations)
    $(document).ready(function () {
      $("#common-grid-btn").click(function () {
        $("#common-grid").hide();
        $("#editCOAGrid").hide();
      });
      $("#common-grid-btn").click(function () {
        $("#Account-Information").show();
      });
      $("#mu-adduser-save").click(function () {
        $("#common-grid").show();
        $("#editCOAGrid").show();
        $("#Account-Information").css("display", "none");
      });
      $("#mu-adduser-cancel").click(function () {
        $("#common-grid").show();
        $("#editCOAGrid").show();
        $("#Account-Information").css("display", "none");
      });
      $("#common-grid-btn").click(function () {
        $("#Account-Information").css("display", "block");
      });
      $(".mu-adduser-save").click(function () {
        $("#Account-Information").css("display", "none");
      });
      $(".mu-adduser-cancel").click(function () {
        $("#Account-Information").css("display", "none");
      });
    });
  }

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
    { headerName: 'Account No', field: 'accountNo', sortable: true, resizable: true, filter: true },
    { headerName: 'Account Name', field: 'accountName', sortable: true, resizable: true, filter: true },
    { headerName: 'Account Type', field: 'accountType.accountType', sortable: true, resizable: true, filter: true },
    { headerName: 'Transaction Limit', field: 'transactionLimit', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor },
    { headerName: 'Total Limit', field: 'totalLimit', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor },
    { headerName: 'Current Balance', field: 'currentBalance', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor },
    { headerName: 'As Of Date', field: 'asOfDate', sortable: true, resizable: true, filter: true }
  ];

  COAGridOptions: GridOptions;
  rowData = [];
  editGrid() {
    this.onAccountSelected(this.COAGridOptions.api.getSelectedRows()[0].accountId);
  }

  getGridRowData() {
    this.pettyCashService.getAllAccounts().subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.rowData = res['result'];
          this.accounts = this.rowData
        }
      }
    }, error => {
      this.toasterService.error("Please Contact Administrator", 'Error', {
        timeOut: 5000
      })
    })
  }

  selectedAccount;
  formatDate: any;
  onAccountSelected(accountId: string) {
    
    this.selectedAccount = this.accounts.find(account => account['accountId'] == accountId);
    //console.log(this.selectedAccount)
    this.formatDate = this.datePipe.transform(this.selectedAccount['date'], 'dd-MM-yyy')
    let COAFormValues: Object = {
      accountNo: this.selectedAccount['accountNo'],
      accountName: this.selectedAccount['accountName'],
      accountType: this.selectedAccount['accountType'],
      transactionLimit: this.selectedAccount['transactionLimit'],
      currentBalance: this.selectedAccount['currentBalance'],
      asOfDate: this.selectedAccount['asOfDate'],
      date: this.formatDate,
      totalLimit: this.selectedAccount['totalLimit']
    }
    this.editCOAInformationForm.setValue(COAFormValues);
  }
  editCOAInformationFormValidations = {
    date: new FormControl(''),
    accountNo: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    accountName: new FormControl('', Validators.required),
    accountType: new FormControl('', Validators.required),
    currentBalance: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    asOfDate: new FormControl('', Validators.required),
    transactionLimit: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    totalLimit: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')])

  }
  payload: Object;
  coaButtonSubmitDisable=false
  onEditCOASubmit() {
    this.coaButtonSubmitDisable=true
    let payload = Object.assign({}, this.editCOAInformationForm.value);
    payload['accountId'] = this.selectedAccount['accountId']
    payload['date'] = this.selectedAccount['date']
    //console.log(this.selectedAccount['accountName'].split(":"))
    payload['accountName'] = this.selectedAccount['accountName'].split(":")[0]
    payload['createdUser'] = localStorage.getItem('id');
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['pharmacyModel'] = { pharmacyId: 1 }
    payload['asOfDate'] = this.datePipe.transform(this.editCOAInformationForm.get('asOfDate').value, 'yyyy-MM-dd')
    this.spinnerService.show();
    this.coaService.saveCOADetails(payload).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.toasterService.success(res['message'], 'Success', {
            timeOut: 3000
          })
          this.getGridRowData();
          this.spinnerService.hide();
        }
      }
    }, error => {
      this.toasterService.error('Please contact administrator', 'Error', {
        timeOut: 5000
      })
    })
    this.reset();
  }

  reset() {
    this.editCOAInformationForm.reset();
  }
  checkFormDisability() {
    return (this.editCOAInformationForm.get('accountNo').errors instanceof Object)
      || (this.editCOAInformationForm.get('accountNo').invalid)
      || (this.editCOAInformationForm.get('accountName').errors instanceof Object)
      || (this.editCOAInformationForm.get('accountType').errors instanceof Object)
      || (this.editCOAInformationForm.get('currentBalance').errors instanceof Object)
      || (this.editCOAInformationForm.get('currentBalance').invalid)
      || (this.editCOAInformationForm.get('asOfDate').errors instanceof Object)
      || (this.editCOAInformationForm.get('transactionLimit').invalid)
      || (this.editCOAInformationForm.get('totalLimit').invalid)
  }

  key;

  search(){
    if(this.key !=null && this.key !=undefined){
      this.coaService.getAllCOA(this.key).subscribe(res=>{
        
        this.rowData = res['result'];
        this.accounts = this.rowData
      })
    }
  }


}
