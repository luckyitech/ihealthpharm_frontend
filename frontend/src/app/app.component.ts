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
import { SessionService } from './core/session/session.service';

@Component({
  selector: 'app-root',
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
  constructor(private router: Router, private employeeService: EmployeeService, private sessionService: SessionService,
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
    // Sign out whether or not the history line could be saved: the session
    // may already have run out on the server, and the user must still get out.
    const signOut = () => {
      this.userId = undefined;
      this.sessionService.signOut();
    };
    this.userHistoryService.saveUserhistoryDetails(this.userHistoryModel).subscribe(signOut, signOut);


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


    this.sessionService.start();

  }
}


