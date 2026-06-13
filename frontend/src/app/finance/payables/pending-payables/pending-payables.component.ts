import { AddpurchaseorderinvoiceService } from './../../../stock/purchase-invoice/addpurchaseorderinvoice.service';
import { SupplierService } from 'src/app/masters/supplier/shared/supplier.service';
import { PaymentsService } from './shared/payments.service';
import { PaymentsModel } from './shared/payments.model';
import { CustomerService } from 'src/app/masters/customer/shared/customer.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColDef, GridOptions, IGetRowsParams } from 'ag-grid-community';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';
import { EmployeeService } from 'src/app/masters/employee/shared/employee.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-payments',
  templateUrl: './pending-payables.component.html',
  styleUrls: ['./pending-payables.component.scss'],
  providers: [PaymentsService, SupplierService, AddpurchaseorderinvoiceService, CustomerService, EmployeeService]
})

export class PendingPayablesComponent implements OnInit {
  api: any;
  public showPaymentType: boolean = false;
  paymentNumber: any;

  payload: Object;
  makePayment = true;

  constructor(private employeeService: EmployeeService, private customerService: CustomerService, private datePipe: DatePipe, private paymentsService: PaymentsService,

    private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService
  ) {
    this.accountPayablesGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.accountPayablesGridOptions.rowSelection = 'multiple';
    this.accountPayablesGridOptions.columnDefs = this.gridColumnDefs;

    this.paymentsGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.paymentsGridOptions.rowSelection = 'multiple';
    this.paymentsGridOptions.columnDefs = this.columnDefs;
    this.getSuppliersData();
    this.getEmployeeData();
    this.getAllPayables();
    this.paymentsService.getAccountPayablesNumber().subscribe(paymentNumber => {
      if (paymentNumber['responseStatus']['code'] == 200) {
        this.selectedPaymentNumber = paymentNumber['result'];
      }
    });
    this.paymentsGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }
    this.accountPayablesGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }
    this.cacheOverflowSize = 2;
    this.maxConcurrentDatasourceRequests = 2;
    this.accountPayablesGridOptions.rowModelType = 'infinite';
  }

  ngOnInit() {
    this.paymentsInformationForm = new FormGroup(this.paymentsInformationFormValidations);
    this.supplier = "Y";

    $(document).ready(function () {
      $("#ins").click(function () {
        $("#customerDiv").hide();
        $("#policyDiv").show();
      });
      $("#cust").click(function () {
        $("#customerDiv").show();
        $("#policyDiv").hide();
      });

      $("#paymentsInputSupplier").change(function () {
        $('#itemSearchModal').modal('show');
      });

      $(".checkradiotrue").click(function () {
        $(".checkradiotrue").prop("checked", true);
        $(".checkradiofalse").prop("checked", false);
      });
      $(".checkradiofalse").click(function () {
        $(".checkradiofalse").prop("checked", true);
        $(".checkradiotrue").prop("checked", false);
      });
    });
  }

  ngOnDestroy(): void {

  }

  customer: string = 'Y';
  supplier: string = 'N';

  cashCheckbox: boolean = false;
  mPesaCheckbox: boolean = false;
  card: boolean = false;
  cheque: boolean = false;

  selectedPaymentNumber: any;
  paymentsGridOptions: GridOptions;
  accountPayablesGridOptions: GridOptions;
  customers: any[] = [];
  suppliers: any[] = [];
  invoices: any[] = [];
  showGrid: boolean = false;
  selectedSupplier: any;
  selectedCustomer: any;
  paymentGrid = false;

  status = [
    { name: 'Approved' },
    { name: 'Not Approved' }
  ];

  selectedStatus: any = { name: 'Approved' };
  totalAmountToBePaid = 0;
  totalRoundOff: number = 0;
  paymentStatusArray: any[] = ["Paid", "Partially Paid", "Pending"];
  searchCodeArr: any[] = ["Invoice", "Debit Note", "Credit Note"];
  showApproveBy = false;

  cacheOverflowSize;
  maxConcurrentDatasourceRequests: any;
  paymentType: any;

  cashAmount: any;
  cashSelected(event) {
    this.paymentType = 'Cash';
    this.makePayment = false;
    this.cashCheckbox = true;
    this.mPesaCheckbox = false;
    this.card = false;
    this.cheque = false;
    this.cashAmount = this.totalAmountToBePaid;
    this.upiAmount = undefined;
    this.cardAmount = undefined;
    this.chequeAmount = undefined;
    this.chequeAmountTwo = undefined;
    this.chequeAmountThree = undefined
    this.chequeAmountFour = undefined
    this.chequeAmountFive = undefined

  }

  upiAmount: any;
  mPesaSelected(event) {
    this.paymentType = 'MPesa';
    this.makePayment = false;
    this.cashCheckbox = false;
    this.mPesaCheckbox = true;
    this.card = false;
    this.cheque = false;
    this.cashAmount = undefined;
    this.upiAmount = this.totalAmountToBePaid;
    this.cardAmount = undefined;
    this.chequeAmount = undefined;
    this.chequeAmountTwo = undefined;
    this.chequeAmountThree = undefined
    this.chequeAmountFour = undefined
    this.chequeAmountFive = undefined
  }

  cardAmount: any;
  cardSelected(event) {
    this.paymentType = 'Card';
    this.makePayment = false;
    this.cashCheckbox = false;
    this.mPesaCheckbox = false;
    this.card = true;
    this.cheque = false;
    this.cashAmount = undefined;
    this.upiAmount = undefined;
    this.cardAmount = this.totalAmountToBePaid;
    this.chequeAmount = undefined;
    this.chequeAmountTwo = undefined;
    this.chequeAmountThree = undefined
    this.chequeAmountFour = undefined
    this.chequeAmountFive = undefined
  }

  payByMultiPayment: boolean
  onYesClick() {

    this.payByMultiPayment = true
    this.multiChequePayModal = false
    if (this.payByMultiPayment) {
      this.noOfCheques = Math.ceil(this.chequeAmount / 1000000);

      console.log(this.noOfCheques)
      if (this.noOfCheques === 2) {
        this.chequeAmountTwo = this.totalAmountToBePaid - 1000000;
        this.chequeAmount = this.totalAmountToBePaid - this.chequeAmountTwo
        this.showSecondCheque = true

      }
      if (this.noOfCheques === 3) {
        this.chequeAmountThree = this.totalAmountToBePaid - 2000000;
        this.chequeAmountTwo = (this.totalAmountToBePaid - this.chequeAmountThree) - 1000000;
        this.chequeAmount = this.totalAmountToBePaid - (this.chequeAmountTwo + this.chequeAmountThree)
        this.showSecondCheque = true
        this.showThirdCheque = true
      }
      if (this.noOfCheques === 4) {
        this.chequeAmountFour = this.totalAmountToBePaid - 3000000;
        this.chequeAmountThree = (this.totalAmountToBePaid - this.chequeAmountFour) - 2000000;
        this.chequeAmountTwo = (this.totalAmountToBePaid - (this.chequeAmountThree + this.chequeAmountFour)) - 1000000;
        this.chequeAmount = this.totalAmountToBePaid - (this.chequeAmountTwo + this.chequeAmountThree + this.chequeAmountFour)
        this.showSecondCheque = true
        this.showThirdCheque = true
        this.showFourthCheque = true
      }
      if (this.noOfCheques === 5) {
        this.chequeAmountFive = this.totalAmountToBePaid - 4000000;
        this.chequeAmountFour = (this.totalAmountToBePaid - this.chequeAmountFive) - 3000000;
        this.chequeAmountThree = (this.totalAmountToBePaid - (this.chequeAmountFour + this.chequeAmountFive)) - 2000000;
        this.chequeAmountTwo = (this.totalAmountToBePaid - (this.chequeAmountThree + this.chequeAmountFour + this.chequeAmountFive)) - 1000000;
        this.chequeAmount = this.totalAmountToBePaid - (this.chequeAmountTwo + this.chequeAmountThree + this.chequeAmountFour + this.chequeAmountFive)
        this.showSecondCheque = true
        this.showThirdCheque = true
        this.showFourthCheque = true
        this.showFifthCheque = true
      }
      if (this.noOfCheques > 5) {

        this.toasterService.warning("Couldn't process the payment for more than 5M", "", {
          timeOut: 3000
        })
        this.cheque = false
        return;
      }

    }
  }

  onNoClick() {
    this.payByMultiPayment = false
    this.multiChequePayModal = false
    if (this.chequeAmount > 5000000) {
      this.toasterService.warning("Couldn't process the payment for more than 5M", "", {
        timeOut: 3000
      })
      this.cheque = false
      return;
    }
  }
  chequeAmount: any;
  chequeAmountTwo: any;
  chequeAmountThree: any;
  chequeAmountFour: any;
  chequeAmountFive: any;
  showSecondCheque: boolean
  showThirdCheque: boolean
  showFourthCheque: boolean
  showFifthCheque: boolean
  multiChequePayModal: boolean
  noOfCheques
  chequeSelected(event) {
    this.paymentType = 'Cheque';
    this.makePayment = false;
    this.cashCheckbox = false;
    this.mPesaCheckbox = false;
    this.showSecondCheque = false
    this.showThirdCheque = false
    this.showFourthCheque = false
    this.showFifthCheque = false
    this.payByMultiPayment = false

    this.card = false;
    this.cheque = true;
    this.cashAmount = undefined;
    this.upiAmount = undefined;
    this.cardAmount = undefined;
    this.chequeAmount = this.totalAmountToBePaid;

    if (this.chequeAmount > 1000000) {

      this.multiChequePayModal = true
    }



  }

  paymentsInformationForm: FormGroup;
  paymentsInformationFormValidations = {
    paymentNumber: new FormControl('', [Validators.required]),
    paymentDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    supplierModel: new FormControl('', [Validators.required]),
    totalInvoiceAmount: new FormControl(''),
    totalAdvanceAmount: new FormControl(''),
    totalCreditAmount: new FormControl(''),
    totalDebitAmount: new FormControl(''),
    totalAmountToBePaid: new FormControl(''),
    totalRoundOff: new FormControl(''),
    selectedStatus: new FormControl('', [Validators.required]),
    cashAmount: new FormControl(''),
    creditCardAmount: new FormControl(''),
    creditCardNo: new FormControl(''),
    upiPhoneNo: new FormControl(''),
    upiAmount: new FormControl(''),
    selectedPaymentStatus: new FormControl(''),
    authCode: new FormControl(''),
    chequeDate: new FormControl(''),
    chequeDateTwo: new FormControl(''),
    chequeDateThree: new FormControl(''),
    chequeDateFour: new FormControl(''),
    chequeDateFive: new FormControl(''),
    upiTransactionId: new FormControl(''),
    chequeNumber: new FormControl('', [Validators.pattern(/^[0-9\,]{2,}$/)]),
    chequeAmount: new FormControl(''),
    chequeNumberTwo: new FormControl('', [Validators.pattern(/^[0-9\,]{2,}$/)]),
    chequeAmountTwo: new FormControl(''),
    chequeNumberThree: new FormControl('', [Validators.pattern(/^[0-9\,]{2,}$/)]),
    chequeAmountThree: new FormControl(''),
    chequeNumberFour: new FormControl('', [Validators.pattern(/^[0-9\,]{2,}$/)]),
    chequeAmountFour: new FormControl(''),
    chequeNumberFive: new FormControl('', [Validators.pattern(/^[0-9\,]{2,}$/)]),
    chequeAmountFive: new FormControl(''),
    approvedByEmp: new FormControl(''),
    approvedPin: new FormControl('', [Validators.pattern(/^[1-9][0-9]{5}$/)]),
    approvedDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    activeS: new FormControl('Y')
  };

  getEmployeeData() {

    this.employeeService.getAllEmployeesWithAccess().subscribe(
      getEmployeeResponse => {
        if (getEmployeeResponse instanceof Object) {
          if (getEmployeeResponse['responseStatus']['code'] === 200) {
            this.employees = getEmployeeResponse['result'];
          }
          else {
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

  employees: any[] = [];

  onPaymentSelected(event) {
    if (event != null && event != undefined) {
      this.showPaymentType = true
      if (event['name'] == "Approved") {
        this.status = [{ name: 'Approved' }]
      } else {
        this.makePayment = true;
      }

      if (event['name'] == "approvedPin") {
        this.selectedStatus = "Not Approved";
      } else {
        this.selectedStatus = "Approved";
      }
    } else {
      this.cashCheckbox = false;
      this.mPesaCheckbox = false;
      this.card = false;
      this.cheque = false;
      this.makePayment = true;
      this.showPaymentType = false;
    }
  }

  approvedBy: any;
  approvedEmpName: any;
  selectedEmployee(event) {
    this.approvedBy = event;
    this.approvedEmpName = event['empName'];
  }

  reset() {
    this.showPaymentType = false;
    this.approvedBy = undefined;
    this.paymentsInformationForm.reset();
    this.selectedStatus = { name: "Approved" };
    this.paymentsInformationForm.patchValue({
      'paymentDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      'approvedDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });
    this.paymentsService.getAccountPayablesNumber().subscribe(paymentNumber => {
      if (paymentNumber['responseStatus']['code'] == 200) {
        this.selectedPaymentNumber = paymentNumber['result'];
      }
    });
    this.selectedSupplier = undefined;
    this.selectedPaymentNumber = undefined;
    this.paymentsGridOptions.api.setRowData([]);
    this.totalAmountToBePaid = 0;
    this.cashCheckbox = false;
    this.mPesaCheckbox = false;
    this.card = false;
    this.cheque = false;
    this.makePayment = true;
    this.showApproveBy = undefined;
    this.approvedRecords = [];
    this.makePayment = true;
    this.paymentsInformationForm.get('approvedPin').setValue('');
    this.approvedBy = undefined;
    this.makePin = true;

    this.startDate = undefined;
    this.endDate = undefined;
    this.selectedPaymentStatus = undefined;
    this.searchCodeValue = undefined;

    // delete functionality varaibles

    this.oldGrid = undefined;
    this.gridArray = undefined;
    this.clickedRow = undefined;

  }

  //searchInvoice: any;


  searchCode(event) {
    //  this.searchInvoice = event['target']['value'];
    this.searchCodeValue = event['target']['value'];
  }
  startDate: any;
  endDate: any;
  selectedPaymentStatus: any;
  searchCodeValue: any;

  accPayablesSearchRowCount = 0;


  getSalesBySearch() {
    this.accPayablesPageNumber = 0;
    if (this.searchCodeValue == '') {
      this.searchCodeValue = undefined;
    }
    if (this.selectedPaymentStatus == '' || this.selectedPaymentStatus === 'undefined') {
      this.selectedPaymentStatus = undefined;
    }

    if (this.startDate == '') {
      this.startDate = undefined;
    }
    if (this.endDate == '') {
      this.endDate = undefined;
    }

    this.paymentsService.getAllAccPayablesBySeachCount(this.selectedPaymentStatus, this.startDate, this.endDate, this.searchCodeValue, this.supplierName).subscribe(
      searchRes => {

        if (searchRes['responseStatus']['code'] == 200) {

          this.accPayablesSearchRowCount = searchRes['result'];

          this.accountPayablesGridOptions.api.setDatasource(this.accPayablesDatasource);
        }
      }
      , error => {
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      });
  }

  accPayablesPageNumber = 0;

  accPayablesDatasource = {
    getRows: (params: IGetRowsParams) => {

      this.spinnerService.show();

      this.paymentsService.getAllAccPayablesBySeaches(this.selectedPaymentStatus, this.startDate, this.endDate, this.searchCodeValue,
        this.accPayablesPageNumber, 100, this.supplierName).subscribe(data => {
          this.spinnerService.hide();

          params.successCallback(data['result'], this.accPayablesSearchRowCount)

          if (data['responseStatus']['code'] === 200) {

            if (data['result']['length'] > 0) {

              this.accPayablesPageNumber++;
            }
            else {
              this.accountPayablesGridOptions.api.setRowData([]);
              this.toasterService.warning('Data Not Found With Search Criteria', 'No Data To Show', {
                timeOut: 3000
              });
            }
          }
        }, error => {
          this.spinnerService.hide();
        });
    }
  }

  statusGrid = false;

  statusSelected(event) {
    // this.statusGrid = true;
    if (this.paymentsInformationForm.get('chequeNumber').invalid) {
      return
    }
    this.onPaymentsSubmit();
  }

  closeStatus() {
    this.statusGrid = false;
    this.showPaymentType = false
    this.makePayment = true;
    this.paymentsInformationForm.get('approvedPin').setValue('');
    this.approvedBy = undefined;
    this.paymentsInformationForm.reset();

    this.selectedStatus = { name: "Not Approved" };
    this.status = [
      { name: 'Approved' },
      { name: 'Not Approved' },
    ];

    this.makePayment = false;
    this.cashCheckbox = false;
    this.mPesaCheckbox = false;
    this.card = false;
    this.cheque = false;
    this.makePayment = true;
  }

  savePin() {
    if (event['name'] == "approvedPin") {
      this.selectedStatus = "Not Approved";
    } else {
      this.selectedStatus = "Approved";
    }
    this.statusGrid = false;
    this.showApproveBy = true;
  }

  show: boolean;
  password() {
    this.show = !this.show;
  }

  searchSupplierName(event) {
    this.paymentsService.getAllSuppliersBasedonNameSearch(event['target']['value']).subscribe(response => {
      if (response instanceof Object) {
        if (response['responseStatus']['code'] === 200) {
          this.suppliers = response['result'];
        }
      }
    })
  }

  getSuppliersData() {
    this.paymentsService.getAllAccountPayablesForSuppliers().subscribe(
      getSupplierResponse => {
        if (getSupplierResponse instanceof Object) {
          if (getSupplierResponse['responseStatus']['code'] === 200) {
            this.suppliers = getSupplierResponse['result'];
          }
          else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 3000
            });
          }
        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 3000
          });
        }
      }
    );
  }


  getAllPayables() {
    this.paymentsService.getAllAccountPayables().subscribe(response => {
      if (response['responseStatus']['code'] === 200) {
        this.customers = response['result'];
      }
    })
  }

  onRoundOff(event: Event) {
    var totalRoundOff = event['target']['value'];
    if (totalRoundOff != null && totalRoundOff != undefined && totalRoundOff != 0) {
      this.totalAmountToBePaid = Number(this.totalAmountToBePaid) + Number(event['target']['value']);
    } else {
      this.totalAmountToBePaid = parseFloat(this.accountPayablesFinalAmt.toFixed(2));
    }
  }

  close() {
    this.paymentsGridOptions.api.setRowData([]);
    document.getElementById('itemSearchModal').style.display = "none";
    this.paymentsGridOptions.api.setRowData([]);
    this.paymentGrid = false;
    this.startDate = undefined;
    this.endDate = undefined;
    this.selectedPaymentStatus = undefined;
    this.searchCodeValue = undefined;
    this.paymentsInformationForm.reset();
    this.selectedStatus = { name: 'Approved' }
    this.selectedSupplier = undefined;
    this.totalAmountToBePaid = 0
  }

  closePopUp() {
    this.paymentGrid = false;
  }

  onTypeChanged(event) {
    this.selectedSupplier = undefined;
    this.selectedCustomer = undefined;
    if (this.supplier == 'Y') {
      this.paymentsInformationForm.reset();
      this.paymentsGridOptions.api.setRowData([]);
      this.reset()
    } else if (this.customer == 'N') {
      this.paymentsInformationForm.reset();
      this.paymentsGridOptions.api.setRowData([]);
      this.reset()
    }
  }

  makePin = true;
  pinEnter(event) {
    if (this.approvedBy['accessPin'] == event['target']['value']) {
      this.makePin = false;
    } else {
      this.makePin = true;
    }
  }


  checkPaymentsFormDisability() {
    return (this.paymentsInformationForm.get('paymentDate').errors instanceof Object)
      || (this.paymentsInformationForm.get('selectedStatus').errors instanceof Object)
  }

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
    { headerName: 'Payment No', field: 'paymentNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Invoice No', field: 'invoiceNo', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Ref', field: 'sourceRef', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Payment Date', field: 'paymentDate', sortable: true, resizable: true, filter: true,
      valueGetter: this.dateFormatter.bind(this)
    },
    { headerName: 'Status', field: 'selectedStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount paid', field: 'totalAmountPaid', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount To Be Paid', field: 'totalAmountToBePaid', sortable: true, resizable: true, filter: true },
    { headerName: 'Payment Status', field: 'selectedPaymentStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Type', field: 'sourceType', sortable: true, resizable: true, filter: true }
  ];

  gridColumnDefs: ColDef[] = [

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
    { headerName: 'Payment No', field: 'paymentNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Invoice No', field: 'invoiceNo', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Ref', field: 'sourceRef', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Payment Date', field: 'paymentDate', sortable: true, resizable: true, filter: true,
      valueGetter: this.dateFormatter.bind(this)
    },
    { headerName: 'Status', field: 'selectedStatus', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Amount paid', field: 'totalAmountPaid', sortable: true, resizable: true, filter: true,
      valueGetter: this.function.bind(this)
    },
    { headerName: 'Amount To Be Paid', field: 'totalAmountToBePaid', sortable: true, resizable: true, filter: true },
    { headerName: 'Payment Status', field: 'selectedPaymentStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Type', field: 'sourceType', sortable: true, resizable: true, filter: true }
  ];

  function(params) {
    var totalAmountPaid = params.data != null && params.data != undefined ? params.data.totalAmountPaid : 0;
    if (totalAmountPaid != null && totalAmountPaid != undefined) {
      return totalAmountPaid;
    } else {
      totalAmountPaid = 0;
      return totalAmountPaid;
    }
  }

  rowData = [];
  getSuppliersGrid(supplierName: string) {
    this.paymentsService.getSupplierSearch(supplierName).subscribe(
      gridDataResponse => {
        if (gridDataResponse instanceof Object) {
          if (gridDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridDataResponse['result'];
            this.showGrid = true;
          }
        }
      }
    )
  }

  accountPayablesFinalAmt: number;
  getTotalAmount() {

    var invoiceTotalAmount = 0;
    var invoiceTotalAdvance = 0;
    var invoiceTotalCredit = 0;
    var invoiceTotalDebit = 0;
    this.rowData.forEach(node => {
      invoiceTotalAmount += isNaN(node['invoiceAmount']) ? 0 : node['invoiceAmount'];
      invoiceTotalAdvance += isNaN(node['advance']) ? 0 : node['advance'];
      invoiceTotalCredit += isNaN(node['creditAmount']) ? 0 : node['creditAmount'];
      invoiceTotalDebit += (node['debitAmount']) ? 0 : node['debitAmount'];
    });

    this.totalAmountToBePaid = parseFloat((invoiceTotalAmount + invoiceTotalCredit - invoiceTotalDebit).toFixed(2));
    this.accountPayablesFinalAmt = this.totalAmountToBePaid
    this.paymentsInformationForm.get('totalAdvanceAmount').setValue(invoiceTotalAdvance);
    this.paymentsInformationForm.get('totalCreditAmount').setValue(invoiceTotalCredit);
    this.paymentsInformationForm.get('totalDebitAmount').setValue(invoiceTotalDebit);
  }

  generatePaymentNumber() {
    if ((this.selectedSupplier != null && this.selectedSupplier != undefined)) {
      let paymentNumber = 'AP' + this.selectedSupplier['paymentDate'] + '0001';
      this.paymentsInformationForm.get('paymentNumber').setValue(paymentNumber);
    }
  }

  showInvoice: boolean = false;
  showCustomer: boolean = false;
  selectedSupplierName: string = 'Select';
  supplierName: any;

  onSupplierSelected(supplier: any) {
    this.reset();
    this.startDate = undefined;
    this.endDate = undefined;
    this.selectedPaymentStatus = undefined;
    this.searchCodeValue = undefined;

    if (supplier != null && supplier != undefined) {
      this.paymentGrid = true
      this.selectedSupplierName = supplier.supplierName;
      this.supplierName = supplier.supplierName;
      this.selectedSupplier = supplier;
      this.getSuppliersGrid(this.selectedSupplierName);
      this.showInvoice = false;
      this.paymentsGridOptions.columnDefs = this.columnDefs;
    } else {
      this.reset();
    }
  }

  customerName: any;
  onCustomerSelected(customer: any) {
    this.paymentGrid = true
    this.selectedCustomerName = customer.customerName;
    this.customerName = customer.customerName;
    this.selectedCustomer = customer;
    this.getCustomersBillsGrid(this.selectedCustomerName);
    this.showCustomer = false;
    this.paymentsGridOptions.columnDefs = this.columnDefs;
  }

  selectedCustomerName: string = 'Select';
  gridArray: PaymentsModel[] = [];

  sourceReference: any;
  accountPayablesId: any;
  sourceRef: any;
  sourceType: any;
  source: any;
  datePayment: string;

  dateFormatter(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.paymentDate != null && params.data.paymentDate != undefined) {
        try {
          params.data.paymentDate = this.datePipe.transform(params.data.paymentDate, "dd-MM-yyyy");
        }
        catch (error) {
        }
        return params.data.paymentDate;
      }
    }
  }

  newArr = [];
  supplierModel: any;
  selectedRows: any;
  getSelectedGridItems() {

    this.selectedRows = this.paymentsGridOptions.api.getSelectedRows();
    this.gridArray = [];
    var invoiceTotalAmount = 0;
    var invoiceTotalAdvance = 0;
    var invoiceTotalCredit = 0;
    var invoiceTotalDebit = 0;
    this.accountPayablesGridOptions.api.getSelectedRows().forEach(data => {
      this.paymentGrid = false;
      let gridItem = new PaymentsModel;
      gridItem['paymentNumber'] = data['paymentNumber'] != null && data['paymentNumber'] != undefined ? data['paymentNumber'] : 0;
      gridItem['paymentDate'] = data['paymentDate'] != null && data['paymentDate'] != undefined ? data['paymentDate'] : '00-00-0000';//    this.datePipe.transform(data['paymentDate'], 'yyyy-MM-dd') : '00-00-0000';
      gridItem['totalAmountPaid'] = data['totalAmountPaid'] != null && data['totalAmountPaid'] != undefined ? data['totalAmountPaid'] : 0;
      gridItem['totalAmountToBePaid'] = data['totalAmountToBePaid'] != null && data['totalAmountToBePaid'] != undefined ? data['totalAmountToBePaid'] : 0;
      gridItem['selectedStatus'] = data['selectedStatus'] != null && data['selectedStatus'] != undefined ? data['selectedStatus'] : ' ';
      gridItem['selectedPaymentStatus'] = data['selectedPaymentStatus'] != null && data['selectedPaymentStatus'] != undefined ? data['selectedPaymentStatus'] : '';
      gridItem['sourceRef'] = data['sourceRef'] != null && data['sourceRef'] != undefined ? data['sourceRef'] : '';
      gridItem['sourceType'] = data['sourceType'] != null && data['sourceType'] != undefined ? data['sourceType'] : '';
      gridItem['source'] = data['source'] != null && data['source'] != undefined ? data['source'] : '';
      gridItem['supplierModel'] = data['supplierModel'];
      gridItem['accountPayablesId'] = data['accountPayablesId'];
      gridItem['invoiceNo'] = data['invoiceNo'];
      gridItem['createdUser'] = data['createdUser'];

      invoiceTotalAmount += isNaN(data['totalAmountToBePaid']) ? 0 : data['totalAmountToBePaid'];
      invoiceTotalAdvance += isNaN(data['advance']) ? 0 : data['advance'];

      if (Number((isNaN(data['totalAmountPaid']) ? 0 : data['totalAmountPaid'])) < 0.0) {
        invoiceTotalCredit += isNaN(data['totalAmountPaid']) ? 0 : -1 * data['totalAmountPaid'];
      }
      else {
        invoiceTotalDebit += isNaN(data['totalAmountPaid']) ? 0 : data['totalAmountPaid'];
      }
      if (Number((isNaN(data['totalAmountToBePaid']) ? 0 : data['totalAmountToBePaid'])) < 0.0) {
        invoiceTotalCredit += isNaN(data['totalAmountToBePaid']) ? 0 : -1 * data['totalAmountToBePaid'];
      }
      else {
        invoiceTotalDebit += isNaN(data['totalAmountToBePaid']) ? 0 : data['totalAmountToBePaid'];
      }

      this.totalAmountToBePaid = parseFloat((invoiceTotalAmount - invoiceTotalAdvance).toFixed(2));

      if (gridItem['selectedStatus'] == "Not Approved") {
        this.selectedStatus = gridItem['selectedStatus'] == "Not Approved" ? { name: 'Not Approved' } : { name: 'Approved' };
        this.paymentsInformationForm.get('selectedStatus').setValue(this.selectedStatus)
      }


      this.gridArray.push(gridItem);
      this.accountPayablesFinalAmt = this.totalAmountToBePaid
      this.paymentsInformationForm.get('totalAdvanceAmount').setValue(invoiceTotalAdvance);
      this.paymentsInformationForm.get('totalCreditAmount').setValue(invoiceTotalCredit);
      this.paymentsInformationForm.get('totalDebitAmount').setValue(invoiceTotalDebit.toFixed(2));
      this.paymentsInformationForm.get('totalInvoiceAmount').setValue((invoiceTotalDebit - invoiceTotalCredit).toFixed(2));
    });

    var tempArray = [];
    if (this.oldGrid != null && this.oldGrid != undefined) {
      for (var i = 0; i < this.oldGrid.length; i++) {
        for (var j = 0; j < this.gridArray.length; j++) {
          if (this.oldGrid[i]['accountPayablesId'] === this.gridArray[j]['accountPayablesId']) {
            tempArray.push(this.gridArray[j])
          }
        }
      }
    }


    if (tempArray != null && tempArray != undefined) {
      for (var i = 0; i < tempArray.length; i++) {
        for (var j = 0; j < this.gridArray.length; j++) {
          this.gridArray.splice(tempArray[i], 1)
        }
      }
    }

    var rowsExist = 0;
    this.paymentsGridOptions.api.forEachNode(node => {
      if (node.data.paymentNumber != null && node.data.paymentNumber != undefined && node.data.paymentNumber != '') {
        rowsExist++;
      }
    });

    if (rowsExist > 0) {
      this.paymentsGridOptions.api.updateRowData({ add: this.gridArray });
    }
    else {
      this.paymentsGridOptions.api.updateRowData({ add: [{}] })
      this.paymentsGridOptions.api.updateRowData({ add: this.gridArray });
    }
    //this.oldGrid = undefined
    if (this.clickedRow === 'yes') {

      var invoiceTotalAmounts = 0;
      var invoiceTotalAdvances = 0;
      var invoiceTotalCredits = 0;
      var invoiceTotalDebits = 0;
      this.totalAmountToBePaid = undefined;

      this.paymentsGridOptions.api.forEachNode(data => {
        if (data.data.paymentNumber != null && data.data.paymentNumber != undefined && data.data.paymentNumber != '') {

          invoiceTotalAmounts += isNaN(data.data['totalAmountToBePaid']) ? 0 : data.data['totalAmountToBePaid'];
          invoiceTotalAdvances += isNaN(data.data['advance']) ? 0 : data.data['advance'];

          if (Number((isNaN(data.data['totalAmountPaid']) ? 0 : data.data['totalAmountPaid'])) < 0.0) {
            invoiceTotalCredits += isNaN(data.data['totalAmountPaid']) ? 0 : -1 * data.data['totalAmountPaid'];
          }
          else {
            invoiceTotalDebits += isNaN(data.data['totalAmountPaid']) ? 0 : data.data['totalAmountPaid'];
          }
          if (Number((isNaN(data.data['totalAmountToBePaid']) ? 0 : data.data['totalAmountToBePaid'])) < 0.0) {
            invoiceTotalCredits += isNaN(data.data['totalAmountToBePaid']) ? 0 : -1 * data.data['totalAmountToBePaid'];
          }
          else {
            invoiceTotalDebits += isNaN(data.data['totalAmountToBePaid']) ? 0 : data.data['totalAmountToBePaid'];
          }
          this.totalAmountToBePaid = parseFloat((invoiceTotalAmounts - invoiceTotalAdvances).toFixed(2));

          this.accountPayablesFinalAmt = this.totalAmountToBePaid
          this.paymentsInformationForm.get('totalAdvanceAmount').setValue(invoiceTotalAdvances);
          this.paymentsInformationForm.get('totalCreditAmount').setValue(invoiceTotalCredits);
          this.paymentsInformationForm.get('totalDebitAmount').setValue(invoiceTotalDebits.toFixed(2));
          this.paymentsInformationForm.get('totalInvoiceAmount').setValue((invoiceTotalDebits - invoiceTotalCredits).toFixed(2));

        }
      });
    }
  }

  getCustomersBillsGrid(customerName: string) {
    this.showGrid = false;
    this.paymentsService.getCustomerIdSearch(customerName).subscribe(
      customerGridDataResponse => {
        if (customerGridDataResponse instanceof Object) {
          if (customerGridDataResponse['responseStatus']['code'] === 200) {
            this.rowData = customerGridDataResponse['result'];
            this.getTotalAmount();
            this.showGrid = true;
          }
        }
      }
    )
  }

  approvedRecords = [];

  formatData(type) {
    let requestObjectArray = [];
    for (var i = 0; i < type.length; i++) {
      if (type[i]['paymentNumber'] != null && type[i]['paymentNumber'] != undefined) {
        if (type[i]['selectedStatus'] != 'Approved') {
          let payload = Object.assign({}, this.paymentsInformationForm.value);

          payload['accountPayablesId'] = type[i]['accountPayablesId']
          payload['paymentNumber'] = type[i]['paymentNumber']
          payload['supplierModel'] = type[i]['supplierModel']
          payload['selectedPaymentStatus'] = 'Paid';
          payload['createdUser'] = type[i]['createdUser'],
            payload['lastUpdateUser'] = localStorage.getItem('id'),
            payload['sourceRef'] = type[i]['sourceRef'];
          payload['approvedBy'] = localStorage.getItem('id'),
            payload['approvedDate'] = this.paymentsInformationForm.get('paymentDate').value;
          payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
          payload['totalAmountToBePaid'] = 0;
          payload['sourceType'] = type[i]['sourceType']
          payload['source'] = type[i]['source']
          payload['totalAmountPaid'] = type[i]['totalAmountToBePaid']
          payload['supplierName'] = this.supplierName != null && this.supplierName != undefined ? this.supplierName : null;
          payload['customerName'] = this.customerName != null && this.customerName != undefined ? this.customerName : null;
          payload['invoiceNo'] = type[i]['invoiceNo']
          payload['paymentType'] = this.paymentType;
          payload['creditCardAmount'] = this.cardAmount != null && this.cardAmount != undefined ? this.cardAmount : '';
          payload['cashAmount'] = this.cashAmount != null && this.cashAmount != undefined ? this.cashAmount : '';
          payload['upiAmount'] = this.upiAmount != null && this.upiAmount != undefined ? this.upiAmount : '';
          payload['chequeAmount'] = this.chequeAmount != null && this.chequeAmount != undefined ? this.chequeAmount : '';

          requestObjectArray.push(payload);
        } else {
          this.approvedRecords.push(type[i])
        }
      }
    }
    return requestObjectArray;
  }


  onPaymentsSubmit() {

    this.statusGrid = false;
    var data = [];


    this.paymentsGridOptions.api.forEachNode(node => {

      data.push(node.data);
    });
    this.savePaymentsInformationFormChanges(this.formatData(data));
    this.approvedBy = undefined;
    this.paymentsInformationForm.get('approvedPin').setValue('')
  }

  chequeAmt: any;
  chequeNumber: any;
  chequeDate: any;

  chequeAmtTwo: any;
  chequeNumberTwo: any;
  chequeDateTwo: any;

  chequeAmtThree: any;
  chequeNumberThree: any;
  chequeDateThree: any;

  chequeAmtFour: any;
  chequeNumberFour: any;
  chequeDateFour: any;

  chequeAmtFive: any;
  chequeNumberFive: any;
  chequeDateFive: any;


  AccountPayablesGridArray: any[] = [];
  generalLedgerJournald: any;
  savePaymentsInformationFormChanges(paymentsInformationForm: Object[]) {
    this.paymentsInformationForm.get('selectedStatus').setErrors({ 'incorrect': true });
    this.spinnerService.show();
    if (paymentsInformationForm[0]['paymentType'] == 'Cheque') {

      /*Cheque Validations*/
      if (!this.chequeAmount || !this.chequeNumber || !this.chequeDate) {

        this.toasterService.warning("Please Enter Cheque  details", "", {
          timeOut: 3000
        })
        this.spinnerService.hide()
        return
      }



      if (this.noOfCheques == 2) {

        if (!this.chequeAmountTwo || !this.chequeNumberTwo || !this.chequeDateTwo ||
          !this.chequeAmount || !this.chequeNumber || !this.chequeDate) {

          this.toasterService.warning("Please Enter Cheque1 & Cheque2 details", "", {
            timeOut: 3000
          })
          this.spinnerService.hide()
          return
        }

      }

      if (this.noOfCheques == 3) {

        if (!this.chequeAmountTwo || !this.chequeNumberTwo || !this.chequeDateTwo ||
          !this.chequeAmountThree || !this.chequeNumberThree || !this.chequeDateThree) {

          this.toasterService.warning("Please Enter Cheque2 & Cheque3 details", "", {
            timeOut: 3000
          })
          this.spinnerService.hide()
          return
        }

      }

      if (this.noOfCheques == 4) {

        if (!this.chequeAmountTwo || !this.chequeNumberTwo || !this.chequeDateTwo ||
          !this.chequeAmountThree || !this.chequeNumberThree || !this.chequeDateThree ||
          !this.chequeAmountFour || !this.chequeNumberFour || !this.chequeDateFour) {

          this.toasterService.warning("Please Enter Cheque2 , Cheque3 & Cheque4 details", "", {
            timeOut: 3000
          })
          this.spinnerService.hide()
          return
        }

        if (this.noOfCheques == 5) {

          if (!this.chequeAmountTwo || !this.chequeNumberTwo || !this.chequeDateTwo ||
            !this.chequeAmountThree || !this.chequeNumberThree || !this.chequeDateThree ||
            !this.chequeAmountFour || !this.chequeNumberFour || !this.chequeDateFour ||
            !this.chequeAmountFive || !this.chequeNumberFive || !this.chequeDateFive) {

            this.toasterService.warning("Please Enter Cheque2 , Cheque3 , Cheque4 & Cheque5 details", "", {
              timeOut: 3000
            })
            this.spinnerService.hide()
            return
          }

        }
      }

      if (this.noOfCheques > 1) {
        let totalChequeAmt = 0
        totalChequeAmt += isNaN(this.chequeAmount) ? Number(0) : Number(this.chequeAmount)
        totalChequeAmt += isNaN(this.chequeAmountTwo) ? Number(0) : Number(this.chequeAmountTwo)
        totalChequeAmt += isNaN(this.chequeAmountThree) ? Number(0) : Number(this.chequeAmountThree)
        totalChequeAmt += isNaN(this.chequeAmountFour) ? Number(0) : Number(this.chequeAmountFour)
        totalChequeAmt += isNaN(this.chequeAmountFive) ? Number(0) : Number(this.chequeAmountFive)
        console.log(totalChequeAmt)
        console.log(this.totalAmountToBePaid)
        if (!(totalChequeAmt == this.totalAmountToBePaid)) {

          this.toasterService.warning("Please correct the cheque amount", "", {
            timeOut: 3000
          })
          this.spinnerService.hide()
          return
        }

      }

      
      if ((this.chequeDate != null && this.chequeDate != undefined) && (this.chequeNumber != null && this.chequeNumber != undefined)) {
        let chequeItems = [];
        var obj = {};
        this.paymentsGridOptions.api.forEachNode(node => {
          if (node['data']['paymentNumber'] != null && node['data']['paymentNumber'] != undefined) {
            obj = {
              'accountPayablesId': { 'accountPayablesId': node['data']['accountPayablesId'] },
              'activeS': 'Y',
              'createdUser': localStorage.getItem('id'),
              'lastUpdateUser': localStorage.getItem('id')
            }
            chequeItems.push(obj)
          }
        });


        var chequeObjsToSave = []

        if (this.totalAmountToBePaid > 1000000 && this.payByMultiPayment) {
          let chequeObjOne = {
            'chequeNumber': this.chequeNumber,
            'chequeDate': this.chequeDate,
            'chequeAmt': this.chequeAmount,
            'activeS': 'Y',
            'chequeApprovalStatus': 'Pending',
            'pharmacyModel': { 'pharmacyId': Number(localStorage.getItem('pharmacyId')) },
            'payType': 'Cheque',
            'chequeItems': chequeItems,
            'createdUser': localStorage.getItem('id'),
            'lastUpdateUser': localStorage.getItem('id'),
            'status': 'Not Approved',
            'chequeRaisedDt': this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          };
          let chequeObjTwo = {
            'chequeNumber': this.chequeNumberTwo,
            'chequeDate': this.chequeDateTwo,
            'chequeAmt': this.chequeAmountTwo,
            'activeS': 'Y',
            'chequeApprovalStatus': 'Pending',
            'pharmacyModel': { 'pharmacyId': Number(localStorage.getItem('pharmacyId')) },
            'payType': 'Cheque',
            'chequeItems': chequeItems,
            'createdUser': localStorage.getItem('id'),
            'lastUpdateUser': localStorage.getItem('id'),
            'status': 'Not Approved',
            'chequeRaisedDt': this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          };
          let chequeObjThree = {
            'chequeNumber': this.chequeNumberThree,
            'chequeDate': this.chequeDateThree,
            'chequeAmt': this.chequeAmountThree,
            'activeS': 'Y',
            'chequeApprovalStatus': 'Pending',
            'pharmacyModel': { 'pharmacyId': Number(localStorage.getItem('pharmacyId')) },
            'payType': 'Cheque',
            'chequeItems': chequeItems,
            'createdUser': localStorage.getItem('id'),
            'lastUpdateUser': localStorage.getItem('id'),
            'status': 'Not Approved',
            'chequeRaisedDt': this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          };
          let chequeObjFour = {
            'chequeNumber': this.chequeNumberFour,
            'chequeDate': this.chequeDateFour,
            'chequeAmt': this.chequeAmountFour,
            'activeS': 'Y',
            'chequeApprovalStatus': 'Pending',
            'pharmacyModel': { 'pharmacyId': Number(localStorage.getItem('pharmacyId')) },
            'payType': 'Cheque',
            'chequeItems': chequeItems,
            'createdUser': localStorage.getItem('id'),
            'lastUpdateUser': localStorage.getItem('id'),
            'status': 'Not Approved',
            'chequeRaisedDt': this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          };
          let chequeObjFive = {
            'chequeNumber': this.chequeNumberFive,
            'chequeDate': this.chequeDateFive,
            'chequeAmt': this.chequeAmountFive,
            'activeS': 'Y',
            'chequeApprovalStatus': 'Pending',
            'pharmacyModel': { 'pharmacyId': Number(localStorage.getItem('pharmacyId')) },
            'payType': 'Cheque',
            'chequeItems': chequeItems,
            'createdUser': localStorage.getItem('id'),
            'lastUpdateUser': localStorage.getItem('id'),
            'status': 'Not Approved',
            'chequeRaisedDt': this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          };

          if (this.noOfCheques === 2) {


            chequeObjsToSave.push(chequeObjOne)
            chequeObjsToSave.push(chequeObjTwo)

          }
          if (this.noOfCheques === 3) {

            chequeObjsToSave.push(chequeObjOne)
            chequeObjsToSave.push(chequeObjTwo)
            chequeObjsToSave.push(chequeObjThree)
          }
          if (this.noOfCheques === 4) {

            chequeObjsToSave.push(chequeObjOne)
            chequeObjsToSave.push(chequeObjTwo)
            chequeObjsToSave.push(chequeObjThree)
            chequeObjsToSave.push(chequeObjFour)
          }
          if (this.noOfCheques === 5) {

            chequeObjsToSave.push(chequeObjOne)
            chequeObjsToSave.push(chequeObjTwo)
            chequeObjsToSave.push(chequeObjThree)
            chequeObjsToSave.push(chequeObjFour)
            chequeObjsToSave.push(chequeObjFive)
          }

        } else {

          let chequeObj = {
            'chequeNumber': this.chequeNumber,
            'chequeDate': this.chequeDate,
            'chequeAmt': this.totalAmountToBePaid,
            'activeS': 'Y',
            'chequeApprovalStatus': 'Pending',
            'pharmacyModel': { 'pharmacyId': Number(localStorage.getItem('pharmacyId')) },
            'payType': 'Cheque',
            'chequeItems': chequeItems,
            'createdUser': localStorage.getItem('id'),
            'lastUpdateUser': localStorage.getItem('id'),
            'status': 'Not Approved',
            'chequeRaisedDt': this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          };
          chequeObjsToSave.push(chequeObj)
        }

        let chequeObjsSavedArr = []
        for (var i = 0; i < chequeObjsToSave.length; i++) {
          chequeObjsSavedArr.push(this.paymentsService.saveChequeData(chequeObjsToSave[i]));

        }

        forkJoin(chequeObjsSavedArr).subscribe(chequeRes => {
          console.log(chequeRes)
          if (chequeRes[0] instanceof Object) {
            if (chequeRes[0]['responseStatus']['code'] === 200) {
              this.spinnerService.hide();
              this.toasterService.success(chequeRes['message'], 'Waiting For Approval', {
                timeOut: 5000
              });
              this.paymentsInformationForm.reset();
              this.selectedStatus = { name: 'Approved' };
              // this.makePayment = true;
              this.showApproveBy = undefined;
              this.showPaymentType = false;
              this.totalAmountToBePaid = 0;
              this.selectedSupplier = undefined;
              this.oldGrid = undefined;
              this.gridArray = undefined;
              this.clickedRow = undefined;
              this.makePayment = false;
              this.cashCheckbox = false;
              this.mPesaCheckbox = false;
              this.card = false;
              this.cheque = false;
              this.makePayment = true;
              this.paymentsGridOptions.api.setRowData([]);
            }
          }
        }, error => {
          this.toasterService.warning('Error Occured', 'Please contact admin', {
            timeOut: 5000
          })
          this.spinnerService.hide();
        })
      } else {
        this.spinnerService.hide();
        this.toasterService.warning('Please Provide Cheque Details', 'Cheque Date or Cheque No Missing', {
          timeOut: 5000
        })
      }

    } else if (this.paymentType == 'MPesa') {
      if (paymentsInformationForm[0]['upiPhoneNo'] != null && paymentsInformationForm[0]['authCode'] != undefined &&
        paymentsInformationForm[0]['authCode'] != '' && paymentsInformationForm[0]['authCode'] != null &&
        paymentsInformationForm[0]['upiPhoneNo'] != undefined && paymentsInformationForm[0]['upiPhoneNo'] != '') {
        this.savePayablesData(paymentsInformationForm);
      } else {
        this.spinnerService.hide();
        this.toasterService.warning('Please Provide Payment Details', '', {
          timeOut: 5000
        })
      }

    }
    else if (this.paymentType == 'Card') {
      if (paymentsInformationForm[0]['creditCardNo'] != null && paymentsInformationForm[0]['authCode'] != undefined &&
        paymentsInformationForm[0]['creditCardNo'] != '' && paymentsInformationForm[0]['authCode'] != null &&
        paymentsInformationForm[0]['creditCardNo'] != undefined && paymentsInformationForm[0]['authCode'] != '') {
        this.savePayablesData(paymentsInformationForm);
      } else {
        this.spinnerService.hide();
        this.toasterService.warning('Please Provide Payment Details', '', {
          timeOut: 5000
        })
      }

    } else {
      this.savePayablesData(paymentsInformationForm)
    }

  }

  savePayablesData(paymentsInformationForm) {
    this.paymentsService.updateAccountPayables(paymentsInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.spinnerService.hide();
            this.AccountPayablesGridArray = saveFormResponse['result'];
            this.gridArray = [];
            var tempGridItems = [];

            for (var i = 0; i < this.AccountPayablesGridArray.length; i++) {

              this.totalAmountToBePaid = 0;
              let gridItem = new PaymentsModel;

              gridItem['paymentNumber'] = this.AccountPayablesGridArray[i]['paymentNumber'] != null && this.AccountPayablesGridArray[i]['paymentNumber'] != undefined ? this.AccountPayablesGridArray[i]['paymentNumber'] : '';
              gridItem['paymentDate'] = this.AccountPayablesGridArray[i]['paymentDate'] != null && this.AccountPayablesGridArray[i]['paymentDate'] != undefined ? this.AccountPayablesGridArray[i]['paymentDate'] : '00-00-0000';
              gridItem['totalAmountToBePaid'] = this.AccountPayablesGridArray[i]['totalAmountToBePaid'] != null && this.AccountPayablesGridArray[i]['totalAmountToBePaid'] != undefined ? this.AccountPayablesGridArray[i]['totalAmountToBePaid'] : 0;
              gridItem['selectedStatus'] = this.AccountPayablesGridArray[i]['selectedStatus'] != null && this.AccountPayablesGridArray[i]['selectedStatus'] != undefined ? this.AccountPayablesGridArray[i]['selectedStatus'] : '';
              gridItem['selectedPaymentStatus'] = this.AccountPayablesGridArray[i]['selectedPaymentStatus'] != null && this.AccountPayablesGridArray[i]['selectedPaymentStatus'] != undefined ? this.AccountPayablesGridArray[i]['selectedPaymentStatus'] : '';
              gridItem['sourceRef'] = this.AccountPayablesGridArray[i]['sourceRef'] //! =null && saveFormResponse['result']['sourceRef'] !=undefined ? saveFormResponse['result']['sourceRef']:'';
              gridItem['sourceType'] = this.AccountPayablesGridArray[i]['sourceType'] != null && this.AccountPayablesGridArray[i]['sourceType'] != undefined ? this.AccountPayablesGridArray[i]['sourceType'] : '';
              gridItem['totalAmountPaid'] = this.AccountPayablesGridArray[i]['totalAmountPaid'] != null && this.AccountPayablesGridArray[i]['totalAmountPaid'] != undefined ? this.AccountPayablesGridArray[i]['totalAmountPaid'] : 0;
              gridItem['invoiceNo'] = this.AccountPayablesGridArray[i]['invoiceNo'] != null && this.AccountPayablesGridArray[i]['invoiceNo'] != undefined ? this.AccountPayablesGridArray[i]['invoiceNo'] : 'no number';

              tempGridItems.push(gridItem);

            }
            for (var i = 0; i < tempGridItems.length; i++) {
              this.approvedRecords.push(tempGridItems[i]);
            }

            this.paymentsGridOptions.api.setRowData([]);
            this.gridArray = this.approvedRecords;
            this.paymentsGridOptions.api.updateRowData({ add: this.gridArray })

            for (var i = 0; i < this.AccountPayablesGridArray.length; i++) {

              this.AccountPayablesGridArray[i]['createdUser'] = localStorage.getItem('id');
              this.AccountPayablesGridArray[i]['lastUpdateUser'] = localStorage.getItem('id');
              this.AccountPayablesGridArray[i]['approvedBy'] = this.AccountPayablesGridArray[i]['approvedBy']
            }

            this.paymentsService.saveMultipleLedgers(this.AccountPayablesGridArray).subscribe(res => {

            })



            this.selectedStatus = { name: 'Approved' };
            this.makePayment = true;
            this.showApproveBy = undefined;
            this.approvedRecords = [];
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });


            this.showPaymentType = false;

            this.paymentsService.getAccountPayablesNumber().subscribe(paymentNumber => {
              if (paymentNumber['responseStatus']['code'] == 200) {
                this.spinnerService.hide();
                this.selectedPaymentNumber = paymentNumber['result'];
              }
            });


          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
            this.spinnerService.hide();

          }
        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
          this.spinnerService.hide();

        }
      }, error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      }
    );
  }

  oldGrid: any;
  clickedRow: any;
  // for supplier empty record search
  onCellClicked(event) {
    this.paymentGrid = true;
    this.clickedRow = 'yes'
    var oldArray = [];
    this.paymentsGridOptions.api.forEachNode(node => {
      if (node.data.paymentNumber != null && node.data.paymentNumber != undefined && node.data.paymentNumber != '') {
        oldArray.push(node.data)
      }
    });
    this.oldGrid = oldArray
    this.getSalesBySearch();

  }



}

