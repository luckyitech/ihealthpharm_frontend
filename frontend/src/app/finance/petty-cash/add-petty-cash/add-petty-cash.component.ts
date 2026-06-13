import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PettyCashService } from '../shared/petty-cash.service';

@Component({
  selector: 'app-add-petty-cash',
  templateUrl: './add-petty-cash.component.html',
  styleUrls: ['./add-petty-cash.component.scss'],
  providers: [PettyCashService]
})
export class AddPettyCashComponent implements OnInit {

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

  constructor(private pettyCashService: PettyCashService, private datePipe: DatePipe,
    private toasterService: ToastrService, private router: Router) {
    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    setTimeout(() => {
      this.newPettyCashInformationForm.patchValue({ date: this.datePipe.transform(this.today, 'dd-MM-yyyy') });
    }, 200);

    this.getAllChartOfAccounts();
    this.getAccRecNumber();
    this.getPettyCashNumber();
    this.getGeneralLedgerNumber();
  }
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
    this.counterPartyAccountNames = deleteObj(this.accountNames, 'accountNo', this.selectedParty['accountNo']);
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

  pettyButtonSubmitDisable=false
  onPettyCashSubmit() {

    this.pettyButtonSubmitDisable=true
    // if (Math.sign(this.totalBalance)==-1) {
    //   this.toasterService.error('Amount selected exceeds current balance of selected party', 'Error', {
    //     timeOut: 3000
    //   })
    // }
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

    //this.newPettyCashBal = Number(this.oldPettyCashBal) + Number(this.newPettyCashInformationForm.get('amount').value);
    let counterPartyBalance = parseFloat(this.selectedCounterParty['currentBalance']) + parseFloat(this.newPettyCashInformationForm.get('amount').value);
    let partyBalance = parseFloat(this.selectedParty['currentBalance']) - parseFloat(this.newPettyCashInformationForm.get('amount').value);

    let payload = Object.assign({}, this.newPettyCashInformationForm.value)
    payload['date'] = this.today;
    payload['createdUser'] = localStorage.getItem('id');
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['balance'] = partyBalance.toFixed(2);
    payload['counterPartyBalance'] = counterPartyBalance.toFixed(2)

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
    saveData['credit'] = payload['amount'];
    saveData['balance'] = this.newPettyCashInformationForm.get('balance').value;
    saveData['pharmacyModel'] = { pharmacyId: localStorage.getItem('pharmacyId') };
    saveData['createdUser'] = localStorage.getItem('id');
    saveData['lastUpdateUser'] = localStorage.getItem('id');

    this.pettyCashService.savePettyCashDetails(payload).subscribe((pettyres) => {
      if (pettyres instanceof Object) {
        if (pettyres['responseStatus']['code'] == 200) {
          this.pettyCashService.saveGeneralLedgerEntry(saveData).subscribe(res => {
            if (res instanceof Object) {
              if (res['responseStatus']['code'] == 200) {
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
    this.reset();
  }


  reset() {
    this.newPettyCashInformationForm.get('amount').disable();
    this.newPettyCashInformationForm.reset();
    this.newPettyCashInformationForm.patchValue({ date: this.datePipe.transform(this.today, 'dd-MM-yyyy') });
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

  ngOnInit() {
    this.newPettyCashInformationForm = new FormGroup(this.newPettyCashInformationFormValidations);
    this.newPettyCashInformationForm.get('amount').disable();
  }


}
