import { InsuranceService } from './../../masters/insurance/shared/insurance.service';
import { Component, OnInit } from '@angular/core';
import { ReceiptsService } from './shared/receipts.service';
import { CustomerService } from 'src/app/masters/customer/shared/customer.service';
import { SalesBillingService } from 'src/app/sales/sales-billing/sales-billing.service';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, ColDef, IGetRowsParams, RowNode } from 'ag-grid-community';
import * as $ from 'jquery';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ReceiptsModel } from './shared/receipts.model';
import { EmployeeService } from 'src/app/masters/employee/shared/employee.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CreditNoteService } from '../credit-note/shared/credit-note.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';


@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss'],
  providers: [ReceiptsService, CustomerService, SalesBillingService, InsuranceService, DatePipe, EmployeeService]
})
export class ReceiptsComponent implements OnInit {

  accountReceivablesGridOptions: GridOptions;
  accountReceivablesAccountGridOptions: GridOptions;
  public showPaymentType: boolean = false;

  constructor(private employeeService: EmployeeService,
    private datePipe: DatePipe, private receiptsService: ReceiptsService,
    private insuranceService: InsuranceService,
    private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {

    this.getPolicyData();
    this.getEmployeeData();
    this.getAllAccountPayables();
    this.getAllMatsersData(0, 100);

    this.receiptsGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.receiptsGridOptions.rowSelection = 'single';
    this.receiptsGridOptions.columnDefs = this.columnDefs;

    this.accountReceivablesGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.accountReceivablesGridOptions.rowSelection = 'multiple';
    this.accountReceivablesGridOptions.columnDefs = this.gridColumnDefs;


    this.accountReceivablesAccountGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.accountReceivablesAccountGridOptions.rowSelection = 'multiple';
    this.accountReceivablesAccountGridOptions.columnDefs = this.gridAccColumnDefs;

    this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.receiptsService.getAccountReceivablessNumber().subscribe(receiptNumber => {
      if (receiptNumber['responseStatus']['code'] == 200) {
        this.selectedReceiptNumber = receiptNumber['result'];
      }
    })
      ;
    this.receiptsGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }
    this.accountReceivablesGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }
    this.cacheOverflowSize = 2;
    this.maxConcurrentDatasourceRequests = 2;
    this.accountReceivablesGridOptions.rowModelType = 'infinite';

    this.accountReceivablesAccountGridOptions.rowModelType = 'infinite';

    this.accountReceivablesGridOptions.isRowSelectable = function (rowNode) {
      return rowNode.data ? rowNode.data.status == 'Not Approved' : false;
    }

