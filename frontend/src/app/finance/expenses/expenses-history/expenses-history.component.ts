import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../expenses.service';
import { GridOptions, ColDef, IGetRowsParams } from 'ag-grid-community';
import { DatePipe } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'expenses-history',
  templateUrl: './expenses-history.component.html',
  styleUrls: ['./expenses-history.component.scss']
})
export class ExpensesHistoryComponent implements OnInit {
  txnEditPaginationSize;
  gridCacheOverFlowSize
  txnMaxConcurrentDatasourceRequests
  BankTxnGridOptions: GridOptions;

  expensesHistoryRowCount = 0;
  expensesHistoryPageNumber = 0;
  expensesHistorySearchPageNumber = 0;
  expensesHistorySearchRowCount = 0

  transactionRefNo
  selectedSearchParty
  selectedSearchCounterParty
  fromTxnDate
  toTxnDate
  constructor(private expensesService: ExpensesService, private datePipe: DatePipe,
    private spinnerService: Ng4LoadingSpinnerService, private toasterService: ToastrService,) {


    this.BankTxnGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };

    this.BankTxnGridOptions.rowSelection = 'single';
    this.BankTxnGridOptions.columnDefs = this.columnDefs;
    this.BankTxnGridOptions.cacheBlockSize = 50;
    this.BankTxnGridOptions.rowModelType = 'infinite'

    // this.BankTxnGridOptions.getRowStyle = function (params) {
    //   if (params.node.rowIndex % 2 !== 0) {
    //     return { background: '#cccccc' }
    //   }
    // }

    this.gridCacheOverFlowSize = 2;
    this.txnEditPaginationSize = 50;
    this.txnMaxConcurrentDatasourceRequests = 2;

