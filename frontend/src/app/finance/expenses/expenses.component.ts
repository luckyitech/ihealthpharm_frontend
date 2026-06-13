import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { ExpensesService } from './expenses.service';
import { ToastrService } from 'ngx-toastr';
import { PettyCashService } from '../petty-cash/shared/petty-cash.service';
import { TransactionService } from '../bank-transactions/shared/transaction.service';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  providers: [ExpensesService, PettyCashService]
})
export class ExpensesComponent implements OnInit {
  switchTab = "expenses";
  bankNames: any[] = [];
  today;
  expenseNumber;
  totalAmount: number;
  totalAmtCharges: number;
  availableBal = 0;
  generalLedgerNum: any;
  currentBalance: any;
  totalBalance: any;
  accPayableNumber: any;
  categories = [{ name: 'Stationary' }, { name: 'Rent' }, { name: 'Telephone ' }, { name: 'Bills' },
  { name: 'Interent Bill' }, { name: 'Packing material' }, { name: 'Repair and Maintenance' },
  { name: 'Fixed Asset ' }, { name: 'Others' }];
  modes: any;
  // modes = [{ name: 'Deposit' }, { name: 'Cheque' }, { name: 'Net Banking' }, { name: 'CreditCard' }, { name: 'Withdrawls' }, { name: 'DebitCard' }];


  constructor(private expensesService: ExpensesService, private toasterService: ToastrService,
    private datePipe: DatePipe, private pettyService: PettyCashService, private transactionService: TransactionService) {
    this.getAllModesList();
    this.expensesService.getExpensesNumber().subscribe(expenseNum => {
      if (expenseNum['responseStatus']['code'] == 200) {
        this.expenseNumber = expenseNum['result'];
      }
    });

    this.expensesService.getAccountPayablesNumber().subscribe(jurnalRefNum => {
      if (jurnalRefNum['responseStatus']['code'] == 200) {
        this.accPayableNumber = jurnalRefNum['result'];
      }
    })

    this.expensesService.getGeneralLedgerNumber().subscribe(generalLedger => {
      if (generalLedger['responseStatus']['code'] == 200) {
        this.generalLedgerNum = generalLedger['result'];
      }
    });


    this.getChartOfAccountsData();

    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    setTimeout(() => {
      this.expensesInformationForm.patchValue({ expensesDate: this.today });
    }, 200);
  }

