import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PettyCashService } from '../petty-cash/shared/petty-cash.service';
import { ToastrService } from 'ngx-toastr';
import { ChartOfAccountsService } from '../chart-of-accounts/shared/chart-of-accounts.service';
import { formatDate, DatePipe } from '@angular/common';

@Component({
  selector: 'app-till-balance',
  templateUrl: './till-balance.component.html',
  styleUrls: ['./till-balance.component.scss'],
  providers: [PettyCashService, ChartOfAccountsService]
})
export class TillBalanceComponent implements OnInit {
  accountNames: any;
  previousBal = 0;
  payload: Object;
  payloadCOA: Object
  today;
  adjustedAmount = 0;
  displayAccountType: boolean

  constructor(private pettyCashService: PettyCashService, private datePipe: DatePipe,
    private COAService: ChartOfAccountsService, private toasterService: ToastrService) {
    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    setTimeout(() => {
      this.tillBalInformationForm.patchValue({ asOfDate: this.datePipe.transform(this.today, 'dd-MM-yyyy') });
    }, 200);
    this.getAllTillChartOfAccounts();
  }

  tillBalInformationForm: FormGroup;
  tillBalInformationFormValidations = {
    prevBalance: new FormControl(''),
    adjustedAmount: new FormControl(''),
    tillAccount: new FormControl(''),
    curBalance: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    asOfDate: new FormControl('')
  };
  currentPrevBal = 0;
  onCurrentBalEnter(event: Event) {
    let val = event['target']['value'];
    let am = Number(isNaN(val) ? 0 : val);
    am = (am < 0 ? 0 : am);
    let totalBal;
    totalBal = this.calculateBal(am);
    this.tillBalInformationForm.patchValue({ adjustedAmount: totalBal.toFixed(2) })

  }
  calculateBal(am) {

    let bal = this.previousBal;
    if (bal > am) {
      this.adjustedAmount = bal - am;
    } else {
      this.adjustedAmount = am - bal;
    }
    return this.adjustedAmount;
  }

  tillBalAccount;
  getAllTillChartOfAccounts() {
    this.pettyCashService.getAllAccountsByType("Till (9900-9999)").subscribe((res) => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.accountNames = res['result'];
          if (this.accountNames.length > 1) {

            

          } else {
            for (var i = 0; i < this.accountNames.length; i++) {

              this.tillBalInformationForm.get('tillAccount').disable()
              this.tillBalAccount = this.accountNames[i];
              this.tillBalInformationForm.get('tillAccount').setValue(this.tillBalAccount['accountName'])

              this.previousBal = this.tillBalAccount['currentBalance'];

              this.tillBalInformationForm.patchValue({ prevBalance: this.previousBal })

            }
          }

        }

      }
    })
  }

  onTillAccountSelected(event) {
    this.tillBalAccount = event;

    this.previousBal = this.tillBalAccount['currentBalance'];

    this.tillBalInformationForm.patchValue({ prevBalance: this.previousBal })
  }

  reset() {
    this.tillBalInformationForm.reset();
    this.tillBalInformationForm.patchValue({ asOfDate: this.datePipe.transform(this.today, 'dd-MM-yyyy') });
    this.tillBalInformationForm.patchValue({ prevBalance: this.previousBal })
  }

  onSubmit() {

    this.tillBalInformationForm.get('curBalance').setErrors({ 'incorrect': true });
    let payload = Object.assign({}, this.tillBalInformationForm.value);
    payload['asOfDate'] = this.datePipe.transform(this.today, 'yyyy-MM-dd');
    payload['createdUser'] = localStorage.getItem('id');
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['pharmacyModel'] = { pharmacyId: localStorage.getItem('pharmacyId') }
    this.COAService.saveTillBal(payload).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.previousBal = res['result']['curBalance']
          this.tillBalInformationForm.patchValue({ prevBalance: this.previousBal })
          this.toasterService.success(res['message'], 'Success', {
            timeOut: 3000
          })

          //updating chart of account
          let payloadCOA = Object.assign({}, this.tillBalAccount)

          payloadCOA['accountName'] = this.tillBalAccount['accountName']
          payloadCOA['date'] = this.today
          payloadCOA['asOfDate'] = payload['asOfDate']
          payloadCOA['currentBalance'] = this.previousBal


          this.COAService.saveCOADetails(payloadCOA).subscribe(res => {
            if (res instanceof Object) {
              if (res['responseStatus']['code'] == 200) {
                // this.toasterService.success(res['message'], 'Success', {
                //   timeOut: 3000
                // })
                this.getAllTillChartOfAccounts();
              }
            }
          })
        }
      }
    })

    this.tillBalInformationForm.reset();
    this.tillBalInformationForm.patchValue({ tillAccount: this.tillBalAccount['accountName'] });
    this.tillBalInformationForm.patchValue({ asOfDate: this.datePipe.transform(this.today, 'dd-MM-yyyy') });




  }
  checkFormDisability() {
    return (this.tillBalInformationForm.get('prevBalance').invalid)
      || (this.tillBalInformationForm.get('asOfDate').errors instanceof Object)
      || (this.tillBalInformationForm.get('curBalance').invalid)
  }

  ngOnInit() {
    this.tillBalInformationForm = new FormGroup(this.tillBalInformationFormValidations);
  }

}
