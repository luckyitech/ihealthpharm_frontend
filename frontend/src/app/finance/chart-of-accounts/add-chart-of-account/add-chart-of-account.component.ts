import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { ChartOfAccountsService } from '../shared/chart-of-accounts.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-chart-of-account',
  templateUrl: './add-chart-of-account.component.html',
  styleUrls: ['./add-chart-of-account.component.scss']
})
export class AddChartOfAccountComponent implements OnInit {


  COAInformationForm: FormGroup
  accountTypes;
  today;
  payload: Object;
  totalLimit = 0;
  constructor(private coaService: ChartOfAccountsService, private datePipe: DatePipe, private toasterService: ToastrService) {
    this.coaService.getTotalLimitFromGL().subscribe(res => {
      this.totalLimit = res['result'];
    })
    this.coaService.getAllAccountTypes().subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.accountTypes = res['result'];
        }
      }
    })
    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    setTimeout(() => {
      this.COAInformationForm.patchValue({ date: this.datePipe.transform(this.today, 'dd-MM-yyyy') });
    }, 200);

  }
  COAInformationFormValidations = {
    date: new FormControl('', [Validators.required]),
    accountNo: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    accountName: new FormControl('', Validators.required),
    accountType: new FormControl('', Validators.required),
    currentBalance: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    asOfDate: new FormControl('', Validators.required),
    transactionLimit: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    totalLimit: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')])
  }

  checkFormDisability() {
    return (this.COAInformationForm.get('accountNo').errors instanceof Object)
      || (this.COAInformationForm.get('accountNo').invalid)
      || (this.COAInformationForm.get('accountName').errors instanceof Object)
      || (this.COAInformationForm.get('accountType').errors instanceof Object)
      || (this.COAInformationForm.get('currentBalance').errors instanceof Object)
      || (this.COAInformationForm.get('currentBalance').invalid)
      || (this.COAInformationForm.get('asOfDate').errors instanceof Object)
      || (this.COAInformationForm.get('transactionLimit').errors instanceof Object)
      || (this.COAInformationForm.get('transactionLimit').invalid)
      || (this.COAInformationForm.get('totalLimit').errors instanceof Object)
      || (this.COAInformationForm.get('totalLimit').invalid)
  }

  coaButtonSubmitDisable = false
  onCOASubmit() {
    this.COAInformationForm.get('accountNo').setErrors({ 'incorrect': true });
    let payload = Object.assign({}, this.COAInformationForm.value)
    payload['date'] = this.today
    payload['createdUser'] = localStorage.getItem('id');
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['pharmacyModel'] = { pharmacyId: 1 }
    payload['asOfDate'] = this.datePipe.transform(this.COAInformationForm.get('asOfDate').value, 'yyyy-MM-dd')
    this.coaService.saveCOADetails(payload).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.toasterService.success(res['message'], 'Success', {
            timeOut: 3000
          })
        }
      }
    }, error => {
      this.toasterService.error('Account No Already exists', 'Error', {
        timeOut: 5000
      })
    })
    this.reset();
    this.COAInformationForm.patchValue({ date: this.datePipe.transform(this.today, 'dd-MM-yyyy') });
  }
  reset() {
    this.COAInformationForm.reset();
    this.COAInformationForm.patchValue({ date: this.datePipe.transform(this.today, 'dd-MM-yyyy') });
  }
  ngOnInit() {
    this.COAInformationForm = new FormGroup(this.COAInformationFormValidations)
  }

}