  ngOnInit() {
    this.expensesInformationForm = new FormGroup(this.newExpensesInformationFormValidations);
    this.expensesInformationForm.get('amount').disable();
  }
  getAllModesList() {
    this.expensesService.getAllModes().subscribe((res) => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] === 200) {
          this.modes = res['result'];

        }
      }
    })
  }
  getChartOfAccountsData() {
    this.expensesService.getAllPettyData().subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] === 200) {
          this.bankNames = res['result'];
        }
      }
    });
  }
  expensesInformationForm: FormGroup;

  newExpensesInformationFormValidations = {
    date: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]),
    account: new FormControl('', Validators.required),
    balance: new FormControl('', Validators.required),
    reference: new FormControl('', Validators.required),
    amount: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    expenseNo: new FormControl(''),
    counterPartyNo:new FormControl('',Validators.required),
    categories: new FormControl('', Validators.required),
    mode: new FormControl('', Validators.required),
    cardNo: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    chequeNo: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    txnId: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
    reason: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)])
  }

  checkFormDisability() {
    return (this.expensesInformationForm.get('date').errors instanceof Object)
      || (this.expensesInformationForm.get('account').errors instanceof Object)
      || (this.expensesInformationForm.get('balance').errors instanceof Object)
      || (this.expensesInformationForm.get('reference').errors instanceof Object)
      || this.expensesInformationForm.get('amount').errors instanceof Object
      || this.expensesInformationForm.get('counterPartyNo').errors instanceof Object
      || this.expensesInformationForm.get('mode').errors instanceof Object
      || (this.displayChequeNO == true ? this.expensesInformationForm.get('chequeNo').errors instanceof Object : false)
      || (this.displayCardNO == true ? this.expensesInformationForm.get('cardNo').errors instanceof Object : false)
      || (this.displaytxnId == true ? this.expensesInformationForm.get('txnId').errors instanceof Object : false)
      || (this.showTxnId == true)
      || (this.displayReason == true ? this.expensesInformationForm.get('reason').errors instanceof Object : false)
      || (this.displayPhoneNumber == true ? this.expensesInformationForm.get('phoneNumber').errors instanceof Object : false)
  }
  selectedFromAccount: any;
  selectedToAccount:any;
  chartOfAccBalance: any;
  selectedCategory: any;
  asOfDate
  selectedMode: any;
  counterPartyAccountNames

  onFromAccountSelected(event) {
    this.expenseButtonSubmitDisable=false
    this.selectedFromAccount = event;
    this.expensesService.getBalanceFromChartAccount(event['accountId']).subscribe(response => {
      if (response instanceof Object) {
        if (response['responseStatus']['code'] = 200) {
          this.chartOfAccBalance = response['result']['currentBalance'];
          // this.asOfDate = response['result']['asOfDate']
          this.expensesInformationForm.patchValue({
            balance: response['result']['currentBalance']
          });
        }
      }
    })

    const deleteObj = (data, column, search) => {
      let result = data.filter(m => m[column] !== search);
      return result;
    }
    this.counterPartyAccountNames = deleteObj(this.bankNames, 'accountNo', this.selectedFromAccount['accountNo']);
  }

  oncounterPartySelected(event) {
    this.expenseButtonSubmitDisable=false
    this.selectedToAccount=event
    this.expensesInformationForm.get('amount').enable();
    this.pettyService.getAccountById(event['accountId']).subscribe((res) => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
         
        }
      }
    })
  }

  onClear() {
    this.expensesInformationForm.get('amount').disable();
  }

  onPartyClear() {
    this.expensesInformationForm.get('balance').setValue('');
  }

  onCategorySelected(event) {
    this.selectedCategory = event['name'];
  }
  displayChequeNO = false;
  displayCardNO = false;
  displayAccountNO = false;
  displaytxnId = false;
  displayReason = false;
  displayPhoneNumber = false;

  onModeSelected(event) {
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
  tranData;
  showTxnId = false;
  onSearchTransactionId(event) {
    if (event.target.value) {
      this.transactionService.getAllTransactionIds(event.target.value).subscribe(res => {
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
  changeBalance() {

    this.expensesInformationForm.patchValue({
      balance: ''
    });
    this.chartOfAccBalance = undefined;
  }
  onAmountChange(event: Event) {
    let val = event['target']['value'];
    var am = Number(isNaN(val) ? 0 : val);
    am = (am < 0 ? 0 : am);
    this.totalBalance = this.calculateBal(am);
    this.expensesInformationForm.get('balance').setValue(this.totalBalance)
  }

  calculateBal(am) {
    let bal = this.chartOfAccBalance;
    this.availableBal = bal - am;
    return this.availableBal;
  }


  expensesData: any;
  expenseButtonSubmitDisable=false
  onExpensesSubmit() {
    this.expenseButtonSubmitDisable=true

    let counterPartyBalance=parseFloat(this.selectedToAccount['currentBalance'])+parseFloat(this.expensesInformationForm.get('amount').value)


    let payload = Object.assign({}, this.expensesInformationForm.value);
    payload['account'] = this.selectedFromAccount
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    payload['categories'] = this.selectedCategory;
    payload['asOfDate'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    payload['counterPartyBalance']=counterPartyBalance.toFixed(2)

    payload['mode'] = this.selectedMode['name'];

    this.expensesService.saveExpenses(payload).subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] === 200) {

            this.expensesData = res['result'];

            this.toasterService.success(res['message'], 'Success', {
              timeOut: 3000
            });

            let glExpensesObj = {
              journalId: this.generalLedgerNum,
              journalRef: this.accPayableNumber,
              entryNo: this.expensesData['expenseNo'],
              entryType: 'Expenses',
              party: this.selectedFromAccount['accountNo'],
              counterParty:this.selectedToAccount['accountNo'],
              entryDate: this.expensesData['date'],
              debit: this.expensesData['amount'],
              credit: this.expensesData['amount'],
              balance: this.expensesData['balance'],
              pharmacyModel: { 'pharmacyId': localStorage.getItem('pharmacyId') },
              createdUser: localStorage.getItem('id'),
              lastUpdateUser: localStorage.getItem('id')

            }
            this.expensesService.saveGeneralLedger(glExpensesObj).subscribe(res => {

              // this.pettyService.updateBalance(this.expensesData['account']['accountId'], this.expensesData['balance']).subscribe(res => {

              // });
            })
            this.resetForm();
          } else {


          }
        }
      }, error => {

      }
    );
  }

  resetForm() {
    this.expensesInformationForm.get('amount').disable();
    this.expensesInformationForm.reset();
    this.selectedMode = undefined;
    this.displayChequeNO = false;
    this.displayCardNO = false;
    this.displayAccountNO = false;
    this.displaytxnId = false;
    this.displayReason = false;
    this.displayPhoneNumber = false;
    this.showTxnId = false;
    this.expensesInformationForm.patchValue({
      'date': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    });
    this.expensesService.getExpensesNumber().subscribe(expenseNum => {
      if (expenseNum['responseStatus']['code'] == 200) {
        this.expenseNumber = expenseNum['result'];
      }
    });

  }

  switchTabOnClick(value){
    this.switchTab = value;
  }
}