    this.accountReceivablesAccountGridOptions.isRowSelectable = function (rowNode) {
      return rowNode.data ? rowNode.data.status == 'Not Approved' : false;
    }

  }
  customer: string = 'N';
  insurance: string = 'Y';
  account: string = 'N';
  bulkReceivables;
  bulkChecked: boolean
  ngOnInit() {
    this.receiptsInformationForm = new FormGroup(this.receiptsInformationFormValidations);

    this.insurance = "Y";
    $(document).ready(function () {
      /*  $('.customradio input').on('change', function() {
         $('input[name=radioName]:checked').val();

      }); */
      $("#ins").click(function () {
        $("#ins").prop("checked", true);
        $("#cust").prop("checked", false);
        $("#acc").prop("checked", false);
        $("#bulk").prop("checked", false);

      });
      $("#cust").click(function () {
        $("#cust").prop("checked", true);
        $("#ins").prop("checked", false);
        $("#acc").prop("checked", false);
        $("#bulk").prop("checked", false);
      });
      $("#acc").click(function () {
        $("#acc").prop("checked", true);
        $("#ins").prop("checked", false);
        $("#cust").prop("checked", false);
        $("#bulk").prop("checked", false);
      });

      $("#bulk").click(function () {
        $("#acc").prop("checked", false);
        $("#ins").prop("checked", false);
        $("#cust").prop("checked", false);
        $("#bulk").prop("checked", true);
      });
      $("#ins").click(function () {
        $("#customerDiv").hide();
        $("#policyDiv").show();
        $("#accountDiv").hide();
      });
      $("#cust").click(function () {
        $("#customerDiv").show();
        $("#policyDiv").hide();
        $("#accountDiv").hide();
      });
      $("#acc").click(function () {
        $("#accountDiv").show();
        $("#customerDiv").hide();
        $("#policyDiv").hide();

      });

      $("#bulk").click(function () {
        $("#accountDiv").hide();
        $("#customerDiv").show();
        $("#policyDiv").hide();

      });

      $("#receiptPayment").change(function () {
        $('#itemSearchModal').modal('show');
      });

    });
  }

  ngOnDestroy(): void {

  }

  makePayment = true;
  receiptStatusArray: any[] = ["Pending", "Paid", "Partially Paid", "Cancel", "Over Paid"];
  cashCheckbox: boolean = false;
  mPesaCheckbox: boolean = false;
  card: boolean = false;
  cheque: boolean = false;
  creditNote: boolean = false;


  selectedReceiptNumber: any;
  receiptsGridOptions: GridOptions;


  cacheOverflowSize;
  maxConcurrentDatasourceRequests;

  customers: any[] = [];
  bills: any[] = [];
  policies: any[] = [];
  showGrid: boolean = true;
  accountGrid = false;
  selectedCustomer: any;
  selectedPolicy: any;
  status = [
    { name: 'Approved' },
    { name: 'Not Approved' },
  ]
  selectedStatus: any = { name: 'Approved' };


  paymentType: any;
  cashAmount: any;

  cashSelected(event) {
    this.paymentType = 'Cash';
    this.makePayment = false;
    this.cashCheckbox = true;
    this.mPesaCheckbox = false;
    this.card = false;
    this.cheque = false;
    this.cashAmount = this.amountToBeReceived;
    this.upiAmount = undefined;
    this.creditCardAmt = undefined;
    this.chequeAmt = undefined;
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
    this.creditCardAmt = undefined;
    this.upiAmount = this.amountToBeReceived;
    this.chequeAmt = undefined
  }

  creditCardAmt: any;
  cardSelected(event) {
    this.paymentType = 'Card';
    this.makePayment = false;
    this.cashCheckbox = false;
    this.mPesaCheckbox = false;
    this.card = true;
    this.cheque = false;
    this.creditCardAmt = this.amountToBeReceived;
    this.upiAmount = undefined;
    this.cashAmount = undefined;
    this.chequeAmt = undefined;
  }

  chequeAmt: any;
  chequeSelected(event) {
    this.paymentType = 'Cheque';
    this.makePayment = false;
    this.cashCheckbox = false;
    this.mPesaCheckbox = false;
    this.card = false;
    this.cheque = true;
    this.chequeAmt = this.amountToBeReceived;
    this.cashAmount = undefined;
    this.creditCardAmt = undefined;
    this.upiAmount = undefined;
  }


  selectedBill: any;
  amountToBeReceived = 0;
  totalRoundOff: number = 0;
  selectedPayments: any;

  receiptsInformationForm: FormGroup;
  receiptsInformationFormValidations = {
    receiptNumber: new FormControl('', [Validators.required]),
    selectedCustomer: new FormControl('', [Validators.required]),
    selectedPolicy: new FormControl('', [Validators.required]),
    selectedPaymentType: new FormControl('', [Validators.required]),
    receiptDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    totalBill: new FormControl('', [Validators.required]),
    totalAdvance: new FormControl('', [Validators.required]),
    totalCredit: new FormControl('', [Validators.required]),
    totalDebit: new FormControl('', [Validators.required]),
    totalRoundOff: new FormControl(''),
    amountToBeReceived: new FormControl(''),
    selectedStatus: new FormControl('', [Validators.required]),
    cashAmount: new FormControl(''),
    creditCardAmount: new FormControl(''),
    creditCardNo: new FormControl(''),
    upiPhoneNo: new FormControl(''),
    upiAmount: new FormControl(''),
    upiAuthCode: new FormControl(''),
    chequeNumber: new FormControl(''),
    chequeAmount: new FormControl(''),
    approvedBy: new FormControl(''),
    approvedPin: new FormControl('', [Validators.pattern(/^[1-9][0-9]{5}$/)]),
    activeS: new FormControl('Y'),
    selectedMaster: new FormControl('', [Validators.required]),
    cardAuthCode: new FormControl(''),
    chequeDate: new FormControl(''),
    creditNoteDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
  };

  public showContainer: boolean = false;
  statusGrid = false;

  toggle() {
    this.statusGrid = true;
  }

  statusSelected(event) {

    this.statusGrid = true;
  }

  chequeNumber: any;
  closeStatus() {
    this.statusGrid = false;
    this.approvedBy = undefined;
    this.receiptsInformationForm.get('approvedPin').setValue('');
    this.selectedStatus = { name: "Not Approved" };
    this.makePin = true;
    this.makePayment = true;
    this.receiptsInformationForm.get('chequeNumber').setValue('');
    this.receiptsInformationForm.get('chequeDate').setValue('');
    this.chequeDate = undefined;
    this.chequeNumber = undefined;
    this.showPaymentType = false;
  }


  savePin() {
    if (event['name'] == "approvedPin") {
      this.selectedStatus = "Not Approved";
    } else {
      this.selectedStatus = "Approved";
    }
    this.statusGrid = false;
  }

  CreditNote = false;
  creditNoteDate: any;

  onPaymentSelected(event) {
    var data = [];
    this.creditNoteBulkTotalAmtDisplay = 0;
    this.creditNoteBulkRefNo = undefined

    this.receiptsGridOptions.api.forEachNode(node => {
      data.push(node.data);
    });
    for (var i = 0; i < data.length; i++) {
      if (data[i]['receiptNumber'] != null && data[i]['receiptNumber'] != undefined) {
        if (data[i]['payment'] == 'Partial') {
          if (data[i]['partialAmt'] == 0) {
            this.toasterService.warning('You Haven`t Clicked On Enter Button', 'When Entered Partial Amount', {
              timeOut: 5000
            });
            this.selectedStatus = { name: "Not Approved" };
            return;
          }
        }
      }

      //for adding all credit amounts
      if ((data[i]['sourceType'] == 'Sales Returns - Credit Note' || data[i]['sourceType'] == 'Credit Note') && !this.bulkChecked == true) {
        if (this.creditNoteBulkTotalAmtDisplay != 0) {
          this.creditNoteBulkTotalAmtDisplay = this.creditNoteBulkTotalAmtDisplay + data[i]['amountToBeReceived'];
          //console.log(this.creditNoteBulkTotalAmtDisplay)
        } else {
          this.creditNoteBulkTotalAmtDisplay = data[i]['amountToBeReceived'];
        }
        if (this.creditNoteBulkRefNo) {
          //console.log(this.creditNoteBulkRefNo)
          this.creditNoteBulkRefNo = this.creditNoteBulkRefNo + "," + data[i]['sourceRef'];
        } else {
          this.creditNoteBulkRefNo = data[i]['sourceRef'];
        }

      }
    }

    if (this.bulkChecked == true) {
      if (this.FinalAmt > 0) {
        this.creditNote = true
        this.creditNoteAmt = this.FinalAmt
      }
    }
    this.selectedStatus = event['name'];
    this.getUniqueCode();
    if (event['name'] == "Approved") {
      this.makePayment = true;
      this.showPaymentType = true;
      if (this.extraPaymentType = true && (this.creditNoteAmt != null && this.creditNoteAmt != undefined && this.creditNoteAmt != 0)) {
        this.CreditNote = true;
        this.creditNote = true;

        this.creditNoteRefNo = this.creditNoteBulkRefNo;
        if (!this.bulkChecked == true) {
          this.creditNoteAmt = this.creditNoteBulkTotalAmtDisplay.toFixed(2)
        }
        this.creditNoteDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        if (this.amountToBeReceived == 0) {
          this.makePayment = false;
        } else {
          this.makePayment = true;
        }
      }

      else {
        this.CreditNote = false;
        this.creditNote = false;
      }

    } else {
      this.makePayment = true;
      this.showPaymentType = false;
      this.paymentReset();
    }
  }

  paymentReset() {
    this.paymentType = undefined;
    this.receiptsInformationForm.get('creditCardNo').setValue('');
    this.receiptsInformationForm.get('cardAuthCode').setValue('');
    this.receiptsInformationForm.get('upiPhoneNo').setValue('');
    this.receiptsInformationForm.get('upiAuthCode').setValue('');
    this.receiptsInformationForm.get('chequeNumber').setValue('');
    this.receiptsInformationForm.get('chequeDate').setValue('');
    this.chequeDate = undefined;
  }

  uniqueNo: any;
  getUniqueCode() {
    this.receiptsService.getUniqueNumber().subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.uniqueNo = res['result'];
      }
    })
  }

  accountReceivablesFinalAmt: number;

  reset() {
    this.showContainer = false;
    this.receiptsInformationForm.reset();
    this.receiptsInformationForm.patchValue({
      'status': '',
      'customers': '',
      'salesModel': '',
      'paymentType': '',
      'policies': '',
      'receiptDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    });
    this.receiptsGridOptions.api.setRowData([]);
    this.amountToBeReceived = 0;
    this.receiptsService.getAccountReceivablessNumber().subscribe(receiptNumber => {
      if (receiptNumber['responseStatus']['code'] == 200) {
        this.selectedReceiptNumber = receiptNumber['result'];
      }
    });
    this.selectedPayments = undefined;
    this.getPolicyData();
    this.selectedStatus = { name: 'Approved' };
    this.selectedReceiptNumber = undefined;
    this.amountToBeReceived = 0;
    this.cashCheckbox = false;
    this.mPesaCheckbox = false;
    this.card = false;
    this.cheque = false;
    this.receiptGrid = false;

    this.startDate = undefined;
    this.endDate = undefined;
    this.selectedCustomerName = undefined;
    this.selectedPaymentStatus = undefined;
    this.searchCodeValue = undefined;

    this.userEnteredAmt = undefined;
    this.GridAmt = undefined;
    this.FinalAmt = undefined;
    this.oldGrid = undefined;
    this.gridArray = undefined;
    this.clickedRow = undefined;

    this.chequeAmt = undefined;
    this.cashAmount = undefined;
    this.creditCardAmt = undefined;
    this.upiAmount = undefined;
    this.chequeDate = undefined;

    this.chequeNumber = undefined;
    this.paymentReset();
    this.showPaymentType = false;
    this.makePayment = true;
    this.receiptsInformationForm.get('selectedStatus').enable();
    this.CreditNote = false;
    this.creditNote = false;
    this.creditNoteDate = undefined;
    this.extraPaymentType = false;
    this.creditNoteAmt = 0;
  }

  resetCustomer() {
    this.showContainer = false;
    this.receiptsInformationForm.patchValue({
      'status': '',
      'customers': '',
      'salesModel': '',
      'paymentType': '',
      'policies': '',
      'receiptDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    });
    this.receiptsGridOptions.api.setRowData([]);

    this.amountToBeReceived = 0;
    this.receiptsService.getAccountReceivablessNumber().subscribe(receiptNumber => {
      if (receiptNumber['responseStatus']['code'] == 200) {
        this.selectedReceiptNumber = receiptNumber['result'];
      }
    });
    this.selectedPayments = undefined;
    this.getPolicyData();
    this.selectedStatus = { name: 'Approved' };
    this.selectedReceiptNumber = undefined;
    this.amountToBeReceived = 0;
    this.cashCheckbox = false;
    this.mPesaCheckbox = false;
    this.card = false;
    this.cheque = false;
    this.receiptGrid = false;

    this.startDate = undefined;
    this.endDate = undefined;
    this.selectedPaymentStatus = undefined;
    this.searchCodeValue = undefined;

    this.userEnteredAmt = undefined;
    this.GridAmt = undefined;
    this.FinalAmt = undefined;
    this.oldGrid = undefined;
    this.gridArray = undefined;
    this.clickedRow = undefined;
  }



  getAllAccountPayables() {
    this.receiptsService.getAllAccountPayablesData().subscribe(response => {
      if (response['responseStatus']['code'] === 200) {
        this.customers = response['result'];
      }
    });
  }

  masters: any;
  getAllMatsersData(start, end) {
    this.receiptsService.getAllMasterAccounts(start, end).subscribe(response => {
      if (response['responseStatus']['code'] === 200) {
        this.masters = response['result'];
      }
    })
  }

  searchAccountName(event) {
    this.receiptsService.getAllMastersBySearch(event['target']['value']).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] === 200) {
          this.masters = res['result'];
        }
      }
    })
  }

  searchCustomerName(event) {
    this.receiptsService.getCustomerByName(event['target']['value']).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] === 200) {
          this.customers = res['result'];
        }
      }
    })
  }


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
  close() {
    this.receiptsGridOptions.api.setRowData([]);
    document.getElementById('itemSearchModal').style.display = "none";
    this.receiptsGridOptions.api.setRowData([]);
    this.reset();
    this.startDate = undefined;
    this.endDate = undefined;
    this.selectedCustomerName = undefined;
    this.selectedPaymentStatus = undefined;
    this.searchCodeValue = undefined;
    this.selectedMaster = undefined;
    this.accountGrid = undefined;
    this.oldGrid = undefined;
    this.gridArray = undefined;
    this.clickedRow = undefined;
    this.receiptsInformationForm.get('selectedStatus').enable();
  }

  closePopUp() {
    this.accountGrid = false;
  }

  closePopUpForReciepts() {
    this.receiptGrid = false;
  }

  getPolicyData() {
    this.insuranceService.getRowDataFromServer().subscribe(
      getInsuranceResponse => {
        if (getInsuranceResponse instanceof Object) {
          if (getInsuranceResponse['responseStatus']['code'] === 200) {
            this.policies = getInsuranceResponse['result'];
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

  checkReceiptsFormDisability() {
    return (this.receiptsInformationForm.get('receiptDate').errors instanceof Object)
      || (this.receiptsInformationForm.get('selectedCustomer').errors instanceof Object)
  }

  /*   tooltipRenderer = function (params) {
      if (params.data.payment == 'Partial') {
        return '<span title="' + '' + '">' + 'Please Enter Amount And Press Enter Button' + '</span>';
      }
  
    } */

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
    { headerName: 'Receipt No', field: 'receiptNumber', sortable: true, resizable: true, filter: true, width: 120 },
    { headerName: 'Source Ref', field: 'sourceRef', sortable: true, resizable: true, filter: true, width: 120 },
    {
      headerName: 'Receipt Dt', field: 'receiptDate', sortable: true, resizable: true, filter: true, width: 100,
      valueGetter: this.dateFormatter.bind(this)
    },
    { headerName: 'Status', field: 'status', sortable: true, resizable: true, filter: true, width: 110 },
    { headerName: 'Amt Rec', field: 'amountReceived', sortable: true, resizable: true, filter: true, width: 120 },
    { headerName: 'Amt To Be Rec', field: 'amountToBeReceived', sortable: true, resizable: true, filter: true, width: 120 },
    {
      headerName: 'Payment', field: 'payment', singleClickEdit: true, resizable: true, sortable: true, filter: true,
      editable: true, cellStyle: { 'border': '1px solid #BDC3C7' }, width: 120,
      valueGetter: this.selectedPayType.bind(this),
      cellEditor: "agSelectCellEditor",
      cellEditorParams: this.payTypes.bind(this),
      headerComponentParams: {
        template:
          '<div class="ag-cell-label" role="presentation">' +
          '<span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
          '</div>'
      },
    },
    {
      headerName: 'Partial Amt', field: 'partialAmt', sortable: true, resizable: true, filter: true, editable: true, singleClickEdit: true, width: 120,
      valueGetter: this.finalAmtCal.bind(this)
    },
    { headerName: 'Pay Status', field: 'paymentStatus', sortable: true, resizable: true, filter: true, width: 120 },
    { headerName: 'Source Type', field: 'sourceType', sortable: true, resizable: true, filter: true, width: 150 }
  ];

  /*  cellRenderer: this.tooltipRenderer, */


  finalAmtCal(params) {
    let obj = this;
    obj.finalCalculations();
    return params.data.partialAmt
  }

  creditNoteAmt: any;
  creditNoteRefNo: any;
  extraPaymentType: boolean = false;
  finalCalculations() {
    this.amountToBeReceived = 0;

    let temp = [];
    this.receiptsGridOptions.api.forEachNode(node => {
      if (node.data.receiptNumber != null && node.data.receiptNumber != undefined && node.data.receiptNumber != '')
        temp.push(node.data);
    })

    if (temp.length > 0) {
      for (var i = 0; i < temp.length; i++) {
        //console.log(this.creditNoteBulkTotalAmtDisplay)
        if (temp[i]['sourceType'].includes('Credit') && !this.bulkChecked == true) {
          this.creditNoteAmt = temp[i]['amountToBeReceived'];
          this.creditNoteRefNo = temp[i]['sourceRef'];
          this.extraPaymentType = true;
        } else {
          this.extraPaymentType = false;
        }
      }

      if (temp[0]['paymentStatus'] != 'Paid') {
        this.receiptsService.getCalculations(temp).subscribe(res => {
          if (res['result'] != null && res['result'] != undefined) {
            this.amountToBeReceived = res['result'] != null && res['result'] != undefined ? res['result']['totalAmount'] : 0;
            this.receiptsInformationForm.get('totalCredit').setValue(res['result']['totalCredit']);
            this.receiptsInformationForm.get('totalBill').setValue(res['result']['totalBill'])
          }
        })
      }
    }
  }

  paymentMethodArray = ['Full', 'Partial'];

  payTypes(params) {
    return { values: this.paymentMethodArray }
  }

  selectedPayType(params) {
    let data = [];

    if (params.data['payment'] == 'Partial' && (params.data['sourceType'].includes('Credit'))) {
      data.push(params.data)
    }

    if (data.length > 0) {
      this.toasterService.warning('Credit Note References Can`t be Partially Paid', 'You Can`t Pay Partial', {
        timeOut: 3000
      });
      data = [];
      let pay = 'Full';
      params.data.payment = pay;
      params.data.partialAmt = 0;

      return params.data.payment;
    }

    if (params.data != null && params.data != undefined) {
      if (params['data']['payment'] == "" || params['data']['payment'] == null || params['data']['payment'] == undefined) {
        params['data']['partialAmt'] = 0;
        return this.paymentMethodArray[0];
      }
      else {
        if (params['data']['payment'] == "Full") {
          params['data']['partialAmt'] = 0;
        }

        return params.data.payment;
      }
    }
    else {
      let data = 'Full';
      params.data.payment = data
      params['data']['partialAmt'] = 0;
      return params.data.payment;
    }

  }

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

    { headerName: 'Receipt No', field: 'receiptNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Ref', field: 'sourceRef', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Receipt Dt', field: 'receiptDate', sortable: true, resizable: true, filter: true, width: 100,
      valueGetter: this.dateFormatter.bind(this)
    },
    { headerName: 'Status', field: 'status', sortable: true, resizable: true, filter: true, width: 110 },
    { headerName: 'Amt Rec', field: 'amountReceived', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'Amt To Be Rec', field: 'amountToBeReceived', sortable: true, resizable: true, filter: true },
    { headerName: 'Pay Status', field: 'paymentStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Type', field: 'sourceType', sortable: true, resizable: true, filter: true, width: 100 },
    {
      headerName: 'Approved Dt', field: 'approvedDate', sortable: true, resizable: true, filter: true, hide: true,
      valueGetter: this.dateFormatteForApproved.bind(this)
    },
    {
      headerName: 'Payment', field: 'payment', singleClickEdit: true, resizable: true, sortable: true, filter: true, hide: true,
    },
    {
      headerName: 'Partial Amt', field: 'partialAmt', sortable: true, resizable: true, filter: true, hide: true,
    },
    {
      headerName: 'Ref', field: 'billRefNo', sortable: true, resizable: true, filter: true, hide: true,
    }

  ];

  gridAccColumnDefs: ColDef[] = [

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
    { headerName: 'Receipt No', field: 'receiptNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Ref', field: 'sourceRef', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Receipt Dt', field: 'receiptDate', sortable: true, resizable: true, filter: true,
      valueGetter: this.dateFormatter.bind(this)
    },
    { headerName: 'Status', field: 'status', sortable: true, resizable: true, filter: true },
    { headerName: 'Amt Rec', field: 'amountReceived', sortable: true, resizable: true, filter: true },
    { headerName: 'Amt To Be Rec', field: 'amountToBeReceived', sortable: true, resizable: true, filter: true },
    { headerName: 'Pay Status', field: 'paymentStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Type', field: 'sourceType', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Approved Date', field: 'approvedDate', sortable: true, resizable: true, filter: true, hide: true,
      valueGetter: this.dateFormatteForApproved.bind(this)
    },
    { headerName: 'Account No', field: 'creditNumber', }
  ];

  generateReceiptNumber() {
    if ((this.selectedCustomer != null && this.selectedCustomer != undefined)) {
      let receiptNumber = 'AP' + this.selectedCustomer['receiptDateDate'] + '0001';
      this.receiptsInformationForm.get('receiptNumber').setValue(receiptNumber);
    }
  }

  showInsurance: boolean = false;
  showCustomer: boolean = false;
  selectedCustomerName: string = 'Select';
  selectedInsuranceName: string = 'Select';

  onInsuranceSelected(policy: any) {
    this.receiptGrid = true;
    this.selectedInsuranceName = policy.name;
    this.selectedPolicy = policy;
    this.getInsurancesBillsGrid(this.selectedPolicy.insurancePolicyId);
    this.showInsurance = false;
    this.receiptsGridOptions.columnDefs = this.columnDefs;
  }

  rowData = [];
  getInsurancesBillsGrid(customerId: number) {
    this.showGrid = false;
    this.receiptsService.getCustomerBillIdSearch(customerId).subscribe(
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

  customersName: any;
  onCustomerSelected(customer: any) {
    //console.log(customer)
    this.resetCustomer();
    if (customer != null && customer != undefined) {
      this.receiptGrid = true;
      this.selectedCustomerName = customer.customerName;
      this.customersName = customer.customerName;
      this.getCustomersBillsGrid(this.selectedCustomerName);
      this.showCustomer = false;
      this.receiptsGridOptions.columnDefs = this.columnDefs;
      this.resetSearchTerms();
    } else {
      this.resetSearchTerms();
      this.reset();
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

  dateFormatteForApproved(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.approvedDate != null && params.data.approvedDate != undefined) {
        try {
          params.data.approvedDate = this.datePipe.transform(params.data.approvedDate, "dd-MM-yyyy");
        }
        catch (error) {
        }
        return params.data.approvedDate;
      }
    }
  }

  dateFormatter(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.receiptDate != null && params.data.receiptDate != undefined) {
        try {
          params.data.receiptDate = this.datePipe.transform(params.data.receiptDate, "dd-MM-yyyy");
        }
        catch (error) {
        }
        return params.data.receiptDate;
      }
    }
  }

  approvedBy: any;
  approvedEmpName: any;
  selectedApprovedBy: any;
  approvedEmp: any
  selectedEmployee(event) {
    this.selectedApprovedBy = event;
    this.approvedBy = event;
    this.approvedEmp = event
    this.approvedEmpName = event['empName'];

  }
  show: boolean;
  password() {
    this.show = !this.show;
  }

  customerGridArray: any;
  getCustomersBillsGrid(customerName: string) {
    this.showGrid = false;
    this.receiptsService.getCustomerIdSearch(customerName).subscribe(
      customerGridDataResponse => {
        if (customerGridDataResponse instanceof Object) {
          if (customerGridDataResponse['responseStatus']['code'] === 200) {
            this.rowData = customerGridDataResponse['result'];
            this.accountReceivablesGridOptions.api.setRowData(this.rowData);
            this.showGrid = true;
          }
        }
      }
    );
  }

  receiptGrid = false;
  gridArray: ReceiptsModel[] = [];
  accountRecievablesId: any;
  source: any;
  sourceRef: any;
  sourceType: any;
  sourceReference: any;
  paymentTypeId: any;
  receiptDate: any;

  getSelectedGridItems() {

    if (!this.bulkChecked == true) {
      this.onAmtEntered(0)
    }


    if (this.bulkChecked == true) {
      if (!this.userEnteredAmt) {
        this.toasterService.warning("Please enter the amount received from customer", " ", {
          timeOut: 3000
        })
        return;
      }

      this.creditNoteDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')

    }
    this.gridArray = [];
    var billTotalAmount = 0;
    var billTotalAdvance = 0;
    var billTotalCredit = 0;
    var billTotalDebit = 0;

    this.accountReceivablesGridOptions.api.getSelectedRows().forEach(data => {

      // console.log("==================second grid")
      this.receiptGrid = false;
      let gridItem = new ReceiptsModel;
      gridItem['receiptNumber'] = data['receiptNumber'] != null && data['receiptNumber'] != undefined ? data['receiptNumber'] : null;
      gridItem['receiptDate'] = data['receiptDate'] != null && data['receiptDate'] != undefined ? data['receiptDate'] : '00-00-0000';
      gridItem['status'] = data['status'] != null && data['status'] != undefined ? data['status'] : '';
      gridItem['amountToBeReceived'] = data['amountToBeReceived'] != null && data['amountToBeReceived'] != undefined ? data['amountToBeReceived'] : 0;
      gridItem['paymentStatus'] = data['paymentStatus'] != null && data['paymentStatus'] != undefined ? data['paymentStatus'] : '';
      gridItem['amountReceived'] = data['amountReceived'] != null && data['amountReceived'] != undefined ? data['amountReceived'] : 0;
      gridItem['sourceType'] = data['sourceType'] != null && data['sourceType'] != undefined ? data['sourceType'] : '';
      gridItem['sourceRef'] = data['sourceRef'] != null && data['sourceRef'] != undefined ? data['sourceRef'] : '';
      gridItem['approvedDate'] = data['approvedDate'] != null && data['approvedDate'] != undefined ? data['approvedDate'] : '00-00-0000';
      gridItem['PaymentType'] = data['paymentTypeId'] != null && data['paymentTypeId'] != undefined ? data['paymentTypeId']['type'] : '';
      gridItem['accountReceivablesId'] = data['accountReceivablesId'];
      gridItem['source'] = data['source'] != null && data['source'] != undefined ? data['source'] : '';
      gridItem['paymentTypeId'] = data['paymentTypeId'] != null && data['paymentTypeId'] != undefined ? data['paymentTypeId']['paymentTypeId'] : 0;
      gridItem['creditNumber'] = data['creditNumber'] != null && data['creditNumber'] != undefined ? data['creditNumber'] : ''

      gridItem['partialAmt'] = 0

      gridItem['payment'] = 'Full';

      gridItem['billRefNo'] = data['billRefNo'] != null && data['billRefNo'] != undefined ? data['billRefNo'] : null
      gridItem['salesBillId'] = data['salesBillId'] != null && data['salesBillId'] != undefined ? data['salesBillId'] : ''
      if (gridItem['status'] == "Not Approved") {
        this.selectedStatus = gridItem['status'] == "Not Approved" ? { name: 'Not Approved' } : { name: 'Approved' };
        this.receiptsInformationForm.get('selectedStatus').setValue(this.selectedStatus);
        this.receiptsInformationForm.get('selectedStatus').enable();
      }
      if (gridItem['status'] == 'Approved') {
        this.selectedStatus = { name: "Approved" };
        this.receiptsInformationForm.get('selectedStatus').disable();
      }
      this.gridArray.push(gridItem);

    });

    for (var i = 0; i < this.gridArray.length; i++) {
      if (this.gridArray[i]['sourceType'].includes("Credit Note") && this.bulkChecked == true) {
        this.toasterService.warning("Can't select credit note in bulk payment", " ", {
          timeOut: 5000
        })
        this.gridArray = []
        this.gridArray = undefined
        this.receiptGrid = true
        break;
      }
    }

    var billNo = [];
    for (var i = 0; i < this.gridArray.length; i++) {
      if (this.gridArray[i]['sourceType'] == 'Sales Billing') {
        billNo.push(this.gridArray[i]['sourceType']);
      }
    }


    for (var i = this.gridArray.length - 1; i >= 0; i--) {
      if (this.bulkChecked == true && this.FinalAmt < 0) {
        if (this.gridArray[i]['sourceType'] == 'Sales Billing' && this.gridArray[i]['amountToBeReceived'] > (-1 * this.FinalAmt)) {
          this.gridArray[i]['partialAmt'] = this.gridArray[i]['amountToBeReceived'] != null && this.gridArray[i]['amountToBeReceived'] != undefined ? Math.round(this.gridArray[i]['amountToBeReceived'] - ((-1) * this.FinalAmt)) : 0;
          this.gridArray[i]['payment'] = 'Partial';
          break;
        }
      }

    }

    for (var i = this.gridArray.length - 1; i >= 0; i--) {
      //console.log(this.FinalAmt)
      if ((this.bulkChecked == false || !this.bulkChecked) && this.FinalAmt < 0) {
        if (this.gridArray[i]['sourceType'] == 'Sales Billing' && this.gridArray[i]['amountToBeReceived'] > (-1 * this.FinalAmt)) {
          //console.log("================")
          this.gridArray[i]['partialAmt'] = this.gridArray[i]['amountToBeReceived'] != null && this.gridArray[i]['amountToBeReceived'] != undefined ? (this.gridArray[i]['amountToBeReceived'] - ((-1) * this.FinalAmt)).toFixed(2) : 0;
          this.gridArray[i]['payment'] = 'Partial';
          break;
        }

      }
      else if ((this.bulkChecked == false || !this.bulkChecked) && this.FinalAmt > 0) {

        if (this.gridArray[i]['sourceType'] == 'Sales Billing') {
          this.toasterService.warning("Sale Bill Amount < Total Credit Notes Amount, either select Sales Bill with greater amount or select one less credit note", "", {
            timeOut: 3000
          })

          this.gridArray = []
          this.receiptGrid = true;
          return;
          break;
        }
      }

    }


    if (billNo.length > 1 && !this.bulkChecked == true) {
      this.gridArray = undefined
      this.toasterService.warning('Can`t Select More Than 1 Sales Billing', '', {
        timeOut: 3000
      });
      return;
    }



    var tempArray = [];
    if (this.oldGrid != null && this.oldGrid != undefined) {
      for (var i = 0; i < this.oldGrid.length; i++) {
        for (var j = 0; j < this.gridArray.length; j++) {
          if (this.oldGrid[i]['accountReceivablesId'] === this.gridArray[j]['accountReceivablesId']) {
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
    this.receiptsGridOptions.api.forEachNode(node => {
      if (node.data.receiptNumber != null && node.data.receiptNumber != undefined && node.data.receiptNumber != '') {
        rowsExist++;
      }
    });

    if (rowsExist > 0) {
      this.receiptsGridOptions.api.updateRowData({ add: this.gridArray });
    }
    else {
      //console.log("adding empty row")
      this.receiptsGridOptions.api.updateRowData({ add: [{}] })
      this.receiptsGridOptions.api.updateRowData({ add: this.gridArray })
    }

    if (this.clickedRow == 'yes') {
      var billTotalAmounts = 0;
      var billTotalAdvances = 0;
      var billTotalCredits = 0;
      var billTotalDebits = 0;

      this.receiptsGridOptions.api.forEachNode(data => {
        if (data.data.receiptNumber != null && data.data.receiptNumber != undefined && data.data.receiptNumber != '') {

          if (Number((isNaN(data.data['amountReceived']) ? 0 : data.data['amountReceived'])) < 0.0) {
            billTotalDebits += isNaN(data.data['amountReceived']) ? 0 : -1 * data.data['amountReceived'];
          }
          else {
            billTotalCredits += isNaN(data.data['amountReceived']) ? 0 : data.data['amountReceived'];
          }

          if (Number((isNaN(data.data['amountToBeReceived']) ? 0 : data.data['amountToBeReceived'])) < 0.0) {
            billTotalDebits += isNaN(data.data['amountToBeReceived']) ? 0 : -1 * data.data['amountToBeReceived'];
          }
          else {
            billTotalCredits += isNaN(data.data['amountToBeReceived']) ? 0 : data.data['amountToBeReceived'];
          }

          billTotalAmounts += isNaN(data.data['amountToBeReceived']) ? 0 : data.data['amountToBeReceived'];
          billTotalAdvances += isNaN(data.data['advance']) ? 0 : data.data['advance'];

          this.amountToBeReceived = parseFloat(Number(billTotalAmounts).toFixed(2));
          // console.log(this.amountToBeReceived)
          this.amountToBeReceived = parseFloat(billTotalAmounts.toFixed(2));
          this.accountReceivablesFinalAmt = this.amountToBeReceived;
          this.receiptsInformationForm.get('totalAdvance').setValue(billTotalAdvances);
          this.receiptsInformationForm.get('totalCredit').setValue(billTotalCredits);
          this.receiptsInformationForm.get('totalDebit').setValue(billTotalDebits);
          this.receiptsInformationForm.get('totalBill').setValue(billTotalCredits - billTotalDebits)


        }
      });
    }



  }

  getSelectedGridItemsForAccounts() {
    //console.log("===============")
    this.gridArray = [];
    var billTotalAmount = 0;
    var billTotalAdvance = 0;
    var billTotalCredit = 0;
    var billTotalDebit = 0;
    this.accountReceivablesAccountGridOptions.api.getSelectedRows().forEach(data => {
      this.accountGrid = false;
      let gridItem = new ReceiptsModel;
      gridItem['receiptNumber'] = data['receiptNumber'] != null && data['receiptNumber'] != undefined ? data['receiptNumber'] : null;
      gridItem['receiptDate'] = data['receiptDate'] != null && data['receiptDate'] != undefined ? data['receiptDate'] : '00-00-0000';
      gridItem['status'] = data['status'] != null && data['status'] != undefined ? data['status'] : '';
      gridItem['amountToBeReceived'] = data['amountToBeReceived'] != null && data['amountToBeReceived'] != undefined ? data['amountToBeReceived'] : 0;
      gridItem['paymentStatus'] = data['paymentStatus'] != null && data['paymentStatus'] != undefined ? data['paymentStatus'] : '';
      gridItem['amountReceived'] = data['amountReceived'] != null && data['amountReceived'] != undefined ? data['amountReceived'] : 0;
      gridItem['sourceType'] = data['sourceType'] != null && data['sourceType'] != undefined ? data['sourceType'] : '';
      gridItem['sourceRef'] = data['sourceRef'] != null && data['sourceRef'] != undefined ? data['sourceRef'] : '';
      gridItem['approvedDate'] = data['approvedDate'] != null && data['approvedDate'] != undefined ? data['approvedDate'] : '00-00-0000';
      gridItem['PaymentType'] = data['paymentTypeId'] != null && data['paymentTypeId'] != undefined ? data['paymentTypeId']['type'] : '';
      gridItem['accountReceivablesId'] = data['accountReceivablesId'];
      gridItem['source'] = data['source'] != null && data['source'] != undefined ? data['source'] : '';
      gridItem['paymentTypeId'] = data['paymentTypeId'] != null && data['paymentTypeId'] != undefined ? data['paymentTypeId']['paymentTypeId'] : 0;
      gridItem['creditNumber'] = data['creditNumber'] != null && data['creditNumber'] != undefined ? data['creditNumber'] : ''
      gridItem['customerName'] = data['customerName'] != null && data['customerName'] != undefined ? data['customerName'] : ''

      gridItem['partialAmt'] = 0;

      gridItem['payment'] = 'Full';
      gridItem['billRefNo'] = data['billRefNo'] != null && data['billRefNo'] != undefined ? data['billRefNo'] : null
      gridItem['salesBillId'] = data['salesBillId'] != null && data['salesBillId'] != undefined ? data['salesBillId'] : ''
      if (Number((isNaN(data['amountReceived']) ? 0 : data['amountReceived'])) < 0.0) {
        billTotalDebit += isNaN(data['amountReceived']) ? 0 : -1 * data['amountReceived'];
      }
      else {
        billTotalCredit += isNaN(data['amountReceived']) ? 0 : data['amountReceived'];
      }

      if (Number((isNaN(data['amountToBeReceived']) ? 0 : data['amountToBeReceived'])) < 0.0) {
        billTotalDebit += isNaN(data['amountToBeReceived']) ? 0 : -1 * data['amountToBeReceived'];
      }
      else {
        billTotalCredit += isNaN(data['amountToBeReceived']) ? 0 : data['amountToBeReceived'];
      }


      billTotalAmount += isNaN(data['amountToBeReceived']) ? 0 : data['amountToBeReceived'];
      billTotalAdvance += isNaN(data['advance']) ? 0 : data['advance'];
      this.amountToBeReceived = parseFloat(Number(billTotalAmount).toFixed(2));

      if (gridItem['status'] == "Not Approved") {
        this.selectedStatus = gridItem['status'] == "Not Approved" ? { name: 'Not Approved' } : { name: 'Approved' };
        this.receiptsInformationForm.get('selectedStatus').setValue(this.selectedStatus)
      }

      if (gridItem['status'] == 'Approved') {
        this.selectedStatus = { name: "Approved" };
        this.receiptsInformationForm.get('selectedStatus').disable();
      }
      this.gridArray.push(gridItem);

      this.amountToBeReceived = parseFloat(billTotalAmount.toFixed(2));
      this.accountReceivablesFinalAmt = this.amountToBeReceived;
      this.receiptsInformationForm.get('totalAdvance').setValue(billTotalAdvance);
      this.receiptsInformationForm.get('totalCredit').setValue(billTotalCredit);
      this.receiptsInformationForm.get('totalDebit').setValue(billTotalDebit);
      this.receiptsInformationForm.get('totalBill').setValue(billTotalCredit - billTotalDebit)

    });

    var billNo = [];
    for (var i = 0; i < this.gridArray.length; i++) {
      if (this.gridArray[i]['sourceType'] == 'Sales Billing') {
        billNo.push(this.gridArray[i]['sourceType']);
      }
    }
    if (billNo.length > 1) {
      this.gridArray = undefined
      this.toasterService.warning('Can`t Select More Than 1 Sales Billing', '', {
        timeOut: 3000
      });
      return;
    }

    var tempArray = [];
    if (this.oldGrid != null && this.oldGrid != undefined) {
      for (var i = 0; i < this.oldGrid.length; i++) {
        for (var j = 0; j < this.gridArray.length; j++) {
          if (this.oldGrid[i]['accountReceivablesId'] === this.gridArray[j]['accountReceivablesId']) {
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
    this.receiptsGridOptions.api.forEachNode(node => {
      if (node.data.receiptNumber != null && node.data.receiptNumber != undefined && node.data.receiptNumber != '') {
        rowsExist++;
      }
    });
    if (rowsExist > 0) {
      this.receiptsGridOptions.api.updateRowData({ add: this.gridArray });
    }
    else {
      this.receiptsGridOptions.api.updateRowData({ add: [{}] })
      this.receiptsGridOptions.api.updateRowData({ add: this.gridArray })
    }

    if (this.clickedRow == 'yes') {
      var billTotalAmounts = 0;
      var billTotalAdvances = 0;
      var billTotalCredits = 0;
      var billTotalDebits = 0;

      this.receiptsGridOptions.api.forEachNode(data => {
        if (data.data.receiptNumber != null && data.data.receiptNumber != undefined && data.data.receiptNumber != '') {

          if (Number((isNaN(data.data['amountReceived']) ? 0 : data.data['amountReceived'])) < 0.0) {
            billTotalDebits += isNaN(data.data['amountReceived']) ? 0 : -1 * data.data['amountReceived'];
          }
          else {
            billTotalCredits += isNaN(data.data['amountReceived']) ? 0 : data.data['amountReceived'];
          }

          if (Number((isNaN(data.data['amountToBeReceived']) ? 0 : data.data['amountToBeReceived'])) < 0.0) {
            billTotalDebits += isNaN(data.data['amountToBeReceived']) ? 0 : -1 * data.data['amountToBeReceived'];
          }
          else {
            billTotalCredits += isNaN(data.data['amountToBeReceived']) ? 0 : data.data['amountToBeReceived'];
          }

          billTotalAmounts += isNaN(data.data['amountToBeReceived']) ? 0 : data.data['amountToBeReceived'];
          billTotalAdvances += isNaN(data.data['advance']) ? 0 : data.data['advance'];

          this.amountToBeReceived = parseFloat(Number(billTotalAmounts).toFixed(2));
          this.amountToBeReceived = parseFloat(billTotalAmounts.toFixed(2));
          this.accountReceivablesFinalAmt = this.amountToBeReceived;
          this.receiptsInformationForm.get('totalAdvance').setValue(billTotalAdvances);
          this.receiptsInformationForm.get('totalCredit').setValue(billTotalCredits);
          this.receiptsInformationForm.get('totalDebit').setValue(billTotalDebits);
          this.receiptsInformationForm.get('totalBill').setValue(billTotalCredits - billTotalDebits)

        }
      });
    }
  }


  // searchSales: any;
  searchCodeValue: any;

  searchCode(event) {
    //   this.searchSales = event['target']['value'];
    this.searchCodeValue = event['target']['value']
  }
  startDate: any;
  endDate: any;
  selectedPaymentStatus: any;
  accRecievablesSearchRowCount = 0;
  accRecievablesSearchRowCountForAccount = 0;
  accRecievablesPageNumber = 0;
  accRecievablesPageNumberForAccounts = 0;

  accRecievablesDatasource = {

    getRows: (params: IGetRowsParams) => {
      this.spinnerService.show();

      if (this.selectedPaymentStatus == '') {
        this.selectedPaymentStatus = undefined;
      }
      if (this.searchCodeValue == '') {
        this.searchCodeValue = undefined;
      }
      if (this.startDate == '') {
        this.startDate = undefined;
      }
      if (this.endDate == '') {
        this.endDate = undefined;
      }
      this.receiptsService.getAllAccRecievablessBySearch(this.selectedPaymentStatus, this.startDate, this.endDate, this.searchCodeValue,
        this.accRecievablesPageNumberForAccounts, 100, this.selectedCustomerName).subscribe(data => {

          try {
            params.successCallback(data['result'], this.accRecievablesSearchRowCount);
          }
          catch (error) {
            this.spinnerService.hide();
            this.toasterService.error('Please Provide Search Criteria', 'Error Occurred', {
              timeOut: 5000
            });
          }
          this.spinnerService.hide();
          if (data['responseStatus']['code'] === 200) {
            if (data['result'] != null) {
              if (data['result']['length'] > 0) {
                this.accRecievablesPageNumberForAccounts++;
              }
              else {
                this.accountReceivablesGridOptions.api.setRowData([]);
                this.toasterService.warning('Data Not Found With Search Criteria', 'No Data To Show', {
                  timeOut: 3000
                });
              }
            }
          }
        }, error => {
          this.spinnerService.hide();
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
        });
    }
  }


  getSalesBySearch() {

    if (this.selectedPaymentStatus == '') {
      this.selectedPaymentStatus = undefined;
    }
    if (this.searchCodeValue == '') {
      this.searchCodeValue = undefined;
    }
    if (this.startDate == '') {
      this.startDate = undefined;
    }
    if (this.endDate == '') {
      this.endDate = undefined;
    }

    this.GridAmt = undefined;
    this.FinalAmt = undefined;
    this.userEnteredAmt = undefined;
    this.accRecievablesPageNumber = 0;
    this.receiptsService.getAllAccRecievablessBySearchCount(this.selectedPaymentStatus, this.startDate, this.endDate, this.searchCodeValue, 0, 100, this.selectedCustomerName).subscribe(
      searchRes => {
        if (searchRes['responseStatus']['code'] === 200) {
          this.accRecievablesSearchRowCount = searchRes['result'];
          this.accountReceivablesGridOptions.api.setDatasource(this.accRecievablesDatasource);
        }
      }
    );
  }

  selectedMaster: any;
  creditNumber: any;

  onAccountSelected(event) {
    this.resetAccount();
    if (event != null && event != undefined) {
      this.creditNumber = event['creditNumber'];
      this.accountGrid = true;
      this.receiptsService.getMasterAccById(event['masterAccountId']).subscribe(res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] === 200) {
            this.selectedMaster = res['result'];
          }
        }
      });
      this.resetSearchTerms();
    } else {
      this.resetSearchTerms();
      this.receiptsGridOptions.api.setRowData([]);
      this.reset();
      this.startDate = undefined;
      this.endDate = undefined;
      this.selectedCustomerName = undefined;
      this.selectedPaymentStatus = undefined;
      this.searchCodeValue = undefined;
      this.selectedMaster = undefined;
      this.accountGrid = undefined;
      this.chequeAmt = undefined;
      this.cashAmount = undefined;
      this.creditCardAmt = undefined;
      this.upiAmount = undefined;
      this.chequeDate = undefined;
      this.oldGrid = undefined;
      this.gridArray = undefined;
      this.clickedRow = undefined;
    }
  }

  resetAccount() {
    this.resetSearchTerms();
    this.receiptsGridOptions.api.setRowData([]);
    this.reset();
    this.startDate = undefined;
    this.endDate = undefined;
    this.selectedCustomerName = undefined;
    this.selectedPaymentStatus = undefined;
    this.searchCodeValue = undefined;
    this.selectedMaster = undefined;
    this.accountGrid = undefined;
    this.chequeAmt = undefined;
    this.cashAmount = undefined;
    this.creditCardAmt = undefined;
    this.upiAmount = undefined;
    this.chequeDate = undefined;
    this.oldGrid = undefined;
    this.gridArray = undefined;
    this.clickedRow = undefined;
    this.receiptsInformationForm.get('selectedStatus').enable();
  }

  accRecievablesDatasourceForAccount = {

    getRows: (params: IGetRowsParams) => {
      this.spinnerService.show();

      if (this.selectedPaymentStatus == '') {
        this.selectedPaymentStatus = undefined;
      }
      if (this.searchCodeValue == '') {
        this.searchCodeValue = undefined;
      }
      if (this.startDate == '') {
        this.startDate = undefined;
      }
      if (this.endDate == '') {
        this.endDate = undefined;
      }
      this.receiptsService.getAllAccRecievablessBySearchForAccounts(this.selectedPaymentStatus, this.startDate, this.endDate, this.searchCodeValue,
        this.accRecievablesPageNumber, 100, this.creditNumber).subscribe(data => {
          try {
            params.successCallback(data['result'], this.accRecievablesSearchRowCountForAccount)
          }
          catch (error) {
            this.spinnerService.hide();
            this.toasterService.error('Please Provide Search Criteria', 'Error Occurred', {
              timeOut: 5000
            });
          }
          this.spinnerService.hide();
          if (data['responseStatus']['code'] === 200) {
            if (data['result'] != null) {
              if (data['result']['length'] > 0) {
                this.accRecievablesPageNumber++;
              }
              else {
                this.accountReceivablesAccountGridOptions.api.setRowData([]);
                this.toasterService.warning('Data Not Found With Search Criteria', 'No Data To Show', {
                  timeOut: 3000
                });
              }
            }
          }
        }, error => {
          this.spinnerService.hide();
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
        });
    }
  }

  getSalesBySearchForAccounts() {

    if (this.selectedPaymentStatus == '') {
      this.selectedPaymentStatus = undefined;
    }
    if (this.searchCodeValue == '') {
      this.searchCodeValue = undefined;
    }
    if (this.startDate == '') {
      this.startDate = undefined;
    }
    if (this.endDate == '') {
      this.endDate = undefined;
    }

    this.GridAmt = undefined;
    this.FinalAmt = undefined;
    this.userEnteredAmt = undefined;

    this.accRecievablesPageNumber = 0;
    this.receiptsService.getAllAccRecievablessBySearchCountForAccounts(this.selectedPaymentStatus, this.startDate, this.endDate, this.searchCodeValue, 0, 100, this.creditNumber).subscribe(
      searchRes => {
        if (searchRes['responseStatus']['code'] === 200) {
          this.accRecievablesSearchRowCountForAccount = searchRes['result'];
          this.accountReceivablesAccountGridOptions.api.setDatasource(this.accRecievablesDatasourceForAccount);
        }
      }
    );
  }


  approvedRecords = [];

  onRoundOff(event: Event) {
    this.totalRoundOff = event['target']['value'];
    if (this.totalRoundOff != null && this.totalRoundOff != undefined && this.totalRoundOff != 0) {
      this.amountToBeReceived = Number(this.amountToBeReceived) + Number(event['target']['value']);
    } else {
      this.amountToBeReceived = parseFloat(this.accountReceivablesFinalAmt.toFixed(2));
    }
  }

  temp = undefined;

  formatData(type) {
    let requestRecievablesObject = [];
    for (var i = 0; i < type.length; i++) {
      if (type[i]['receiptNumber'] != null && type[i]['receiptNumber'] != undefined) {

        if (type[i]['status'] != 'Approved') {

          if (type[i]['payment'] == 'Full') {

            // console.log(this.approvedBy)
            let payload = Object.assign({}, this.receiptsInformationForm.value);

            payload['accountReceivablesId'] = type[i]['accountReceivablesId'];
            payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
            payload['createdUser'] = localStorage.getItem('id');
            payload['lastUpdateUser'] = localStorage.getItem('id');
            payload['receiptDate'] = this.receiptsInformationForm.get('receiptDate').value;
            payload['receiptNumber'] = type[i]['receiptNumber'];
            payload['amountToBeReceived'] = 0;
            payload['amountReceived'] = type[i]['amountToBeReceived'];
            payload['approvedBy'] = this.approvedBy['employeeId'];
            payload['sourceRef'] = type[i]['sourceRef'];
            payload['source'] = type[i]['source'];
            payload['paymentStatus'] = 'Paid';
            payload['status'] = this.selectedStatus;
            payload['sourceType'] = type[i]['sourceType'];
            payload['customerName'] = this.customersName != null && this.customersName != undefined ? this.customersName : type[i]['customerName'];
            payload['approvedDate'] = this.receiptsInformationForm.get('receiptDate').value;
            payload['lastUpdateUser'] = localStorage.getItem('id');
            payload['paymentTypeId'] = { 'paymentTypeId': type[i]['paymentTypeId'] }
            payload['creditNumber'] = type[i]['creditNumber'] != null && type[i]['creditNumber'] != undefined ? type[i]['creditNumber'] : ''
            payload['unique'] = this.uniqueNo;
            payload['salesBillId'] = type[i]['salesBillId'] != null && type[i]['salesBillId'] != undefined ? type[i]['salesBillId'] : ''
            if (this.bulkChecked == true) {
              payload['chequeNumber'] = this.receiptsInformationForm.get('chequeNumber').value ? this.receiptsInformationForm.get('chequeNumber').value + " - BP" : '';
              payload['creditCardNo'] = this.receiptsInformationForm.get('creditCardNo').value ? this.receiptsInformationForm.get('creditCardNo').value + " - BP" : '';
              payload['upiPhoneNo'] = this.receiptsInformationForm.get('upiPhoneNo').value ? this.receiptsInformationForm.get('upiPhoneNo').value + " - BP" : '';
            }
            if (type[i]['sourceType'].includes('Credit Note')) {

              payload['paymentType'] = 'Credit Note';
              payload['paymentcreditRefNo'] = this.creditNoteRefNo
            } else {
              payload['paymentType'] = this.paymentType != null && this.paymentType != undefined ? this.paymentType : 'Credit Note';
            }
            if (this.paymentType == null && this.paymentType == undefined) {
              payload['partiallyPaid'] = 'yes'
            }

            if (this.bulkChecked == true) {
              payload['cashAmount'] = this.cashAmount != null && this.cashAmount != undefined ? type[i]['amountToBeReceived'] : '';
              payload['creditCardAmount'] = this.creditCardAmt != null && this.creditCardAmt != undefined ? type[i]['amountToBeReceived'] : '';
              payload['upiAmount'] = this.upiAmount != null && this.upiAmount != undefined ? type[i]['amountToBeReceived'] : '';
              payload['chequeAmount'] = this.chequeAmt != null && this.chequeAmt != undefined ? type[i]['amountToBeReceived'] : '';
              payload['chequeDate'] = this.chequeAmt != null && this.chequeAmt != undefined ? this.chequeDate : '';
              payload['billRefNo'] = type[i]['billRefNo'] != null && type[i]['billRefNo'] != undefined ? type[i]['billRefNo'] : null
              payload['partialAmt'] = type[i]['partialAmt'] != null && type[i]['partialAmt'] != undefined ? Number(type[i]['partialAmt']) : 0;
            } else {
              payload['cashAmount'] = this.cashAmount != null && this.cashAmount != undefined ? this.cashAmount : '';
              payload['creditCardAmount'] = this.creditCardAmt != null && this.creditCardAmt != undefined ? this.creditCardAmt : '';
              payload['upiAmount'] = this.upiAmount != null && this.upiAmount != undefined ? this.upiAmount : '';
              payload['chequeAmount'] = this.chequeAmt != null && this.chequeAmt != undefined ? this.chequeAmt : '';
              payload['chequeDate'] = this.chequeAmt != null && this.chequeAmt != undefined ? this.chequeDate : '';
              payload['billRefNo'] = type[i]['billRefNo'] != null && type[i]['billRefNo'] != undefined ? type[i]['billRefNo'] : null
              payload['partialAmt'] = type[i]['partialAmt'] != null && type[i]['partialAmt'] != undefined ? Number(type[i]['partialAmt']) : 0;
            }
            if (this.CreditNote = true) {

              payload['creditNoteDate'] = this.creditNoteDate;
            }
            requestRecievablesObject.push(payload);
          }

          else if (type[i]['payment'] == 'Partial') {
            this.temp = type[i];

            this.receiptsService.getAccountReceivablessNumber().subscribe(receiptNumber => {
              let obj = this;
              if (receiptNumber['responseStatus']['code'] == 200) {
                var newRecieptNo
                newRecieptNo = receiptNumber['result'];
                let newAccRePayload = Object.assign({}, this.receiptsInformationForm.value);

                newAccRePayload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
                newAccRePayload['createdUser'] = localStorage.getItem('id');
                newAccRePayload['lastUpdateUser'] = localStorage.getItem('id');
                newAccRePayload['receiptDate'] = this.receiptsInformationForm.get('receiptDate').value;
                newAccRePayload['receiptNumber'] = newRecieptNo;
                newAccRePayload['amountToBeReceived'] = Number(obj.temp['amountToBeReceived']) - Number(obj.temp['partialAmt']);
                newAccRePayload['amountReceived'] = 0;
                newAccRePayload['approvedBy'] = obj.selectedApprovedBy['employeeId'];
                newAccRePayload['sourceRef'] = obj.temp['sourceRef'];
                newAccRePayload['source'] = obj.temp['source'];
                newAccRePayload['paymentStatus'] = 'Pending';
                newAccRePayload['status'] = 'Not Approved';
                newAccRePayload['sourceType'] = obj.temp['sourceType'];
                newAccRePayload['customerName'] = obj.customersName != null && obj.customersName != undefined ? obj.customersName : obj.temp['customerName'];
                newAccRePayload['approvedDate'] = this.receiptsInformationForm.get('receiptDate').value;
                newAccRePayload['lastUpdateUser'] = localStorage.getItem('id');
                newAccRePayload['paymentTypeId'] = { 'paymentTypeId': obj.temp['paymentTypeId'] }
                newAccRePayload['creditNumber'] = obj.temp['creditNumber'] != null && obj.temp['creditNumber'] != undefined ? obj.temp['creditNumber'] : ''
                // newAccRePayload['unique'] = obj.uniqueNo;
                newAccRePayload['paymentType'] = obj.paymentType
                newAccRePayload['cashAmount'] = obj.cashAmount != null && obj.cashAmount != undefined ? 0 : '';
                newAccRePayload['creditCardAmount'] = obj.creditCardAmt != null && obj.creditCardAmt != undefined ? 0 : '';
                newAccRePayload['upiAmount'] = obj.upiAmount != null && obj.upiAmount != undefined ? 0 : '';
                newAccRePayload['chequeAmount'] = obj.chequeAmt != null && obj.chequeAmt != undefined ? 0 : '';
                newAccRePayload['chequeDate'] = obj.chequeAmt != null && obj.chequeAmt != undefined ? 0 : '';
                newAccRePayload['billRefNo'] = obj.temp['billRefNo'] != null && obj.temp['billRefNo'] != undefined ? obj.temp['billRefNo'] : null
                if (this.bulkChecked == true) {
                  payload['chequeNumber'] = this.receiptsInformationForm.get('chequeNumber').value ? this.receiptsInformationForm.get('chequeNumber').value + " - BP" : '';
                  payload['creditCardNo'] = this.receiptsInformationForm.get('creditCardNo').value ? this.receiptsInformationForm.get('creditCardNo').value + " - BP" : '';
                  payload['upiPhoneNo'] = this.receiptsInformationForm.get('upiPhoneNo').value ? this.receiptsInformationForm.get('upiPhoneNo').value + " - BP" : '';
                }
                //newAccRePayload['partialAmt'] = obj.temp['partialAmt'] != null && obj.temp['partialAmt'] != undefined ? Number(obj.temp['partialAmt']) : 0;
                payload['salesBillId'] = obj.temp['salesBillId'] != null && obj.temp['salesBillId'] != undefined ? obj.temp['salesBillId'] : ''
                this.receiptsService.saveAccountReceivables(newAccRePayload).subscribe(res => {
                  if (res['result'] != null && res['result'] != undefined) {
                    this.amountToBeReceived = res['result']['amountToBeReceived']
                  } else {
                    this.amountToBeReceived = 0;
                  }
                });
              }
            });
            let payload = Object.assign({}, this.receiptsInformationForm.value);

            payload['accountReceivablesId'] = type[i]['accountReceivablesId'];
            payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
            payload['createdUser'] = localStorage.getItem('id');
            payload['lastUpdateUser'] = localStorage.getItem('id');
            payload['receiptDate'] = this.receiptsInformationForm.get('receiptDate').value;
            payload['receiptNumber'] = type[i]['receiptNumber'];
            payload['amountToBeReceived'] = Number(type[i]['amountToBeReceived']) - Number(type[i]['partialAmt']);
            payload['amountReceived'] = Number(type[i]['partialAmt']);
            payload['approvedBy'] = this.approvedBy['employeeId'];
            payload['sourceRef'] = type[i]['sourceRef'];
            payload['source'] = type[i]['source'];
            payload['paymentStatus'] = 'Partially Paid';
            payload['status'] = this.selectedStatus;
            payload['sourceType'] = type[i]['sourceType'];
            payload['customerName'] = this.customersName != null && this.customersName != undefined ? this.customersName : type[i]['customerName'];
            payload['approvedDate'] = this.receiptsInformationForm.get('receiptDate').value;
            payload['lastUpdateUser'] = localStorage.getItem('id');
            payload['paymentTypeId'] = { 'paymentTypeId': type[i]['paymentTypeId'] }
            payload['creditNumber'] = type[i]['creditNumber'] != null && type[i]['creditNumber'] != undefined ? type[i]['creditNumber'] : ''
            payload['unique'] = this.uniqueNo;
            payload['salesBillId'] = type[i]['salesBillId'] != null && type[i]['salesBillId'] != undefined ? type[i]['salesBillId'] : ''
            if (type[i]['sourceType'].includes('Credit Note')) {
              payload['paymentType'] = 'Credit Note';
              payload['paymentcreditRefNo'] = this.creditNoteRefNo
            } else {
              payload['paymentType'] = this.paymentType != null && this.paymentType != undefined ? this.paymentType : 'Credit Note';
            }
            if (this.paymentType == null && this.paymentType == undefined) {
              payload['partiallyPaid'] = 'yes'
            }

            if (this.bulkChecked == true) {
              payload['chequeNumber'] = this.receiptsInformationForm.get('chequeNumber').value ? this.receiptsInformationForm.get('chequeNumber').value + " - BP" : '';
              payload['creditCardNo'] = this.receiptsInformationForm.get('creditCardNo').value ? this.receiptsInformationForm.get('creditCardNo').value + " - BP" : '';
              payload['upiPhoneNo'] = this.receiptsInformationForm.get('upiPhoneNo').value ? this.receiptsInformationForm.get('upiPhoneNo').value + " - BP" : '';
            }
            //  payload['paymentType'] = this.paymentType != null && this.paymentType != undefined ? this.paymentType : 'Credit Note';
            payload['cashAmount'] = this.cashAmount != null && this.cashAmount != undefined ? Number(type[i]['partialAmt']) : '';
            payload['creditCardAmount'] = this.creditCardAmt != null && this.creditCardAmt != undefined ? Number(type[i]['partialAmt']) : '';
            payload['upiAmount'] = this.upiAmount != null && this.upiAmount != undefined ? Number(type[i]['partialAmt']) : '';
            payload['chequeAmount'] = this.chequeAmt != null && this.chequeAmt != undefined ? Number(type[i]['partialAmt']) : '';
            payload['chequeDate'] = this.chequeAmt != null && this.chequeAmt != undefined ? this.chequeDate : '';
            payload['billRefNo'] = type[i]['billRefNo'] != null && type[i]['billRefNo'] != undefined ? type[i]['billRefNo'] : null
            payload['partialAmt'] = type[i]['partialAmt'] != null && type[i]['partialAmt'] != undefined ? Number(type[i]['partialAmt']) : 0;
            if (this.CreditNote = true) {
              payload['creditNoteDate'] = this.creditNoteDate;
            }

            requestRecievablesObject.push(payload);
          }

        } else {
          this.approvedRecords.push(type[i]);
        }
      }
    }
    return requestRecievablesObject;
  }

  chequeDate: any;
  receiptButtonDisable = false
  onReceiptsSubmit() {
    if (this.paymentType == 'MPesa') {
      if (!this.receiptsInformationForm.get('upiAuthCode').value || !this.receiptsInformationForm.get('upiPhoneNo').value) {
        this.toasterService.warning('Please Provide Payement Details', '', {
          timeOut: 5000
        });
        return;
      }
      if (this.receiptsInformationForm.get('upiPhoneNo').value) {
        if (!this.receiptsInformationForm.get('upiPhoneNo').value.trim()) {
          this.toasterService.warning('Please Provide Payement Details', '', {
            timeOut: 5000
          });
          return;
        }
      }
      if (this.receiptsInformationForm.get('upiAuthCode').value) {
        if (!this.receiptsInformationForm.get('upiAuthCode').value.trim()) {
          this.toasterService.warning('Please Provide Payement Details', '', {
            timeOut: 5000
          });
          return;
        }
      }
    }

    else if (this.paymentType == 'Card') {
      if (!this.receiptsInformationForm.get('creditCardNo').value || !this.receiptsInformationForm.get('cardAuthCode').value) {
        this.toasterService.warning('Please Provide Payement Details', '', {
          timeOut: 5000
        });
        return;
      }
      if (this.receiptsInformationForm.get('creditCardNo').value) {
        if (!this.receiptsInformationForm.get('creditCardNo').value.trim()) {
          this.toasterService.warning('Please Provide Payement Details', '', {
            timeOut: 5000
          });
          return;
        }
      }
      if (this.receiptsInformationForm.get('cardAuthCode').value) {
        if (!this.receiptsInformationForm.get('cardAuthCode').value.trim()) {
          this.toasterService.warning('Please Provide Payement Details', '', {
            timeOut: 5000
          });
          return;
        }
      }
    }

    else if (this.paymentType == 'Cheque') {
      if (!this.receiptsInformationForm.get('chequeNumber').value || !this.receiptsInformationForm.get('chequeDate').value) {
        this.toasterService.warning('Please Provide Payement Details', '', {
          timeOut: 5000
        });
        return;
      }
      else if (this.receiptsInformationForm.get('chequeNumber').value) {
        if (!this.receiptsInformationForm.get('chequeNumber').value.trim()) {
          this.toasterService.warning('Please Provide Payement Details', '', {
            timeOut: 5000
          });
          return;
        }
      }
    }
    var gridArray = [];
    let paymentToasterStatus = [];
    this.receiptsGridOptions.api.forEachNode(function (node) {
      if (node.data != null && node.data != undefined && node.data != '') {
        gridArray.push(node)
      }
    });

    for (var i = 0; i < gridArray.length; i++) {
      if (gridArray[i]['data']['payment'] == 'Partial') {
        paymentToasterStatus.push(true);
      }
    }

    if (paymentToasterStatus.length > 1) {
      this.toasterService.warning('You have selected multiple partial payments', '', {
        timeOut: 3000
      })
      return
    }


    this.showPaymentType = false;
    this.statusGrid = true;
  }

  blob: Blob;
  creditNoteNo
  salesBillsUsedInGrid
  bulkRefUsedInGrid
  creditNoteBulkTotalAmtDisplay = 0
  creditNoteBulkRefNo
  SavingAccountRecievables() {
    this.receiptButtonDisable = true
    //console.log(this.creditNoteAmt)
    var data = [];
    this.salesBillsUsedInGrid = undefined
    this.bulkRefUsedInGrid = undefined

    this.receiptsGridOptions.api.forEachNode(node => {
      data.push(node.data);
    });

    for (var i = 0; i < data.length; i++) {
      //console.log(data[i])
      if (data[i]['sourceType'] == 'Sales Billing') {
        if (this.salesBillsUsedInGrid) {
          this.salesBillsUsedInGrid = this.salesBillsUsedInGrid + "," + data[i]['sourceRef']
        } else {
          this.salesBillsUsedInGrid = data[i]['sourceRef']
        }
      }

      if (this.bulkRefUsedInGrid) {
        this.bulkRefUsedInGrid = this.bulkRefUsedInGrid + "," + data[i]['sourceRef']
      } else {
        this.bulkRefUsedInGrid = data[i]['sourceRef']
      }


    }





    if (this.bulkChecked == true && this.creditNoteAmt > 0) {

      var i = data.length - 1
      let sourceRef=data[i]['sourceRef'];
      let sourceType=data[i]['sourceType']
     
      this.receiptsService.getCreditNoteNumber().subscribe(creditNoteNum => {
        if (creditNoteNum['responseStatus']['code'] == 200) {
          this.creditNoteNo = creditNoteNum['result'];
          this.receiptsService.getCustomerModelBySourceRefAndSourceType(sourceRef,sourceType).subscribe(res => {
            if (res['responseStatus']['code'] == 200) {
              let customerModel = res['result']
              let payload = Object.assign({});
             
              payload['returnType'] = 'Sales';
              payload['returnTypeReason'] = "Bulk Payment - " + this.FinalAmt;
              payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
              payload['createdUser'] = localStorage.getItem('id');
              payload['lastUpdateUser'] = localStorage.getItem('id');
              //payload['customerModel'] = {customerId:this.selectedCustomer['customerName']}
              payload['status'] = "Approved";
              payload['approvedBy'] = { 'employeeId': localStorage.getItem('id') };
              payload['approvedByEmp'] = this.approvedEmpName;
              payload['lastUpdateUser'] = localStorage.getItem('id');
              payload['createdUser'] = localStorage.getItem('id');
              payload['netAmount'] = this.creditNoteAmt;
              payload['paymentStatus'] = 'Pending';
              payload['paymentType'] = { 'paymentTypeId': 2 }
              payload['creditDate'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
              payload['creditNoteNo'] = this.creditNoteNo,
                payload['amount'] = this.creditNoteAmt
              payload['customerModel'] = customerModel
              payload['approvedDate'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
              payload['remarks'] = "Amount to be paid to customer in bulk payment against " + this.bulkRefUsedInGrid + ' (Total Paid- ' + this.userEnteredAmt + ')'
              payload['billType'] = "Credit Note"
              if (sourceType == 'Sales Returns - Credit Note' || sourceType == 'Credit Note') {
                payload['billId'] = data[i]['billRefNo'] != null && data[i]['billRefNo'] != undefined ? data[i]['billRefNo'] : null
              } else {
                payload['billId'] = sourceRef != null && sourceRef != undefined ? sourceRef : null
              }
              //console.log(payload)

              this.receiptsService.saveCreditNoteData(payload).subscribe(
                savedCreditNoteResponse => {
                  if (savedCreditNoteResponse instanceof Object) {
                    if (savedCreditNoteResponse['responseStatus']['code'] === 200) {
                      this.bulkCreditNoteFormatData(data, savedCreditNoteResponse['result']['creditNoteId']);
                    }
                  }
                })
            }
          })

        }
      });



      for (var i = 0; i < data.length; i++) {
        if (data[i]['sourceType'] != null && data[i]['sourceType'] != undefined) {
          //in the payload if we are sending one record only
          if (data[i]['sourceType'].includes('Credit Note')) {
            this.saveReceiptsInformationFormChanges(this.CreditNoteFormatData(data));
          } else if (data[i]['sourceType'].includes('Sales Billing')) {
            this.saveReceiptsInformationFormChanges(this.formatData(data));
          }

        }
      }




    }
    else if (this.amountToBeReceived >= 0 && data.length >= 3) {
      this.saveReceiptsInformationFormChanges(this.formatData(data));
    } else if (data.length == 2) {
      for (var i = 0; i < data.length; i++) {
        if (data[i]['sourceType'] != null && data[i]['sourceType'] != undefined) {
          //in the payload if we are sending one record only
          if (data[i]['sourceType'].includes('Credit Note')) {
            this.saveReceiptsInformationFormChanges(this.CreditNoteFormatData(data));
          } else if (data[i]['sourceType'].includes('Sales Billing')) {
            this.saveReceiptsInformationFormChanges(this.formatData(data));
          }

        }
      }


    } else {
      if (this.amountToBeReceived == 0) {
        this.saveReceiptsInformationFormChanges(this.formatData(data));
      }

      else {
        this.statusGrid = false;
        this.approvedBy = undefined;
        this.receiptsInformationForm.get('approvedPin').setValue('');
        this.toasterService.warning('Negative Transactions Can`t Be Processed', '', {
          timeOut: 5000
        })
      }
    }


  }

  newReceiptNo
  bulkCreditNoteFormatData(type, creditNoteId) {
    //console.log("remaining amount save as a credit note")
    var i = type.length - 1
    // console.log(type[i])

    this.receiptsService.getAccountReceivablessNumber().subscribe(receiptNumber => {
      if (receiptNumber['responseStatus']['code'] == 200) {
        this.spinnerService.hide();
        this.newReceiptNo = receiptNumber['result'];
        let updateAccRecievablesObject = {
          'amountToBeReceived': -1 * this.creditNoteAmt,
          'amountReceived': 0,
          'receiptDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          'source': creditNoteId,
          'sourceRef': this.creditNoteNo,
          'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
          'receiptNumber': this.newReceiptNo,
          'status': 'Not Approved',
          'createdUser': localStorage.getItem('id'),
          'lastUpdateUser': localStorage.getItem('id'),
          'paymentStatus': 'Pending',
          'activeS': 'Y',
          'paymentTypeId': { 'paymentTypeId': 1 },
          'sourceType': 'Credit Note',
          'approvedBy': localStorage.getItem('id'),
          'customerName': this.customersName != null && this.customersName != undefined ? this.customersName : type[i]['customerName'],
          'approvedDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          'creditNoteDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
          'billRefNo': type[i]['billRefNo'] != null && type[i]['billRefNo'] != undefined ? type[i]['billRefNo'] : null,
          'salesBillId': type[i]['salesBillId'] != null && type[i]['salesBillId'] != undefined ? type[i]['salesBillId'] : '',
          'creditNumber': type[i]['creditNumber'] != null && type[i]['creditNumber'] != undefined ? type[i]['creditNumber'] : ''

        }
        if (type[i]['sourceType'] == 'Sales Returns - Credit Note' || type[i]['sourceType'] == 'Credit Note') {
          updateAccRecievablesObject['billRefNo'] = type[i]['billRefNo'] != null && type[i]['billRefNo'] != undefined ? type[i]['billRefNo'] : null
        } else {
          updateAccRecievablesObject['billRefNo'] = type[i]['sourceRef'] != null && type[i]['sourceRef'] != undefined ? type[i]['sourceRef'] : null
        }

        //console.log(type)

        this.receiptsService.saveAccountReceivables(updateAccRecievablesObject).subscribe(response => {


        });
      }
    });

  }

  CreditNoteFormatData(type) {
    //console.log(type + "==================")
    let requestRecievablesObject = [];
    for (var i = 0; i < type.length; i++) {
      //console.log(type[i])
      if (type[i]['receiptNumber'] != null && type[i]['receiptNumber'] != undefined) {
        if (type[i]['status'] != 'Approved') {

          if (type[i]['payment'] == 'Full') {
            let payload = Object.assign({}, this.receiptsInformationForm.value);
            payload['accountReceivablesId'] = type[i]['accountReceivablesId'];
            payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
            payload['createdUser'] = localStorage.getItem('id');
            payload['lastUpdateUser'] = localStorage.getItem('id');
            payload['receiptDate'] = this.receiptsInformationForm.get('receiptDate').value;
            payload['receiptNumber'] = type[i]['receiptNumber'];
            payload['amountToBeReceived'] = 0;
            payload['amountReceived'] = type[i]['amountToBeReceived'];
            payload['approvedBy'] = this.approvedBy['employeeId'];
            payload['sourceRef'] = type[i]['sourceRef'];
            payload['source'] = type[i]['source'];
            payload['paymentStatus'] = 'Paid';
            payload['status'] = this.selectedStatus;
            payload['sourceType'] = type[i]['sourceType'];
            payload['customerName'] = this.customersName != null && this.customersName != undefined ? this.customersName : type[i]['customerName'];
            payload['approvedDate'] = this.receiptsInformationForm.get('receiptDate').value;
            payload['lastUpdateUser'] = localStorage.getItem('id');
            payload['paymentTypeId'] = { 'paymentTypeId': type[i]['paymentTypeId'] }
            payload['creditNumber'] = type[i]['creditNumber'] != null && type[i]['creditNumber'] != undefined ? type[i]['creditNumber'] : ''
            payload['unique'] = this.uniqueNo;
            payload['salesBillId'] = type[i]['salesBillId'] != null && type[i]['salesBillId'] != undefined ? type[i]['salesBillId'] : ''
            payload['partiallyPaid'] = 'Credit Note'
            if (this.bulkChecked == true) {
              payload['chequeNumber'] = this.receiptsInformationForm.get('chequeNumber').value ? this.receiptsInformationForm.get('chequeNumber').value + " - BP" : '';
              payload['creditCardNo'] = this.receiptsInformationForm.get('creditCardNo').value ? this.receiptsInformationForm.get('creditCardNo').value + " - BP" : '';
              payload['upiPhoneNo'] = this.receiptsInformationForm.get('upiPhoneNo').value ? this.receiptsInformationForm.get('upiPhoneNo').value + " - BP" : '';

            }
            if (type[i]['sourceType'].includes('Credit Note')) {
              payload['paymentType'] = this.paymentType;
              payload['paymentcreditRefNo'] = this.creditNoteRefNo
            } else {
              payload['paymentType'] = this.paymentType != null && this.paymentType != undefined ? this.paymentType : 'Credit Note';
            }
            if (this.paymentType == null && this.paymentType == undefined) {
              payload['partiallyPaid'] = 'yes'
            }
            if (this.bulkChecked == true) {
              payload['cashAmount'] = this.cashAmount != null && this.cashAmount != undefined ? type[i]['amountToBeReceived'] : '';
              payload['creditCardAmount'] = this.creditCardAmt != null && this.creditCardAmt != undefined ? type[i]['amountToBeReceived'] : '';
              payload['upiAmount'] = this.upiAmount != null && this.upiAmount != undefined ? type[i]['amountToBeReceived'] : '';
              payload['chequeAmount'] = this.chequeAmt != null && this.chequeAmt != undefined ? type[i]['amountToBeReceived'] : '';
              payload['chequeDate'] = this.chequeAmt != null && this.chequeAmt != undefined ? this.chequeDate : '';
              payload['billRefNo'] = type[i]['billRefNo'] != null && type[i]['billRefNo'] != undefined ? type[i]['billRefNo'] : null
              payload['partialAmt'] = type[i]['partialAmt'] != null && type[i]['partialAmt'] != undefined ? Number(type[i]['partialAmt']) : 0;

            } else {
              payload['cashAmount'] = this.cashAmount != null && this.cashAmount != undefined ? this.cashAmount : '';
              payload['creditCardAmount'] = this.creditCardAmt != null && this.creditCardAmt != undefined ? this.creditCardAmt : '';
              payload['upiAmount'] = this.upiAmount != null && this.upiAmount != undefined ? this.upiAmount : '';
              payload['chequeAmount'] = this.chequeAmt != null && this.chequeAmt != undefined ? this.chequeAmt : '';
              payload['chequeDate'] = this.chequeAmt != null && this.chequeAmt != undefined ? this.chequeDate : '';
              payload['billRefNo'] = type[i]['billRefNo'] != null && type[i]['billRefNo'] != undefined ? type[i]['billRefNo'] : null
              payload['partialAmt'] = type[i]['partialAmt'] != null && type[i]['partialAmt'] != undefined ? Number(type[i]['partialAmt']) : 0;

            }
            if (this.CreditNote = true) {
              payload['creditNoteDate'] = this.creditNoteDate;
            }

            requestRecievablesObject.push(payload);
          }
        }
      }
    }
    return requestRecievablesObject;
  }

  AccountRecievablesGridArray: any[] = [];
  mpesaRadio = false;
  cardRadio = false;
  chequeRadio = false;

  saveReceiptsInformationFormChanges(receiptsInformationForm: Object[]) {
    this.receiptsInformationForm.get('receiptDate').setErrors({ 'incorrect': true });
    this.spinnerService.show();
    this.approvedBy = undefined;
    this.receiptsInformationForm.get('approvedPin').setValue('');
    if (this.paymentType == 'MPesa') {
      if (receiptsInformationForm[0]['upiPhoneNo'] != null && receiptsInformationForm[0]['upiAuthCode'] != null
        && receiptsInformationForm[0]['upiPhoneNo'] != undefined && receiptsInformationForm[0]['upiAuthCode'] != undefined
        && receiptsInformationForm[0]['upiPhoneNo'] != '' && receiptsInformationForm[0]['upiAuthCode'] != '') {
        this.saveRecievables(receiptsInformationForm);

      } else {
        this.toasterService.warning('Please Provide Payement Details', '', {
          timeOut: 5000
        });
        this.statusGrid = false;
        this.showPaymentType = true;
        this.mpesaRadio = true;
        this.spinnerService.hide();
      }
    }

    else if (this.paymentType == 'Card') {
      if (receiptsInformationForm[0]['creditCardNo'] != null && receiptsInformationForm[0]['creditCardNo'] != undefined &&
        receiptsInformationForm[0]['cardAuthCode'] != undefined && receiptsInformationForm[0]['cardAuthCode'] != null &&
        receiptsInformationForm[0]['cardAuthCode'] != '' && receiptsInformationForm[0]['creditCardNo'] != '') {
        this.saveRecievables(receiptsInformationForm);

      } else {
        this.toasterService.warning('Please Provide Payement Details', '', {
          timeOut: 5000
        });
        this.statusGrid = false;
        this.showPaymentType = true;
        this.cardRadio = true;
        this.spinnerService.hide();
      }
    }

    else if (this.paymentType == 'Cheque') {
      if (receiptsInformationForm[0]['chequeNumber'] != null && this.chequeDate != undefined && this.chequeDate != null && receiptsInformationForm[0]['chequeNumber'] != '') {
        this.saveRecievables(receiptsInformationForm);

      } else {
        this.toasterService.warning('Please Provide Payement Details', '', {
          timeOut: 5000
        });
        this.statusGrid = false;
        this.showPaymentType = true;
        this.chequeRadio = true;
        this.spinnerService.hide();
      }
    }

    else if (this.paymentType == 'Cash') {
      this.saveRecievables(receiptsInformationForm);
    } else {
      this.saveRecievables(receiptsInformationForm);
    }

  }
  sRemarks
  setRemarksObj
  saveRecievables(receiptsInformationForm: Object[]) {
    //console.log(receiptsInformationForm)
    this.receiptsService.updateAccountReceivables(receiptsInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.spinnerService.hide();
            this.AccountRecievablesGridArray = saveFormResponse['result'];
            this.gridArray = [];
            var tempGridData = [];

            for (var i = 0; i < this.AccountRecievablesGridArray.length; i++) {

              if (this.AccountRecievablesGridArray[i]['sourceType'] == "Sales Billing" && this.bulkChecked == true) {
                this.setRemarksObj = {
                  payType: this.AccountRecievablesGridArray[i]['paymentType'],
                  chequeNumber: this.AccountRecievablesGridArray[i]['chequeNumber'],
                  creditCardNo: this.AccountRecievablesGridArray[i]['creditCardNo'],
                  upiPhoneNo: this.AccountRecievablesGridArray[i]['upiPhoneNo'],
                  upiAuthCode: this.AccountRecievablesGridArray[i]['upiAuthCode'],
                  chequeDate: this.AccountRecievablesGridArray[i]['chequeDate'],
                  cardAuthCode: this.AccountRecievablesGridArray[i]['cardAuthCode'],
                }

                this.sRemarks = "Part of Bulk Payment on " + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + " with payment type - " + this.setRemarksObj['payType'] + " total amount paid by customer - " + this.userEnteredAmt


                if (this.setRemarksObj['payType'] === "MPesa") {
                  this.sRemarks = this.sRemarks + " " + this.setRemarksObj['upiPhoneNo'] + " " + this.setRemarksObj['upiAuthCode']
                }

                if (this.setRemarksObj['payType'] === "Card") {
                  this.sRemarks = this.sRemarks + " " + this.setRemarksObj['creditCardNo'] + " " + this.setRemarksObj['cardAuthCode']
                }

                if (this.setRemarksObj['payType'] === "Cheque") {
                  //console.log(this.sRemarks)
                  this.sRemarks = this.sRemarks + " " + this.receiptsInformationForm.get('chequeNumber').value + "," + this.setRemarksObj['chequeDate']
                }
                this.receiptsService.updateSalesBillRemarks(this.AccountRecievablesGridArray[i]['sourceRef'], this.sRemarks).subscribe(res => {

                })
              }

              //console.log(this.AccountRecievablesGridArray[i])
              //console.log(this.bulkChecked)
              this.AccountRecievablesGridArray[i]
              //  this.amountToBeReceived = 0;
              let gridItem = new ReceiptsModel;
              this.receiptsGridOptions.api.setRowData([]);

              gridItem['receiptNumber'] = this.AccountRecievablesGridArray[i]['receiptNumber'] != null && this.AccountRecievablesGridArray[i]['receiptNumber'] != undefined ? this.AccountRecievablesGridArray[i]['receiptNumber'] : '';
              gridItem['receiptDate'] = this.AccountRecievablesGridArray[i]['receiptDate'] != null && this.AccountRecievablesGridArray[i]['receiptDate'] != undefined ? this.AccountRecievablesGridArray[i]['receiptDate'] : '00-00-0000';
              gridItem['status'] = this.AccountRecievablesGridArray[i]['status'] != null && this.AccountRecievablesGridArray[i]['status'] != undefined ? this.AccountRecievablesGridArray[i]['status'] : '';
              gridItem['amountReceived'] = this.AccountRecievablesGridArray[i]['amountReceived'] != null && this.AccountRecievablesGridArray[i]['amountReceived'] != undefined ? this.AccountRecievablesGridArray[i]['amountReceived'] : 0;
              gridItem['amountToBeReceived'] = this.AccountRecievablesGridArray[i]['amountToBeReceived'] != null && this.AccountRecievablesGridArray[i]['amountToBeReceived'] != undefined ? this.AccountRecievablesGridArray[i]['amountToBeReceived'] : 0;
              gridItem['paymentStatus'] = this.AccountRecievablesGridArray[i]['paymentStatus'] != null && this.AccountRecievablesGridArray[i]['paymentStatus'] != undefined ? this.AccountRecievablesGridArray[i]['paymentStatus'] : '';
              gridItem['sourceType'] = this.AccountRecievablesGridArray[i]['sourceType'] != null && this.AccountRecievablesGridArray[i]['sourceType'] != undefined ? this.AccountRecievablesGridArray[i]['sourceType'] : '';
              gridItem['sourceRef'] = this.AccountRecievablesGridArray[i]['sourceRef'] != null && this.AccountRecievablesGridArray[i]['sourceRef'] != undefined ? this.AccountRecievablesGridArray[i]['sourceRef'] : '';
              gridItem['approvedDate'] = this.AccountRecievablesGridArray[i]['approvedDate'] != null && this.AccountRecievablesGridArray[i]['approvedDate'] != undefined ? this.AccountRecievablesGridArray[i]['approvedDate'] : '00-00-0000';

              tempGridData.push(gridItem)
            }

            for (var i = 0; i < tempGridData.length; i++) {
              this.approvedRecords.push(tempGridData[i]);
            }

            this.receiptsGridOptions.api.setRowData([]);
            this.gridArray = this.approvedRecords;
            this.receiptsGridOptions.api.updateRowData({ add: this.gridArray });

            for (var i = 0; i < this.AccountRecievablesGridArray.length; i++) {
              this.AccountRecievablesGridArray[i]['approvedBy'] = this.AccountRecievablesGridArray[0]['approvedBy']
              this.AccountRecievablesGridArray[i]['createdUser'] = localStorage.getItem('id');
              this.AccountRecievablesGridArray[i]['lastUpdateUser'] = localStorage.getItem('id');
            }

            
            let data = this.AccountRecievablesGridArray
            for (var i = 0; i < data.length; i++) {
              if (data[i]['sourceType'] == 'Sales Returns - Credit Note') {
                //console.log("sales return credit update remarks")

                if (this.salesBillsUsedInGrid) {
                  var remarks = 'Used in Payment on ' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + " against " + this.salesBillsUsedInGrid
                } else {
                  var remarks = "Credit Note settle on " + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + " by paying " + this.paymentType + " to the customer";
                }

                this.receiptsService.updateSaleReturnEntryWithRemarks(remarks, data[i]['sourceRef']).subscribe(res => {
                  if (res instanceof Object) {
                    if (res['responseStatus']['code'] == 200) {
                      //console.log(res['result'])
                    }
                  }
                })
              } else if (data[i]['sourceType'] == 'Credit Note') {

                if (this.salesBillsUsedInGrid) {
                  var remarks = 'Used Credit Note on ' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + " to pay against " + this.salesBillsUsedInGrid
                } else {
                  var remarks = "Credit Note settle on " + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + " by paying " + this.paymentType + " to the customer";
                }

                this.receiptsService.updateCreditNoteEntryWithRemarks(remarks, data[i]['sourceRef']).subscribe(res => {
                  if (res instanceof Object) {
                    if (res['responseStatus']['code'] == 200) {
                      //console.log(res['result'])
					  
                    }
                  }
                })
              }
            }

            this.receiptsService.saveMultipleAccRecievables(this.AccountRecievablesGridArray).subscribe(res => {

              let uri = { "ReportCode": 'ACCOUNT_RECEIVABLES_RECEIPT', "UNIQUE_RECEIPT_NO": this.uniqueNo };

              var encoded = encodeURI(JSON.stringify(uri));

              let reportURI = encoded;
              this.receiptsService.downloadPdfFile(reportURI).subscribe((data: any) => {
                this.blob = new Blob([data], { type: 'application/pdf' });
                var downloadURL = window.URL.createObjectURL(data);
                var link = document.createElement('a');
                link.href = downloadURL;
                link.download = 'ACCOUNT RECEIVABLES' + '.pdf';
                link.click();
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = downloadURL;
                document.body.appendChild(iframe);
                iframe.contentWindow.print();
              });
            })

            this.statusGrid = false;
            this.selectedStatus = { name: 'Approved' };
            this.makePayment = true;
            this.approvedBy = undefined;
            this.oldGrid = undefined;
            this.gridArray = undefined;
            this.clickedRow = undefined;
            this.mpesaRadio = false;
            this.cardRadio = false;
            this.chequeRadio = false;
            this.paymentReset();
            this.chequeNumber = undefined;
            this.CreditNote = false;
            this.receiptsInformationForm.get('approvedPin').setValue('');
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
            this.approvedRecords = [];
            this.showContainer = false;
            this.creditNote = false;
            this.creditNoteDate = undefined;
            this.chequeDate = undefined;
            this.receiptsService.getAccountReceivablessNumber().subscribe(receiptNumber => {
              if (receiptNumber['responseStatus']['code'] == 200) {
                this.spinnerService.hide();
                this.selectedReceiptNumber = receiptNumber['result'];
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

  onCustomerClicked(event) {
    this.bulkChecked = false
    this.reset();
  }

  onBulkRecClicked(event) {
    this.bulkChecked = true
    this.reset();
  }

  onAccClicked(event) {
    this.bulkChecked = false
    this.reset()
  }

  onInsuranceClicked(event) {
    this.bulkChecked = false
    this.reset()
  }

  resetSearchTerms() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.selectedPaymentStatus = undefined;
    this.searchCodeValue = undefined;
  }

  selectedAccRecObj: any;
  userEnteredAmt: any;
  GridAmt: any;
  FinalAmt: any;

  onAmtEntered(event) {
    //console.log("==================")
    this.onSelectionChanged(event);
  }

  onSelectionChanged(event) {
    //console.log("=========")
    if (event == 0) {
      this.userEnteredAmt = 0
    }
    this.selectedAccRecObj = this.accountReceivablesGridOptions.api.getSelectedRows();
    var amt = 0;
    if ((this.userEnteredAmt != null && this.userEnteredAmt != undefined)) {
      for (var i = 0; i < this.selectedAccRecObj.length; i++) {
        if (this.selectedAccRecObj[i]['paymentStatus'] == 'Pending' || this.selectedAccRecObj[i]['paymentStatus'] == 'Partially Paid') {
          amt += isNaN(this.selectedAccRecObj[i]['amountToBeReceived']) ? Number(0) : Number(this.selectedAccRecObj[i]['amountToBeReceived']);
        } else {
          this.userEnteredAmt = 0
          amt = 0
        }
      }
      this.GridAmt = amt.toFixed(2);
      this.FinalAmt = (Number(this.userEnteredAmt) - Number(this.GridAmt)).toFixed(2);
      // console.log(this.FinalAmt)
    } else {
      this.GridAmt = '0.00'
      this.FinalAmt = '0.00'
    }
    if (this.selectedAccRecObj == null || this.selectedAccRecObj == undefined) {
      this.FinalAmt = '0.00'
    }
  }

  onAmtEnteredForAccount(event) {
    this.onSelectionChangedForAccounts(event);
  }

  onSelectionChangedForAccounts(event) {
    this.selectedAccRecObj = this.accountReceivablesAccountGridOptions.api.getSelectedRows();
    var amt = 0;
    if (this.userEnteredAmt != null && this.userEnteredAmt != undefined) {
      for (var i = 0; i < this.selectedAccRecObj.length; i++) {
        if (this.selectedAccRecObj[i]['paymentStatus'] == 'Pending' || this.selectedAccRecObj[i]['paymentStatus'] == 'Partially Paid') {
          amt += isNaN(this.selectedAccRecObj[i]['amountToBeReceived']) ? Number(0) : Number(this.selectedAccRecObj[i]['amountToBeReceived']);
        } else {
          this.userEnteredAmt = 0
          amt = 0
        }
      }
      this.GridAmt = amt.toFixed(2);
      this.FinalAmt = (Number(this.userEnteredAmt) - Number(this.GridAmt)).toFixed(2);
    } else {
      this.GridAmt = '0.00'
      this.FinalAmt = '0.00';
    }
  }

  clickedRow: any;
  oldGrid: any;
  gridApi;

  onGridReady(params) {
    this.gridApi = params.api;
  }

  // for customer  and account empty record search
  onCellClicked(event) {
    if (event['rowIndex'] === 0) {
      if (this.selectedCustomerName != null && this.selectedCustomerName != undefined) {
        this.clickedRow = 'yes'
        var oldArray = [];
        this.receiptsGridOptions.api.forEachNode(node => {
          if (node.data.receiptNumber != null && node.data.receiptNumber != undefined && node.data.receiptNumber != '') {
            oldArray.push(node.data)
          }
        });
        this.oldGrid = oldArray;
        this.getSalesBySearch();
        this.receiptGrid = true;
      } else if (this.creditNumber != null && this.creditNumber != undefined) {
        this.clickedRow = 'yes'
        var oldArray = [];
        this.receiptsGridOptions.api.forEachNode(node => {
          if (node.data.receiptNumber != null && node.data.receiptNumber != undefined && node.data.receiptNumber != '') {
            oldArray.push(node.data)
          }
        });
        this.oldGrid = oldArray;
        this.accountGrid = true;
        this.getSalesBySearchForAccounts();
      }
    } else {

    }
  }




}