    this.expensesService.getExpencesCount().subscribe(res => {
      this.expensesHistoryRowCount = res['result']
      this.BankTxnGridOptions.api.setDatasource(this.expensesHistoryDatasource);
    });
  }

  rowData = []
  expensesSearchResult: any[] = []
  getTransactionsBySearch() {
    this.startPosition=0;
    let formData = new FormData();
    formData.append("fromDate", this.fromTxnDate);
    formData.append("toDate", this.toTxnDate);
    formData.append("refNo", this.transactionRefNo);
    formData.append("party", this.selectedSearchParty ? this.selectedSearchParty['accountId'] : undefined);
    formData.append("counterParty", this.selectedSearchCounterParty ? this.selectedSearchCounterParty['accountId'] : undefined);

    this.spinnerService.show()
    this.expensesService.getAllExpensesTransactionscount(formData).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.expensesHistorySearchRowCount = res['result']
          this.BankTxnGridOptions.api.setDatasource(this.expensesHistorySearchDatasource);
          this.spinnerService.hide()
        }
      }
    }, error => {
      this.toasterService.error("Error Occured Please Contact Administrator", " ", {
        timeOut: 3000
      })

      this.spinnerService.hide();
    })

  }

  ngOnInit() {
    this.expensesInformationForm = new FormGroup(this.newExpensesInformationFormValidations);
  }

  columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "",
      checkboxSelection: true,
      sortable: false,
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40
    },
    { headerName: 'Expense No', field: 'expenseNo', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Transaction Ref', field: 'reference', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Reason', field: 'reason', sortable: false, resizable: true, filter: false, width: 100 },
    {
      headerName: 'Transaction Date', field: 'date',
      sortable: false, resizable: true, filter: false, width: 130
    },
    { headerName: 'Party', field: 'account.accountName', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Counter Party', field: 'counterPartyNo.accountName', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Amount', field: 'amount', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Balance', field: 'balance', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Mode', field: 'mode', sortable: false, resizable: true, filter: false, width: 100 }
  ];


  dateFormatter(params) {
    //return this.datePipe.transform(params.data.date, 'yyyy-MM-dd')
    return params.data.date;
  }




  expensesHistoryDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.spinnerService.show();
      this.expensesService.getExpencesList(this.expensesHistoryPageNumber, 50).subscribe(data => {
        try {
          params.successCallback(data['result'], this.expensesHistoryRowCount)
        }
        catch (error) {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
          this.spinnerService.hide();
        }
        this.spinnerService.hide();
        if (data['responseStatus']['code'] === 200) {
          if (data['result'] != null) {
            if (data['result']['length'] > 0) {

              this.expensesHistoryPageNumber++;
            }
            else {
              this.BankTxnGridOptions.api.setRowData([]);
              this.toasterService.warning('Data Not Found', 'No Data To Show', {
                timeOut: 3000
              });
            }
          }
        }
      }, error => {

        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      });
    }

  }

  startPosition=0
  expensesHistorySearchDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.spinnerService.show();

      let limit = 50
     
      let formData = new FormData();
      formData.append("fromDate", this.fromTxnDate);
      formData.append("toDate", this.toTxnDate);
      formData.append("refNo", this.transactionRefNo);
      formData.append("party", this.selectedSearchParty ? this.selectedSearchParty['accountId'] : undefined);
      formData.append("counterParty", this.selectedSearchCounterParty ? this.selectedSearchCounterParty['accountId'] : undefined);
      formData.append("pageNumber", this.startPosition.toString())
      formData.append("limit", limit.toString())

      this.expensesService.getAllExpensesTransactionsBySearch(formData).subscribe(data => {
        try {

          params.successCallback(data['result'], this.expensesHistorySearchRowCount)
        }
        catch (error) {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
          this.spinnerService.hide();
        }
        this.spinnerService.hide();
        if (data['responseStatus']['code'] === 200) {
          if (data['result'] != null) {
            if (data['result']['length'] > 0) {
              this.startPosition=this.startPosition+data['result']['length'];
              
              this.expensesHistorySearchPageNumber++;
            }
            else {
              this.BankTxnGridOptions.api.setRowData([]);
              this.toasterService.warning('Data Not Found', 'No Data To Show', {
                timeOut: 3000
              });
            }
          }
        }
      }, error => {

        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      });
    }

  }



  onCellClicked(params) {
    if (params.column.colId !== 'check') {
      this.change(params.data)
      setTimeout(() => {
        $('#approvedModal').modal('show');
      }, 200);
    }
  }

  cancelForm(){
    
      setTimeout(() => {
        $('#approvedModal').modal('hide');
      }, 200);
     
    
  }

  expensesInformationForm: FormGroup;

  newExpensesInformationFormValidations = {
    date: new FormControl(''),
    balance: new FormControl(''),
    reference: new FormControl(''),
    amount: new FormControl(''),
    expenseNo: new FormControl(''),
    account:new FormControl(''),
    counterPartyNo:new FormControl(''),
    mode: new FormControl(''),
    cardNo: new FormControl(''),
    chequeNo: new FormControl(''),
    txnId: new FormControl(''),
    reason: new FormControl(''),
    phoneNumber: new FormControl('')
  }


  change(expenseDetails){

    this.expensesInformationForm.get('account').disable();
    this.expensesInformationForm.get('counterPartyNo').disable();
    this.expensesInformationForm.get('mode').disable();

    let viewExpenseObj:Object={
      date:expenseDetails['date'],
      balance: expenseDetails['balance'],
      account:expenseDetails['account'],
      reference: expenseDetails['reference'],
      amount: expenseDetails['amount'],
      expenseNo: expenseDetails['expenseNo'],
      counterPartyNo:expenseDetails['counterPartyNo'],
      mode: expenseDetails['mode'],
      cardNo: expenseDetails['cardNo'],
      chequeNo: expenseDetails['chequeNo'],
      txnId: expenseDetails['txnId'],
      reason: expenseDetails['reason'],
      phoneNumber: expenseDetails['phoneNumber']
    }

    this.onModeRetrieved(expenseDetails['mode']);
    this.expensesInformationForm.setValue(viewExpenseObj)
  }


  displayChequeNO = false;
  displayCardNO = false;
  displayAccountNO = false;
  displaytxnId = false;
  displayReason = false;
  displayPhoneNumber = false;
  showTxnId=false
  onModeRetrieved(event){
    if ((event['name'] == 'CreditCard') || (event['name'] == 'DebitCard')) {
      this.displayCardNO = true;
      this.displayAccountNO = false;
      this.displayChequeNO = false;
      this.displaytxnId = false;
      this.displayReason = false;
      this.showTxnId = false;
      this.displayPhoneNumber = false;
    }
    else if (event['name'] == "Net Banking") {
      this.displaytxnId = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
    }
    else if (event['name'] == 'CashDeposit') {
      this.displaytxnId = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
    }
    else if ((event['name'] == 'ChequeDeposit')) {
      this.displayChequeNO = true;
      this.displayCardNO = false;
      this.displaytxnId = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.showTxnId = false;
      this.displayPhoneNumber = false;
    }
    else if ((event['name'] == 'Withdrawls')) {
      this.displayReason = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displaytxnId = false;
      this.showTxnId = false;
      this.displayPhoneNumber = false;
    }
    else if (event['name'] == 'Cheque') {
      this.displayChequeNO = true;
      this.displayAccountNO = false;
      this.displayCardNO = false;
      this.displaytxnId = false;
      this.displayReason = false;
      this.showTxnId = false;
      this.displayPhoneNumber = false;
    }
    else if (event['name'] == 'M-PESA') {
      this.displaytxnId = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = true;
    }
    else {
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displaytxnId = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
    }
  }
}
