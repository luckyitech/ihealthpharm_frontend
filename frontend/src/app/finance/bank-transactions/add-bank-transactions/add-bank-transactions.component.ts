import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TransactionService } from '../shared/transaction.service';

@Component({
  selector: 'app-add-bank-transactions',
  templateUrl: './add-bank-transactions.component.html',
  styleUrls: ['./add-bank-transactions.component.scss'],
  providers: [TransactionService]
})
export class AddBankTransactionsComponent implements OnInit {

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
  modes: any;
  constructor(private transactionService: TransactionService,
    private datePipe: DatePipe, private toasterService: ToastrService) {
    this.getReferenceNo();
    this.getAllAccountNames();
    this.getCurrentDate();
    this.getAllJournalId();
    this.getAllJournaRefNo()
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
    reason: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)])
  }

  ngOnInit() {
    this.transactionInformationForm = new FormGroup(this.newtransactionInformationFormValidations);
    //this.transactionInformationForm.get('amount').disable();

  }

  // modes = [{ name: 'Deposit' },
  // { name: 'Cheque' },
  // { name: 'Net Banking' },
  // { name: 'CreditCard' },
  // { name: 'Withdrawls' },
  // { name: 'DebitCard' }];

  selectedMode: any;
  selectedToAccount: any;
  selectedFromParty: any;
  selectedType: any;
  type: any;
  totalAmount;
  names;
  toAccountBalance
  onPartyAccountSelected(event) {
    this.txnButtonSubmitDisable=false
    this.transactionService.getBalanceFromChartAccount(event['accountId']).subscribe(response => {

      this.accountBalance = parseFloat(response['result']);

      this.accountBalance = this.accountBalance.toFixed(2);

      this.transactionInformationForm.patchValue({
        balance: this.accountBalance
      })
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
    this.txnButtonSubmitDisable=false
    //this.transactionInformationForm.get('amount').enable();
    this.transactionService.getBalanceFromChartAccount(event['accountId']).subscribe(response => {
      if (response['result'] != null && response['result'] != undefined && response['result'] != '') {
        //console.log(response['result'])
        this.toAccountBalance = parseFloat(response['result']);
        //console.log(this.toAccountBalance)
        this.toAccountBalance = this.toAccountBalance.toFixed(2);
      }
    });

  }

  onPartyClear() {
    this.transactionInformationForm.get('balance').setValue('');
    this.transactionInformationForm.get('amount').setValue('');
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
      this.transactionInformationForm.patchValue({ transactionDate: this.currentDate });
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
      // this.modes = [{ name: 'Cash Deposit' },
      // { name: 'Cheque Deposit' },
      // { name: 'Online Transfer' },
      // { name: 'M-PESA Deposit' },
      // { name: 'PDQ Settlement' }];
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
      // this.modes = [{ name: 'Cheque' },
      // { name: 'Net Banking' },
      // { name: 'CreditCard' },
      // { name: 'Withdrawls' },
      // { name: 'DebitCard' },
      // { name: 'M-PESA' }];
      //this.transactionInformationForm.get('counterParty').enable();
    }
  }

  displayChequeNO = false;
  displayCardNO = false;
  displayAccountNO = false;
  displaytxnId = false;
  displayReason = false;
  displayPhoneNumber = false;
  onModeSelected(event) {

    if ((event['name'] == 'CreditCard') || (event['name'] == 'DebitCard')) {
      //this.transactionInformationForm.get('counterParty').enable();
      this.displayCardNO = true;
      this.displayAccountNO = false;
      this.displayChequeNO = false;
      this.displaytxnId = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
      this.showTxnId = false;

    }
    else if (event['name'] == "Net Banking") {
      //this.transactionInformationForm.get('counterParty').enable();
      this.displaytxnId = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;

    }
    else if (event['name'] == 'Cash Deposit') {
      // this.transactionInformationForm.get('counterParty').disable();
      //this.transactionInformationForm.get('counterParty').reset();
      this.transactionInformationForm.get('amount').enable();
      this.displaytxnId = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
    }
    else if ((event['name'] == 'Cheque Deposit')) {
      // this.transactionInformationForm.get('counterParty').disable();
      //this.transactionInformationForm.get('counterParty').reset();
      this.transactionInformationForm.get('amount').enable();
      this.displayChequeNO = true;
      this.displayCardNO = false;
      this.displaytxnId = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
      this.showTxnId = false;

    }
    else if ((event['name'] == 'Withdrawls')) {

      //this.transactionInformationForm.get('counterParty').disable();
      //this.transactionInformationForm.get('counterParty').reset();
      this.transactionInformationForm.get('amount').enable();
      this.displayReason = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displaytxnId = false;
      this.showTxnId = false;

    }
    else if (event['name'] == 'Cheque') {
      //this.transactionInformationForm.get('counterParty').enable();
      this.displayChequeNO = true;
      this.displayAccountNO = false;
      this.displayCardNO = false;
      this.displaytxnId = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
      this.showTxnId = false;
    }
    else if (event['name'] == 'M-PESA') {
      // this.transactionInformationForm.get('counterParty').enable();
      this.displaytxnId = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = true;

    }
    else if (event['name'] == 'Online Transfer') {
      //this.transactionInformationForm.get('counterParty').disable();
      //this.transactionInformationForm.get('counterParty').reset();
      this.displaytxnId = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = false;
    }
    else if (event['name'] == 'M-PESA Deposit') {
      //this.transactionInformationForm.get('counterParty').disable();
      // this.transactionInformationForm.get('counterParty').reset();
      this.displaytxnId = true;
      this.displayChequeNO = false;
      this.displayCardNO = false;
      this.displayAccountNO = false;
      this.displayReason = false;
      this.displayPhoneNumber = true;
    }
    else if (event['name'] == 'PDQ Settlement') {
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
    else if (event['name'] == 'CreditCard Deposit') {
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
  txnButtonSubmitDisable=false
  onTransactionSubmit() {
    this.txnButtonSubmitDisable=true
    let partyAmount = this.transactionInformationForm.get('amount').value;
    this.totalFromAccountAmount = parseFloat(this.accountBalance) - parseFloat(partyAmount);
    this.totalFromAccountAmount = this.totalFromAccountAmount.toFixed(2);

    let counterPartyAmount = this.transactionInformationForm.get('amount').value;
    //console.log(this.toAccountBalance)
    if(!this.toAccountBalance){
      this.totalToAccountAmount = parseFloat(counterPartyAmount);
    }else{
    this.totalToAccountAmount = parseFloat(this.toAccountBalance) + parseFloat(counterPartyAmount);
    }

    //console.log(this.totalToAccountAmount)
    this.totalToAccountAmount = this.totalToAccountAmount.toFixed(2);

    let payload = Object.assign({}, this.transactionInformationForm.value)
    payload['counterPartyBalance'] = this.totalToAccountAmount
    payload['transactionDate'] = this.today;
    payload['createdUser'] = localStorage.getItem('id');
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['balance'] = this.totalFromAccountAmount
    payload['mode'] = this.selectedMode['name'];
    payload['valueDate'] = this.today;
    payload['status']="Original Transaction";

    if (payload['party']['accountType']['accountType'] === "Bank Account (1200-1209)" || payload['counterParty']['accountType']['accountType'] === "Bank Account (1200-1209)") {

      this.transactionService.saveBankTransactionDetails(payload).subscribe((res) => {
        if (res instanceof Object) {
          if (res['status'] == 200) {
            if (this.selectedType == 'Credit') {

              let generalLedgerObj = Object.assign({});
              generalLedgerObj['journalId'] = this.journalId
              generalLedgerObj['journalRef'] = this.journalRef;
              generalLedgerObj['entryNo'] = payload['transactionRef'];
              generalLedgerObj['entryType'] = "Bank Transaction" + "-" + this.selectedMode['name'];
              generalLedgerObj['party'] = this.selectedFromParty['accountNo'];

              if ((this.transactionInformationForm.get('counterParty').value != undefined) && (this.transactionInformationForm.get('counterParty').value != null)) {
                generalLedgerObj['counterParty'] = this.selectedToAccount['accountNo'];
              }
              else {
                generalLedgerObj['counterParty'] = this.selectedFromParty['accountNo'];
              }
              generalLedgerObj['entryDate'] = payload['transactionDate'];
              generalLedgerObj['credit'] = payload['amount'];
              generalLedgerObj['debit'] = 0;
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
            }
            else if (this.selectedType == 'Debit') {
              let generalLedgerObj = Object.assign({});
              generalLedgerObj['journalId'] = this.journalId
              generalLedgerObj['journalRef'] = this.journalRef;
              generalLedgerObj['entryNo'] = payload['transactionRef'];
              generalLedgerObj['entryType'] = "Bank Transaction" + "-" + this.selectedMode['name'];
              generalLedgerObj['party'] = this.selectedFromParty['accountNo'];
              if ((this.transactionInformationForm.get('counterParty').value != undefined) && (this.transactionInformationForm.get('counterParty').value != null)) {
                generalLedgerObj['counterParty'] = this.selectedToAccount['accountNo'];
              }
              else {
                generalLedgerObj['counterParty'] = this.selectedFromParty['accountNo'];
              }
              generalLedgerObj['entryDate'] = payload['transactionDate'];
              generalLedgerObj['debit'] = payload['amount'];
              generalLedgerObj['credit'] = 0;
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
            }

            this.toasterService.success(res['message'], 'Success', {
              timeOut: 3000
            })
          }
        }
      });

    }else{
      this.toasterService.warning("Atleast one party/counter party must be a bank account"," ",{
        timeOut:4000
      })
      
    }
  }

  checkFormDisability() {
    return (this.transactionInformationForm.get('party').errors instanceof Object)
      || (this.transactionInformationForm.get('counterParty').errors instanceof Object)
      || (this.transactionInformationForm.get('balance').errors instanceof Object)
      || (this.transactionInformationForm.get('amount').errors instanceof Object)
      || (this.transactionInformationForm.get('mode').errors instanceof Object)
      || (this.transactionInformationForm.get('transactionType').errors instanceof Object)
      || (this.displayChequeNO == true ? this.transactionInformationForm.get('chequeNo').errors instanceof Object : false)
      || (this.displayCardNO == true ? this.transactionInformationForm.get('cardNo').errors instanceof Object : false)
      || (this.displaytxnId == true ? this.transactionInformationForm.get('transactionId').errors instanceof Object : false)
      || (this.showTxnId == true)
      || (this.displayReason == true ? this.transactionInformationForm.get('reason').errors instanceof Object : false)
      || (this.displayPhoneNumber == true ? this.transactionInformationForm.get('phoneNumber').errors instanceof Object : false)
  }
  reset() {
    this.transactionInformationForm.reset();
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



}
