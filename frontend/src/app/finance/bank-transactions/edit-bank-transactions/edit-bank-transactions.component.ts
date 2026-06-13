import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridOptions, IGetRowsParams } from 'ag-grid-community';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { NumericEditor } from 'src/app/core/numeric-editor.component';
import { ChartOfAccountsService } from '../../chart-of-accounts/shared/chart-of-accounts.service';
import { PettyCashService } from '../../petty-cash/shared/petty-cash.service';
import { TransactionService } from '../shared/transaction.service';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-edit-bank-transactions',
  templateUrl: './edit-bank-transactions.component.html',
  styleUrls: ['./edit-bank-transactions.component.scss']
})
export class EditBankTransactionsComponent implements OnInit {

  accountDetails: any[] = [];
  counterPartyAccountNames: any[] = [];
  today;
  refNo;
  currentDate;
  journalId;
  journalRef;
  accountBalance;
  payload: Object;
  tranData;
  fromTxnDate
  toTxnDate
  modes: any;
  constructor(private transactionService: TransactionService, private coaService: ChartOfAccountsService,
    private toasterService: ToastrService, private datePipe: DatePipe, private spinnerService: Ng4LoadingSpinnerService) {
    this.BankTxnGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };

    this.BankTxnGridOptions.rowSelection = 'single';
    this.BankTxnGridOptions.columnDefs = this.columnDefs;
    this.BankTxnGridOptions.cacheBlockSize = 50;
    this.BankTxnGridOptions.rowModelType = 'infinite'

