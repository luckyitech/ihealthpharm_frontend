import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridOptions, IGetRowsParams } from 'ag-grid-community';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ChartOfAccountsService } from '../../chart-of-accounts/shared/chart-of-accounts.service';
import { PettyCashService } from '../shared/petty-cash.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-edit-petty-cash',
  templateUrl: './edit-petty-cash.component.html',
  styleUrls: ['./edit-petty-cash.component.scss']
})
export class EditPettyCashComponent implements OnInit {


  accounts: any[] = [];
  accountTypes;
  editCOAInformationForm: FormGroup;
  txnEditPaginationSize;
  gridCacheOverFlowSize
  txnMaxConcurrentDatasourceRequests

  constructor(private pettyCashService: PettyCashService,
    private coaService: ChartOfAccountsService,
    private toasterService: ToastrService, private datePipe: DatePipe,
    private spinnerService: Ng4LoadingSpinnerService) {


    this.pettyCashGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };

    this.pettyCashGridOptions.rowSelection = 'single';
    this.pettyCashGridOptions.columnDefs = this.columnDefs;
    this.pettyCashGridOptions.cacheBlockSize = 50;
    this.pettyCashGridOptions.rowModelType = 'infinite'

    this.coaService.getAllAccountTypes().subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.accountTypes = res['result']
        }
      }
    })
    this.pettyCashGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }

    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    setTimeout(() => {
      this.newPettyCashInformationForm.patchValue({ date: this.datePipe.transform(this.today, 'dd-MM-yyyy') });
    }, 200);

    this.getAllChartOfAccounts();
    this.getAccRecNumber();
    this.getPettyCashNumber();
    this.getGeneralLedgerNumber();
    this.getAllPettyCashDetails()

    this.gridCacheOverFlowSize = 2;
    this.txnEditPaginationSize = 50;
    this.txnMaxConcurrentDatasourceRequests = 2;

  }
  ngOnInit() {
    this.newPettyCashInformationForm = new FormGroup(this.newPettyCashInformationFormValidations);
    this.viewPettyCashInformationForm = new FormGroup(this.viewPettyCashInformationFormValidations);
    this.newPettyCashInformationForm.get('amount').disable();

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
      sortable: false,
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40
    },
    { headerName: 'PettyCash Ref. No', field: 'pettyCashRef', sortable: false, resizable: true, filter: false, width: 100 },

    {
      headerName: 'Date', field: 'date',
      sortable: false, resizable: true, filter: false, width: 100, valueGetter: this.dateFormatter.bind(this)
    },
    { headerName: 'Party', field: 'partyNo.accountName', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Counter Party', field: 'counterPartyNo.accountName', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Amount', field: 'amount', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Party Balance', field: 'balance', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Counter Party Balance', field: 'counterPartyBalance', sortable: false, resizable: true, filter: false, width: 100 },
    { headerName: 'Reference', field: 'reference', sortable: false, resizable: true, filter: false, width: 100 },

    { headerName: 'Reason', field: 'reason', sortable: true, resizable: true, filter: true, width: 100 },

  ];

  pettyCashGridOptions: GridOptions;
  rowData = [];
  editGrid() {
    this.onpettyCashAccountSelected(this.pettyCashGridOptions.api.getSelectedRows()[0].pettyCashId);
  }

  dateFormatter(params) {
    return this.datePipe.transform(params.data.date, 'yyyy-MM-dd')
  }

  pettyCashHistoryRowCount = 0
  pettyCashHistoryPageNumber = 0

  getAllPettyCashDetails() {
    /* this.spinnerService.show()
     this.pettyCashService.getAllPettyCashDetails().subscribe(res => {
       if (res instanceof Object) {
         if (res['responseStatus']['code'] == 200) {
           this.spinnerService.hide()
           this.rowData = res['result']
         }
       }
     })*/
    this.pettyCashService.getPettyCashCount().subscribe(res => {
      this.pettyCashHistoryRowCount = res['result']
      this.pettyCashGridOptions.api.setDatasource(this.pettyCashHistoryDatasource);
    });

  }


  pettyHistorySearchRowCount = 0
  pettyHistorySearchPageNumber = 0
  startPosition = 0
  pettyCashHistorySearchDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.spinnerService.show();

      let limit = 50

      let formData = new FormData();
      formData.append("fromDate", this.fromTxnDate);
      formData.append("toDate", this.toTxnDate);
      formData.append("refNo", this.transactionRefNo);
      formData.append("party", this.selectedSearchParty ? this.selectedSearchParty['accountId'] : undefined);
      formData.append("counterParty", this.selectedSearchCounterParty ? this.selectedSearchCounterParty['accountId'] : undefined);
      formData.append("startPosition", this.startPosition.toString())
      formData.append("limit", limit.toString())

      this.pettyCashService.getAllPettyCashTransactionsBySearch(formData).subscribe(data => {
        try {

          params.successCallback(data['result'], this.pettyHistorySearchRowCount)
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
              this.startPosition = this.startPosition + data['result']['length'];
              this.pettyHistorySearchPageNumber++;
            }
            else {
              this.pettyCashGridOptions.api.setRowData([]);
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

  pettyCashHistoryDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.spinnerService.show();
      this.pettyCashService.getAllPettyCashTxns(this.pettyCashHistoryPageNumber, 50).subscribe(data => {
        try {
          params.successCallback(data['result'], this.pettyCashHistoryRowCount)
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

              this.pettyCashHistoryPageNumber++;
            }
            else {
              this.pettyCashGridOptions.api.setRowData([]);
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
  pettyCashTransaction
  onpettyCashAccountSelected(pettyCashId) {

    this.pettyCashService.getPettyCashTransactionById(pettyCashId).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.pettyCashTransaction = res['result']

          let editPettyCashPayload: Object = {
            date: this.pettyCashTransaction['date'],
            partyNo: this.pettyCashTransaction['partyNo'],
            balance: this.pettyCashTransaction['partyNo']['currentBalance'],
            counterPartyNo: this.pettyCashTransaction['counterPartyNo'],
            reference: this.pettyCashTransaction['reference'],
            amount: this.pettyCashTransaction['amount'],
            pettyCashRef: this.pettyCashTransaction['pettyCashRef'],
            reason: this.pettyCashTransaction['reason']

          }
          if (this.pettyCashTransaction['counterPartyNo']) {
            this.newPettyCashInformationForm.get('amount').enable();
          }
          this.transactionLimit = this.pettyCashTransaction['counterPartyNo']['transactionLimit']
          this.onPartySelected(this.pettyCashTransaction['partyNo'])
          this.newPettyCashInformationForm.setValue(editPettyCashPayload)
        }
      }
    })
  }
  //**********************************************//
  accountNames: any;
  today;
  totalBalance = 0;
  pettyCashRefNumber;
  journalId;
  journalRef;
  payload: Object;
  saveData: Object;
  totalLimit = 0;
  showAmount = true;


  newPettyCashInformationForm: FormGroup;

  newPettyCashInformationFormValidations = {
    date: new FormControl(''),
    partyNo: new FormControl('', Validators.required),
    balance: new FormControl(''),
    counterPartyNo: new FormControl('', Validators.required),
    reference: new FormControl('', Validators.required),
    amount: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    pettyCashRef: new FormControl('', Validators.required),
    reason: new FormControl('', Validators.required)
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
  fromTxnDate
  toTxnDate
  getTransactionsBySearch() {

    this.startPosition = 0;
    let formData = new FormData();
    formData.append("fromDate", this.fromTxnDate);
    formData.append("toDate", this.toTxnDate);
    formData.append("refNo", this.transactionRefNo);
    formData.append("party", this.selectedSearchParty ? this.selectedSearchParty['accountId'] : undefined);
    formData.append("counterParty", this.selectedSearchCounterParty ? this.selectedSearchCounterParty['accountId'] : undefined);

    this.spinnerService.show()
    this.pettyCashService.getAllPettyCashTransactionsSearchCount(formData).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.pettyHistorySearchRowCount = res['result']
          this.pettyCashGridOptions.api.setDatasource(this.pettyCashHistorySearchDatasource);
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

  getAccRecNumber() {
    this.pettyCashService.getAccountReceivablessNumber().subscribe(uniquecodeRes => {
      if (uniquecodeRes instanceof Object) {
        if (uniquecodeRes['responseStatus']['code'] == 200) {
          this.journalRef = uniquecodeRes['result'];
        }
      }
    })
  }
  getGeneralLedgerNumber() {
    this.pettyCashService.getGeneralLedgerNumber().subscribe(uniquecodeRes => {
      if (uniquecodeRes instanceof Object) {
        if (uniquecodeRes['responseStatus']['code'] == 200) {
          this.journalId = uniquecodeRes['result'];
        }
      }
    })
  }
  getPettyCashNumber() {
    this.pettyCashService.getPettyCashNumber().subscribe(uniquecodeRes => {
      if (uniquecodeRes instanceof Object) {
        if (uniquecodeRes['responseStatus']['code'] == 200) {
          this.pettyCashRefNumber = uniquecodeRes['result'];
        }
      }
    })
  }
  selectedCounterParty;
  selectedParty;
  currentBalance = 0;
  pettyCashBalance = 0;
  transactionLimit = 0;

  getAllChartOfAccounts() {
    this.pettyCashService.getAllAccountsById(localStorage.getItem('pharmacyId')).subscribe((res) => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.accountNames = res['result'];
        }

      }
    })
  }

  counterPartyAccountNames;

  onPartySelected(event) {
    this.pettyCashService.getAccountById(event['accountId']).subscribe((res) => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.currentBalance = res['result']['currentBalance'];
          this.newPettyCashInformationForm.patchValue({ balance: res['result']['currentBalance'] })
        }
      }
    })
    const deleteObj = (data, column, search) => {
      let result = data.filter(m => m[column] !== search);
      return result;
    }

    this.counterPartyAccountNames = deleteObj(this.accountNames, 'accountNo', event['accountNo']);
  }
  oldPettyCashBal: any;
  newPettyCashBal: any;
  oncounterPartySelected(event) {
    this.newPettyCashInformationForm.get('amount').enable();
    this.pettyCashService.getAccountById(event['accountId']).subscribe((res) => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.transactionLimit = res['result']['transactionLimit']
          this.totalLimit = res['result']['totalLimit'];
          this.oldPettyCashBal = res['result']['currentBalance'];
        }
      }
    })
  }
  availableBal = 0;
  onAmountSelected(event: Event) {
    let val = event['target']['value'];
    var am = Number(isNaN(val) ? 0 : val);
    am = (am < 0 ? 0 : am);
    this.totalBalance = this.calculateBal(am);
    this.newPettyCashInformationForm.get('balance').setValue(this.totalBalance.toFixed(2))

  }

  onClear() {
    this.newPettyCashInformationForm.get('amount').disable();
  }

  onPartyClear() {
    this.newPettyCashInformationForm.get('balance').setValue('');
  }
  calculateBal(am) {
    let bal = this.currentBalance;
    this.availableBal = bal - am;
    return this.availableBal;
  }


  totalFromAccountAmount
  totalToAccountAmount
  onPettyCashSubmit() {

    if (Math.sign(this.totalBalance) == -1) {
      this.toasterService.error('Amount selected exceeds current balance of selected party', 'Error', {
        timeOut: 3000
      })
    }
    // else if (this.newPettyCashInformationForm.get('amount').value > this.totalLimit) {
    //   this.toasterService.error('Amount selected exceeds total limit set for this account', 'Error', {
    //     timeOut: 3000
    //   })
    // }
    // else if (this.newPettyCashInformationForm.get('amount').value > this.transactionLimit) {
    //   this.toasterService.error('Amount selected is more than transaction limit', 'Error', {
    //     timeOut: 3000
    //   })
    // } 
    else {




      let formData = new FormData()
      formData.append("party", this.pettyCashTransaction['partyNo']['accountId'])
      formData.append("counterParty", this.pettyCashTransaction['counterPartyNo']['accountId'])
      formData.append("amount", this.pettyCashTransaction['amount'])
      formData.append("selectedParty", this.selectedParty['accountId'])
      formData.append("selectedCounterParty", this.selectedCounterParty['accountId'])

      this.pettyCashService.updateCOABalanceWithPrevAmt(formData).subscribe(res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            let partyBalance = res['result']['partyAccount']['currentBalance']
            let counterPartyBalnce = res['result']['counterPartyAccount']['currentBalance']

            let partyAmount = this.newPettyCashInformationForm.get('amount').value;
            this.totalFromAccountAmount = parseFloat(partyBalance) - parseFloat(partyAmount);
            this.totalFromAccountAmount = this.totalFromAccountAmount.toFixed(2);

            let counterPartyAmount = this.newPettyCashInformationForm.get('amount').value;
            this.totalToAccountAmount = parseFloat(counterPartyBalnce) + parseFloat(counterPartyAmount);
            this.totalToAccountAmount = this.totalToAccountAmount.toFixed(2);

            let payload = Object.assign({}, this.newPettyCashInformationForm.value)
            payload['pettyCashId'] = this.pettyCashTransaction['pettyCashId']
            payload['date'] = this.today;
            payload['createdUser'] = localStorage.getItem('id');
            payload['lastUpdateUser'] = localStorage.getItem('id');
            payload['balance'] = this.totalFromAccountAmount
            payload['counterPartyBalance'] = this.totalToAccountAmount

            //create general ledger entry
            let saveData = Object.assign({});
            saveData['journalId'] = this.journalId
            saveData['journalRef'] = this.journalRef;
            saveData['entryNo'] = payload['pettyCashRef'];
            saveData['entryType'] = "Petty Cash";
            saveData['party'] = this.selectedParty['accountNo']
            saveData['counterParty'] = this.selectedCounterParty['accountNo'];
            saveData['entryDate'] = payload['date'];
            saveData['debit'] = payload['amount'];
            saveData['credit'] = 0;
            saveData['balance'] = this.totalFromAccountAmount;
            saveData['pharmacyModel'] = { pharmacyId: localStorage.getItem('pharmacyId') };
            saveData['createdUser'] = localStorage.getItem('id');
            saveData['lastUpdateUser'] = localStorage.getItem('id');
            this.pettyCashService.savePettyCashDetails(payload).subscribe((pettyres) => {
              if (pettyres instanceof Object) {
                if (pettyres['responseStatus']['code'] == 200) {
                  this.pettyCashService.saveGeneralLedgerEntry(saveData).subscribe(res => {
                    if (res instanceof Object) {
                      if (res['responseStatus']['code'] == 200) {
                        this.reset();
                        this.toasterService.success(pettyres['message'], 'Success', {
                          timeOut: 3000
                        })
                      }
                    }
                  }, error => {
                    this.toasterService.error('Please contact administrator', 'Error', {
                      timeOut: 3000
                    })
                  })
                } else {
                  this.toasterService.error('Please contact administrator', 'Error', {
                    timeOut: 3000
                  })
                }
              }
            }, error => {
              this.toasterService.error('Please contact administrator', 'Error', {
                timeOut: 3000
              })
            })


          }
        }
      })


    }
  }

  reset() {

    this.newPettyCashInformationForm.get('amount').disable();
    this.newPettyCashInformationForm.reset();
    this.newPettyCashInformationForm.patchValue({ date: this.datePipe.transform(this.today, 'dd-MM-yyyy') });

    if (this.transactionRefNo || this.fromTxnDate || this.toTxnDate
      || this.selectedSearchParty || this.selectedSearchCounterParty) {

      this.getTransactionsBySearch()
    } else {
      this.getAllPettyCashDetails()
    }
    this.getGeneralLedgerNumber();
    this.getPettyCashNumber();
    this.getAccRecNumber();
    this.getAllChartOfAccounts();

  }

  checkFormDisability() {
    return (this.newPettyCashInformationForm.get('partyNo').errors instanceof Object)
      || (this.newPettyCashInformationForm.get('counterPartyNo').errors instanceof Object)
      || (this.newPettyCashInformationForm.get('reference').errors instanceof Object)
      || this.newPettyCashInformationForm.get('amount').invalid
      || this.newPettyCashInformationForm.get('amount').errors instanceof Object
      || this.newPettyCashInformationForm.get('reason').errors instanceof Object
  }


  viewPettyCashInformationForm: FormGroup;

  viewPettyCashInformationFormValidations = {
    date: new FormControl(''),
    partyNo: new FormControl('', Validators.required),
    balance: new FormControl(''),
    counterPartyNo: new FormControl('', Validators.required),
    reference: new FormControl('', Validators.required),
    amount: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    pettyCashRef: new FormControl('', Validators.required),
    reason: new FormControl('', Validators.required)
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

  change(pettyCashDetails) {

    this.viewPettyCashInformationForm.get('partyNo').disable()
    this.viewPettyCashInformationForm.get('counterPartyNo').disable()

    let editPettyCashPayload: Object = {
      date: pettyCashDetails['date'],
      partyNo: pettyCashDetails['partyNo'],
      balance: pettyCashDetails['partyNo']['currentBalance'],
      counterPartyNo: pettyCashDetails['counterPartyNo'],
      reference: pettyCashDetails['reference'],
      amount: pettyCashDetails['amount'],
      pettyCashRef: pettyCashDetails['pettyCashRef'],
      reason: pettyCashDetails['reason']

    }


    this.viewPettyCashInformationForm.setValue(editPettyCashPayload)
  }
}
