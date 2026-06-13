import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../shared/employee.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/core/app.service';
import { DatePipe } from '@angular/common';
import { GridOptions, GridApi, ColDef } from 'ag-grid-community';
import { Employee } from '../shared/employee.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NumericEditor } from 'src/app/core/numeric-editor.component';
import * as $ from "jquery";
import { DobValidator } from 'src/app/core/DOB Validator/dob-validator';
import * as _ from "lodash";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss'],
  providers: [EmployeeService]
})

export class EditEmployeeComponent implements OnInit {

  checkAll: Boolean = false;
  selectedCountry: any;
  selectedState: any;
  selectedEmpType: any;
  selectedEmpGender: any;
  selectedTitle: any;
  selectedPharmacyRoles: any;
  selectedUnMappedPharmacyNames: any[] = [];
  show: boolean;
  memberShipDetails: any;
  honorDetails: any;
  interestObj: any;
  publicationObj: any;
  educationObj: any;
  historyObj: any;
  salaryObj: any;
  accessObj: any;
  pharmaRoles: any;
  empCredential: any;
  imageSrc: string;
  pharmacyRole: any;
  unMappedPharmacy: any;
  url: File;

  showProfileImage = false;
  title = [
    { test: 'Mr' },
    { test: 'Ms' }
  ];

  genders = [
    { name: 'Male' },
    { name: 'Female' }
  ];

  showAccess = false;
  profilePhoto;
  profileImage: File;
  conductCertificatePhoto;
  profileImage1: File;
  contractPhoto;
  profileImage2: File;
  documentPhoto;
  profileImage3: File;
  resumePhoto;
  profileImage4: File;