    this.BankTxnGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }

    this.gridCacheOverFlowSize = 2;
    this.txnEditPaginationSize = 50;
    this.txnMaxConcurrentDatasourceRequests = 2;

    this.getReferenceNo();
    this.getAllAccountNames();
    this.getCurrentDate();
    this.getAllJournalId();
    this.getAllJournaRefNo()
    this.getAllBankTransactionsData();
  }

  getAllBankTransactionsData() {
    this.spinnerService.show()
    this.transactionService.getBankTxnCount().subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {

          this.banlTxnHistoryRowCount = res['result']
          this.BankTxnGridOptions.api.setDatasource(this.bankTxnHistoryDatasource);
          this.spinnerService.hide()

          //this.rowData = res['result']
        }
      }
    }, error => {
      this.toasterService.error("Error Occured Please Contact Administrator", " ", {
        timeOut: 3000
      })
      this.spinnerService.hide()
    })
  }

  bankTxnHistoryPageNumber = 0
  banlTxnHistoryRowCount = 0
  bankTxnSearchHistoryPageNumber = 0
  bankTxnSearchHistoryRowCount = 0
  startPosition = 0
  bankTxnHistoryDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.spinnerService.show();
      this.transactionService.getBankTxnsList(this.bankTxnHistoryPageNumber, 50).subscribe(data => {
        try {
          params.successCallback(data['result'], this.banlTxnHistoryRowCount)
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

              this.bankTxnHistoryPageNumber++;
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


  bankTxnSearchHistoryDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.spinnerService.show();

      let formData = new FormData();
      let limit = 50
      formData.append("fromDate", this.fromTxnDate);
      formData.append("toDate", this.toTxnDate);
      formData.append("refNo", this.transactionRefNo);
      formData.append("party", this.selectedSearchParty ? this.selectedSearchParty['accountId'] : undefined);
      formData.append("counterParty", this.selectedSearchCounterParty ? this.selectedSearchCounterParty['accountId'] : undefined);
      formData.append("startPosition", this.startPosition.toString())
      formData.append("limit", limit.toString())

      this.transactionService.getBankTxnsListBySearch(formData).subscribe(data => {
        try {
          params.successCallback(data['result'], this.bankTxnSearchHistoryRowCount)
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

              this.startPosition = this.startPosition + data['result']['length']
              this.bankTxnSearchHistoryPageNumber++;
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
  ngOnInit() {
    this.editBankTxnInformationForm = new FormGroup(this.edittransactionInformationFormValidations)
    this.transactionInformationForm = new FormGroup(this.newtransactionInformationFormValidations)
    $(document).ready(function () {
      $("#common-grid-btn").click(function () {
        $("#common-grid").hide();
        $("#editCOAGrid").hide();
      });
      $("#common-grid-btn").click(function () {
        $("#Account-Information").show();
      });
      $("#mu-adduser-save").click(function () {
        // $("#common-grid").show();
        // $("#editCOAGrid").show();
        // $("#Account-Information").css("display", "none");
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
      sortable: false,
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40
    },
    { headerName: 'Transaction Ref. No', field: 'transactionRef', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Transaction Type', field: 'transactionType', sortable: false, resizable: true, filter: false, width: 100 },
    {
      headerName: 'Transaction Date', field: 'transactionDate',
      sortable: false, resizable: true, filter: false, width: 100, cellRenderer: (data) => {
        return data.value ? (this.datePipe.transform(data.value,'dd-MM-yyyy')) : '';
      }
    },
    { headerName: 'Party', field: 'party.accountName', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Counter Party', field: 'counterParty.accountName', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Amount', field: 'amount', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Party Balance', field: 'balance', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Counter Party Balance', field: 'counterPartyBalance', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Mode', field: 'mode', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Status', field: 'status', sortable: false, resizable: true, filter: false, width: 100 }
  ];



  txnEditPaginationSize;
  gridCacheOverFlowSize
  txnMaxConcurrentDatasourceRequests
  BankTxnGridOptions: GridOptions;
  rowData = [];
  editGrid() {
    this.onTransactionSelected(this.BankTxnGridOptions.api.getSelectedRows()[0].bankTransactionId);
  }

  transactionDetails
  onTransactionSelected(bankTransactionId) {
    this.transactionService.getBankTransactionDetailsById(bankTransactionId).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.transactionDetails = res['result']
          this.selectedMode = this.transactionDetails['mode']
          this.onModeSelected(this.transactionDetails['mode'])

          let txnDataPayload: Object = {
            transactionDate: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
            party: this.transactionDetails['party'],
            counterParty: this.transactionDetails['counterParty'],
            transactionRef: this.transactionDetails['transactionRef'],
            mode: this.transactionDetails['mode'],
            amount: this.transactionDetails['amount'],
            balance: this.transactionDetails['party']['currentBalance'],
            chequeNo: this.transactionDetails['chequeNo'],
            cardNo: this.transactionDetails['cardNo'],
            transactionType: this.transactionDetails['transactionType'],
            transactionId: this.transactionDetails['transactionId'],
            reason: this.transactionDetails['reason'],
            phoneNumber: this.transactionDetails['phoneNumber']

          }
          this.editBankTxnInformationForm.setValue(txnDataPayload);
          const deleteObj = (data, column, search) => {
            let result = data.filter(m => m[column] !== search);
      
            return result;
          }
          this.counterPartyAccountNames = deleteObj(this.accountDetails, 'accountNo', this.transactionDetails['party']['accountNo']);

        }
      }
    })
  }

  onSearchPartyClear() {
    this.selectedSearchParty = undefined
  }
  onSearchCounterPartyClear() {
    this.selectedSearchCounterParty = undefined
  }
  transactionRefNo
  selectedSearchParty
  selectedSearchCounterParty

  getTransactionsBySearch() {

    this.startPosition = 0;
    let formData = new FormData();
    formData.append("fromDate", this.fromTxnDate);
    formData.append("toDate", this.toTxnDate);
    formData.append("refNo", this.transactionRefNo);
    formData.append("party", this.selectedSearchParty ? this.selectedSearchParty['accountId'] : undefined);
    formData.append("counterParty", this.selectedSearchCounterParty ? this.selectedSearchCounterParty['accountId'] : undefined);

    this.spinnerService.show()
    this.transactionService.getAllTransactionsBySearchCount(formData).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          //this.rowData = res['result']
          this.bankTxnSearchHistoryRowCount = res['result']
          this.BankTxnGridOptions.api.setDatasource(this.bankTxnSearchHistoryDatasource);
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

  editBankTxnInformationForm: FormGroup;
  edittransactionInformationFormValidations = {
    transactionDate: new FormControl('', [Validators.required]),
    party: new FormControl('', Validators.required),
    counterParty: new FormControl('', Validators.required),
    transactionRef: new FormControl('', Validators.required),
    mode: new FormControl('', Validators.required),
    amount: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    balance: new FormControl('', Validators.required),
    chequeNo: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    cardNo: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    transactionType: new FormControl('', Validators.required),
    transactionId: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    reason: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)])
  }


  selectedMode: any;
  selectedToAccount: any;
  selectedFromParty: any;
  selectedType: any;
  type: any;
  totalAmount;
  names;
  toAccountBalance
  onPartyAccountSelected(event) {
    this.txnButtonSubmitDisable = false
    this.transactionService.getBalanceFromChartAccount(event['accountId']).subscribe(response => {
      if (response['result'] != null && response['result'] != undefined && response['result'] != '') {
        this.accountBalance = parseFloat(response['result']);

        this.accountBalance = this.accountBalance.toFixed(2);

        this.editBankTxnInformationForm.patchValue({
          balance: response['result']
        })

      } else {

        this.toasterService.warning('No Balance to display', 'Data Not Found', {
          timeOut: 3000
        })
      }


    });

    const deleteObj = (data, column, search) => {
      let result = data.filter(m => m[column] !== search);

      return result;
    }


    this.counterPartyAccountNames = deleteObj(this.accountDetails, 'accountNo', this.selectedFromParty['accountNo']);
  }

  counterPartyBalance;
  enableMode = false;
  onToAccountSelected(event) {
    this.txnButtonSubmitDisable = false
    //this.transactionInformationForm.get('amount').enable();
    this.transactionService.getBalanceFromChartAccount(event['accountId']).subscribe(response => {
      if (response['result'] != null && response['result'] != undefined && response['result'] != '') {
        this.toAccountBalance = parseFloat(response['result']);

        this.toAccountBalance = this.toAccountBalance.toFixed(2);
      }
    });

  }

  onPartyClear() {
    this.editBankTxnInformationForm.get('balance').setValue('');
    this.editBankTxnInformationForm.get('amount').setValue('');
  }

  onCounterPartyClear() {
    // this.transactionInformationForm.get('amount').disable();
  }
  getReferenceNo() {
    this.transactionService.getTransactionRefNumber().subscribe(res => {
      this.refNo = res['result'];
    });
  }
  getAllJournalId() {
    this.transactionService.getJournalId().subscribe(res => {
      this.journalId = res['result'];
    });
  }
  getAllJournaRefNo() {
    this.transactionService.getJournalRefNumber().subscribe(res => {
      this.journalRef = res['result'];
    });
  }
  getAllAccountNames() {
    this.transactionService.getTransactions().subscribe((res: any) => {
      if (res instanceof Object) {
        if (res['status'] == 200) {
          this.accountDetails = res['result'];
        }

      }
    });
  }
  showTxnId = false;
  onSearchTransactionId(event) {
    if (event.target.value) {
      this.transactionService.getTransactionIds(event.target.value).subscribe(res => {
        if (res['result'] instanceof Object)
          this.tranData = res['result'];
        if (this.tranData.length == 0) {
          this.showTxnId = false;
        } else {
          this.showTxnId = true;
        }
      })
    }

  }
  getCurrentDate() {
    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.currentDate = this.datePipe.transform(this.today, 'dd-MM-yyyy');
    setTimeout(() => {
      this.editBankTxnInformationForm.patchValue({ transactionDate: this.currentDate });
    }, 200);
  }

  onTypeChanged(event) {
    let typeValue = event.target.value;
    this.selectedType = typeValue;

    if (typeValue == 'Credit') {
      // let creditAmount = this.transactionInformationForm.get('amount').value;
      // this.totalAmount = parseFloat(this.accountBalance) - parseFloat(creditAmount)
      // this.totalAmount = this.totalAmount.toFixed(2);
      this.transactionService.getModesOnCredit().subscribe((res) => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] === 200) {
            this.modes = res['result'];
          }
        }
      })

    }

    else if (typeValue == 'Debit') {
      // let debitAmount = this.transactionInformationForm.get('amount').value;
      // this.totalAmount = parseFloat(this.accountBalance) + parseFloat(debitAmount);
      // this.totalAmount = this.totalAmount.toFixed(2);
      this.transactionService.getModesOnDebit().subscribe((res) => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] === 200) {
            this.modes = res['result'];
          }
        }
      })

    }
  }

  displayChequeNO = false;
  displayCardNO = false;
  displayAccountNO = false;
  displaytxnId = false;
  displayReason = false;
  displayPhoneNumber = false;
  modeSelected
  onModeSelected(event) {

    if (event['name']) {
      this.modeSelected = event['name']
    } else {
      this.modeSelected = event
    }
    if ((this.modeSelected == 'CreditCard') || (this.modeSelected == 'DebitCard')) {
      //this.transactionInformationForm.get('counterParty').enable();
      this.displayCardNO = true;
      this.displayAccountNO = false;
      this.displayChequeNO = false;
      this.displaytxnId = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
      this.showTxnId = false;

    }
    else if (this.modeSelected == "Net Banking") {
      //this.transactionInformationForm.get('counterParty').enable();
      this.displaytxnId = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;

    }
    else if (this.modeSelected == 'Cash Deposit') {
      // this.transactionInformationForm.get('counterParty').disable();
      //this.transactionInformationForm.get('counterParty').reset();
      this.editBankTxnInformationForm.get('amount').enable();
      this.displaytxnId = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
    }
    else if ((this.modeSelected == 'Cheque Deposit')) {
      // this.transactionInformationForm.get('counterParty').disable();
      //this.transactionInformationForm.get('counterParty').reset();
      this.editBankTxnInformationForm.get('amount').enable();
      this.displayChequeNO = true;
      this.displayCardNO = false;
      this.displaytxnId = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
      this.showTxnId = false;

    }
    else if ((this.modeSelected == 'Withdrawls')) {

      //this.transactionInformationForm.get('counterParty').disable();
      //this.transactionInformationForm.get('counterParty').reset();
      this.editBankTxnInformationForm.get('amount').enable();
      this.displayReason = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displaytxnId = false;
      this.showTxnId = false;

    }
    else if (this.modeSelected == 'Cheque') {
      //this.transactionInformationForm.get('counterParty').enable();
      this.displayChequeNO = true;
      this.displayAccountNO = false;
      this.displayCardNO = false;
      this.displaytxnId = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
      this.showTxnId = false;
    }
    else if (this.modeSelected == 'M-PESA') {
      // this.transactionInformationForm.get('counterParty').enable();
      this.displaytxnId = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = true;

    }
    else if (this.modeSelected == 'Online Transfer') {
      //this.transactionInformationForm.get('counterParty').disable();
      //this.transactionInformationForm.get('counterParty').reset();
      this.displaytxnId = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
    }
    else if (this.modeSelected == 'M-PESA Deposit') {
      //this.transactionInformationForm.get('counterParty').disable();
      // this.transactionInformationForm.get('counterParty').reset();
      this.displaytxnId = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = true;
    }
    else if (this.modeSelected == 'PDQ Settlement') {
      //this.transactionInformationForm.get('counterParty').disable();
      //this.transactionInformationForm.get('counterParty').reset();
      this.displayCardNO = true;
      this.displayAccountNO = false;
      this.displayChequeNO = false;
      this.displaytxnId = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
      this.showTxnId = false;
    }
    else if (this.modeSelected == 'CreditCard Deposit') {
      //this.transactionInformationForm.get('counterParty').disable();
      this.displaytxnId = false;
      this.displayChequeNO = false;
      this.displayCardNO = true;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
      // this.transactionInformationForm.get('counterParty').reset();
    }

    else {
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displaytxnId = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
      this.showTxnId = false;
    }
  }

  totalFromAccountAmount
  totalToAccountAmount
  txnButtonSubmitDisable = false
  onTransactionSubmit() {
    this.txnButtonSubmitDisable = true
    let formData = new FormData()
    formData.append("party", this.transactionDetails['party']['accountId'])
    formData.append("counterParty", this.transactionDetails['counterParty']['accountId'])
    formData.append("amount", this.transactionDetails['amount'])
    formData.append("selectedParty", this.selectedFromParty['accountId'])
    formData.append("selectedCounterParty", this.selectedToAccount['accountId'])

    let txnDataPayload: Object = {
      transactionDate: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      party: { "accountId": this.transactionDetails['party']['accountId'] },
      counterParty: { "accountId": this.transactionDetails['counterParty']['accountId'] },
      transactionRef: this.transactionDetails['transactionRef'],
      mode: this.transactionDetails['mode'],
      amount: this.transactionDetails['amount'],
      balance: this.transactionDetails['party']['currentBalance'],
      chequeNo: this.transactionDetails['chequeNo'],
      cardNo: this.transactionDetails['cardNo'],
      transactionType: this.transactionDetails['transactionType'],
      transactionId: this.transactionDetails['transactionId'],
      reason: this.transactionDetails['reason'],
      phoneNumber: this.transactionDetails['phoneNumber'],
      status: "Reversal transaction of " + " " + this.transactionDetails['transactionRef'],
      createdUser: localStorage.getItem('id'),
      lastUpdateUser: localStorage.getItem('id')
    }
    formData.append("transactionDetails", JSON.stringify(txnDataPayload))

    let partySelected = this.editBankTxnInformationForm.get('party').value;
    let counterPartySelected = this.editBankTxnInformationForm.get('counterParty').value;

    if (partySelected['accountType']['accountType'] === "Bank Account (1200-1209)"
      || counterPartySelected['accountType']['accountType'] === "Bank Account (1200-1209)") {

      this.transactionService.updateCOABalanceWithPreviousAmount(formData).subscribe(res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {


            this.accountBalance = res['result']['partyAccount']['currentBalance']
            this.toAccountBalance = res['result']['counterPartyAccount']['currentBalance']

            let partyAmount = this.editBankTxnInformationForm.get('amount').value;
            this.totalFromAccountAmount = parseFloat(this.accountBalance) - parseFloat(partyAmount);
            this.totalFromAccountAmount = this.totalFromAccountAmount.toFixed(2);

            let counterPartyAmount = this.editBankTxnInformationForm.get('amount').value;
            this.totalToAccountAmount = parseFloat(this.toAccountBalance) + parseFloat(counterPartyAmount);
            this.totalToAccountAmount = this.totalToAccountAmount.toFixed(2);

            let payload = Object.assign({}, this.editBankTxnInformationForm.value);
            payload['bankTransactionId'] = this.transactionDetails['bankTransactionId']
            payload['counterPartyBalance'] = this.totalToAccountAmount
            payload['transactionDate'] = this.today;
            payload['createdUser'] = localStorage.getItem('id');
            payload['lastUpdateUser'] = localStorage.getItem('id');
            payload['balance'] = this.totalFromAccountAmount
            if (this.selectedMode['name']) {
              payload['mode'] = this.selectedMode['name'];
            } else {
              payload['mode'] = this.selectedMode
            }

            payload['valueDate'] = this.today;
            payload['status'] = "Edited Transaction of" + " " + this.transactionDetails['transactionRef'];

            this.transactionService.saveBankTransactionDetails(payload).subscribe((res) => {
              if (res instanceof Object) {
                if (res['status'] == 200) {

                  let generalLedgerObj = Object.assign({});
                  generalLedgerObj['journalId'] = this.journalId
                  generalLedgerObj['journalRef'] = this.journalRef;
                  generalLedgerObj['entryNo'] = payload['transactionRef'];
                  if (this.selectedMode['name']) {
                    generalLedgerObj['entryType'] = "Bank Transaction" + "-" + this.selectedMode['name'];
                  } else {
                    generalLedgerObj['entryType'] = "Bank Transaction" + "-" + this.selectedMode;
                  }

                  generalLedgerObj['party'] = this.selectedFromParty['accountNo'];

                  if ((this.editBankTxnInformationForm.get('counterParty').value != undefined) && (this.editBankTxnInformationForm.get('counterParty').value != null)) {
                    generalLedgerObj['counterParty'] = this.selectedToAccount['accountNo'];
                  }

                  generalLedgerObj['entryDate'] = payload['transactionDate'];
                  if (this.selectedType == 'Credit') {

                    generalLedgerObj['credit'] = payload['amount'];
                    generalLedgerObj['debit'] = 0;
                  } else {
                    generalLedgerObj['debit'] = payload['amount'];
                    generalLedgerObj['credit'] = 0;
                  }
                  generalLedgerObj['balance'] = parseFloat(this.totalFromAccountAmount);
                  generalLedgerObj['pharmacyModel'] = { pharmacyId: localStorage.getItem('pharmacyId') };
                  generalLedgerObj['createdUser'] = localStorage.getItem('id');
                  generalLedgerObj['lastUpdateUser'] = localStorage.getItem('id');
                  this.transactionService.saveToGenaralLedger(generalLedgerObj).subscribe((res) => {
                    if (res instanceof Object) {
                      if (res['status'] == 200) {
                        this.reset();
                      }
                    }
                  });

                  this.toasterService.success(res['message'], 'Success', {
                    timeOut: 3000
                  })

                  $("#common-grid").show();
                  $("#editCOAGrid").show();
                  $("#Account-Information").css("display", "none");

                }
              }
            });



          }
        }


      })

    } else {

      this.toasterService.warning("Atleast one party/counter party must be a bank account", " ", {
        timeOut: 4000
      })
    }
  }

  checkFormDisability() {
    return (this.editBankTxnInformationForm.get('party').errors instanceof Object)
      || (this.editBankTxnInformationForm.get('counterParty').errors instanceof Object)
      || (this.editBankTxnInformationForm.get('balance').errors instanceof Object)
      || (this.editBankTxnInformationForm.get('amount').errors instanceof Object)
      || (this.editBankTxnInformationForm.get('mode').errors instanceof Object)
      || (this.editBankTxnInformationForm.get('transactionType').errors instanceof Object)
      || (this.displayChequeNO == true ? this.editBankTxnInformationForm.get('chequeNo').errors instanceof Object : false)
      || (this.displayCardNO == true ? this.editBankTxnInformationForm.get('cardNo').errors instanceof Object : false)
      || (this.displaytxnId == true ? this.editBankTxnInformationForm.get('transactionId').errors instanceof Object : false)
      || (this.showTxnId == true)
      || (this.displayReason == true ? this.editBankTxnInformationForm.get('reason').errors instanceof Object : false)
      || (this.displayPhoneNumber == true ? this.editBankTxnInformationForm.get('phoneNumber').errors instanceof Object : false)
  }
  reset() {
    this.editBankTxnInformationForm.reset();
    if (this.transactionRefNo || this.fromTxnDate || this.toTxnDate
      || this.selectedSearchParty || this.selectedSearchCounterParty) {
      this.bankTxnHistoryPageNumber = 0
      this.getTransactionsBySearch()
    } else {
      this.bankTxnHistoryPageNumber = 0
      this.getAllBankTransactionsData()
    }
    this.getReferenceNo();
    this.getCurrentDate();
    this.displayChequeNO = false;
    this.displayCardNO = false;
    this.displayAccountNO = false;
    this.displaytxnId = false;
    this.displayReason = false;
    this.showTxnId = false;
    this.displayPhoneNumber = false;
    //this.transactionInformationForm.get('counterParty').enable();
  }




  transactionInformationForm: FormGroup;
  newtransactionInformationFormValidations = {
    transactionDate: new FormControl('', [Validators.required]),
    party: new FormControl('', Validators.required),
    counterParty: new FormControl('', Validators.required),
    transactionRef: new FormControl('', Validators.required),
    mode: new FormControl('', Validators.required),
    amount: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    balance: new FormControl('', Validators.required),
    chequeNo: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    cardNo: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    transactionType: new FormControl('', Validators.required),
    transactionId: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    reason: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z\\s]+$')]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)])
  }


  onCellClicked(params) {
    if (params.column.colId !== 'check') {
      this.change(params.data)
      setTimeout(() => {
        $('#approvedModal').modal('show');
      }, 200);
    }
  }

  cancelForm() {

    setTimeout(() => {
      $('#approvedModal').modal('hide');
    }, 200);

  }


  change(txnDetails) {

    this.transactionInformationForm.get('party').disable();
    this.transactionInformationForm.get('counterParty').disable();
    this.transactionInformationForm.get('mode').disable();

    this.selectedMode = txnDetails['mode']
    this.onModeSelected(txnDetails['mode'])

    let txnDataPayload: Object = {
      transactionDate: formatDate(txnDetails['transactionDate'], 'yyyy-MM-dd', 'en-US'),
      party: txnDetails['party'],
      counterParty: txnDetails['counterParty'],
      transactionRef: txnDetails['transactionRef'],
      mode: txnDetails['mode'],
      amount: txnDetails['amount'],
      balance: txnDetails['party']['currentBalance'],
      chequeNo: txnDetails['chequeNo'],
      cardNo: txnDetails['cardNo'],
      transactionType: txnDetails['transactionType'],
      transactionId: txnDetails['transactionId'],
      reason: txnDetails['reason'],
      phoneNumber: txnDetails['phoneNumber']

    }
    this.transactionInformationForm.setValue(txnDataPayload);

  }
}
