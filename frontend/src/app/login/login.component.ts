import { UserHistoryModel } from './../core/user-history/user-history.model';
import { UserHistoryService } from './../core/user-history/user-history.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from './shared/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/core/app.service';
import {
  Component,
  OnInit,
  Renderer2
} from '@angular/core';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  pharmacyList: any[] = [];
  userHistoryModel: UserHistoryModel;
  constructor(private renderer: Renderer2, private loginService: LoginService, private toasterService: ToastrService, private router: Router
    , private appService: AppService, private userHistoryService: UserHistoryService) {
    this.renderer.addClass(document.body, 'login-screen');
  }

  ngOnInit() {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['/master']);
    }
    this.loginInformationForm = new FormGroup(this.loginInformationFormValidations);
    $(document).ready(function () {

      $('.forgot-password-link').click(function (e) {
        e.preventDefault();
        $('.login-form').hide();
        $('.forgot-password-form').show();
        $(this).hide();
        $('.login-link').show();
      });
      $('.login-link').click(function (e) {
        e.preventDefault();
        $('.login-form').show();
        $('.forgot-password-form').hide();
        $(this).hide();
        $('.forgot-password-link').show();
      });

    });
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'login-screen');
  }

  loginInformationForm: FormGroup;
  loginInformationFormValidations = {
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  }

  onSubmit() {
    let payload = Object.assign({}, this.loginInformationForm.value);
    this.login(payload);
  }

  login(loginInformationForm: Object) {
    this.loginInformationForm.get('password').setErrors({ 'incorrect': true })

    this.loginService.authenticate(loginInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.loginInformationForm.reset();
            this.pharmacyList = saveFormResponse['result']['pharmacyModel'];
            if (this.pharmacyList.length == 1) {
              localStorage.setItem('pharmacyId', this.pharmacyList[0]['pharmacyId']);
              this.userHistoryModel = new UserHistoryModel("login", "Authentication", "login");
              this.userHistoryService.saveUserhistoryDetails(this.userHistoryModel).subscribe(res => {
              });
              this.checkSetup();
              this.toasterService.success(saveFormResponse['message'], 'Success', {
                timeOut: 3000
              });
            }
            else {

            }
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
          }
        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
        }
      }, (error) => {
        this.toasterService.error(error['error']['message'], 'Error Occurred', {
          timeOut: 5000
        })
      }
    );
  }

  checkFormDisability() {
    return (
      this.loginInformationForm.get('userName').invalid
      || this.loginInformationForm.get('password').invalid)
  }
  checkSetup() {
    this.loginService.isSetupDone().subscribe(res => {
      if (res['result'].length > 0) {
        this.appService.setLogin(true);
        this.appService.getLogin().subscribe(res => {

        })
        this.router.navigate(['/home']);
      }
      else {
        this.router.navigate(['/setup']);
      }
    }
    );
  }
  pharmacySelected(event: Event) {
    this.toasterService.success("Login Successfull", 'Success', {
      timeOut: 3000
    });
    localStorage.setItem('pharmacyId', event['target']['value']);
    this.checkSetup();
  }

}
