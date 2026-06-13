import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList, KeyValueDiffers } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { EmployeeService } from '../shared/employee.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/core/app.service';
import { DobValidator } from 'src/app/core/DOB Validator/dob-validator';
import { EndDateValidator } from 'src/app/core/DOB Validator/endDate-validator';
import { DatePipe } from '@angular/common';
import * as $ from "jquery";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
  providers: [EmployeeService, DatePipe]
})

export class AddEmployeeComponent implements OnInit {

  checkAll: Boolean = false;
  seletedCountry: any;
  seletedState: any;
  selectedEmpType: any;
  selectedEmpGender: any;
  selectedTitle: any;
  selectedPharmacyRoles: any;
  selectedUnMappedPharmacyNames: any = [];
  show: boolean;
  selectedEndDate;
  selectStartDate;
  @ViewChild('profPhoto', { static: true }) profPhotoVariable: ElementRef;
  @ViewChild('condCert', { static: true }) condCertVariable: ElementRef;
  @ViewChild('contract', { static: true }) contractVariable: ElementRef;
  @ViewChild('identDoc', { static: true }) identDocVariable: ElementRef;
  @ViewChild('resume', { static: true }) resumeVariable: ElementRef;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;

  testing = [
    { test: 'Mr' },
    { test: 'Ms' }
  ];

  genders = [
    { name: 'Male' },
    { name: 'Female' }
  ];

  profileImage: File;
  identificationDocument: File;
  policeGoodConductCertificate: File;
  resume: File;
  signedContract: File;
  recentEmployee: Object;
  showUnMappedPharmacy: boolean = false;
  unMappedPharmacies: any[] = [];
  resetSearchTerm: boolean = false;
  unMappedPharmacySearchTerm: string = '';
  pharmacySearchTerm: string = '';
  showAccess = false;

  constructor(private employeeService: EmployeeService,
    private toasterService: ToastrService, private datePipe: DatePipe,
    private appService: AppService, private spinnerService: Ng4LoadingSpinnerService) {
    this.employeeService.getEmployeePharmacyroleByEmployeeId(localStorage.getItem('id')).subscribe((res) => {
      if (res['result']['pharmacyRolesModel']['roleId'] == 1) {
        this.showAccess = true;
      } else {
        this.showAccess = false;
      }
    })
    this.getCountries();
    this.getAllEmployeeTypes();
    this.getAllPharmacyRoles();
    this.getAllPharmacyBranches();
    this.getAllPharmacyAccessPermissions();
    this.show = false;
    this.employeeService.fetchEmpCode().subscribe(CnNum => {
      if (CnNum['responseStatus']['code'] == 200) {
        this.employeeInformationForm.controls['employeeCode'].setValue(CnNum['result']);
      }
    });
  }
  resetAllSelectedPermissions() {
    $('input[type=checkbox]').prop('checked', false);
  }

  selectAllAccessPermissions() {
    this.checkAll = !this.checkAll
    $('.checked_all').on('change', function () {
      $('.checkbox').prop('checked', $(this).prop("checked"));
    });
    $('.checkbox').change(function () {
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });

    for (var i = 0; i < this.selectedPermissionsFlag.length; i++) {
      if (this.checkAll) {
        this.selectedPermissionsFlag[i] = true;
      }
      else {
        this.selectedPermissionsFlag[i] = false;
      }
    }
    this.employeeAccessInformationForm.get("flag").setValue(this.selectedPermissionsFlag);
  }

