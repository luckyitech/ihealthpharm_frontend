import { UserHistoryModel } from './core/user-history/user-history.model';
import { UserHistoryService } from './core/user-history/user-history.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import {
  faClinicMedical,
  faLayerGroup,
  faFileInvoiceDollar,
  faWallet,
  faUsers,
  faCog,
  faBell,
  faClipboard,
  faBars,
  faFolder,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import 'bootstrap';
import { EmployeeService } from './masters/employee/shared/employee.service';
import { LoginService } from './login/shared/login.service';
import { AppService } from './core/app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: 'app-root',
  host: {
    '(window:keydown)': 'hotKeys($event)',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(mousemove)': 'mouseMove()',
    '(click)': 'clickFun()'

  },
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [EmployeeService]
})

export class AppComponent {
  userId: any;
  authorized: boolean;
  employeeId;
  employeeImage;
  employeeDetails;
  permissions: any;
  masters: boolean = false;
  stock: boolean = false;
  sales: boolean = false;
  finance: boolean = false;
  crm: boolean = false;
  reports: boolean = false;
  checkListPendingNumber: any;
  showErrorMsg = false;
  checkCfrmPwd = false;
  resetBtn = true;
  userHistoryModel: UserHistoryModel;
  constructor(private router: Router, private employeeService: EmployeeService, private userIdle: UserIdleService,
    private loginService: LoginService, private appService: AppService, private toasterService: ToastrService,
    private userHistoryService: UserHistoryService) {
    this.getCheckListCountForPending();

    this.appService.getPermissions().subscribe(res => {


      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];
        if (this.permissions[0]['activeS'] === 'Y' ||
          this.permissions[1]['activeS'] === 'Y' ||
          this.permissions[2]['activeS'] === 'Y' ||
          this.permissions[3]['activeS'] === 'Y' ||
          this.permissions[4]['activeS'] === 'Y') {
          this.masters = true;

        }
        else {
          this.masters = false;
        }

        //stock tab check
        if (this.permissions[11]['activeS'] === 'Y' ||
          this.permissions[12]['activeS'] === 'Y' ||
          this.permissions[13]['activeS'] === 'Y' ||
          this.permissions[14]['activeS'] === 'Y' ||
          this.permissions[15]['activeS'] === 'Y' ||
          this.permissions[16]['activeS'] === 'Y' ||
          this.permissions[17]['activeS'] === 'Y' ||
          this.permissions[18]['activeS'] === 'Y' ||
          this.permissions[19]['activeS'] === 'Y' ||
          this.permissions[20]['activeS'] === 'Y') {
          this.stock = true;
        }
        else {
          this.stock = false;
        }

        //sales tab check
        if (this.permissions[5]['activeS'] === 'Y' || this.permissions[6]['activeS'] === 'Y' || this.permissions[7]['activeS'] === 'Y') {
          this.sales = true;
        }
        else {
          this.sales = false;
        }

        //finance tab check
        if (this.permissions[21]['activeS'] === 'Y' || this.permissions[22]['activeS'] === 'Y'
          || this.permissions[23]['activeS'] === 'Y' || this.permissions[24]['activeS'] === 'Y'
          || this.permissions[25]['activeS'] === 'Y' || this.permissions[26]['activeS'] === 'Y') {
          this.finance = true;
        }
        else {
          this.finance = false;
        }

        //reports tab check
        if (this.permissions[10]['activeS'] === 'Y') {
          this.reports = true;
        }
        else {
          this.reports = false;
        }
      }


    });
  }
  getCheckListCountForPending() {
    this.appService.getCheckListPendingCount().subscribe(
      res => {
        if (res['responseStatus']['code'] == 200) {
          this.checkListPendingNumber = res['result'];
        }
      }
    )
  }
  title = 'IHealth Pharm';
  faClinicMedical = faClinicMedical;
  faLayerGroup = faLayerGroup;
  faFileInvoiceDollar = faFileInvoiceDollar;
  faWallet = faWallet;
  faUsers = faUsers;
  faClipboard = faClipboard;
  faCog = faCog;
  faBell = faBell;
  faBars = faBars;
  faFolder = faFolder;
  faChartLine = faChartLine;
  show: boolean;
  showNewPwd: boolean;
  showconfirmPwd: boolean;
  password() {
    this.show = !this.show;
  }
  passwordNew() {
    this.showNewPwd = !this.showNewPwd;
  }
  passwordConfirm() {
    this.showconfirmPwd = !this.showconfirmPwd;
  }
  navigateToStock() {
    this.router.navigate(['/stock'])
  }

  navigateToSales() {
    this.router.navigate(['/sales'])
  }

  navigateToMasters() {
    this.router.navigate(['/master'])
  }

  navigateToFinance() {
    this.router.navigate(['/finance'])
  }

  navigateToReports() {
    this.router.navigate(['/reports'])
  }
  logout() {
    this.userHistoryModel = new UserHistoryModel("logout", "Authentication", "logout");
    this.userHistoryService.saveUserhistoryDetails(this.userHistoryModel).subscribe(res => {
      localStorage.clear();
      this.userId = undefined;
      this.router.navigate(['/']);
    });


  }
  pwdChecking: any;
  onPwdEnter(event) {
    this.employeeService.getEmployeeCredentialsByEmployeeId(localStorage.getItem('id')).subscribe((res) => {
      this.employeeDetails = res['result'];
    });
    this.pwdChecking = event['target']['value'];
    if (this.employeeDetails['currentPassword'] == this.pwdChecking) {
      this.showErrorMsg = false;
      if (this.passwordResetForm.get('passwordConfirm').value.length > 0
        && this.passwordResetForm.get('passwordNew').value.length > 0) {
        if (this.passwordResetForm.get('passwordConfirm').value === this.passwordResetForm.get('passwordNew').value) {
          this.resetBtn = false;
        }
      }
    } else {
      this.showErrorMsg = true;
      this.resetBtn = true;
    }
  }
  onConfirmPwd(event) {
    if (this.passwordResetForm.value['passwordNew'] == event['target']['value']) {
      this.checkCfrmPwd = false;
      if (this.employeeDetails['currentPassword'] === this.passwordResetForm.get('passwordCurrent').value) {
        this.resetBtn = false;
      }
    } else {
      this.checkCfrmPwd = true;
      this.resetBtn = true;
    }
  }
  checkFormDisability() {
    return (this.passwordResetForm.get('passwordCurrent').errors instanceof Object)
      || (this.passwordResetForm.get('passwordNew').errors instanceof Object)
      || this.passwordResetForm.get('passwordNew').invalid
      || (this.passwordResetForm.get('passwordConfirm').errors instanceof Object)
      || !(this.passwordResetForm.get('passwordNew').value === this.passwordResetForm.get('passwordConfirm').value)
      || !(this.employeeDetails['currentPassword'] == this.pwdChecking)

  }
  updatePassword() {
    let resetpwd = {
      employeeCredentialsId: this.employeeDetails['employeeCredentialsId'],
      currentPassword: this.passwordResetForm.get('passwordConfirm').value
    }
    this.employeeService.updateEmployeePwdCredentials(resetpwd).subscribe((res) => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] === 200) {
          $("#exampleModal").modal("hide");
          this.passwordResetForm.reset();
          this.logout();
          this.toasterService.success(res['message'], 'Success', {
            timeOut: 3000
          });
        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 3000
          });
        }
      }
    });

    this.passwordResetForm.reset();
  }
  showPopUp = true;

  closeStatus() {
    this.showPopUp = true;
    this.passwordResetForm.reset();
  }

  passwordResetForm: FormGroup;
  passwordResetFormValidations = {
    passwordCurrent: new FormControl('', [Validators.required]),
    passwordNew: new FormControl('', [Validators.required, Validators.pattern(/(.){6,10}/)]),
    passwordConfirm: new FormControl('', [Validators.required]),
  };

  ngOnInit() {

    this.passwordResetForm = new FormGroup(this.passwordResetFormValidations);
    this.appService.getLogin().subscribe(res => {
      this.authorized = res;
      this.employeeId = localStorage.getItem('id');
      this.loginService.getEmployeeDataByEmployeeId(this.employeeId).subscribe((res) => {
        this.userId = res['result'] != null && res['result'] != undefined ? res['result']['firstName'] + " " + res['result']['lastName'] : null;
      });

      this.loginService.getEmployeeImageByEmployeeIdAndImageDesc(this.employeeId, "profileImage").subscribe((res) => {
        this.employeeImage = res['result'] != null && res['result'] != undefined ? res['result']['image'] : null;
      });

    }
    );
    $(document).ready(function () {
      $('#top-menu li').click(function () {
        $('#top-menu li').removeClass('active');
        $('.logo-wrap, .left-menu').removeClass('reduced-size');
        $('.left-menu h2 button span').show();
        $('.left-menu li a span').show();
        $(this).addClass('active');
      });
      $('.side-menu-toggler').click(function () {
        $('.logo-wrap, .left-menu').toggleClass('reduced-size');
        $('.left-menu h2 button span').toggle();
        $('.left-menu li a span').toggle();
      });
      $(".checklist").click(function () {
        $(".monthlySalesChart").hide();
        $(".checklistdata").show();
      });
      $(".home").click(function () {
        $(".checklistdata").hide();
        $(".monthlySalesChart").show();
      });


    });


    this.userIdle.startWatching();
    this.userIdle.onTimerStart().subscribe(count => {

    });

    this.userIdle.onTimeout().subscribe(
      res => {
        this.userHistoryModel = new UserHistoryModel("TimeOut", "Authentication", "logout");
        this.userHistoryService.saveUserhistoryDetails(this.userHistoryModel).subscribe(res => {
          localStorage.clear();
          this.router.navigate(['/']);
        });
      }
    );

  }

  onMouseLeave() {
    this.userIdle.stopTimer();
  }

  onMouseEnter() {
    this.userIdle.stopTimer();
  }

  mouseMove() {
    this.userIdle.stopTimer();
  }


  clickFun() {
    this.userIdle.stopTimer();
  }

  hotKeys(event) {

    if (event.keyCode == 76 || event.keyCode == 13 || event.keyCode == 17 || event.keyCode == 20 || event.keyCode == 8
      || event.keyCode == 45 || event.keyCode == 32 || event.keyCode == 18 || event.keyCode == 91 || event.keyCode == 9
      || event.keyCode == 91) {

      this.userIdle.stopTimer();

    } else if (event.keyCode == 33 || event.keyCode == 34 || event.keyCode == 40 || event.keyCode == 38
      || event.keyCode == 27 || event.keyCode == 36 || event.keyCode == 35 || event.keyCode == 39 || event.keyCode == 37
      || event.keyCode == 46 || event.keyCode == 16 || event.keyCode == 192 || event.keyCode == 255) {

      this.userIdle.stopTimer();

    } else if (event.keyCode == 49 || event.keyCode == 50 || event.keyCode == 51 || event.keyCode == 52 || event.keyCode == 53 || event.keyCode == 54
      || event.keyCode == 55 || event.keyCode == 116 || event.keyCode == 119 || event.keyCode == 120 || event.keyCode == 122 || event.keyCode == 78 ||
      event.keyCode == 56 || event.keyCode == 57 || event.keyCode == 48 || event.keyCode == 189 || event.keyCode == 187 || event.keyCode == 112
      || event.keyCode == 113 || event.keyCode == 112 || event.keyCode == 115 || event.keyCode == 117 || event.keyCode == 118 || event.keyCode == 121
      || event.keyCode == 123) {

      this.userIdle.stopTimer();

    } else if (event.keyCode == 220 || event.keyCode == 221 || event.keyCode == 219 || event.keyCode == 80 || event.keyCode == 79 || event.keyCode == 73 ||
      event.keyCode == 85 || event.keyCode == 89 || event.keyCode == 84 || event.keyCode == 82 || event.keyCode == 69 || event.keyCode == 87 || event.keyCode == 81 ||
      event.keyCode == 77 || event.keyCode == 86 || event.keyCode == 90 || event.keyCode == 65 || event.keyCode == 83 || event.keyCode == 68 || event.keyCode == 70 ||
      event.keyCode == 71 || event.keyCode == 72 || event.keyCode == 74 || event.keyCode == 75 || event.keyCode == 76 || event.keyCode == 186 || event.keyCode == 222 ||
      event.keyCode == 191 || event.keyCode == 190 || event.keyCode == 188 || event.keyCode == 66 || event.keyCode == 67 || event.keyCode == 88) {

      this.userIdle.stopTimer();

    }

  }
}