  constructor(
    private employeeService: EmployeeService,
    private toasterService: ToastrService,
    private appService: AppService,
    private spinnerService: Ng4LoadingSpinnerService,
    private datePipe: DatePipe
  ) {
    this.employeeService.getEmployeePharmacyroleByEmployeeId(localStorage.getItem('id')).subscribe((res) => {
      if (res['result']['pharmacyRolesModel']['roleId'] == 1) {
        this.showAccess = true;
      } else {
        this.showAccess = false;
      }
    })

    this.getCountries();
    this.getAllEmployeeTypes();
    this.show = false;
    this.getAllPharmacyRoles();
    this.getAllPharmacyBranches();
    this.getAllPharmacyAccessPermissions();
    this.employeeGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.employeeGridOptions.rowSelection = "single";
    this.employeeGridOptions.columnDefs = this.columnDefs;
    this.getGridRowData();
    this.employeeGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }

  }
  employeeProfessionalMembershipUpdate: boolean = false;
  employeeHonorUpdate: boolean = false;
  employeeInterestUpdate: boolean = false;
  employeePublicationUpdate: boolean = false;
  employeeEducationUpdate: boolean = false;
  employeeHistoryUpdate: boolean = false;
  employeeSalaryUpdate: boolean = false;
  employeeAccessUpdate: boolean = false;
  employeeCredentialUpdate: boolean = false;
  employeeRoleUpdate: boolean = false;
  showGenericDetails: boolean = false;
  currentEmployee: any;
  employee: Employee[] = [];

  profileEditImage;
  ConductCertificateEditImage;
  ContractEditImage;
  DocumentEditImage;
  resumeEditImage;

  identificationDocument: File;
  policeGoodConductCertificate: File;
  resume: File;
  signedContract: File;
  unMappedPharmacies: any[] = [];
  selectedUnMappedPharmacies: any[] = [];
  resetSearchTerm: boolean = false;
  unMappedPharmacySearchTerm: string = "";
  pharmacySearchTerm: string = "";

  key;
  private gridApi: GridApi;
  employeeGridOptions: GridOptions;
  showGrid: boolean = true;

  employeeImages: any = [];
  employees: any[] = [];
  countries: any[] = [];
  employeeTypes: any[] = [];
  states: any[] = [];
  selectedEmployee: Object = {};
  employeeAccessIds: any[] = [];
  employeeAccessInformationFormArray: any[] = [];
  pharmacyRoles: any[] = [];
  pharmacyBranches: any[] = [];
  pharmacyAccessPermissions: any[] = [];
  selectedPermissions: any[] = [];
  selectedPermissionsFlag: any[] = [];
  selPermFlag: any[] = [];
  pharmaAccessids: number[] = [];
  userName: string;
  resetPerm: boolean = true;

  employeeProfessionalMembershipInformationForm: FormGroup;
  employeeProfessionalMembershipInformationFormValidations = {
    employeeProfMembershipId: new FormControl(""),
    membershipName: new FormControl(""),
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    employee: new FormControl(""),
    createdUser: new FormControl(localStorage.getItem("id"))
  };

  employeeHonorInformationForm: FormGroup;
  employeeHonorInformationFormValidations = {
    employeeHonorId: new FormControl(""),
    honorName: new FormControl(""),
    honorDesc: new FormControl(""),
    receivedDate: new FormControl(""),
    employee: new FormControl(""),
    createdUser: new FormControl(localStorage.getItem("id"))
  };

  employeeInterestInformationForm: FormGroup;
  employeeInterestInformationFormValidations = {
    employeeIntrestId: new FormControl(""),
    areaOfIntrestDesc: new FormControl(""),
    employee: new FormControl(""),
    createdUser: new FormControl(localStorage.getItem("id"))
  };

  employeePublicationInformationForm: FormGroup;
  employeePublicationInformationFormValidations = {
    employeePublicationId: new FormControl(""),
    publicationName: new FormControl(""),
    publicationDesc: new FormControl(""),
    publishDate: new FormControl(""),
    employee: new FormControl(""),
    createdUser: new FormControl()
  };

  employeeEducationInformationForm: FormGroup;
  employeeEducationInformationFormValidations = {
    employeeEducationId: new FormControl(""),
    studiedAt: new FormControl(""),
    degree: new FormControl(""),
    graduationDate: new FormControl(""),
    employee: new FormControl(""),
    createdUser: new FormControl(localStorage.getItem("id"))
  };

  employmentHistoryInformationForm: FormGroup;
  employmentHistoryInformationFormValidations = {
    employeementHistoryId: new FormControl(""),
    companyName: new FormControl(""),
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    compnayAddress: new FormControl(""),
    reportingPersonDetails: new FormControl(""),
    managerName: new FormControl(""),
    managerPhoneNumber: new FormControl('', [Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    managerEmail: new FormControl(""),
    designation: new FormControl(""),
    employementType: new FormControl(""),
    reference1: new FormControl(""),
    reference2: new FormControl(""),
    employee: new FormControl(""),
    createdUser: new FormControl(localStorage.getItem("id"))
  };

  employeeSalaryInformationForm: FormGroup;
  employeeSalaryInformationFormValidations = {
    employeeSalaryId: new FormControl(""),
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
    employeeCredentialsId: new FormControl(""),
    userName: new FormControl("", Validators.required),
    currentPassword: new FormControl("", Validators.required),
    previousPassword1: new FormControl(""),
    previousPassword2: new FormControl(""),
    approvalAccessPin: new FormControl('', [Validators.required, Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]),
    passwordStatus: new FormControl(""),
    activeS: new FormControl("Y"),
    employee: new FormControl(""),
    createdUser: new FormControl(localStorage.getItem("id"))
  };

  employeePharmacyRoleInformationForm: FormGroup;
  employeePharmacyRoleInformationFormValidations = {
    employeePharmacyRoleId: new FormControl(""),
    pharmacyModel: new FormControl("", Validators.required),
    employeeRole: new FormControl("", Validators.required),
    employee: new FormControl(""),
    pharmacyRolesModel: new FormControl(""),
    createdUser: new FormControl(localStorage.getItem("id"))
  };

  employeeAccessInformationForm: FormGroup;
  employeeAccessInformationFormValidations = {
    employeeAccessId: new FormControl(""),
    pharmaAccessids: new FormControl(""),
    employee: new FormControl(""),
    flag: new FormControl(""),
    createdUser: new FormControl(localStorage.getItem("id"))
  };

  employeePharmacyAccessInformationForm: FormGroup;
  employeePharmacyAccessInformationFormValidations = {
    employeeAccessId: new FormControl(""),
    pharmaAccessids: new FormControl(""),
    employee: new FormControl(""),
    activeS: new FormControl("")
  };

  employeeInformationForm: FormGroup;
  employeeInformationFormValidations = {
    employeeId: new FormControl(),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    middleName: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    employeeCode: new FormControl(''),
    genderCode: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    employeeTypeFullTimOrPartTime: new FormControl(''),
    salary: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    dateOfBirth: new FormControl('', [Validators.required, DobValidator]),
    dateOfJoining: new FormControl('', Validators.required),
    emailId: new FormControl('', [Validators.email, Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)]),
    designation: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
    bipgraphyDesc: new FormControl(''),
    country: new FormControl([], [Validators.required]),
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
    nssfNumber: new FormControl('', Validators.pattern(/^[0-9]*$/)),

		/* employeeProfMembershipModel: new FormControl(''),
		employeeHonorModel: new FormControl(''),
		employeeInterestModel: new FormControl(''),
		employeePublicationModel: new FormControl(''),
		employeeEducationModel: new FormControl(''),
		employeeHistoryModel: new FormControl(''),
		employeeSalaryModel: new FormControl(''),
		employeeCredentialsModel: new FormControl(''),
		employeePharmacyRoleModel: new FormControl(''), */
    createdUser: new FormControl(localStorage.getItem('id'))
  };


  columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "",
      checkboxSelection: true,
      sortable: true,
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40
    },
    { headerName: "First Name", field: "firstName", sortable: true, resizable: true, filter: true },
    { headerName: "Last Name", field: "lastName", sortable: true, resizable: true, filter: true },
    { headerName: "Title", field: "title", sortable: true, resizable: true, filter: true },
    { headerName: "Employee Code", field: "employeeCode", sortable: true, resizable: true, filter: true },
    { headerName: "Gender", field: "genderCode", sortable: true, resizable: true, filter: true },
    { headerName: "Phone", field: "phoneNumber", sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor },
    { headerName: "FullTime Or PartTime", field: "employeeTypeFullTimOrPartTime", sortable: true, resizable: true, filter: true },
    { headerName: "Status", field: "Status", sortable: true, resizable: true, filter: true },
    { headerName: "Salary", field: "salary", sortable: true, resizable: true, filter: true },
    { headerName: "Date Of Birth", field: "dateOfBirth", sortable: true, resizable: true, filter: true },
    { headerName: "Date Of Joining", field: "dateOfJoining", sortable: true, resizable: true, filter: true },
    { headerName: "Email", field: "emailId", sortable: true, resizable: true, filter: true },
    { headerName: "Designation", field: "designation", sortable: true, resizable: true, filter: true },
    { headerName: "Biography Desc", field: "bipgraphyDesc", sortable: true, resizable: true, filter: true },
    { headerName: "Country", field: "country.countryName", sortable: true, resizable: true, filter: true },
    { headerName: "State", field: "state.provinceName", sortable: true, resizable: true, filter: true },
    { headerName: "Address Line 1", field: "addressLine1", sortable: true, resizable: true, filter: true },
    { headerName: "City", field: "city", sortable: true, resizable: true, filter: true },
    { headerName: "Blood Group", field: "bloodGroup", sortable: true, resizable: true, filter: true },
    { headerName: "Provider ImagePath", field: "providerImagePath", sortable: true, resizable: true, filter: true },
    { headerName: "Address Line 2", field: "addressLine2", sortable: true, resizable: true, filter: true },
    { headerName: "Pin Code", field: "postalCode", sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor },
    { headerName: "Pharmacy Id", field: "pharmacyId", sortable: true, resizable: true, filter: true },
    { headerName: "Night Shift", field: "nightShifts", sortable: true, resizable: true, filter: true },
    { headerName: "Employee Type ", field: "employeeTypeModel.employeeTypeDesc", sortable: true, resizable: true, filter: true }
  ];

  rowData = [];
  resetAllSelectedPermissions() {
    $('input[type=checkbox]').prop('checked', false);
  }
  selectAllAccessPermissions(event) {

    if (event['target']['checked']) {
      this.checkAll = !this.checkAll
    }

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
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
      if ($('.checkbox_m:checked').length == $('.checkbox_m').length) {
        $('.checkbox_master').prop('checked', true);

      } else {
        $('.checkbox_master').prop('checked', false);
      }

    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Master") {
        if (document.getElementById('mastersaccess')['checked']) {
          this.selectedPermissionsFlag[i] = true;
        }
        else {
          this.selectedPermissionsFlag[i] = false;
        }
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
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
      if ($('.checkbox_f:checked').length == $('.checkbox_f').length) {
        $('.checkbox_finance').prop('checked', true);

      } else {
        $('.checkbox_finance').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Finance") {
        if (document.getElementById('financeaccess')['checked']) {
          this.selectedPermissionsFlag[i] = true;
        }
        else {
          this.selectedPermissionsFlag[i] = false;
        }

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
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
      if ($('.checkbox_s:checked').length == $('.checkbox_s').length) {
        $('.checkbox_stock').prop('checked', true);

      } else {
        $('.checkbox_stock').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Stock") {
        if (document.getElementById('stockaccess')['checked']) {
          this.selectedPermissionsFlag[i] = true;
        }
        else {
          this.selectedPermissionsFlag[i] = false;
        }
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
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }

      if ($('.checkbox_sl:checked').length == $('.checkbox_sl').length) {
        $('.checkbox_sales').prop('checked', true);

      } else {
        $('.checkbox_sales').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Sales") {
        if (document.getElementById('salesaccess')['checked']) {
          this.selectedPermissionsFlag[i] = true;
        }
        else {
          this.selectedPermissionsFlag[i] = false;
        }
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
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
      if ($('.checkbox_sc:checked').length == $('.checkbox_sc').length) {
        $('.checkbox_scrap').prop('checked', true);

      } else {
        $('.checkbox_scrap').prop('checked', false);
      }
    });

    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Scrap") {
        if (document.getElementById('scrapaccess')['checked']) {
          this.selectedPermissionsFlag[i] = true;
        }
        else {
          this.selectedPermissionsFlag[i] = false;
        }
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
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }

      if ($('.checkbox_ch:checked').length == $('.checkbox_ch').length) {
        $('.checkbox_charts').prop('checked', true);

      } else {
        $('.checkbox_charts').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Charts") {
        if (document.getElementById('chartsaccess')['checked']) {
          this.selectedPermissionsFlag[i] = true;
        }
        else {
          this.selectedPermissionsFlag[i] = false;
        }
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
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }

      if ($('.checkbox_r:checked').length == $('.checkbox_r').length) {
        $('.checkbox_reports').prop('checked', true);

      } else {
        $('.checkbox_reports').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Reports-Master") {
        if (document.getElementById('reportsmastersaccess')['checked']) {
          this.selectedPermissionsFlag[i] = true;
        }
        else {
          this.selectedPermissionsFlag[i] = false;
        }
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
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }

      if ($('.checkbox_r_stock:checked').length == $('.checkbox_r_stock').length) {
        $('.checkbox_reports_stock').prop('checked', true);

      } else {
        $('.checkbox_reports_stock').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Reports-Stock") {
        if (document.getElementById('reportsstockaccess')['checked']) {
          this.selectedPermissionsFlag[i] = true;
        }
        else {
          this.selectedPermissionsFlag[i] = false;
        }
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

      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }

      if ($('.checkbox_r_sales:checked').length == $('.checkbox_r_sales').length) {
        $('.checkbox_reports_sales').prop('checked', true);

      } else {
        $('.checkbox_reports_sales').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Reports-Sales") {
        if (document.getElementById('reportssalesaccess')['checked']) {
          this.selectedPermissionsFlag[i] = true;
        }
        else {
          this.selectedPermissionsFlag[i] = false;
        }
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
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }
      if ($('.checkbox_r_pur:checked').length == $('.checkbox_r_pur').length) {
        $('.checkbox_reports_purchase').prop('checked', true);

      } else {
        $('.checkbox_reports_purchase').prop('checked', false);
      }
    });
    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.pharmacyAccessPermissions[i]["accessCd"] == "Reports-Purchase") {
        if (document.getElementById('reportspurchaseaccess')['checked']) {
          this.selectedPermissionsFlag[i] = true;
        }
        else {
          this.selectedPermissionsFlag[i] = false;
        }
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
      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $('.checked_all').prop('checked', true);
      } else {
        $('.checked_all').prop('checked', false);
      }

      if ($('.checkbox_r_finance:checked').length == $('.checkbox_r_finance').length) {
        $('.checkbox_reports_finance').prop('checked', true);

      } else {
        $('.checkbox_reports_finance').prop('checked', false);
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
    var count=0
    var k = event["target"]["value"];
    this.selectedPermissionsFlag[k] = !this.selectedPermissionsFlag[k];
 
    var allYPermissions = false;
    var allNPermissions = false;
    var masterPermissions = false;
    var salesPermissions = false;
    var scrapPermissions = false;
    var reportsmasterPermissions = false;
    var reportsstockPermissions = false;
    var reportssalesPermissions = false;
    var reportspurchasePermissions = false;
    var reportsfinancePermissions = false;
    var stockPermissions = false;
    var financePermissions = false;
    var chartsPermissions = false;
    var crmReportsPermissions = false;
    var stockYPermissionsLength = 0;
    var masterYPermissionsLength = 0;
    var salesYPermissionsLength = 0;
    var scrapYPermissionsLength = 0;
    var chartsYPermissionsLength = 0;
    var reportsYmasterPermissionsLength = 0;
    var reportsYstockPermissionsLength = 0;
    var reportsYsalesPermissionsLength = 0;
    var reportsYpurchasePermissionsLength = 0;
    var reportsYfinancePermissionsLength = 0;
    var financeYPermissionsLength = 0;
    var crmReportsYPermissionsLength = 0;

    for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
      if (this.selectedPermissionsFlag[i]) {
        allNPermissions = true;
      }
      
      if (this.selectedPermissionsFlag[i]) {
        var id = String(i + 1)
        count++
        try {
          document.getElementById(id)['checked']= true;
        }
        catch (error) {
        }
      }
     
      if (this.pharmacyAccessPermissions[i]['accessCd'] == "Master") {
        if (this.selectedPermissionsFlag[i]) {
          masterYPermissionsLength++

          masterPermissions = true;
         
        }
        else {
          masterPermissions = false;
        }
      }

      if (this.pharmacyAccessPermissions[i]['accessCd'] == "Sales") {
        if (this.selectedPermissionsFlag[i]) {
          
          salesYPermissionsLength++
          salesPermissions = true;
        }
        else {
          salesPermissions = false;
        }
      }

      if (this.pharmacyAccessPermissions[i]['accessCd'] == "Scrap") {
        if (this.selectedPermissionsFlag[i]) {
          scrapYPermissionsLength++
          scrapPermissions = true;
        }
        else {
          scrapPermissions = false;
        }
      }

      if (this.pharmacyAccessPermissions[i]['accessCd'] == "Charts") {
        if (this.selectedPermissionsFlag[i]) {
          chartsYPermissionsLength++
          chartsPermissions = true;
        }
        else {
          chartsPermissions = false;
        }
      }

      if (this.pharmacyAccessPermissions[i]['accessCd'] == "Reports-Master") {
        if (this.selectedPermissionsFlag[i]) {
          reportsYmasterPermissionsLength++
          reportsmasterPermissions = true;
        }
        else {
          reportsmasterPermissions = false;
        }
      }

      if (this.pharmacyAccessPermissions[i]['accessCd'] == "Reports-Stock") {
        if (this.selectedPermissionsFlag[i]) {
          reportsYstockPermissionsLength++
          reportsstockPermissions = true;
        }
        else {
          reportsstockPermissions = false;
        }
      }
      if (this.pharmacyAccessPermissions[i]['accessCd'] == "Reports-Sales") {
        if (this.selectedPermissionsFlag[i]) {
          reportsYsalesPermissionsLength++
          reportssalesPermissions = true;
        }
        else {
          reportssalesPermissions = false;
        }
      }
      if (this.pharmacyAccessPermissions[i]['accessCd'] == "Reports-Purchase") {
        if (this.selectedPermissionsFlag[i]) {
          reportsYpurchasePermissionsLength++
          reportspurchasePermissions = true;
        }
        else {
          reportspurchasePermissions = false;
        }
      }
      if (this.pharmacyAccessPermissions[i]['accessCd'] == "Reports-Finance") {
        if (this.selectedPermissionsFlag[i]) {


          reportsYfinancePermissionsLength++

          reportsfinancePermissions = true;
        }
        else {
          reportsfinancePermissions = false;
        }
      }

      if (this.pharmacyAccessPermissions[i]['accessCd'] == "Reports-CRM") {
        if (this.selectedPermissionsFlag[i]) {
          crmReportsYPermissionsLength++
          crmReportsPermissions = true;
        }
        else {
          crmReportsPermissions = false;
        }
      }

      if (this.pharmacyAccessPermissions[i]['accessCd'] == "Stock") {
        if (this.selectedPermissionsFlag[i]) {
          stockYPermissionsLength++
          stockPermissions = true;
        }
        else {
          stockPermissions = false;
        }
      }

      if (this.pharmacyAccessPermissions[i]['accessCd'] == "Finance") {
        if (this.selectedPermissionsFlag[i]) {
          financeYPermissionsLength++
          financePermissions = true;
        }
        else {
          financePermissions = false;
        }
      }
    }
    
    if (count == this.pharmacyAccessPermissions.length) {
      document.getElementById("allaccess")['checked'] = true;
    } else{
      document.getElementById("allaccess")['checked'] = false;
    }

    // if (!allNPermissions) {
    //   document.getElementById("allaccess")['checked'] = true;
    // }
    // else {
    //   document.getElementById("allaccess")['checked'] = false;
    // }

    if (masterYPermissionsLength == $('.checkbox_m').length) {
      document.getElementById("mastersaccess")['checked'] = true;
    } else {
      document.getElementById("mastersaccess")['checked'] = false;
    }

    if (salesYPermissionsLength == $('.checkbox_sl').length) {
      document.getElementById("salesaccess")['checked'] = true;
    } else {
      document.getElementById("salesaccess")['checked'] = false;
    }

    if (scrapYPermissionsLength == $('.checkbox_sc').length) {
      document.getElementById("scrapaccess")['checked'] = true;
    } else {
      document.getElementById("scrapaccess")['checked'] = false;
    }

    if (chartsYPermissionsLength == $('.checkbox_ch').length) {
      document.getElementById("chartsaccess")['checked'] = true;
    } else {
      document.getElementById("chartsaccess")['checked'] = false;
    }

    if (reportsYmasterPermissionsLength == $('.checkbox_r').length) {
      document.getElementById("reportsmastersaccess")['checked'] = true;
    } else {
      document.getElementById("reportsmastersaccess")['checked'] = false;
    }

    if (reportsYstockPermissionsLength == $('.checkbox_r_stock').length) {
      document.getElementById("reportsstockaccess")['checked'] = true;
    } else {
      document.getElementById("reportsstockaccess")['checked'] = false;
    }

    if (reportsYsalesPermissionsLength == $('.checkbox_r_sales').length) {
      document.getElementById("reportssalesaccess")['checked'] = true;
    } else {
      document.getElementById("reportssalesaccess")['checked'] = false;
    }

    if (reportsYpurchasePermissionsLength == $('.checkbox_r_pur').length) {
      document.getElementById("reportspurchaseaccess")['checked'] = true;
    } else {
      document.getElementById("reportspurchaseaccess")['checked'] = false;
    }

    if (reportsYfinancePermissionsLength == $('.checkbox_r_finance').length) {
      document.getElementById("reportsfinanceaccess")['checked'] = true;
    } else {
      document.getElementById("reportsfinanceaccess")['checked'] = false;

    }

    if (crmReportsYPermissionsLength == $('.checkbox_r_crm').length) {
      document.getElementById("reportscrmaccess")['checked'] = true;
    } else {
      document.getElementById("reportscrmaccess")['checked'] = false;

    }

    if (stockYPermissionsLength == $('.checkbox_s').length) {
      document.getElementById("stockaccess")['checked'] = true;
    } else {
      document.getElementById("stockaccess")['checked'] = false;
    }

    if (financeYPermissionsLength == $('.checkbox_f').length) {
      document.getElementById("financeaccess")['checked'] = true;
    } else {
      document.getElementById("financeaccess")['checked'] = false;
    }

    // if (masterPermissions) {
    //   document.getElementById("mastersaccess")['checked'] = true;
    // }
    // else {
    //   document.getElementById("mastersaccess")['checked'] = false;
    // }

    // if (salesPermissions) {
    //   document.getElementById("salesaccess")['checked'] = true;
    // }
    // else {
    //   document.getElementById("salesaccess")['checked'] = false;
    // }

    // if (scrapPermissions) {
    //   document.getElementById("scrapaccess")['checked'] = true;
    // }
    // else {
    //   document.getElementById("scrapaccess")['checked'] = false;
    // }

    // if (chartsPermissions) {
    //   document.getElementById("chartsaccess")['checked'] = true;
    // }
    // else {
    //   document.getElementById("chartsaccess")['checked'] = false;
    // }

    // if (reportsmasterPermissions) {
    //   document.getElementById("reportsmastersaccess")['checked'] = true;
    // }
    // else {
    //   document.getElementById("reportsmastersaccess")['checked'] = false;
    // }

    // if (reportsstockPermissions) {
    //   document.getElementById("reportsstockaccess")['checked'] = true;
    // }
    // else {
    //   document.getElementById("reportsstockaccess")['checked'] = false;
    // }

    // if (reportssalesPermissions) {
    //   document.getElementById("reportssalesaccess")['checked'] = true;
    // }
    // else {
    //   document.getElementById("reportssalesaccess")['checked'] = false;
    // }

    // if (reportspurchasePermissions) {
    //   document.getElementById("reportspurchaseaccess")['checked'] = true;
    // }
    // else {
    //   document.getElementById("reportspurchaseaccess")['checked'] = false;
    // }
    // if (reportsfinancePermissions) {
    //   document.getElementById("reportsfinanceaccess")['checked'] = true;
    // }
    // else {
    //   document.getElementById("reportsfinanceaccess")['checked'] = false;
    // }

    // if (stockPermissions) {
    //   document.getElementById("stockaccess")['checked'] = true;
    // }
    // else {
    //   document.getElementById("stockaccess")['checked'] = false;
    // }

    // if (financePermissions) {
    //   document.getElementById("financeaccess")['checked'] = true;
    // }
    // else {
    //   document.getElementById("financeaccess")['checked'] = false;
    // }
  }

  ngOnInit() {
    $(document).ready(function () {

      $(".toggleHide").click(function () {
        $(".display-content-hide").hide();
      });

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

      $(".cancel-btn-empm").click(function (e) {
        $(".date-membership").hide();
        $(".add-screen-new-agrid").show();
        $("#nav-employee-tab-edit").show();
        $(".fg-hide-from").hide();
        e.preventDefault();
        $('a[href="#nav-employee-single-edit"]').tab('show');

        $(".edit-click-show").click(function () {
          $(".fg-hide-from").show();
        });

        $("#nav-membership-tab-edit").click(function () {
          $(".date-membership").show();
        });

      });

      $(".cancel-btn-emph").click(function (e) {
        $(".date-honor").hide();
        $(".add-screen-new-agrid").show();
        $("#nav-employee-tab-edit").show();
        $(".fg-hide-from").hide();
        e.preventDefault();
        $('a[href="#nav-employee-single-edit"]').tab('show');

        $(".edit-click-show").click(function () {
          $(".fg-hide-from").show();
        });

        $("#nav-honor-tab-edit").click(function () {
          $(".date-honor").show();
        });

      });


      $(".cancel-btn-empi").click(function (e) {
        $(".date-interest").hide();
        $(".add-screen-new-agrid").show();
        $("#nav-employee-tab-edit").show();
        $(".fg-hide-from").hide();
        e.preventDefault();
        $('a[href="#nav-employee-single-edit"]').tab('show');

        $(".edit-click-show").click(function () {
          $(".fg-hide-from").show();
        });

        $("#nav-interest-tab-edit").click(function () {
          $(".date-interest").show();
        });

      });


      $(".cancel-btn-empp").click(function (e) {
        $(".date-publication").hide();
        $(".add-screen-new-agrid").show();
        $("#nav-employee-tab-edit").show();
        $(".fg-hide-from").hide();
        e.preventDefault();
        $('a[href="#nav-employee-single-edit"]').tab('show');

        $(".edit-click-show").click(function () {
          $(".fg-hide-from").show();
        });

        $("#nav-publication-tab-edit").click(function () {
          $(".date-publication").show();
        });

      });


      $(".cancel-btn-emped").click(function (e) {
        $(".date-education").hide();
        $(".add-screen-new-agrid").show();
        $("#nav-employee-tab-edit").show();
        $(".fg-hide-from").hide();
        e.preventDefault();
        $('a[href="#nav-employee-single-edit"]').tab('show');

        $(".edit-click-show").click(function () {
          $(".fg-hide-from").show();
        });

        $("#nav-education-tab-edit").click(function () {
          $(".date-education").show();
        });

      });

      $(".cancel-btn-empht").click(function (e) {
        $(".date-history").hide();
        $(".add-screen-new-agrid").show();
        $("#nav-employee-tab-edit").show();
        $(".fg-hide-from").hide();
        e.preventDefault();
        $('a[href="#nav-employee-single-edit"]').tab('show');

        $(".edit-click-show").click(function () {
          $(".fg-hide-from").show();
        });

        $("#nav-history-tab-edit").click(function () {
          $(".date-history").show();
        });

      });

      $(".cancel-btn-emps").click(function (e) {
        $(".date-salary").hide();
        $(".add-screen-new-agrid").show();
        $("#nav-employee-tab-edit").show();
        $(".fg-hide-from").hide();
        e.preventDefault();
        $('a[href="#nav-employee-single-edit"]').tab('show');

        $(".edit-click-show").click(function () {
          $(".fg-hide-from").show();
        });

        $("#nav-salary-tab-edit").click(function () {
          $(".date-salary").show();
        });

      });


      $(".update-btn-empm").click(function (e) {
        $(".date-membership").hide();
        $(".add-screen-new-agrid").show();
        $("#nav-employee-tab-edit").show();
        $(".fg-hide-from").hide();
        e.preventDefault();
        $('a[href="#nav-employee-single-edit"]').tab('show');

        $(".edit-click-show").click(function () {
          $(".fg-hide-from").show();
        });

        $("#nav-membership-tab-edit").click(function () {
          $(".date-membership").show();
        });

      });


      $(".update-btn-emph").click(function (e) {
        $(".date-honor").hide();
        $(".add-screen-new-agrid").show();
        $("#nav-employee-tab-edit").show();
        $(".fg-hide-from").hide();
        e.preventDefault();
        $('a[href="#nav-employee-single-edit"]').tab('show');

        $(".edit-click-show").click(function () {
          $(".fg-hide-from").show();
        });

        $("#nav-honor-tab-edit").click(function () {
          $(".date-honor").show();
        });

      });


      $(".update-btn-empi").click(function (e) {
        $(".date-interest").hide();
        $(".add-screen-new-agrid").show();
        $("#nav-employee-tab-edit").show();
        $(".fg-hide-from").hide();
        e.preventDefault();
        $('a[href="#nav-employee-single-edit"]').tab('show');

        $(".edit-click-show").click(function () {
          $(".fg-hide-from").show();
        });

        $("#nav-interest-tab-edit").click(function () {
          $(".date-interest").show();
        });

      });


      $(".update-btn-empp").click(function (e) {
        $(".date-publication").hide();
        $(".add-screen-new-agrid").show();
        $("#nav-employee-tab-edit").show();
        $(".fg-hide-from").hide();
        e.preventDefault();
        $('a[href="#nav-employee-single-edit"]').tab('show');

        $(".edit-click-show").click(function () {
          $(".fg-hide-from").show();
        });

        $("#nav-publication-tab-edit").click(function () {
          $(".date-publication").show();
        });

      });

      $(".update-btn-emped").click(function (e) {
        $(".date-education").hide();
        $(".add-screen-new-agrid").show();
        $("#nav-employee-tab-edit").show();
        $(".fg-hide-from").hide();
        e.preventDefault();
        $('a[href="#nav-employee-single-edit"]').tab('show');

        $(".edit-click-show").click(function () {
          $(".fg-hide-from").show();
        });

        $("#nav-education-tab-edit").click(function () {
          $(".date-education").show();
        });
      });


      $(".update-btn-empht").click(function (e) {
        $(".date-history").hide();
        $(".add-screen-new-agrid").show();
        $("#nav-employee-tab-edit").show();
        $(".fg-hide-from").hide();
        e.preventDefault();
        $('a[href="#nav-employee-single-edit"]').tab('show');

        $(".edit-click-show").click(function () {
          $(".fg-hide-from").show();
        });

        $("#nav-history-tab-edit").click(function () {
          $(".date-history").show();
        });

      });


      $(".update-btn-emps").click(function (e) {
        $(".date-salary").hide();
        $(".add-screen-new-agrid").show();
        $("#nav-employee-tab-edit").show();
        $(".fg-hide-from").hide();
        e.preventDefault();
        $('a[href="#nav-employee-single-edit"]').tab('show');

        $(".edit-click-show").click(function () {
          $(".fg-hide-from").show();
        });

        $("#nav-salary-tab-edit").click(function () {
          $(".date-salary").show();
        });

      });

    });

    this.employeeInformationForm = new FormGroup(
      this.employeeInformationFormValidations
    );
    this.employeeProfessionalMembershipInformationForm = new FormGroup(
      this.employeeProfessionalMembershipInformationFormValidations
    );
    this.employeeHonorInformationForm = new FormGroup(
      this.employeeHonorInformationFormValidations
    );
    this.employeeInterestInformationForm = new FormGroup(
      this.employeeInterestInformationFormValidations
    );
    this.employeePublicationInformationForm = new FormGroup(
      this.employeePublicationInformationFormValidations
    );
    this.employeeEducationInformationForm = new FormGroup(
      this.employeeEducationInformationFormValidations
    );
    this.employmentHistoryInformationForm = new FormGroup(
      this.employmentHistoryInformationFormValidations
    );
    this.employeeSalaryInformationForm = new FormGroup(
      this.employeeSalaryInformationFormValidations
    );
    this.employeePharmacyRoleInformationForm = new FormGroup(
      this.employeePharmacyRoleInformationFormValidations
    );
    this.employeeCredentialsInformationForm = new FormGroup(
      this.employeeCredentialsInformationFormValidations
    );
    this.employeePharmacyAccessInformationForm = new FormGroup(
      this.employeePharmacyAccessInformationFormValidations
    );
    this.employeeAccessInformationForm = new FormGroup(
      this.employeeAccessInformationFormValidations
    );

  }

  ngOnDestroy(): void {
    this.appService.clearInsertedRowData();
  }

  rowSelection(params: any) {
    if (!params.node.selected) {
      let resetData = this.appService.getInsertedRowData().find(dataRow => dataRow.employeeId === params.data.employeeId);
      params.node.setData(JSON.parse(JSON.stringify(resetData)));
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
  }

  resetGrid() {
    this.getGridRowData();
  }

	/**
	 * Grid Changes
	 * End
	 */

  getGridRowData() {
    this.showGrid = true;
    this.employeeService.getRowDataFromServer().subscribe(gridRowDataResponse => {
      if (gridRowDataResponse instanceof Object) {
        if (gridRowDataResponse["responseStatus"]["code"] === 200) {
          this.rowData = gridRowDataResponse["result"];
          this.employees = this.rowData;
          for (let i = 0; i < this.employees.length; i++) {
            if (this.employees[i].activeS == "Y") {
              this.employees[i].Status = "Active";
            } else if (this.employees[i].activeS == "N") {
              this.employees[i].Status = "DeActive";
            }
            if (this.employees[i].genderCode == 'M') {
              this.employees[i].Gender = 'Male'
            }
            else if (this.employees[i].genderCode == 'F') {
              this.employees[i].Gender = 'FeMale'
            }
          }

          this.showGrid = true;
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });
  }

  public onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.employeeGridOptions.api.setQuickFilter($event.target.value);
    if (this.employeeGridOptions.api.getDisplayedRowCount() == 0) {
      this.employeeGridOptions.api.showNoRowsOverlay();
    } else {
      this.employeeGridOptions.api.hideOverlay();
    }
  }

  onEmployeeSelected(employeeId: string) {
    let gridOptionEmpId = this.employeeGridOptions.api.getSelectedRows()[0].employeeId;
    this.employeeService.getEmployeeImageById(gridOptionEmpId).subscribe(getImageResponse => {
      if (getImageResponse instanceof Object) {
        if (getImageResponse["responseStatus"]["code"] === 200) {
          this.employeeImages = getImageResponse['result'];
        }
      }
      for (let i = 0; i < this.employeeImages.length; i++) {
        if (this.employeeImages[i].imageDesc == "profileImage") {
          this.profileEditImage = this.employeeImages[i].image;
        }
        if (this.employeeImages[i].imageDesc == "policeGoodConductCertificate") {
          this.ConductCertificateEditImage = this.employeeImages[i].image;
        }

        if (this.employeeImages[i].imageDesc == "signedContract") {
          this.ContractEditImage = this.employeeImages[i].image;
        }

        if (this.employeeImages[i].imageDesc == "identificationDocument") {
          this.DocumentEditImage = this.employeeImages[i].image;
        }

        if (this.employeeImages[i].imageDesc == "resume") {
          this.resumeEditImage = this.employeeImages[i].image;
        }
      }
    })

    this.showGenericDetails = true;
    this.selectedEmployee = this.employees.find(employee => employee["employeeId"] == employeeId);

    this.employeeService.getProvinces(this.selectedEmployee["country"]).subscribe(getProvincesResponse => {
      if (getProvincesResponse instanceof Object) {
        if (getProvincesResponse["responseStatus"]["code"] === 200) {
          this.states = getProvincesResponse["result"];
          let employeeFormValues: Object = {
            employeeId: this.selectedEmployee["employeeId"],
            firstName: this.selectedEmployee["firstName"],
            lastName: this.selectedEmployee["lastName"],
            middleName: this.selectedEmployee["middleName"],
            title: this.selectedEmployee["title"],
            employeeCode: this.selectedEmployee["employeeCode"],
            genderCode: this.selectedEmployee["genderCode"],
            phoneNumber: this.selectedEmployee["phoneNumber"],
            employeeTypeFullTimOrPartTime: this.selectedEmployee[
              "employeeTypeFullTimOrPartTime"
            ],
            salary: this.selectedEmployee["salary"],
            dateOfBirth: this.selectedEmployee["dateOfBirth"],
            dateOfJoining: this.selectedEmployee["dateOfJoining"],
            emailId: this.selectedEmployee["emailId"],
            designation: this.selectedEmployee["designation"],
            bipgraphyDesc: this.selectedEmployee["bipgraphyDesc"],
            country: this.selectedEmployee["country"],
            state: this.selectedEmployee["state"],
            addressLine1: this.selectedEmployee["addressLine1"],
            city: this.selectedEmployee["city"],
            bloodGroup: this.selectedEmployee["bloodGroup"],
            nightShifts: this.selectedEmployee["nightShifts"],
            addressLine2: this.selectedEmployee["addressLine2"],
            postalCode: this.selectedEmployee["postalCode"],
            pharmacyId: this.selectedEmployee["pharmacyId"],
            employeeTypeModel: this.selectedEmployee["employeeTypeModel"],
            activeS: this.selectedEmployee["activeS"],
            kraPin: this.selectedEmployee["kraPin"],
            nhifNumber: this.selectedEmployee["nhifNumber"],
            landlineNumber: this.selectedEmployee["landlineNumber"],
            postBox: this.selectedEmployee["postBox"],
            createdUser: this.selectedEmployee["createdUser"],
            identificationNumber: this.selectedEmployee[
              "identificationNumber"
            ],
            nssfNumber: this.selectedEmployee["nssfNumber"]
          };
          this.employeeInformationForm.setValue(employeeFormValues);
          this.currentEmployee = this.selectedEmployee;
          this.selectedEmpGender = this.selectedEmployee['genderCode'];

        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });

    this.employeeService.getEmployeeProfMembershipByEmployeeId(employeeId).subscribe(employeeProfMembership => {
      if (employeeProfMembership instanceof Object) {
        if (employeeProfMembership["responseStatus"]["code"] === 200) {

          if (employeeProfMembership["result"] instanceof Object) {
            let employeeProfMembershipValues: Object = {
              employeeProfMembershipId: employeeProfMembership["result"]["employeeProfMembershipId"],
              membershipName: employeeProfMembership["result"]["membershipName"],
              employee: this.employeeInformationForm.value,
              startDate: this.datePipe.transform(
                employeeProfMembership["result"]["startDate"], "yyyy-MM-dd"
              ),
              endDate: this.datePipe.transform(
                employeeProfMembership["result"]["endDate"], "yyyy-MM-dd"
              ),
              createdUser: employeeProfMembership["result"]["createdUser"]
            };
            this.memberShipDetails = employeeProfMembershipValues;
            this.employeeProfessionalMembershipInformationForm.setValue(employeeProfMembershipValues);
            this.employeeProfessionalMembershipUpdate = true;
          } else {
            this.employeeProfessionalMembershipUpdate = false;
          }
        } else {
          this.toasterService.error(
            "Please contact administrator", "Error Occurred", {
            timeOut: 5000
          }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator", "Error Occurred", {
          timeOut: 5000
        }
        );
      }
    });

    this.employeeService.getEmployeeHonorByEmployeeId(employeeId).subscribe(employeeHonor => {
      if (employeeHonor instanceof Object) {
        if (employeeHonor["responseStatus"]["code"] === 200) {
          if (employeeHonor["result"] instanceof Object) {
            let employeeHonorValues: Object = {
              employeeHonorId: employeeHonor["result"]["employeeHonorId"],
              honorName: employeeHonor["result"]["honorName"],
              honorDesc: employeeHonor["result"]["honorDesc"],
              employee: employeeHonor["result"]["employee"],
              receivedDate: this.datePipe.transform(
                employeeHonor["result"]["receivedDate"], "yyyy-MM-dd"
              ),
              createdUser: employeeHonor["result"]["createdUser"]
            };
            this.honorDetails = employeeHonorValues;
            this.employeeHonorInformationForm.setValue(employeeHonorValues);
            this.employeeHonorUpdate = true;
          } else {
            this.employeeHonorUpdate = false;
          }

        } else {
          this.toasterService.error(
            "Please contact administrator", "Error Occurred", {
            timeOut: 5000
          }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator", "Error Occurred", {
          timeOut: 5000
        }
        );
      }
    });

    this.employeeService.getEmployeeInterestByEmployeeId(employeeId).subscribe(employeeInterest => {
      if (employeeInterest instanceof Object) {
        if (employeeInterest["responseStatus"]["code"] === 200) {
          if (employeeInterest["result"] instanceof Object) {
            let employeeInterestValues: Object = {
              employeeIntrestId: employeeInterest["result"]["employeeIntrestId"],
              areaOfIntrestDesc: employeeInterest["result"]["areaOfIntrestDesc"],
              employee: employeeInterest["result"]["employee"],
              createdUser: employeeInterest["result"]["createdUser"]
            };
            this.interestObj = employeeInterestValues;
            this.employeeInterestInformationForm.setValue(
              employeeInterestValues
            );
            this.employeeInterestUpdate = true;
          } else {
            this.employeeInterestUpdate = false;
          }
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });

    this.employeeService
      .getEmployeePublicationByEmployeeId(employeeId)
      .subscribe(employeePublication => {
        if (employeePublication instanceof Object) {
          if (employeePublication["responseStatus"]["code"] === 200) {
            if (employeePublication["result"] instanceof Object) {
              let employeePublicationValue: Object = {
                employeePublicationId:
                  employeePublication["result"]["employeePublicationId"],
                publicationName: employeePublication["result"]["publicationName"],
                publicationDesc: employeePublication["result"]["publicationDesc"],
                employee: employeePublication["result"]["employee"],
                publishDate: this.datePipe.transform(
                  employeePublication["result"]["publishDate"],
                  "yyyy-MM-dd"
                ),
                createdUser: employeePublication["result"]["createdUser"]
              };
              this.publicationObj = employeePublicationValue;
              this.employeePublicationInformationForm.setValue(
                employeePublicationValue
              );
              this.employeePublicationUpdate = true;
            }
            else {
              this.employeePublicationUpdate = false;
            }
          } else {
            this.toasterService.error(
              "Please contact administrator",
              "Error Occurred",
              {
                timeOut: 5000
              }
            );
          }
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      });
    this.employeeService
      .getEmployeeEducationByEmployeeId(employeeId)
      .subscribe(employeeEducation => {
        if (employeeEducation instanceof Object) {
          if (employeeEducation["responseStatus"]["code"] === 200) {
            if (employeeEducation["result"] instanceof Object) {
              let employeeEducationValues: Object = {
                employeeEducationId: employeeEducation["result"]["employeeEducationId"],
                studiedAt: employeeEducation["result"]["studiedAt"],
                degree: employeeEducation["result"]["degree"],
                employee: employeeEducation["result"]["employee"],
                graduationDate: this.datePipe.transform(employeeEducation["result"]["graduationDate"],
                  "yyyy-MM-dd"
                ),
                createdUser: employeeEducation["result"]["createdUser"]
              };
              this.educationObj = employeeEducationValues;
              this.employeeEducationInformationForm.setValue(
                employeeEducationValues
              );
              this.employeeEducationUpdate = true;
            }
            else {
              this.employeeEducationUpdate = false;
            }

          } else {
            this.toasterService.error(
              "Please contact administrator",
              "Error Occurred",
              {
                timeOut: 5000
              }
            );
          }
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      });
    this.employeeService.getEmployeeHistoryByEmployeeId(employeeId).subscribe(employeeHistory => {
      if (employeeHistory instanceof Object) {
        if (employeeHistory["responseStatus"]["code"] === 200) {
          if (employeeHistory["result"] instanceof Object) {
            let employeeHistoryValues: Object = {
              employeementHistoryId:
                employeeHistory["result"]["employeementHistoryId"],
              companyName: employeeHistory["result"]["companyName"],
              startDate: this.datePipe.transform(
                employeeHistory["result"]["startDate"],
                "yyyy-MM-dd"
              ),
              endDate: this.datePipe.transform(
                employeeHistory["result"]["endDate"],
                "yyyy-MM-dd"
              ),
              compnayAddress: employeeHistory["result"]["compnayAddress"],
              reportingPersonDetails: employeeHistory["result"]["reportingPersonDetails"],
              managerName: employeeHistory["result"]["managerName"],
              managerPhoneNumber: employeeHistory["result"]["managerPhoneNumber"],
              managerEmail: employeeHistory["result"]["managerEmail"],
              designation: employeeHistory["result"]["designation"],
              employementType: employeeHistory["result"]["employementType"],
              employee: employeeHistory["result"]["employee"],
              reference1: employeeHistory["result"]["reference1"],
              reference2: employeeHistory["result"]["reference2"],
              createdUser: employeeHistory["result"]["createdUser"]
            };
            this.historyObj = employeeHistoryValues;
            this.employmentHistoryInformationForm.setValue(
              employeeHistoryValues
            );
            this.employeeHistoryUpdate = true;
          }
          else {
            this.employeeHistoryUpdate = false;
          }
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });

    this.employeeService.getEmployeeSalaryByEmployeeId(employeeId).subscribe(employeeSalary => {
      if (employeeSalary instanceof Object) {
        if (employeeSalary["responseStatus"]["code"] === 200) {
          if (employeeSalary["result"] instanceof Object) {
            let employeeSalaryValues: Object = {
              employeeSalaryId: employeeSalary["result"]["employeeSalaryId"],
              salaryDate: this.datePipe.transform(
                employeeSalary["result"]["salaryDate"],
                "yyyy-MM-dd"
              ),
              basic: employeeSalary["result"]["basic"],
              hra: employeeSalary["result"]["hra"],
              da: employeeSalary["result"]["da"],
              medical: employeeSalary["result"]["medical"],
              ptax: employeeSalary["result"]["ptax"],
              pfEmployee: employeeSalary["result"]["pfEmployee"],
              pfEmployer: employeeSalary["result"]["pfEmployer"],
              tds: employeeSalary["result"]["tds"],
              esi: employeeSalary["result"]["esi"],
              grossSalary: employeeSalary["result"]["grossSalary"],
              employee: employeeSalary["result"]["employee"],
              createdUser: employeeSalary["result"]["createdUser"]
            };
            this.salaryObj = employeeSalaryValues;
            this.employeeSalaryInformationForm.setValue(employeeSalaryValues);
            this.employeeSalaryUpdate = true;
          }
          else {
            this.employeeSalaryUpdate = false;
          }
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });

    this.employeeService.getEmployeeCredentialsByEmployeeId(employeeId).subscribe(employeeCredentials => {
      if (employeeCredentials instanceof Object) {
        if (employeeCredentials["responseStatus"]["code"] === 200) {
          if (employeeCredentials["result"] instanceof Object) {
            let employeeCredentialsValues: Object = {
              employeeCredentialsId: employeeCredentials["result"]["employeeCredentialsId"],
              userName: employeeCredentials["result"]["userName"],
              currentPassword: employeeCredentials["result"]["currentPassword"],
              approvalAccessPin: employeeCredentials["result"]["approvalAccessPin"],
              previousPassword1: employeeCredentials["result"]["previousPassword1"],
              previousPassword2: employeeCredentials["result"]["previousPassword2"],
              passwordStatus: employeeCredentials["result"]["passwordStatus"],
              activeS: employeeCredentials["result"]["activeS"],
              employee: employeeCredentials["result"]["employee"],
              createdUser: employeeCredentials["result"]["createdUser"]
            };
            this.accessObj = employeeCredentialsValues;
            this.employeeCredentialsInformationForm.setValue(employeeCredentialsValues);
            this.empCredential = employeeCredentialsValues;
            this.employeeCredentialUpdate = true;
          }
          else {
            this.employeeCredentialsInformationForm.get('userName').setValue(this.currentEmployee['firstName'] + this.currentEmployee['employeeId'])
            this.employeeCredentialUpdate = false;
          }
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });

    this.employeeService.getEmployeePharmacyroleByEmployeeId(employeeId).subscribe(employeePharmacyrole => {
      if (employeePharmacyrole instanceof Object) {
        if (employeePharmacyrole["responseStatus"]["code"] === 200) {
          if (employeePharmacyrole["result"] instanceof Object) {
            const employeePharmacyroleValues = {
              employeePharmacyRoleId: employeePharmacyrole["result"]["employeePharmacyRoleId"],
              pharmacyModel: employeePharmacyrole["result"]["pharmacyModel"],
              employee: employeePharmacyrole["result"]["employee"],
              employeeRole:employeePharmacyrole["result"]["pharmacyRolesModel"],
              pharmacyRolesModel: employeePharmacyrole["result"]["pharmacyRolesModel"],
              createdUser: employeePharmacyrole["result"]["createdUser"]
            };
            const pharmacies: any[] =
              employeePharmacyroleValues["pharmacyModel"];
            for (let i = 0; i < pharmacies.length; i++) {
              this.onUnMappedCheckedPharmacies([pharmacies[i]]);
            }
            this.employeePharmacyRoleInformationForm.setValue(
              employeePharmacyroleValues
            );
            this.pharmaRoles = employeePharmacyroleValues;
            this.unMappedPharmacy = employeePharmacyroleValues['pharmacyModel'];
            this.pharmacyRole = employeePharmacyroleValues['pharmacyRolesModel'];
            this.employeeRoleUpdate = true;
          }
          else {
            this.employeeRoleUpdate = false;
          }
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });

    this.employeeService.getEmployeeAccessByEmployeeId(employeeId).subscribe(employeeAccess => {
      if (employeeAccess instanceof Object) {
        if (employeeAccess["responseStatus"]["code"] === 200) {
          if (employeeAccess["result"] instanceof Object) {
            this.selectedPermissionsFlag = [];
            if (employeeAccess["result"].length > 0) {
              for (var i = 0; i < employeeAccess["result"].length; i++) {
                this.employeeAccessIds.push(
                  employeeAccess["result"][i]["employeeAccessId"]
                );
                if (employeeAccess["result"][i]["activeS"] === "Y") {
                  this.selectedPermissionsFlag.push(true);
                } else {
                  this.selectedPermissionsFlag.push(false);
                }
              }
            }
            else {
              for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
                this.selectedPermissionsFlag.push(false);
              }
            }

            for (var i = 0; i < this.pharmacyAccessPermissions.length; i++) {
              if (this.selectedPermissionsFlag[i] == undefined && this.selectedPermissionsFlag[i] == null) {
                this.selectedPermissionsFlag.push(false);
              }
            }

            var allYPermissions = false;
            var allNPermissions = false;

            var masterPermissions = false;
            var salesPermissions = false;
            var scrapPermissions = false;
            var chartsPermissions = false;
            var reportsmasterPermissions = false;
            var reportsstockPermissions = false;
            var reportssalesPermissions = false;
            var reportspurchasePermissions = false;
            var reportsfinancePermissions = false;
            var crmReportsPermissions = false;
            var stockPermissions = false;
            var financePermissions = false;
            var stockYPermissionsLength = 0;
            var masterYPermissionsLength = 0;
            var salesYPermissionsLength = 0;
            var scrapYPermissionsLength = 0;
            var chartsYPermissionsLength = 0;
            var reportsYmasterPermissionsLength = 0;
            var reportsYstockPermissionsLength = 0;
            var reportsYsalesPermissionsLength = 0;
            var reportsYpurchasePermissionsLength = 0;
            var reportsYfinancePermissionsLength = 0;
            var financeYPermissionsLength = 0;
            var crmReportsYPermissionsLength = 0;


            for (var i = 0; i < employeeAccess["result"].length; i++) {
              if (employeeAccess["result"][i]["activeS"] === "N") {
                allNPermissions = true;
              }
              if (employeeAccess["result"][i]["activeS"] === "Y") {
                var id = String(i + 1);
                try {
                  document.getElementById(id)['checked'] = true;
                }
                catch (error) {
                }
              }

              if (this.pharmacyAccessPermissions[i]['accessCd'] == "Master") {
                if (employeeAccess["result"][i]["activeS"] === "Y") {
                  masterYPermissionsLength++
                  masterPermissions = true;
                }
                else {
                  masterPermissions = false;
                }
              }

              if (this.pharmacyAccessPermissions[i]['accessCd'] == "Sales") {
                if (employeeAccess["result"][i]["activeS"] === "Y") {
                  salesYPermissionsLength++
                  salesPermissions = true;
                }
                else {
                  salesPermissions = false;
                }
              }

              if (this.pharmacyAccessPermissions[i]['accessCd'] == "Scrap") {
                if (employeeAccess["result"][i]["activeS"] === "Y") {
                  scrapYPermissionsLength++
                  scrapPermissions = true;
                }
                else {
                  scrapPermissions = false;
                }
              }

              if (this.pharmacyAccessPermissions[i]['accessCd'] == "Charts") {
                if (employeeAccess["result"][i]["activeS"] === "Y") {
                  chartsYPermissionsLength++
                  chartsPermissions = true;
                }
                else {
                  chartsPermissions = false;
                }
              }

              if (this.pharmacyAccessPermissions[i]['accessCd'] == "Reports-Master") {
                if (employeeAccess["result"][i]["activeS"] === "Y") {
                  reportsYmasterPermissionsLength++
                  reportsmasterPermissions = true;
                }
                else {
                  reportsmasterPermissions = false;
                }
              }

              if (this.pharmacyAccessPermissions[i]['accessCd'] == "Reports-Stock") {
                if (employeeAccess["result"][i]["activeS"] === "Y") {
                  reportsYstockPermissionsLength++
                  reportsstockPermissions = true;
                }
                else {
                  reportsstockPermissions = false;
                }
              }
              if (this.pharmacyAccessPermissions[i]['accessCd'] == "Reports-Sales") {
                if (employeeAccess["result"][i]["activeS"] === "Y") {
                  reportsYsalesPermissionsLength++
                  reportssalesPermissions = true;
                }
                else {
                  reportssalesPermissions = false;
                }
              }
              if (this.pharmacyAccessPermissions[i]['accessCd'] == "Reports-Purchase") {
                if (employeeAccess["result"][i]["activeS"] === "Y") {
                  reportsYpurchasePermissionsLength++
                  reportspurchasePermissions = true;
                }
                else {
                  reportspurchasePermissions = false;
                }
              }

              if (this.pharmacyAccessPermissions[i]['accessCd'] == "Reports-CRM") {
                if (employeeAccess["result"][i]["activeS"] === "Y") {
                  crmReportsYPermissionsLength++
                  crmReportsPermissions = true;
                }
                else {
                  crmReportsPermissions = false;
                }
              }

              if (this.pharmacyAccessPermissions[i]['accessCd'] == "Reports-Finance") {
                if (employeeAccess["result"][i]["activeS"] === "Y") {
                  reportsYfinancePermissionsLength++
                  reportsfinancePermissions = true;
                }
                else {
                  reportsfinancePermissions = false;
                }
              }

              if (this.pharmacyAccessPermissions[i]['accessCd'] == "Stock") {
                if (employeeAccess["result"][i]["activeS"] === "Y") {
                  stockYPermissionsLength++;
                  stockPermissions = true;

                }
                else {
                  stockPermissions = false;
                }
              }

              if (this.pharmacyAccessPermissions[i]['accessCd'] == "Finance") {
                if (employeeAccess["result"][i]["activeS"] === "Y") {
                  financeYPermissionsLength++
                  financePermissions = true;
                }
                else {
                  financePermissions = false;
                }
              }
            }

            if (masterPermissions && salesPermissions && scrapPermissions && chartsPermissions && reportsmasterPermissions
              && reportsfinancePermissions && reportspurchasePermissions
              && reportssalesPermissions && reportsstockPermissions && stockPermissions && financePermissions) {
              document.getElementById("allaccess")['checked'] = true;
            }

            if (masterYPermissionsLength == $('.checkbox_m').length) {
              document.getElementById("mastersaccess")['checked'] = true;
            } else {
              document.getElementById("mastersaccess")['checked'] = false;
            }

            if (salesYPermissionsLength == $('.checkbox_sl').length) {
              document.getElementById("salesaccess")['checked'] = true;
            } else {
              document.getElementById("salesaccess")['checked'] = false;
            }

            if (scrapYPermissionsLength == $('.checkbox_sc').length) {
              document.getElementById("scrapaccess")['checked'] = true;
            } else {
              document.getElementById("scrapaccess")['checked'] = false;
            }

            if (chartsYPermissionsLength == $('.checkbox_ch').length) {
              document.getElementById("chartsaccess")['checked'] = true;
            } else {
              document.getElementById("chartsaccess")['checked'] = false;
            }

            if (reportsYmasterPermissionsLength == $('.checkbox_r').length) {
              document.getElementById("reportsmastersaccess")['checked'] = true;
            } else {
              document.getElementById("reportsmastersaccess")['checked'] = false;
            }

            if (reportsYstockPermissionsLength == $('.checkbox_r_stock').length) {
              document.getElementById("reportsstockaccess")['checked'] = true;
            } else {
              document.getElementById("reportsstockaccess")['checked'] = false;
            }

            if (reportsYsalesPermissionsLength == $('.checkbox_r_sales').length) {
              document.getElementById("reportssalesaccess")['checked'] = true;
            } else {
              document.getElementById("reportssalesaccess")['checked'] = false;
            }

            if (reportsYpurchasePermissionsLength == $('.checkbox_r_pur').length) {
              document.getElementById("reportspurchaseaccess")['checked'] = true;
            } else {
              document.getElementById("reportspurchaseaccess")['checked'] = false;
            }

            if (reportsYfinancePermissionsLength == $('.checkbox_r_finance').length) {
              document.getElementById("reportsfinanceaccess")['checked'] = true;
            } else {
              document.getElementById("reportsfinanceaccess")['checked'] = false;

            }

            if (crmReportsYPermissionsLength == $('.checkbox_r_crm').length) {
              document.getElementById("reportscrmaccess")['checked'] = true;
            } else {
              document.getElementById("reportscrmaccess")['checked'] = false;

            }

            if (stockYPermissionsLength == $('.checkbox_s').length) {
              document.getElementById("stockaccess")['checked'] = true;
            } else {
              document.getElementById("stockaccess")['checked'] = false;
            }

            if (financeYPermissionsLength == $('.checkbox_f').length) {
              document.getElementById("financeaccess")['checked'] = true;
            } else {
              document.getElementById("financeaccess")['checked'] = false;
            }


            this.selPermFlag = _.cloneDeep(this.selectedPermissionsFlag);
            this.employeeAccessInformationForm.get("employeeAccessId").setValue(this.employeeAccessIds);
            this.employeeAccessInformationForm.get("pharmaAccessids").setValue(this.selectedPermissions);
            this.employeeAccessInformationForm.get("employee").setValue(this.currentEmployee);
            this.employeeAccessInformationForm.get("flag").setValue(this.selectedPermissionsFlag);
            this.employeeAccessUpdate = true;
          }
          else {
            this.employeeAccessUpdate = false;
          }
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });
  }

  onProfessionalMemberShipSubmit() {
    this.showGrid = true;
    this.employeeProfessionalMembershipInformationForm.get('employee').setValue(this.currentEmployee);
    let payload = Object.assign({}, this.employeeProfessionalMembershipInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    if (this.employeeProfessionalMembershipUpdate) {
      this.updateProfessionalMemberShipFormChanges(payload);
    }
    else {
      this.saveProfessionalMemberShipFormChanges(payload);
    }
  }


  updateProfessionalMemberShipFormChanges(payload) {
    this.employeeService.updateEmployeeProfMembership(payload).subscribe(employeeProfMembership => {
      this.employeeProfessionalMembershipInformationForm.get('membershipName').setErrors({ 'incorrect': true });
      if (employeeProfMembership instanceof Object) {
        if (employeeProfMembership["responseStatus"]["code"] === 200) {
          this.employeeProfessionalMembershipInformationForm.reset();
          this.toasterService.success(
            employeeProfMembership["message"],
            "Success",
            {
              timeOut: 3000
            }
          );
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });
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
            this.employeeProfessionalMembershipInformationFormValidations = {
              employeeProfMembershipId: new FormControl(""),
              membershipName: new FormControl(""),
              startDate: new FormControl(""),
              endDate: new FormControl(""),
              employee: new FormControl(""),
              createdUser: new FormControl(localStorage.getItem("id"))
            };
            this.employeeProfessionalMembershipInformationForm = new FormGroup(
              this.employeeProfessionalMembershipInformationFormValidations
            );

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

  onEmployeeHonorInformationFormSubmit() {
    this.showGrid = true;
    this.employeeHonorInformationForm.get('employee').setValue(this.currentEmployee);
    let payload = Object.assign({}, this.employeeHonorInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    if (this.employeeHonorUpdate) {
      this.updateHonorFormChanges(payload);
    } else {
      this.saveEmployeeHonorInformationFormChanges(payload);
    }
    payload['genderCode'] = (this.selectedEmpGender['name'] == 'Male' || this.selectedEmpGender['name'] == 'M') ? 'M' : 'F';
  }

  updateHonorFormChanges(payload) {
    this.employeeService.updateEmployeeHonor(payload).subscribe(employeeHonor => {
      if (employeeHonor instanceof Object) {
        if (employeeHonor["responseStatus"]["code"] === 200) {
          this.employeeHonorInformationForm.reset();
          this.toasterService.success(employeeHonor["message"], "Success", {
            timeOut: 3000
          });
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });
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
    this.showGrid = true;
    this.employeeInterestInformationForm.get('employee').setValue(this.currentEmployee);
    let payload = Object.assign({}, this.employeeInterestInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    if (this.employeeInterestUpdate) {
      this.updateEmployeeInterestInformationFormChanges(payload);
    } else {
      this.saveEmployeeInterestInformationFormChanges(payload);
    }
  }

  updateEmployeeInterestInformationFormChanges(payload) {
    this.employeeService.updateEmployeeInterest(payload).subscribe(employeeInterest => {
      if (employeeInterest instanceof Object) {
        if (employeeInterest["responseStatus"]["code"] === 200) {
          this.employeeInterestInformationForm.reset();
          this.toasterService.success(
            employeeInterest["message"],
            "Success",
            { timeOut: 3000 }
          );
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error("Please contact administrator", "Error Occurred", {
          timeOut: 5000
        }
        );
      }
    });
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
    this.showGrid = true;
    this.employeePublicationInformationForm.get('employee').setValue(this.currentEmployee);
    let payload = Object.assign({}, this.employeePublicationInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    if (this.employeePublicationUpdate) {
      this.updateEmployeePublicationInformationFormChanges(payload);
    } else {
      payload.createdUser = localStorage.getItem('id');
      this.saveEmployeePublicationInformationFormChanges(payload);
    }
  }

  updateEmployeePublicationInformationFormChanges(payload) {
    this.employeeService.updateEmployeePublication(payload).subscribe(employeeInformation => {
      if (employeeInformation instanceof Object) {
        if (employeeInformation["responseStatus"]["code"] === 200) {
          this.employeePublicationInformationForm.reset();
          this.toasterService.success(
            employeeInformation["message"], "Success", {
            timeOut: 3000
          }
          );
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });
  }

  saveEmployeePublicationInformationFormChanges(employeePublicationInformationForm: Object) {
    this.employeePublicationInformationForm.get('publicationName').setErrors({ 'incorrect': true });
    this.employeeService.saveEmployeePublication(employeePublicationInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.employeePublicationInformationForm.reset();
            this.publicationObj = undefined;
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
    this.showGrid = true;
    this.employeeEducationInformationForm.get('employee').setValue(this.currentEmployee);
    let payload = Object.assign({}, this.employeeEducationInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    if (this.employeeEducationUpdate) {
      this.updateEmployeeEducationInformationFormChanges(payload);
    } else {
      this.saveEmployeeEducationInformationFormChanges(payload);
    }
  }

  updateEmployeeEducationInformationFormChanges(payload) {
    this.employeeService.updateEmployeeEducation(payload).subscribe(employeeEducation => {
      if (employeeEducation instanceof Object) {
        if (employeeEducation["responseStatus"]["code"] === 200) {
          this.employeeEducationInformationForm.reset();
          this.toasterService.success(
            employeeEducation["message"], "Success", {
            timeOut: 3000
          }
          );
        } else {
          this.toasterService.error(
            "Please contact administrator", "Error Occurred", {
            timeOut: 5000
          }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator", "Error Occurred", {
          timeOut: 5000
        }
        );
      }
    });
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
    this.showGrid = true;
    this.employmentHistoryInformationForm.get('employee').setValue(this.currentEmployee);
    let payload = Object.assign({}, this.employmentHistoryInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    if (this.employeeHistoryUpdate) {
      this.updateEmploymentHistoryInformationChanges(payload);
    } else {
      this.saveEmploymentHistoryInformationFormChanges(payload);
    }
  }

  updateEmploymentHistoryInformationChanges(payload) {
    this.employeeService.updateEmployeeHistory(payload).subscribe(employeeHistory => {
      if (employeeHistory instanceof Object) {
        if (employeeHistory["responseStatus"]["code"] === 200) {
          this.employmentHistoryInformationForm.reset();
          this.toasterService.success(employeeHistory["message"], "Success", {
            timeOut: 3000
          });
        } else {
          this.toasterService.error("Please contact administrator", "Error Occurred", {
            timeOut: 5000
          }
          );
        }
      } else {
        this.toasterService.error("Please contact administrator", "Error Occurred", {
          timeOut: 5000
        }
        );
      }
    });
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
    this.showGrid = true;
    this.employeeSalaryInformationForm.get('employee').setValue(this.currentEmployee);
    let payload = Object.assign({}, this.employeeSalaryInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    if (this.employeeSalaryUpdate) {
      this.updateEmployeeSalaryInformationFormChanges(payload);
    } else {
      this.saveEmployeeSalaryInformationFormChanges(payload);
    }
  }

  updateEmployeeSalaryInformationFormChanges(payload) {
    this.employeeService.updateEmployeeSalary(payload).subscribe(employeeSalary => {
      if (employeeSalary instanceof Object) {
        if (employeeSalary["responseStatus"]["code"] === 200) {
          this.employeeSalaryInformationForm.reset();
          this.toasterService.success(employeeSalary["message"], "Success", {
            timeOut: 3000
          });
        } else {
          this.toasterService.error("Please contact administrator", "Error Occurred", {
            timeOut: 5000
          }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred", {
          timeOut: 5000
        }
        );
      }
    });
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
    this.employeePharmacyRoleInformationForm.get('employee').setValue(this.currentEmployee);
    this.employeeCredentialsInformationForm.get('employee').setValue(this.currentEmployee);
    this.employeeAccessInformationForm.get('employee').setValue(this.currentEmployee);
    let pharmacyBrancheSelected = this.selectedUnMappedPharmacies;

    this.employeePharmacyRoleInformationForm.get("pharmacyRolesModel").setValue(this.pharmacyRole);
    this.employeePharmacyRoleInformationForm.get("pharmacyModel").setValue(this.unMappedPharmacy);

    let payload = Object.assign({}, this.employeeCredentialsInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    if (this.employeeAccessUpdate && this.employeeRoleUpdate && this.employeeCredentialUpdate) {
      this.updateEmployeeCredentialsInformationFormChanges(payload);
    } else {
      if (payload['employeeCredentialsId']) {
        this.saveEmployeeCredentialsInformationFormChanges(payload);
      } else {
        delete payload['employeeCredentialsId']
        this.saveEmployeeCredentialsInformationFormChanges(payload);
      }
    }
    this.resetAllSelectedPermissions();
    this.showGrid = true;
  }

  updateEmployeeCredentialsInformationFormChanges(employeeCredentialsInformationForm: Object) {
    this.spinnerService.show();
    this.employeeCredentialsInformationForm.get('currentPassword').setErrors({ 'incorrect': true });
    this.employeeService.updateEmployeeCredentials(employeeCredentialsInformationForm).subscribe(saveFormResponse => {
      if (saveFormResponse instanceof Object) {
        if (saveFormResponse["responseStatus"]["code"] === 200) {
          this.employeeCredentialsInformationForm.reset();
          this.employeeService.updateEmployeePharmacyrole(this.employeePharmacyRoleInformationForm.value).subscribe(pharmacyroleRes => {
            if (pharmacyroleRes["responseStatus"]["code"] === 200) {
              this.employeePharmacyRoleInformationForm.reset();
              this.accessObj = undefined;
              this.employeeService.updateEmployeeAccess(this.employeeAccessInformationForm.value).subscribe(accessRes => {
                if (accessRes["responseStatus"]["code"] === 200) {
                  this.spinnerService.hide();
                  this.selectedPermissions = [];
                  this.selectedPermissionsFlag = [];
                  this.getAllPharmacyAccessPermissions();
                  this.selectedUnMappedPharmacyNames = undefined;
                  this.selectedPharmacyRoles = undefined;
                  this.employeePharmacyRoleInformationForm.patchValue({
                    pharmacyModel: "",
                    pharmacyRolesModel: ""
                  });
                  this.toasterService.success(
                    accessRes["message"], "Success", {
                    timeOut: 3000
                  }
                  );
                  this.pharmacyRole = undefined;
                  this.unMappedPharmacy = undefined;
                } else {
                  this.spinnerService.hide();
                  this.toasterService.error(
                    "Please contact administrator", "Error Occurred", {
                    timeOut: 5000
                  }
                  );
                }
              },
                error => {
                  this.spinnerService.hide();
                  this.toasterService.error("Please contact administrator", "Error Occurred", {
                    timeOut: 5000
                  }
                  );
                });
            }
          },
            error => {
              this.spinnerService.hide();
              this.toasterService.error("Please contact administrator", "Error Occurred", {
                timeOut: 5000
              }
              );
            });
        } else {
          this.spinnerService.hide();
          this.toasterService.error("Please contact administrator", "Error Occurred", {
            timeOut: 5000
          }
          );
        }
      } else {
        this.spinnerService.hide();
        this.toasterService.error("Please contact administrator", "Error Occurred", {
          timeOut: 5000
        }
        );
      }
    },
      error => {
        this.spinnerService.hide();
        this.toasterService.error("Please contact administrator", "Error Occurred", {
          timeOut: 5000
        }
        );
      });
  }

  saveEmployeeCredentialsInformationFormChanges(employeeCredentialsInformationForm: Object) {
    this.spinnerService.show();
    this.employeeCredentialsInformationForm.get('currentPassword').setErrors({ 'incorrect': true });
    this.employeeService.saveEmployeeCredentials(employeeCredentialsInformationForm).subscribe(
      saveFormResponse => {
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
                      this.spinnerService.hide();
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
                    this.toasterService.error('Please contact administrator', 'Error Occurred', {
                      timeOut: 5000
                    });
                  });
                }
              }, error => {
                this.spinnerService.hide();
                this.toasterService.error('Please contact administrator', 'Error Occurred', {
                  timeOut: 5000
                });
              });
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
      }, error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      });
  }

  editGrid() {
    this.showGrid = false;
    this.onEmployeeSelected(this.employeeGridOptions.api.getSelectedRows()[0].employeeId);
  }

  reset() {
    this.employeeInformationForm.reset();
    this.employeeInformationForm.controls.activeS.setValue('Y');
    this.employeeHonorInformationForm.reset();
    this.employeeProfessionalMembershipInformationForm.reset();
    this.employeeHonorInformationForm.reset();
    this.employeeInterestInformationForm.reset();
    this.employeePublicationInformationForm.reset();
    this.employeeEducationInformationForm.reset();
    this.employmentHistoryInformationForm.reset();
    this.employeeSalaryInformationForm.reset();
    this.employeeCredentialsInformationForm.reset();
    this.employeePharmacyRoleInformationForm.reset();
    this.employeePharmacyAccessInformationForm.reset();
    // this.pharmacyAccessPermissions = [];
    // this.pharmacyRoles = undefined;
    // this.unMappedPharmacies = undefined;
    this.unMappedPharmacy = undefined
    this.pharmacyRole = undefined;
    this.profileEditImage = null;
    this.ContractEditImage = null;
    this.ConductCertificateEditImage = null;
    this.DocumentEditImage = null;
    this.resumeEditImage = null;
    this.showGenericDetails = false;
    this.showGrid = true;
    this.resetAllSelectedPermissions()
  }

  memberShipRest() {
    this.showGrid = true;
    this.employeeProfessionalMembershipInformationForm.setValue(this.memberShipDetails);
    this.totalReset();
  }

  honorInfoReset() {

    this.showGrid = true;
    this.employeeHonorInformationForm.setValue(this.honorDetails);
    this.totalReset();
  }

  interestDetailsReset() {
    this.showGrid = true;
    this.employeeInterestInformationForm.setValue(this.interestObj);
    this.totalReset();
  }

  publicationReset() {
    this.showGrid = true;
    this.employeePublicationInformationForm.setValue(this.publicationObj);
    this.totalReset();
  }

  educationReset() {

    this.showGrid = true;
    this.employeeEducationInformationForm.setValue(this.educationObj);
    this.totalReset();
  }

  historyReset() {

    this.showGrid = true;
    this.employmentHistoryInformationForm.setValue(this.historyObj);
    this.totalReset();
  }

  salaryReset() {

    this.showGrid = true;
    this.employeeSalaryInformationForm.setValue(this.salaryObj);
    this.totalReset();
  }

  accessReset() {
    this.resetPerm = false;
    this.employeeCredentialsInformationForm.setValue(this.empCredential);
    this.unMappedPharmacy = this.pharmaRoles['pharmacyModel'];
    this.pharmacyRole = this.pharmaRoles['pharmacyRolesModel'];
    this.selectedPermissionsFlag = _.cloneDeep(this.selPermFlag);
    this.resetPerm = true;
  }

  totalReset() {
    this.employeeSalaryInformationForm.reset();
    this.employmentHistoryInformationForm.reset();
    this.employeeEducationInformationForm.reset();
    this.employeePublicationInformationForm.reset();
    this.employeeInterestInformationForm.reset();
    this.employeeHonorInformationForm.reset();
    this.employeeProfessionalMembershipInformationForm.reset();
  }

  getCountries() {
    this.employeeService.getCountries().subscribe(getCountriesResponse => {
      if (getCountriesResponse instanceof Object) {
        if (getCountriesResponse["responseStatus"]["code"] === 200) {
          this.countries = getCountriesResponse["result"];
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });
  }

  getAllEmployeeTypes() {
    this.employeeService.getAllEmployeeTypes().subscribe(getEmployeeTypeResponse => {
      if (getEmployeeTypeResponse instanceof Object) {
        if (getEmployeeTypeResponse["responseStatus"]["code"] === 200) {
          this.employeeTypes = getEmployeeTypeResponse["result"];
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });
  }

  getProvinces(country: Object) {
    this.employeeService.getProvinces(country).subscribe(getProvincesResponse => {
      if (getProvincesResponse instanceof Object) {
        if (getProvincesResponse["responseStatus"]["code"] === 200) {
          this.states = getProvincesResponse["result"];
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });
  }
  ProfImage = true;
  ProfImage1 = false;

  selectProfileImage(event) {
    if (event.target.files[0].size > 4194304) {
      this.toasterService.error('Image size must be < 4 MB', 'Error Occurred', {
        timeOut: 5000
      });
      event.target.value = '';
    } else {
      this.profileImage = event.target.files[0];
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.profileImage);
    reader.onload = (_event) => {
      this.profilePhoto = reader.result;
    }
    let profileOldImage = this.profileEditImage;
    let profileNewImage = this.profileImage;

    if (profileNewImage == null || profileNewImage == undefined) {
      this.ProfImage1 = false;
      this.ProfImage = true;
    }
    else if (profileOldImage !== null || profileOldImage !== undefined) {
      this.ProfImage1 = true;
      this.ProfImage = false;
    }
    else if (profileOldImage == null && profileOldImage == undefined) {
      this.ProfImage = false;
      this.ProfImage1 = true;
    }
  }


  CondImage = true;
  CondImage1 = false;

  selectPoliceGoodConductCertificate(event) {
    if (event.target.files[0].size > 4194304) {
      this.toasterService.error('Image size must be < 4 MB', 'Error Occurred', {
        timeOut: 5000
      });
      event.target.value = '';
    } else {
      this.profileImage1 = event.target.files[0];
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.profileImage1);

    reader.onload = (_event) => {
      this.conductCertificatePhoto = reader.result;
    }

    let ConductOldImage = this.ConductCertificateEditImage;
    let ConductNewImage = this.profileImage1;

    if (ConductNewImage == null && ConductNewImage == undefined) {
      this.CondImage = true;
      this.CondImage1 = false;
    }

    else if (ConductOldImage !== null && ConductOldImage !== undefined) {
      this.CondImage1 = true;
      this.CondImage = false;
    }

    else if (ConductOldImage == null && ConductOldImage == undefined) {
      this.CondImage = false;
      this.CondImage1 = true;
    }
  }

  ContractImage = true;
  ContractImage1 = false;

  selectSignedContract(event) {
    if (event.target.files[0].size > 4194304) {
      this.toasterService.error('Image size must be < 4 MB', 'Error Occurred', {
        timeOut: 5000
      });
      event.target.value = '';
    } else {
      this.profileImage2 = event.target.files[0];
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.profileImage2);
    reader.onload = (_event) => {
      this.contractPhoto = reader.result;
    }

    let ContractOldImage = this.ContractEditImage;
    let ContractNewImage = this.profileImage2;

    if (ContractNewImage == null && ContractNewImage == undefined) {
      this.ContractImage = true;
      this.ContractImage1 = false;
    }

    else if (ContractOldImage !== null && ContractOldImage !== undefined) {
      this.ContractImage1 = true;
      this.ContractImage = false;
    }

    else if (ContractOldImage == null && ContractOldImage == undefined) {
      this.ContractImage = false;

      this.ContractImage1 = true;
    }
  }

  IdentDocImage = true;
  IdentDocImage1 = false;

  selectIdentificationDocument(event) {
    if (event.target.files[0].size > 4194304) {
      this.toasterService.error('Image size must be < 4 MB', 'Error Occurred', {
        timeOut: 5000
      });
      event.target.value = '';
    } else {
      this.profileImage3 = event.target.files[0];
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.profileImage3);
    reader.onload = (_event) => {
      this.documentPhoto = reader.result;
    }

    let DocOldImage = this.DocumentEditImage;
    let DocNewImage = this.profileImage3;

    if (DocNewImage == null && DocNewImage == undefined) {
      this.IdentDocImage = true;
      this.IdentDocImage1 = false;
    }

    else if (DocOldImage !== null && DocOldImage !== undefined) {
      this.IdentDocImage1 = true;
      this.IdentDocImage = false;
    }
    else if (DocOldImage == null && DocOldImage == undefined) {
      this.IdentDocImage = false;

      this.IdentDocImage1 = true;
    }
  }

  ResumeImage = true;
  ResumeImage1 = false;

  selectResume(event) {
    if (event.target.files[0].size > 4194304) {
      this.toasterService.error('Image size must be < 4 MB', 'Error Occurred', {
        timeOut: 5000
      });
      event.target.value = '';
    } else {
      this.profileImage4 = event.target.files[0];
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.profileImage4);
    reader.onload = (_event) => {
      this.resumePhoto = reader.result;
    }

    let resumeOldImage = this.resumeEditImage;
    let resumeNewImage = this.profileImage4;

    if (resumeNewImage == null && resumeNewImage == undefined) {
      this.ResumeImage = true;
      this.ResumeImage1 = false;
    }

    else if (resumeOldImage !== null && resumeOldImage !== undefined) {
      this.ResumeImage1 = true;
      this.ResumeImage = false;
    }

    else if (resumeOldImage == null && resumeOldImage == undefined) {
      this.ResumeImage = false;

      this.ResumeImage1 = true;
    }
  }

  updateFormChanges(employeeInformationForm: Object) {

    this.showGrid = true;
    this.employeeInformationForm.get('firstName').setErrors({ 'incorrect': true });
    if (this.profileImage == null && this.profileImage1 == null
      && this.profileImage2 == null && this.profileImage3 == null
      && this.profileImage4 == null) {
      this.employeeService.updateEmployeeData(employeeInformationForm).subscribe(updateFormResponse => {
        if (updateFormResponse instanceof Object) {
          if (updateFormResponse["responseStatus"]["code"] === 200) {
            this.employeeInformationForm.reset();
            this.profileImage = null;
            this.profileImage1 = null;
            this.profileImage2 = null;
            this.profileImage3 = null;
            this.profileImage4 = null;

            this.currentEmployee = updateFormResponse["result"];
            this.employeeInformationForm.patchValue({
              country: "",
              state: "",
              employeeTypeModel: "",
              pharmacyId: "",
              genderCode: "",
              title: ""
            });

            this.getGridRowData();
            this.states = [];

            this.showGrid = true;
            this.showGenericDetails = false;
            this.toasterService.success(
              updateFormResponse["message"], "Success",
              {
                timeOut: 3000
              }
            );
            this.selectedState = undefined;
            this.selectedCountry = undefined;
            this.selectedTitle = undefined;
            this.selectedEmpGender = undefined;
            this.selectedEmpType = undefined
          } else {
            this.toasterService.error(
              "Please contact administrator",
              "Error Occurred",
              {
                timeOut: 5000
              }
            );
          }
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      });
    } else {

      const profiledata = new FormData();
      const conductdata = new FormData();
      const contractdata = new FormData();
      const resumedata = new FormData();
      const documentdata = new FormData();
      let abc = new Array();




      profiledata.append("employee", JSON.stringify(employeeInformationForm));
      if (this.profileImage != null && this.profileImage != undefined) {
        var index = 0;
        for (var i = 0; i < this.employeeImages.length; i++) {
          if (this.employeeImages[index]['imageDesc'] == "profileImage") {

            profiledata.append("imageId", this.employeeImages[index].employeeImageId);

          }
          index++;
        }
        profiledata.append("imageDesc", 'profileImage');
        profiledata.append("image", this.profileImage);




        abc.push(profiledata);


      }



      conductdata.append("employee", JSON.stringify(employeeInformationForm));
      if (this.profileImage1 != null && this.profileImage1 != undefined) {
        var index = 0;
        for (var i = 0; i < this.employeeImages.length; i++) {
          if (this.employeeImages[index]['imageDesc'] == "policeGoodConductCertificate") {


            conductdata.append("imageId", this.employeeImages[index].employeeImageId);
          }
          index++;
        }
        conductdata.append("imageDesc", 'policeGoodConductCertificate');
        conductdata.append("image", this.profileImage1);




        abc.push(conductdata);

      }



      contractdata.append("employee", JSON.stringify(employeeInformationForm));
      if (this.profileImage2 != null && this.profileImage2 != undefined) {
        var index = 0;
        for (var i = 0; i < this.employeeImages.length; i++) {
          if (this.employeeImages[index]['imageDesc'] == "signedContract") {


            contractdata.append("imageId", this.employeeImages[index].employeeImageId);
          }
          index++;
        }

        contractdata.append("imageDesc", 'signedContract');
        contractdata.append("image", this.profileImage2);




        abc.push(contractdata);

      }


      documentdata.append("employee", JSON.stringify(employeeInformationForm));
      if (this.profileImage3 != null && this.profileImage3 != undefined) {
        var index = 0;
        for (var i = 0; i < this.employeeImages.length; i++) {
          if (this.employeeImages[index]['imageDesc'] == "identificationDocument") {


            documentdata.append("imageId", this.employeeImages[index].employeeImageId);
          }
          index++;
        }
        documentdata.append("imageDesc", 'identificationDocument');
        documentdata.append("image", this.profileImage3);



        abc.push(documentdata);


      }

      resumedata.append("employee", JSON.stringify(employeeInformationForm));
      if (this.profileImage4 != null && this.profileImage4 != undefined) {

        var index = 0;
        for (var i = 0; i < this.employeeImages.length; i++) {
          if (this.employeeImages[index]['imageDesc'] == "resume") {
            resumedata.append("imageId", this.employeeImages[index].employeeImageId);

          }
          index++;
        }

        resumedata.append("imageDesc", 'resume')
        resumedata.append("image", this.profileImage4);




        abc.push(resumedata);

      }




      for (i = 0; i < abc.length; i++) {

        if (((abc[i].get('imageDesc') != null) && (abc[i].get('imageDesc') != undefined)) &&
          ((abc[i].get('image') != null) && (abc[i].get('image') != undefined))) {
          this.employeeService.updateEmployeeImage(abc[i]).subscribe(saveFormResponse => {

            if (saveFormResponse instanceof Object) {
              if (saveFormResponse["responseStatus"]["code"] === 200) {
                this.employeeInformationForm.reset();
                this.profileImage = null;
                this.profileImage3 = null;
                this.profileImage1 = null;
                this.profileImage4 = null;
                this.profileImage2 = null;

                this.employeeInformationForm.patchValue({
                  country: "",
                  state: "",
                  employeeTypeModel: "",
                  pharmacyId: "",
                  title: "",
                  genderCode: ""
                });

                this.getGridRowData();
                this.states = [];
                this.showGrid = true;
                this.toasterService.success(
                  "Employee Image Updated",
                  "Success",
                  {
                    timeOut: 3000
                  }
                );
              } else {
                this.toasterService.error(
                  "Please contact administrator",
                  "Error Occurred",
                  {
                    timeOut: 5000
                  }
                );
              }
            } else {
              this.toasterService.error(
                "Please contact administrator",
                "Error Occurred",
                {
                  timeOut: 5000
                }
              );
            }
          });
        }
      }
    }
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
    let payload = Object.assign({}, this.employeeInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    payload['country'] = this.selectedCountry;
    payload['state'] = this.selectedState;
    payload['employeeTypeModel'] = this.selectedEmpType;
    payload['pharmacyId'] = this.selectedEmployee['pharmacyId'] != null && this.selectedEmployee['pharmacyId'] != undefined ? this.selectedEmployee['pharmacyId'] : null;

    if (this.selectedEmpGender instanceof Object) {
      payload['genderCode'] = this.selectedEmpGender['name'] == 'Male' ? 'M' : 'F';
    }
    payload["title"] = this.selectedTitle;
    this.updateFormChanges(payload);
    this.reset();
  }

  onCountrySelected(event: Event) {
    this.getProvinces(this.selectedCountry);
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

  employeeAccessFormDisability() {
    return (this.employeeCredentialsInformationForm.get('userName').errors instanceof Object)
      || (this.employeeCredentialsInformationForm.get('currentPassword').errors instanceof Object)
      || (this.employeeCredentialsInformationForm.get('approvalAccessPin').errors instanceof Object)
      || (this.employeePharmacyRoleInformationForm.get('employeeRole').errors instanceof Object)
      || (this.employeePharmacyRoleInformationForm.get('pharmacyModel').errors instanceof Object)

  }

  getAllPharmacyRoles() {
    this.employeeService.getPharmacyRoles().subscribe(getPharmacyRolesResponse => {
      if (getPharmacyRolesResponse instanceof Object) {
        if (getPharmacyRolesResponse["responseStatus"]["code"] === 200) {
          this.pharmacyRoles = getPharmacyRolesResponse["result"];
        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });
  }

  getAllPharmacyBranches() {
    this.employeeService.getPharmacies().subscribe(getPharmacyBranchesResponse => {
      if (getPharmacyBranchesResponse instanceof Object) {
        if (getPharmacyBranchesResponse["responseStatus"]["code"] === 200) {
          this.pharmacyBranches = getPharmacyBranchesResponse["result"];
          this.unMappedPharmacies = this.pharmacyBranches;
        } else {
          this.toasterService.error("Please contact administrator", "Error Occurred", {
            timeOut: 5000
          }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });
  }

  getAllPharmacyAccessPermissions() {
    this.employeeService.getAccessPermissions().subscribe(getAccessPermissionsResponse => {
      if (getAccessPermissionsResponse instanceof Object) {
        if (getAccessPermissionsResponse["responseStatus"]["code"] === 200) {
          this.pharmacyAccessPermissions =
            getAccessPermissionsResponse["result"];
        
          for (let permission of getAccessPermissionsResponse["result"]) {
            this.selectedPermissions.push(permission["pharmaAccessId"]);
            this.selectedPermissionsFlag.push(false);
          }


        } else {
          this.toasterService.error(
            "Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            }
          );
        }
      } else {
        this.toasterService.error(
          "Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          }
        );
      }
    });

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
	/**
	 * Form Changes
	 * End
	 */

  /* multi select */

  onUnMappedCheckedPharmacies(selectedUnMappedPharmacies: any[]) {

  }

  onUnMappedPharmaciesSelected(Pharmacy) {

  }

  onUnMappedPharmacySearchChanged(searchTerm) {
    /*  this.unMappedPharmacySearchTerm = searchTerm;
     this.getUnMappedPharmacyData(this.pharmacySearchTerm); */
  }

  getUnMappedPharmacyData(searchTerm: string) {

  }

  onStateSelected(event: Event) {

  }

  password() {
    this.show = !this.show;
  }
  showconfirmPwd: boolean;
  passwordConfirm() {
    this.showconfirmPwd = !this.showconfirmPwd;
  }

  userNameGenerator(event: Event) {
    this.userName = event['target']['value'];
    this.employeeService.getLastCreatedEmployeeId().subscribe(res => {
      this.userName += res['result']['employeeId'] + 1;
      this.employeeCredentialsInformationForm.get('userName').setValue(this.userName);
    });
  }

  search() {
    if (this.key != null && this.key != undefined && this.key != '') {
      this.employeeService.getEmployeesBySearchKey(this.key).subscribe(employeeRes => {
        if (employeeRes["responseStatus"]["code"] === 200) {
          this.rowData = employeeRes['result'];
        }
      },
        error => {
          this.rowData = [];
          this.toasterService.error("Please contact administrator",
            "Error Occurred",
            {
              timeOut: 5000
            });
        })
    }
    else {
      this.getGridRowData();
    }
  }
}