  selectMasterAccessPermissions() {
    $('.checkbox_master').on('change', function () {
      $('.checkbox_m').prop('checked', $(this).prop("checked"));
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    $('.checkbox_m').change(function () {
      if ($('.checkbox_m:checked').length == $('.checkbox_m').length) {
        $('.checkbox_master').prop('checked', true);
      } else {
        $('.checkbox_master').prop('checked', false);
      }
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Master") {
        this.selectedPermissionsFlag[i] = !this.selectedPermissionsFlag[i]
      }
    }
    this.employeeAccessInformationForm.get("flag").setValue(this.selectedPermissionsFlag);
  }

  selectFinanceAccessPermissions() {
    $('.checkbox_finance').on('change', function () {
      $('.checkbox_f').prop('checked', $(this).prop("checked"));
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    $('.checkbox_f').change(function () {

      if ($('.checkbox_f:checked').length == $('.checkbox_f').length) {
        $('.checkbox_finance').prop('checked', true);
      } else {
        $('.checkbox_finance').prop('checked', false);
      }
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Finance") {
        this.selectedPermissionsFlag[i] = !this.selectedPermissionsFlag[i]
      }
    }
    this.employeeAccessInformationForm.get("flag").setValue(this.selectedPermissionsFlag);
  }

  selectStockAccessPermissions() {
    $('.checkbox_stock').on('change', function () {
      $('.checkbox_s').prop('checked', $(this).prop("checked"));
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    $('.checkbox_s').change(function () {
      if ($('.checkbox_s:checked').length == $('.checkbox_s').length) {
        $('.checkbox_stock').prop('checked', true);
      } else {
        $('.checkbox_stock').prop('checked', false);
      }
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Stock") {
        this.selectedPermissionsFlag[i] = !this.selectedPermissionsFlag[i]
      }
    }
    this.employeeAccessInformationForm.get("flag").setValue(this.selectedPermissionsFlag);
  }

  selectSalesAccessPermissions() {
    $('.checkbox_sales').on('change', function () {
      $('.checkbox_sl').prop('checked', $(this).prop("checked"));
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    $('.checkbox_sl').change(function () {
      if ($('.checkbox_sl:checked').length == $('.checkbox_sl').length) {
        $('.checkbox_sales').prop('checked', true);
      } else {
        $('.checkbox_sales').prop('checked', false);
      }
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Sales") {
        this.selectedPermissionsFlag[i] = !this.selectedPermissionsFlag[i]
      }
    }
    this.employeeAccessInformationForm.get("flag").setValue(this.selectedPermissionsFlag);
  }

  selectScrapAccessPermissions() {
    $('.checkbox_scrap').on('change', function () {
      $('.checkbox_sc').prop('checked', $(this).prop("checked"));
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    $('.checkbox_sc').change(function () {
      if ($('.checkbox_sc:checked').length == $('.checkbox_sc').length) {
        $('.checkbox_scrap').prop('checked', true);
      } else {
        $('.checkbox_scrap').prop('checked', false);
      }
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });

    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Scrap") {
        this.selectedPermissionsFlag[i] = !this.selectedPermissionsFlag[i]
      }
    }
    this.employeeAccessInformationForm.get("flag").setValue(this.selectedPermissionsFlag);
  }

  selectChartsAccessPermissions() {
    $('.checkbox_charts').on('change', function () {
      $('.checkbox_ch').prop('checked', $(this).prop("checked"));
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    $('.checkbox_ch').change(function () {
      if ($('.checkbox_ch:checked').length == $('.checkbox_ch').length) {
        $('.checkbox_charts').prop('checked', true);
      } else {
        $('.checkbox_charts').prop('checked', false);
      }
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Charts") {
        this.selectedPermissionsFlag[i] = !this.selectedPermissionsFlag[i];
      }
    }
    this.employeeAccessInformationForm.get("flag").setValue(this.selectedPermissionsFlag);
  }

  selectReportsAccessPermissions() {
    $('.checkbox_reports').on('change', function () {
      $('.checkbox_r').prop('checked', $(this).prop("checked"));
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    $('.checkbox_r').change(function () {
      if ($('.checkbox_r:checked').length == $('.checkbox_r').length) {
        $('.checkbox_reports').prop('checked', true);
      } else {
        $('.checkbox_reports').prop('checked', false);
      }
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Reports-Master") {
        this.selectedPermissionsFlag[i] = !this.selectedPermissionsFlag[i]
      }
    }
    this.employeeAccessInformationForm.get("flag").setValue(this.selectedPermissionsFlag);
  }

  selectReportsStockAccessPermissions() {
    $('.checkbox_reports_stock').on('change', function () {
      $('.checkbox_r_stock').prop('checked', $(this).prop("checked"));
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    $('.checkbox_r_stock').change(function () {
      if ($('.checkbox_r_stock:checked').length == $('.checkbox_r_stock').length) {
        $('.checkbox_reports_stock').prop('checked', true);
      } else {
        $('.checkbox_reports_stock').prop('checked', false);
      }
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Reports-Stock") {
        this.selectedPermissionsFlag[i] = !this.selectedPermissionsFlag[i]
      }
    }
    this.employeeAccessInformationForm.get("flag").setValue(this.selectedPermissionsFlag);
  }
  selectSalesReportsAccessPermissions() {
    $('.checkbox_reports_sales').on('change', function () {
      $('.checkbox_r_sales').prop('checked', $(this).prop("checked"));
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });

    $('.checkbox_r_sales').change(function () {

      if ($('.checkbox_r_sales:checked').length == $('.checkbox_r_sales').length) {
        $('.checkbox_reports_sales').prop('checked', true);
      } else {
        $('.checkbox_reports_sales').prop('checked', false);
      }
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Reports-Sales") {
        this.selectedPermissionsFlag[i] = !this.selectedPermissionsFlag[i];
      }
    }
    this.employeeAccessInformationForm.get("flag").setValue(this.selectedPermissionsFlag);
  }

  selectPurchaseReportsAccessPermissions() {
    $('.checkbox_reports_purchase').on('change', function () {
      $('.checkbox_r_pur').prop('checked', $(this).prop("checked"));
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    $('.checkbox_r_pur').change(function () {
      if ($('.checkbox_r_pur:checked').length == $('.checkbox_r_pur').length) {
        $('.checkbox_reports_purchase').prop('checked', true);
      } else {
        $('.checkbox_reports_purchase').prop('checked', false);
      }
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Reports-Purchase") {
        this.selectedPermissionsFlag[i] = !this.selectedPermissionsFlag[i]
      }
    }
    this.employeeAccessInformationForm.get("flag").setValue(this.selectedPermissionsFlag);
  }

  selectFinanceReportsAccessPermissions() {
    $('.checkbox_reports_finance').on('change', function () {
      $('.checkbox_r_finance').prop('checked', $(this).prop("checked"));
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    $('.checkbox_r_finance').change(function () {
      if ($('.checkbox_r_finance:checked').length == $('.checkbox_r_finance').length) {
        $('.checkbox_reports_finance').prop('checked', true);
      } else {
        $('.checkbox_reports_finance').prop('checked', false);
      }
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Reports-Finance") {
        if (document.getElementById('reportsfinanceaccess')['checked']) {
          this.selectedPermissionsFlag[i] = true;
        }
        else {
          this.selectedPermissionsFlag[i] = false;
        }
      }
    }
    this.employeeAccessInformationForm.get("flag").setValue(this.selectedPermissionsFlag);
  }

  selectCRMReportsAccessPermissions() {
    $('.checkbox_reports_crm').on('change', function () {
      $('.checkbox_r_crm').prop('checked', $(this).prop("checked"));
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
    });
    $('.checkbox_r_crm').change(function () {
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }

      if ($('.checkbox_r_crm:checked').length == $('.checkbox_r_crm').length) {
        $('.checkbox_reports_crm').prop('checked', true);

      } else {
        $('.checkbox_reports_crm').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Reports-CRM") {
        if (document.getElementById('reportscrmaccess')['checked']) {
          this.selectedPermissionsFlag[i] = true;
        }
        else {
          this.selectedPermissionsFlag[i] = false;
        }
      }
    }
    this.employeeAccessInformationForm.get("flag").setValue(this.selectedPermissionsFlag);
  }
  selectedPermission(event) {
    var i = event["target"]["value"];
    this.selectedPermissionsFlag[i] = !this.selectedPermissionsFlag[i]


    //for making purchase reports checkbox true
    if ($('.checkbox_r_pur:checked').length == $('.checkbox_r_pur').length) {
      $('.checkbox_reports_purchase').prop('checked', true);
    } else {
      $('.checkbox_reports_purchase').prop('checked', false);
    }
    //for making finance reportscheckbox true
    if ($('.checkbox_r_finance:checked').length == $('.checkbox_r_finance').length) {
      $('.checkbox_reports_finance').prop('checked', true);
    } else {
      $('.checkbox_reports_finance').prop('checked', false);
    }
    //for making sales reportscheckbox true
    if ($('.checkbox_r_sales:checked').length == $('.checkbox_r_sales').length) {
      $('.checkbox_reports_sales').prop('checked', true);
    } else {
      $('.checkbox_reports_sales').prop('checked', false);
    }
    //for making stock reportscheckbox true
    if ($('.checkbox_r_stock:checked').length == $('.checkbox_r_stock').length) {
      $('.checkbox_reports_stock').prop('checked', true);
    } else {
      $('.checkbox_reports_stock').prop('checked', false);
    }

    //for making masters reportscheckbox true
    if ($('.checkbox_r:checked').length == $('.checkbox_r').length) {
      $('.checkbox_reports').prop('checked', true);
    } else {
      $('.checkbox_reports').prop('checked', false);
    }

    //for making masters checkbox true
    if ($('.checkbox_m:checked').length == $('.checkbox_m').length) {
      $('.checkbox_master').prop('checked', true);
    } else {
      $('.checkbox_master').prop('checked', false);
    }
    //for making stock checkbox true
    if ($('.checkbox_s:checked').length == $('.checkbox_s').length) {
      $('.checkbox_stock').prop('checked', true);
    } else {
      $('.checkbox_stock').prop('checked', false);
    }
    //for making sales checkbox true
    if ($('.checkbox_sl:checked').length == $('.checkbox_sl').length) {
      $('.checkbox_sales').prop('checked', true);
    } else {
      $('.checkbox_sales').prop('checked', false);
    }
    //for making finance checkbox true
    if ($('.checkbox_f:checked').length == $('.checkbox_f').length) {
      $('.checkbox_finance').prop('checked', true);
    } else {
      $('.checkbox_finance').prop('checked', false);
    }
    //for making scrap checkbox true
    if ($('.checkbox_sc:checked').length == $('.checkbox_sc').length) {
      $('.checkbox_scrap').prop('checked', true);
    } else {
      $('.checkbox_scrap').prop('checked', false);
    }
    //for making charts checkbox true
    if ($('.checkbox_ch:checked').length == $('.checkbox_ch').length) {
      $('.checkbox_charts').prop('checked', true);
    } else {
      $('.checkbox_charts').prop('checked', false);
    }

    //for making crm reportsoi checkbox true
    if ($('.checkbox_r_crm:checked').length == $('.checkbox_r_crm').length) {
      $('.checkbox_reports_crm').prop('checked', true);
    } else {
      $('.checkbox_reports_crm').prop('checked', false);
    }

 
    this.employeeAccessInformationForm.get('flag').setValue(this.selectedPermissionsFlag);
  }

  ngOnInit() {
    $(document).ready(function () {

      $(".caret-masters").click(function () {
        $(".display-content-masters").toggle("active");
        $(".caret-masters").toggleClass("caret-down");

      });
      $(".caret-sales").click(function () {
        $(".display-content-sales").toggle("active");
        $(".caret-sales").toggleClass("caret-down");

      });
      $(".caret-scrap").click(function () {
        $(".display-content-scrap").toggle("active");
        $(".caret-scrap").toggleClass("caret-down");

      });
      $(".caret-stock").click(function () {
        $(".display-content-stock").toggle("active");
        $(".caret-stock").toggleClass("caret-down");

      });
      $(".caret-finance").click(function () {
        $(".display-content-finance").toggle("active");
        $(".caret-finance").toggleClass("caret-down");

      });

      $(".caret-charts").click(function () {
        $(".display-content-charts").toggle("active");
        $(".caret-charts").toggleClass("caret-down");

      });
      $(".caret-reports-masters").click(function () {
        $(".display-content-reports-masters").toggle("active");
        $(".caret-reports-masters").toggleClass("caret-down");

      });
      $(".caret-reports-stock").click(function () {
        $(".display-content-reports-stock").toggle("active");
        $(".caret-reports-stock").toggleClass("caret-down");

      });
      $(".caret-reports-sales").click(function () {
        $(".display-content-reports-sales").toggle("active");
        $(".caret-reports-sales").toggleClass("caret-down");

      });
      $(".caret-reports-purchase").click(function () {
        $(".display-content-reports-purchase").toggle("active");
        $(".caret-reports-purchase").toggleClass("caret-down");

      });
      $(".caret-reports-finance").click(function () {
        $(".display-content-reports-finance").toggle("active");
        $(".caret-reports-finance").toggleClass("caret-down");

      });

      $(".caret-reports-crm").click(function () {
        $(".display-content-reports-crm").toggle("active");
        $(".caret-reports-crm").toggleClass("caret-down");

      });
      
      $(".toggleHide").click(function () {
        $(".display-content-hide").hide();
      });
    });

    this.employeeInformationForm = new FormGroup(this.employeeInformationFormValidations);
    this.employeeProfessionalMembershipInformationForm = new FormGroup(this.employeeProfessionalMembershipInformationFormValidations);
    this.employeeHonorInformationForm = new FormGroup(this.employeeHonorInformationFormValidations);
    this.employeeInterestInformationForm = new FormGroup(this.employeeInterestInformationFormValidations);
    this.employeePublicationInformationForm = new FormGroup(this.employeePublicationInformationFormValidations);
    this.employeeEducationInformationForm = new FormGroup(this.employeeEducationInformationFormValidations);
    this.employmentHistoryInformationForm = new FormGroup(this.employmentHistoryInformationFormValidations);
    this.employeeSalaryInformationForm = new FormGroup(this.employeeSalaryInformationFormValidations);
    this.employeePharmacyRoleInformationForm = new FormGroup(this.employeePharmacyRoleInformationFormValidations);
    this.employeeCredentialsInformationForm = new FormGroup(this.employeeCredentialsInformationFormValidations);
    this.employeePharmacyAccessInformationForm = new FormGroup(this.employeePharmacyAccessInformationFormValidations);
    this.employeeAccessInformationForm = new FormGroup(this.employeeAccessInformationFormValidations);
  }

  employeeAccessInformationFormArray: any[] = [];
  countries: any[] = [];
  employeeTypes: any[] = [];
  states: any[] = [];
  pharmacyRoles: any[] = [];
  pharmacyBranches: any[] = [];
  pharmacyAccessPermissions: any[] = [];
  selectedPermissions: number[] = [];
  pharmaAccessids: number[] = [];
  selectedPermissionsFlag: boolean[] = [];
  userName: string;
  employeeProfessionalMembershipInformationForm: FormGroup;
  employeeProfessionalMembershipInformationFormValidations = {
    membershipName: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl('', [EndDateValidator]),
    employee: new FormControl(''),
    createdUser: new FormControl(localStorage.getItem('id'))
  };

  employeeHonorInformationForm: FormGroup;
  employeeHonorInformationFormValidations = {
    honorName: new FormControl(''),
    honorDesc: new FormControl(''),
    receivedDate: new FormControl(''),
    employee: new FormControl(''),
    createdUser: new FormControl(localStorage.getItem('id'))
  };

  employeeInterestInformationForm: FormGroup;
  employeeInterestInformationFormValidations = {
    areaOfIntrestDesc: new FormControl(''),
    employee: new FormControl(''),
    createdUser: new FormControl(localStorage.getItem('id'))
  };

  employeePublicationInformationForm: FormGroup;
  employeePublicationInformationFormValidations = {
    publicationName: new FormControl(''),
    publicationDesc: new FormControl(''),
    publishDate: new FormControl(''),
    employee: new FormControl(''),
    createdUser: new FormControl(localStorage.getItem('id'))
  };

  employeeEducationInformationForm: FormGroup;
  employeeEducationInformationFormValidations = {
    studiedAt: new FormControl(''),
    degree: new FormControl(''),
    graduationDate: new FormControl(''),
    employee: new FormControl(''),
    createdUser: new FormControl(localStorage.getItem('id'))
  };

  employmentHistoryInformationForm: FormGroup;
  employmentHistoryInformationFormValidations = {
    companyName: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl('', [EndDateValidator]),
    compnayAddress: new FormControl(''),
    reportingPersonDetails: new FormControl(''),
    managerName: new FormControl(''),
    managerPhoneNumber: new FormControl('', [Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    managerEmail: new FormControl(''),
    designation: new FormControl(''),
    employementType: new FormControl(''),
    reference1: new FormControl(''),
    reference2: new FormControl(''),
    employee: new FormControl(''),
    createdUser: new FormControl(localStorage.getItem('id'))
  };

  employeeSalaryInformationForm: FormGroup;
  employeeSalaryInformationFormValidations = {
    salaryDate: new FormControl(''),
    basic: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    hra: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    da: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    medical: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    ptax: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    pfEmployee: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    pfEmployer: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    tds: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    esi: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    grossSalary: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    employee: new FormControl(''),
    createdUser: new FormControl(localStorage.getItem('id'))
  };

  employeeCredentialsInformationForm: FormGroup;
  employeeCredentialsInformationFormValidations = {
    userName: new FormControl('',Validators.required),
    currentPassword: new FormControl('',Validators.required),
    previousPassword1: new FormControl(''),
    previousPassword2: new FormControl(''),
    approvalAccessPin: new FormControl('', [Validators.required,Validators.pattern(/^[1-9][0-9]{5}$/)]),
    passwordStatus: new FormControl(''),
    activeS: new FormControl('Y'),
    employee: new FormControl(''),
    createdUser: new FormControl(localStorage.getItem('id'))
  };

  employeePharmacyRoleInformationForm: FormGroup;
  employeePharmacyRoleInformationFormValidations = {
    pharmacyModel: new FormControl('',Validators.required),
    employee: new FormControl(''),
    employeeRole:new FormControl('',Validators.required),
    pharmacyRolesModel: new FormControl(''),
    createdUser: new FormControl(localStorage.getItem('id'))
  };

  employeeAccessInformationForm: FormGroup;
  employeeAccessInformationFormValidations = {
    pharmaAccessids: new FormControl(''),
    employee: new FormControl(''),
    flag: new FormControl(''),
    createdUser: new FormControl(localStorage.getItem('id'))
  };

  employeePharmacyAccessInformationForm: FormGroup;
  employeePharmacyAccessInformationFormValidations = {
    pharmaAccessids: new FormControl(''),
    employee: new FormControl(''),
    activeS: new FormControl(''),
  };
  employeeInformationForm: FormGroup;
  employeeInformationFormValidations = {
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    middleName: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    employeeCode: new FormControl(''),
    genderCode: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(^a-zA-Z\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    employeeTypeFullTimOrPartTime: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
    salary: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    dateOfBirth: new FormControl('', [Validators.required, DobValidator]),
    dateOfJoining: new FormControl('', Validators.required),
    emailId: new FormControl('', [Validators.email, Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)]),
    designation: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
    bipgraphyDesc: new FormControl(''),
    country: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    addressLine1: new FormControl('', [Validators.required]),
    city: new FormControl(''),
    bloodGroup: new FormControl(''),
    nightShifts: new FormControl(''),
    addressLine2: new FormControl(''),
    postalCode: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    pharmacyId: new FormControl('', [Validators.required]),
    employeeTypeModel: new FormControl('', [Validators.required]),
    activeS: new FormControl('Y'),
    kraPin: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    nhifNumber: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    landlineNumber: new FormControl(),
    postBox: new FormControl(),
    identificationNumber: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    nssfNumber: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
    createdUser: new FormControl(localStorage.getItem('id'))
  };


	/**
    * Grid Changes
    * End
    */

  getCountries() {
    this.employeeService.getCountries().subscribe(
      getCountriesResponse => {
        if (getCountriesResponse instanceof Object) {
          if (getCountriesResponse['responseStatus']['code'] === 200) {
            this.countries = getCountriesResponse['result'];
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
      }
    );
  }

  getAllEmployeeTypes() {
    this.employeeService.getAllEmployeeTypes().subscribe(
      getEmployeeTypeResponse => {
        if (getEmployeeTypeResponse instanceof Object) {
          if (getEmployeeTypeResponse['responseStatus']['code'] === 200) {
            this.employeeTypes = getEmployeeTypeResponse['result'];
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
      }
    );
  }

  getAllPharmacyRoles() {
    this.employeeService.getPharmacyRoles().subscribe(
      getPharmacyRolesResponse => {
        if (getPharmacyRolesResponse instanceof Object) {
          if (getPharmacyRolesResponse['responseStatus']['code'] === 200) {
            this.pharmacyRoles = getPharmacyRolesResponse['result'];
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
      }
    );
  }


  getAllPharmacyBranches() {
    this.employeeService.getPharmacies().subscribe(
      getPharmacyBranchesResponse => {
        if (getPharmacyBranchesResponse instanceof Object) {
          if (getPharmacyBranchesResponse['responseStatus']['code'] === 200) {
            this.unMappedPharmacies = getPharmacyBranchesResponse['result'];
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
      }
    );
  }

  getAllPharmacyAccessPermissions() {
    this.employeeService.getAccessPermissions().subscribe(
      getAccessPermissionsResponse => {
        if (getAccessPermissionsResponse instanceof Object) {
          if (getAccessPermissionsResponse['responseStatus']['code'] === 200) {
            this.pharmacyAccessPermissions = getAccessPermissionsResponse['result'];
            for (let permission of getAccessPermissionsResponse['result']) {
              this.selectedPermissions.push(permission['pharmaAccessId']);
              this.selectedPermissionsFlag.push(false);
              this.employeeAccessInformationForm.get('pharmaAccessids').setValue(this.selectedPermissions);
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
      }
    );
  }

  getProvinces(country: Object) {
    this.employeeService.getProvinces(country).subscribe(
      getProvincesResponse => {
        if (getProvincesResponse instanceof Object) {
          if (getProvincesResponse['responseStatus']['code'] === 200) {
            this.states = getProvincesResponse['result'];
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
      }
    );
  }

  reset() {
    let employeeCode = this.employeeInformationForm.get('employeeCode').value;
    this.employeeInformationForm.get('employeeCode').setValue(employeeCode);
    this.employeeService.fetchEmpCode().subscribe(CnNum => {
      if (CnNum['responseStatus']['code'] == 200) {
        this.employeeInformationForm.controls['employeeCode'].setValue(CnNum['result']);
      }
    });

    this.seletedCountry = undefined;
    this.seletedState = undefined;
    this.getAllEmployeeTypes();
    this.selectedEmpType = undefined;
    this.selectedEmpGender = undefined;
    this.selectedTitle = undefined;

    this.employeeInformationForm.patchValue({
      'createdUser': localStorage.getItem('id')
    });
    this.profPhotoVariable.nativeElement.value = '';
    this.condCertVariable.nativeElement.value = '';
    this.contractVariable.nativeElement.value = '';
    this.identDocVariable.nativeElement.value = '';
    this.resumeVariable.nativeElement.value = '';
  }

  membershipReset() {
    this.employeeProfessionalMembershipInformationForm.reset();
    this.employeeProfessionalMembershipInformationForm.patchValue({
      'createdUser': localStorage.getItem('id')
    });
  }

  employeeInterestInformationFormReset() {
    this.employeeInterestInformationForm.reset();
    this.employeeInterestInformationForm.patchValue({
      'createdUser': localStorage.getItem('id')
    });
  }

  employeeHonorInformationFormReset() {
    this.employeeHonorInformationForm.reset();
    this.employeeHonorInformationForm.patchValue({
      'createdUser': localStorage.getItem('id')
    });
  }

  employeePublicationInformationFormReset() {
    this.employeePublicationInformationForm.reset();
    this.employeePublicationInformationForm.patchValue({
      'createdUser': localStorage.getItem('id')
    });
  }

  employeeEducationInformationFormReset() {
    this.employeeEducationInformationForm.reset();
    this.employeeEducationInformationForm.patchValue({
      'createdUser': localStorage.getItem('id')
    });
  }

  employmentHistoryInformationFormReset() {
    this.employmentHistoryInformationForm.reset();
    this.employmentHistoryInformationForm.patchValue({
      'createdUser': localStorage.getItem('id')
    });
  }

  employeeSalaryInformationFormReset() {
    this.employeeSalaryInformationForm.reset();
    this.employeeSalaryInformationForm.patchValue({
      'createdUser': localStorage.getItem('id')
    });
  }

  accessReset() {
    let userName = this.employeeCredentialsInformationForm.get('userName').value;
    this.employeeCredentialsInformationForm.reset();
    this.employeeCredentialsInformationForm.get('userName').setValue(userName);
    this.selectedPharmacyRoles = undefined;
    this.selectedUnMappedPharmacyNames = undefined;
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  saveEmployeeFormChanges(employeeInformationForm: Object) {
    this.employeeInformationForm.get('firstName').setErrors({ 'incorrect': true });
    const formData = new FormData();
    formData.append('employee', JSON.stringify(employeeInformationForm));
    this.spinnerService.show();
    this.employeeService.saveEmployeeData(formData).subscribe(
      saveFormResponse => {
        let payload = Object.assign({}, this.employeeInformationForm.value);
        payload['lastUpdateUser'] = localStorage.getItem('id');
        payload['createdUser'] = localStorage.getItem('id');
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.employeeInformationForm.reset();
            this.reset();
            this.spinnerService.hide();
            this.recentEmployee = saveFormResponse['result'];
            if (this.profileImage != null) {
              const formData = new FormData();
              formData.append('employee', JSON.stringify(this.recentEmployee))
              formData.append('image', this.profileImage);
              formData.append('imageDesc', 'profileImage')
              this.employeeService.saveEmployeeImage(formData).subscribe(res => {
              });
            }
            if (this.identificationDocument != null) {
              const formData = new FormData();
              formData.append('employee', JSON.stringify(this.recentEmployee))
              formData.append('image', this.identificationDocument);
              formData.append('imageDesc', 'identificationDocument')
              this.employeeService.saveEmployeeImage(formData).subscribe(res => {
              })
            }
            if (this.policeGoodConductCertificate != null) {
              const formData = new FormData();
              formData.append('employee', JSON.stringify(this.recentEmployee))
              formData.append('image', this.policeGoodConductCertificate);
              formData.append('imageDesc', 'policeGoodConductCertificate')
              this.employeeService.saveEmployeeImage(formData).subscribe(res => {
              })
            }
            if (this.resume != null) {
              const formData = new FormData();
              formData.append('employee', JSON.stringify(this.recentEmployee))
              formData.append('image', this.resume);
              formData.append('imageDesc', 'resume')
              this.employeeService.saveEmployeeImage(formData).subscribe(res => {
              })
            }
            if (this.signedContract != null) {
              const formData = new FormData();
              formData.append('employee', JSON.stringify(this.recentEmployee))
              formData.append('image', this.signedContract);
              formData.append('imageDesc', 'signedContract')
              this.employeeService.saveEmployeeImage(formData).subscribe(res => {
              })
            }
            this.employeeProfessionalMembershipInformationForm.get('employee').setValue(this.recentEmployee);
            this.employeeHonorInformationForm.get('employee').setValue(this.recentEmployee);
            this.employeeInterestInformationForm.get('employee').setValue(this.recentEmployee);
            this.employeePublicationInformationForm.get('employee').setValue(this.recentEmployee);
            this.employeeEducationInformationForm.get('employee').setValue(this.recentEmployee);
            this.employmentHistoryInformationForm.get('employee').setValue(this.recentEmployee);
            this.employeeSalaryInformationForm.get('employee').setValue(this.recentEmployee);
            this.employeeCredentialsInformationForm.get('employee').setValue(this.recentEmployee);
            this.employeePharmacyRoleInformationForm.get('employee').setValue(this.recentEmployee);
            this.employeeInformationForm.controls.activeS.setValue('Y');
            this.profileImage = undefined;
            this.identificationDocument = undefined;
            this.policeGoodConductCertificate = undefined;
            this.resume = undefined;
            this.signedContract = undefined;

            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });

            this.profPhotoVariable.nativeElement.value = '';
            this.condCertVariable.nativeElement.value = '';
            this.contractVariable.nativeElement.value = '';
            this.identDocVariable.nativeElement.value = '';
            this.resumeVariable.nativeElement.value = '';
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
      }
    );
  }
	/**
	 * Service Changes
	 * End
	 */


	/**
	 * Form Changes
	 * Start
	 */

  onEmployeeSubmit() {
    this.employeeInformationForm.get('createdUser').setValue(localStorage.getItem('id'));
    let payload = Object.assign({}, this.employeeInformationForm.value);
    let accesspayload = Object.assign({}, this.employeeAccessInformationForm.value);
    payload['country'] = this.seletedCountry;
    payload['state'] = this.seletedState;
    payload['employeeTypeModel'] = this.selectedEmpType;
    payload['title'] = this.selectedTitle['test'];
    payload['pharmacyId'] = this.selectedUnMappedPharmacyNames['pharmacyId'];
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    if (this.selectedEmpGender instanceof Object) {
      payload['genderCode'] = this.selectedEmpGender['name'] == 'Male' ? 'M' : 'F';
    }
    this.saveEmployeeFormChanges(payload);
  }

  onProfessionalMemberShipSubmit() {
    let payload = Object.assign({}, this.employeeProfessionalMembershipInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    this.saveProfessionalMemberShipFormChanges(payload);
  }

  saveProfessionalMemberShipFormChanges(employeeProfessionalMembershipInformationForm: Object) {
    this.employeeProfessionalMembershipInformationForm.get('membershipName').setErrors({ 'incorrect': true });
    this.employeeService.saveEmployeeProfMembership(employeeProfessionalMembershipInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.employeeProfessionalMembershipInformationForm.reset();
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
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
      }
    );
  }

  checkProfessionalMemberShipFormDisability() {
    return this.recentEmployee == null || this.recentEmployee == undefined ||
      this.employeeProfessionalMembershipInformationForm.get('startDate').value == '' ||
      this.employeeProfessionalMembershipInformationForm.get('endDate').value == '';
  }

  onEmployeeHonorInformationFormSubmit() {
    let payload = Object.assign({}, this.employeeHonorInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    this.saveEmployeeHonorInformationFormChanges(payload);
  }

  saveEmployeeHonorInformationFormChanges(employeeHonorInformationForm: Object) {
    this.employeeHonorInformationForm.get('honorName').setErrors({ 'incorrect': true });
    this.employeeService.saveEmployeeHonor(employeeHonorInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.employeeHonorInformationForm.reset();
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
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
      }
    );
  }

  onEmployeeInterestInformationFormSubmit() {
    let payload = Object.assign({}, this.employeeInterestInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    this.saveEmployeeInterestInformationFormChanges(payload);
  }

  saveEmployeeInterestInformationFormChanges(employeeInterestInformationForm: Object) {
    this.employeeInterestInformationForm.get('areaOfIntrestDesc').setErrors({ 'incorrect': true });
    this.employeeService.saveEmployeeInterest(employeeInterestInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.employeeInterestInformationForm.reset();
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
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
      }
    );
  }


  onEmployeePublicationInformationFormSubmit() {
    let payload = Object.assign({}, this.employeePublicationInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    this.saveEmployeePublicationInformationFormChanges(payload);
  }

  saveEmployeePublicationInformationFormChanges(employeePublicationInformationForm: Object) {
    this.employeePublicationInformationForm.get('publicationName').setErrors({ 'incorrect': true });
    this.employeeService.saveEmployeePublication(employeePublicationInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.employeePublicationInformationForm.reset();
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
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
      }
    );
  }

  onEmployeeEducationInformationFormSubmit() {
    let payload = Object.assign({}, this.employeeEducationInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    this.saveEmployeeEducationInformationFormChanges(payload);
  }

  saveEmployeeEducationInformationFormChanges(employeeEducationInformationForm: Object) {
    this.employeeEducationInformationForm.get('studiedAt').setErrors({ 'incorrect': true });
    this.employeeService.saveEmployeeEducation(employeeEducationInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.employeeEducationInformationForm.reset();
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
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
      }
    );
  }

  onEmploymentHistoryInformationFormSubmit() {
    let payload = Object.assign({}, this.employmentHistoryInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    this.saveEmploymentHistoryInformationFormChanges(payload);
  }

  saveEmploymentHistoryInformationFormChanges(employmentHistoryInformationForm: Object) {
    this.employmentHistoryInformationForm.get('companyName').setErrors({ 'incorrect': true });
    this.employeeService.saveEmployeeHistory(employmentHistoryInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.employmentHistoryInformationForm.reset();
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
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
      }
    );
  }

  onEmployeeSalaryInformationFormSubmit() {
    let payload = Object.assign({}, this.employeeSalaryInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    this.saveEmployeeSalaryInformationFormChanges(payload);
  }

  saveEmployeeSalaryInformationFormChanges(employeeSalaryInformationForm: Object) {
    this.employeeSalaryInformationForm.get('salaryDate').setErrors({ 'incorrect': true });
    this.employeeService.saveEmployeeSalary(employeeSalaryInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.employeeSalaryInformationForm.reset();
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
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
      }
    );
  }

  onEmployeeCredentialsInformationFormSubmit() {
    this.employeePharmacyRoleInformationForm.get('pharmacyRolesModel').setValue(this.selectedPharmacyRoles);
    this.employeePharmacyRoleInformationForm.get('pharmacyModel').setValue(this.selectedUnMappedPharmacyNames);
    this.employeeAccessInformationForm.get('employee').setValue(this.recentEmployee);
    let payload = Object.assign({}, this.employeeCredentialsInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    this.saveEmployeeCredentialsInformationFormChanges(payload);
    this.resetAllSelectedPermissions();
  }

  saveEmployeeCredentialsInformationFormChanges(employeeCredentialsInformationForm: Object) {
    this.spinnerService.show();
    this.employeeCredentialsInformationForm.get('currentPassword').setErrors({ 'incorrect': true });
    this.employeeService.saveEmployeeCredentials(employeeCredentialsInformationForm).subscribe(
      saveFormResponse => {
        let payload = Object.assign({}, this.employeeCredentialsInformationForm.value);
        payload['lastUpdateUser'] = localStorage.getItem('id');
        payload['createdUser'] = localStorage.getItem('id');
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.employeeCredentialsInformationForm.reset();
            this.employeeService.saveEmployeePharmacyrole(this.employeePharmacyRoleInformationForm.value).subscribe(
              pharmacyroleRes => {
                if (pharmacyroleRes['responseStatus']['code'] === 200) {
                  this.employeePharmacyRoleInformationForm.reset();
                  this.employeeService.saveEmployeeAccess(this.employeeAccessInformationForm.value).subscribe(accessRes => {
                    if (accessRes['responseStatus']['code'] === 200) {
                      this.spinnerService.hide();
                      this.selectedPermissions = [];
                      this.selectedPermissionsFlag = [];
                      this.getAllPharmacyAccessPermissions();
                      this.employeePharmacyRoleInformationForm.patchValue({
                        pharmacyModel: '',
                        pharmacyRolesModel: ''
                      });
                      this.toasterService.success(accessRes['message'], 'Success', {
                        timeOut: 3000
                      });
                      this.selectedPharmacyRoles = undefined;
                      this.selectedUnMappedPharmacyNames = undefined;
                    } else {
                      this.spinnerService.hide();
                      this.toasterService.error('Please contact administrator', 'Error Occurred', {
                        timeOut: 5000
                      });
                    }
                  }, error => {
                    this.spinnerService.hide();
                    this.toasterService.error("Please contact administrator", "Error Occurred", {
                      timeOut: 5000
                    }
                    );
                  });
                }
              }, error => {
                this.spinnerService.hide();
                this.toasterService.error("Please contact administrator", "Error Occurred", {
                  timeOut: 5000
                }
                );
              }
            );
          } else {
            this.spinnerService.hide();
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
          }
        } else {
          this.spinnerService.hide();
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
        }
      },
      error => {
        this.spinnerService.hide();
        this.toasterService.error("Please contact administrator", "Error Occurred", {
          timeOut: 5000
        }
        );
      }
    );
  }

  onCountrySelected(event: Event) {
    this.getProvinces(this.seletedCountry);
  }

  onStateSelected(event: Event) {
  }
  onPermissionSelect(event: any) {
    let index = this.selectedPermissions.findIndex(permission => permission == event.target['value']);
    if (event.currentTarget.checked) {
      this.pharmaAccessids.push(this.selectedPermissions[index]);
      this.selectedPermissionsFlag[index] = !this.selectedPermissionsFlag[index];
      this.employeeAccessInformationForm.get('pharmaAccessids').setValue(this.pharmaAccessids);
      this.employeeAccessInformationForm.get('flag').setValue(this.selectedPermissionsFlag);
    } else {
      if (index > -1) {
        this.pharmaAccessids.splice(index, 1);
        this.employeeAccessInformationForm.get('pharmaAccessids').setValue(this.pharmaAccessids);
        this.selectedPermissionsFlag[index] = !this.selectedPermissionsFlag[index];
        this.employeeAccessInformationForm.get('flag').setValue(this.selectedPermissionsFlag);
      }
    }
  }

  checkFormDisability() {
    return (this.employeeInformationForm.get('firstName').errors instanceof Object)
      || (this.employeeInformationForm.get('lastName').errors instanceof Object)
      || (this.employeeInformationForm.get('addressLine1').errors instanceof Object)
      || (this.employeeInformationForm.get('phoneNumber').errors instanceof Object)
      || (this.employeeInformationForm.get('dateOfBirth').errors instanceof Object)
      || (this.employeeInformationForm.get('dateOfJoining').errors instanceof Object)
      || (this.employeeInformationForm.get('nssfNumber').errors instanceof Object)
      || (this.employeeInformationForm.get('genderCode').errors instanceof Object)
      || this.employeeInformationForm.get('emailId').invalid
      || this.employeeInformationForm.get('phoneNumber').invalid
      || (this.employeeInformationForm.get('postalCode').errors instanceof Object)
      || this.employeeInformationForm.get('postalCode').invalid
      || this.employeeInformationForm.get('designation').invalid
  }

  employeeAccessFormDisability(){
    return (this.employeeCredentialsInformationForm.get('userName').errors instanceof Object)
    ||(this.employeeCredentialsInformationForm.get('currentPassword').errors instanceof Object)
    ||(this.employeeCredentialsInformationForm.get('approvalAccessPin').errors instanceof Object)
    ||(this.employeePharmacyRoleInformationForm.get('employeeRole').errors instanceof Object)
    ||(this.employeePharmacyRoleInformationForm.get('pharmacyModel').errors instanceof Object)


  }
  userNameGenerator(event: Event) {
    this.userName = event['target']['value'];
    this.employeeService.getLastCreatedEmployeeId().subscribe(res => {
      this.userName += res['result']['employeeId'] + 1;
      this.employeeCredentialsInformationForm.get('userName').setValue(this.userName);
    });
  }

	/**
	 * Form Changes
	 * End
	 */

  /* multi select */

  onUnMappedCheckedPharmacies(selectedUnMapped: any[]) {

    //this.selectedUnMappedPharmacyNames = selectedUnMapped;
    //this.selectedUnMappedPharmacyNames = this.selectedUnMappedPharmacyNames.map(x => x.pharmacyName).join(",")
  }

  onUnMappedPharmaciesSelected(Pharmacy) {
  }

  onUnMappedPharmacySearchChanged(searchTerm) {
    this.unMappedPharmacySearchTerm = searchTerm;
    this.getUnMappedPharmacyData(this.pharmacySearchTerm);
  }

  getUnMappedPharmacyData(searchTerm: string) {
    this.employeeService.getPharmacies().subscribe(
      unMappedPharmaciesData => {
        if (unMappedPharmaciesData instanceof Object) {
          if (unMappedPharmaciesData['responseStatus']['code'] === 200) {
            this.unMappedPharmacies = unMappedPharmaciesData['result'];
          }
        }
      }
    );
  }

  uploadDocuments(event, docType) {
    if (event.target.files[0].size > 4194304) {
      this.toasterService.error('Image size must be < 4 MB', 'Error Occurred', {
        timeOut: 5000
      });
      event.target.value = '';
    } else if (docType === 'profileImage') {
      this.profileImage = event.target.files[0];
    } else if (docType === 'identificationDocument') {
      this.identificationDocument = event.target.files[0];
    } else if (docType === 'policeGoodConductCertificate') {
      this.policeGoodConductCertificate = event.target.files[0];
    } else if (docType === 'resume') {
      this.resume = event.target.files[0];
    } else if (docType === 'signedContract') {
      this.signedContract = event.target.files[0];
    }
  }

  password() {
    this.show = !this.show;
  }

  diff_months(dt2, dt1) {
    let d1 = new Date(dt1);
    let d2 = new Date(dt2);
    var diff = (d2.getTime() - d1.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7 * 4);
    return Math.abs(Math.round(diff));
  }
  date = new Date();
  restrictEndDate = false;

  selectedStartDate(event) {
    this.selectStartDate = new Date(event['target']['value']);
  }

  selectEndDate(event) {
    this.selectedEndDate = new Date(event.target['value']);
    if ((this.selectedEndDate >= this.selectStartDate) && (this.selectedEndDate <= this.date)) {
      this.restrictEndDate = false;
    } else {
      this.restrictEndDate = true;
    }
  }

}
