import {
  Component,
  OnInit
} from '@angular/core';
import * as $ from 'jquery';
import {
  faChartLine,
  faFilePdf,
  faFileExcel
} from '@fortawesome/free-solid-svg-icons';
import { ReportService } from './shared/report.service';
import { Environment } from '../core/environment';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { stringify } from 'querystring';
import { EmployeeService } from '../masters/employee/shared/employee.service';
import { ToastrService } from 'ngx-toastr';
import { GridOptions } from 'ag-grid-community';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  urlRef = new Environment();
  reportURI;
  slowMovingReportURI
  reportData;
  reportGroups = [];
  reportDetails;
  faChartLine = faChartLine;
  faFilePdf = faFilePdf;
  faFileExcel = faFileExcel;
  singleReportData;
  reportCode;
  columnDefs = [];
  rowData = [];
  PdfRes;
  reportForm: FormGroup;
  selectedInputParameter;
  blob: Blob;
  selectedReportData: Object = {};
  setJson = {};
  setValue;
  supplierDataPMC: [];
  itemDataPMC: [];
  doctorsDataSCL: [];
  manufacturerDataSCL: [];
  supplierDataPID: [];
  InvoiceDtDataPID: [];
  invoiceNoDataPID: [];
  supplierDataPOL: [];
  manufacturerDataPOL: [];
  invoiceDateDataPOL: [];
  billDateDataSCL: [];
  manufacturerDataPBPD: [];
  suppliersPODPOData: [];
  supplierDataPBPD: [];
  suppliersPIRData: [];
  invoiceDtPIRData: [];
  customerSBPDData: [];
  billDtDataSBPD: [];
  doctorsDataDBL: [];
  manufacturersDataDBL: [];
  typesDataSRD: any[] = [];
  locationDataSRAD: [];
  pharmacyDataSRAD: any[] = [];
  customerDataSPS: [];
  itemNamesDataSPS: [];
  billCodeDataSRBB: [];
  salesPersonDataSRBB: any[] = [];
  debitNoteReturnTypeData: any[] = [];
  salesPersonDataPRCN: any[] = [];
  salesPersonDataSRCN: any[] = [];
  customerDataSRBB: [];
  supplierSBMLData: [];
  batchNoPDBNData: [];
  suppliersPDBNData: [];
  itemsPDPNData: [];
  cstNoData: []
  suppliersPRLData: [];
  paymentTypesPRLData: [];
  itemsDataSMPD: [];
  itemsCodesDataSMPD: [];
  PurOrdNoDataPDPO: [];
  CreditNoteNoDataCN: [];
  ReceiptNoDataAR: [];
  customersARData: [];
  paymentNosDataAP: [];
  suppliersAPData: [];
  debiitNosData: [];
  billCodeDataSRETURN: [];
  salesReurnNosDataSRETURN: [];
  invoiceNumbersDataPID: [];
  itemDataST: [];
  grnNoDataPR: [];
  suppliersDataPR: [];
  debitNoteSuppliersData: [];
  debitNoteInvoiceData: any[] = [];
  creditNoteCustomersData: [];
  invoiceNoDataPR: [];
  partyAccountData: [];
  invoiceNumbersDataST: [];
  accountPartiesData: [];
  manufacturerMWS: any[] = [];
  customerSRCNData: any[] = [];
  itemNameMWS: any[] = [];
  supplierSWS: any[] = [];
  itemNameSWS: any[] = [];
  itemCodeSWS: any[] = [];
  accountTypeData: any[] = []
  memCardData: [];
  memCardNumberData: [];
  modes: any[] = []
  expenseCounterPartyData: any[] = []
  transactionModeData: any[] = []
  customerLastNamesData: []
  customerFirstNamesData: []
  customerAccountNoData: []
  category: any;
  mode: any;
  totalCard: any = 0;
  totalCash: any = 0;
  totalCredit: any = 0;
  totalCheque: any = 0;
  totalInsurance: any = 0;
  totalUPI: any = 0;
  totalVat: any = 0;
  totalMPesa: any = 0;
  totalCreditNoteAmt: any = 0;
  totalAmount: any = 0;
  grandTotalWithVat: any = 0;
  totalPurchaseValueAmount: any = 0.00;

  custExpTotalAmount: any = 0.00;
  custExpTotalDiscount: any = 0.00;
  custExpTotalAmountPaid: any = 0.00;
  custExpTotalAmountOut: any = 0.00;
  threshHoldValue
  period
  customerAccNo
  customerFamily
  customerNames: any;
  customerType: any
  billCodes: any;
  billType: any;
  ListAllCNByBillTypes: any;

  showTotals = false;
  showCustExpTotals = false;
  //paymentStatusAPData:[];

  statusArray = ["Active", "De-Active"];
  creditDaysArray: [];

  //creditDaysArray = [15, 30, 60, 90];

  //accountTypeData = ["Current Asset", "Current Liability", "Revenue", "Expenses", "Proprietorship"];
  paymentStatusAPData = ["Paid", "Partially Paid", "Pending", "Over Paid"];
  paymentStatusARData = ["Paid", "Partially Paid", "Pending", "Over Paid"];
  // transactionModeData = ["Cash Deposit", "Cheque Deposit", "Online Transfer", "M-PESA Deposit", "PDQ Settlement", "Cheque",
  //   "Net Banking", "CreditCard", "Withdrawls", "DebitCard", "M-PESA"];
  transactionTypeData = ["Credit", "Debit"];
  //categories = ['Stationary', 'Rent', 'Telephone ', 'Bills', 'Interent Bill', 'Packing material', 'Repair and Maintenance', 'Fixed Asset ', 'Others'];
  //modes = ['Deposit', 'Cheque', 'Net Banking', 'CreditCard', 'Withdrawls', 'DebitCard'];

  //Reports access variables

  creditNoteSummaryType = ["CREDIT NOTE ISSUED", "SR CREDIT NOTE ISSUED", "CREDIT NOTE RECEIVED"]
  customerTypeData = ["Corporate", "Staff", "Customer"]
  permissions: any[] = [];
  showMasters = true;
  showSales = true;
  showStock = true;
  showPurchase = true;
  showFinance = true;
  showCrm = true;

  reportsGridOptions: GridOptions;
  counterPartyAccountData: any;
  stockTakeStatus:string
  stockTakeStatusArr=[{name:"EXPIRY STOCK VALUE"},{name:"OVERALL STOCK VALUE"}]


  constructor(private reportService: ReportService, private datePipe: DatePipe, private toasterService: ToastrService, private sanitizer: DomSanitizer, private employeeService: EmployeeService,
    private spinnerservice: Ng4LoadingSpinnerService, private router: Router) {
    this.getCustomersByDummyBills();
    this.getBillsByDummyBills();
    this.employeeService.getEmployeeAccessByEmployeeId(localStorage.getItem('id')).subscribe((employeeAccess) => {
      if (employeeAccess instanceof Object) {
        if (employeeAccess["responseStatus"]["code"] === 200) {
          if (employeeAccess["result"] instanceof Object) {
            this.permissions = employeeAccess["result"];
            //console.log(this.permissions)
            if (this.permissions[27]['activeS'] === 'Y') {
              this.showMasters = true;
            } else {
              this.showMasters = false;
            }
            if (this.permissions[28]['activeS'] === 'Y' || this.permissions[29]['activeS'] === 'Y' ||
              this.permissions[30]['activeS'] === 'Y' || this.permissions[31]['activeS'] === 'Y' ||
              this.permissions[32]['activeS'] === 'Y' || this.permissions[33]['activeS'] === 'Y' ||
              this.permissions[34]['activeS'] === 'Y' || this.permissions[35]['activeS'] === 'Y' ||
              this.permissions[36]['activeS'] === 'Y' || this.permissions[37]['activeS'] === 'Y' ||
              this.permissions[38]['activeS'] === 'Y' || this.permissions[76]['activeS'] === 'Y' ||
              this.permissions[77]['activeS'] === 'Y') {
              this.showStock = true;


            } else {
              this.showStock = false
            }
            if (this.permissions[39]['activeS'] === 'Y' || this.permissions[40]['activeS'] === 'Y' ||
              this.permissions[41]['activeS'] === 'Y' || this.permissions[42]['activeS'] === 'Y' ||
              this.permissions[43]['activeS'] === 'Y' || this.permissions[44]['activeS'] === 'Y' ||
              this.permissions[45]['activeS'] === 'Y' || this.permissions[46]['activeS'] === 'Y' ||
              this.permissions[47]['activeS'] === 'Y' || this.permissions[66]['activeS'] === 'Y') {
              this.showSales = true;
            } else {
              this.showSales = false;
            }
            if (this.permissions[48]['activeS'] === 'Y' || this.permissions[49]['activeS'] === 'Y' ||
              this.permissions[50]['activeS'] === 'Y' || this.permissions[51]['activeS'] === 'Y' ||
              this.permissions[52]['activeS'] === 'Y' || this.permissions[53]['activeS'] === 'Y' ||
              this.permissions[54]['activeS'] === 'Y' || this.permissions[55]['activeS'] === 'Y' ||
              this.permissions[56]['activeS'] === 'Y' || this.permissions[57]['activeS'] === 'Y' ||
              this.permissions[58]['activeS'] === 'Y') {
              this.showPurchase = true;
            } else {
              this.showPurchase = false;
            }
            if (this.permissions[59]['activeS'] === 'Y' || this.permissions[60]['activeS'] === 'Y' ||
              this.permissions[61]['activeS'] === 'Y' || this.permissions[62]['activeS'] === 'Y' ||
              this.permissions[63]['activeS'] === 'Y' || this.permissions[64]['activeS'] === 'Y' ||
              this.permissions[65]['activeS'] === 'Y' || this.permissions[73]['activeS'] === 'Y' ||
              this.permissions[74]['activeS'] === 'Y' || this.permissions[75]['activeS'] === 'Y' ||
              this.permissions[78]['activeS'] === 'Y' || this.permissions[79]['activeS'] === 'Y' ||
              this.permissions[80]['activeS'] === 'Y' || this.permissions[81]['activeS'] === 'Y' ||
              this.permissions[82]['activeS'] === 'Y' || this.permissions[83]['activeS'] === 'Y') {
              this.showFinance = true;
            } else {
              this.showFinance = false;
            }
          }
        }
      }
    })
    this.reportsGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.showMasterReports();
    this.reportsGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }

  }
  display = false;
  disable = true;
  display_grid = false;
  display_form = false;
  show_report_tabs = true;
  inputParameter;
  ngOnInit() {
    this.reportForm = new FormGroup({

    })
    $(document).ready(function () {
      $('.left-menu ul li').click(function () {
        $('.left-menu ul li').removeClass('active');
        $('.no-childern').removeClass('active');
        $(this).addClass('active');
      });
      $('.no-childern').click(function () {
        $('.no-childern').removeClass('active');
        $('.left-menu ul li').removeClass('active');
        $(this).addClass('active');
      });

      $('.reports-wrap a').click(function (e) {
        e.preventDefault();
        $('.reports-wrap').hide();
        $('.edit-single').show();
      });

      $('.edit-single .btn-primary, .edit-single .btn-secondary').click(function (e) {
        e.preventDefault();
        $('.reports-wrap').show();
        $('.edit-single').hide();
      });

    })
  }

  showMasterReports() {
    this.spinnerservice.show();
    this.reportService.getReports().subscribe((res) => {
      this.reportData = res;
      this.reportGroups = [];
      this.reportData.forEach(obj => {
        if (obj['reportCode'] === "SUPPLIER_LIST" && this.permissions[27] != undefined && this.permissions[27]['activeS'] === 'Y') {
          this.reportGroups.push(obj);
        }
      });
      this.spinnerservice.hide();
    })
  }
  showSalesReports() {
    this.spinnerservice.show();
    this.reportService.getReports().subscribe((res) => {
      this.reportData = res;
      this.reportGroups = [];
      this.reportData.forEach(obj => {
        if ((obj['reportCode'] === "SUPPLIER_WISE_SALES" && this.permissions[39] != undefined && this.permissions[39]['activeS'] === 'Y') ||
          (obj['reportCode'] === "DUMMY_SALES_BILL" && this.permissions[40] != undefined && this.permissions[40]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_CANCELLATION_LIST" && this.permissions[66] != undefined && this.permissions[66]['activeS'] === 'Y') ||
          (obj['reportCode'] === "MANUFACTURER_WISE_SALES" && this.permissions[41] != undefined && this.permissions[41]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_REGISTER_DETAILS" && this.permissions[42] != undefined && this.permissions[42]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_BY_PRODUCT_SUMMARY" && this.permissions[43] != undefined && this.permissions[43]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_REGISTER_AREAWISE_DETAILS" && this.permissions[44] != undefined && this.permissions[44]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_BY_CUSTOMER_DETAILS" && this.permissions[45] != undefined && this.permissions[45]['activeS'] === 'Y') ||
          (obj['reportCode'] === "QUOTATION_REPORT" && this.permissions[46] != undefined && this.permissions[46]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_RECEIPT_DUAL" && this.permissions[47] != undefined && this.permissions[47]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_BY_HOURLY_DETAILS" && this.permissions[90] != undefined && this.permissions[90]['activeS'] === 'Y') ||
          (obj['reportCode'] === "DELIVERY_NOTE_DUAL" && this.permissions[105] != undefined && this.permissions[105]['activeS'] === 'Y')) {

          this.reportGroups.push(obj);
        }
      });
      this.spinnerservice.hide();
    })
  }
  showStockReports() {
    this.spinnerservice.show();
    this.reportService.getReports().subscribe((res) => {
      this.reportData = res;
      this.reportGroups = [];
      this.reportData.forEach(obj => {
        if ((obj['reportCode'] === "FAST_MOVING_PRODUCT_DETAILS" && this.permissions[28] != undefined && this.permissions[28]['activeS'] === 'Y') ||
          (obj['reportCode'] === "OVER_STOCK_REORDER_LEVEL" && this.permissions[29] != undefined && this.permissions[29]['activeS'] === 'Y') ||
          (obj['reportCode'] === "CONSOLIDATED_STOCK_LIST" && this.permissions[30] != undefined && this.permissions[30]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SUPPLIER_BY_MFR_LIST" && this.permissions[32] != undefined && this.permissions[32]['activeS'] === 'Y') ||
          (obj['reportCode'] === "OUT_OF_STOCK_LIST" && this.permissions[33] != undefined && this.permissions[33]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SLOW_MOVING_ITEMS" && this.permissions[34] != undefined && this.permissions[34]['activeS'] === 'Y') ||
          (obj['reportCode'] === "STOCK_CONSUMPTION_INVENTORY_REPORT" && this.permissions[35] != undefined && this.permissions[35]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALE_PRICE_VALUE_FOR_CURRENT_STOCK" && this.permissions[36] != undefined && this.permissions[36]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_PRICE_VALUE_FOR_CURRENT_STOCK" && this.permissions[37] != undefined && this.permissions[37]['activeS'] === 'Y') ||
          (obj['reportCode'] === "CURRENT_STOCK_WITH_SALES_PRICE_AND_MARGIN" && this.permissions[38] != undefined && this.permissions[38]['activeS'] === 'Y') ||
          (obj['reportCode'] === "STOCK_TAKE" && this.permissions[76] != undefined && this.permissions[76]['activeS'] === 'Y') ||
          (obj['reportCode'] === "STOCK_AUDIT_REPORT" && this.permissions[77] != undefined && this.permissions[77]['activeS'] === 'Y') ||
          (obj['reportCode'] === "STOCK_ITEMS_UPCOMING_EXPIRY" && this.permissions[80] != undefined && this.permissions[80]['activeS'] === 'Y') ||
          (obj['reportCode'] === "MINIMUM_STOCK_REORDER_LEVEL" && this.permissions[81] != undefined && this.permissions[81]['activeS'] === 'Y') ||
          (obj['reportCode'] === "ITEM_MOVEMENT_REPORT" && this.permissions[89] != undefined && this.permissions[89]['activeS'] === 'Y') ||
          (obj['reportCode'] === "QUOTATION_DETAILS" && this.permissions[98] != undefined && this.permissions[98]['activeS'] === 'Y') ||
          (obj['reportCode'] === "QUOTATION_DETAILS_BY_ITEM" && this.permissions[99] != undefined && this.permissions[99]['activeS'] === 'Y') ||
          (obj['reportCode'] === "STOCK_TAKE_EXCEPTION" && this.permissions[108] != undefined && this.permissions[108]['activeS'] === 'Y') ||
          (obj['reportCode'] === "ITEM_MOVEMENT_DETAILED_REPORT" && this.permissions[112] != undefined && this.permissions[112]['activeS'] === 'Y') ||
          (obj['reportCode'] === "ITEM_AUDIT_REPORT" && this.permissions[114] != undefined && this.permissions[114]['activeS'] === 'Y') ||
          (obj['reportCode'] === "UNTOUCHED_STOCK_ITEMS" && this.permissions[119] != undefined && this.permissions[119]['activeS'] === 'Y') ||
          (obj['reportCode'] === "AVAILABLE_STOCK_ITEMS" && this.permissions[120] != undefined && this.permissions[120]['activeS'] === 'Y')) {

          this.reportGroups.push(obj);

        }
      });
      this.spinnerservice.hide();
    })
  }
  showPurchaseReports() {
    this.spinnerservice.show();
    this.reportService.getReports().subscribe((res) => {
      this.reportData = res;
      this.reportGroups = [];
      this.reportData.forEach(obj => {
        if ((obj['reportCode'] === "PURCHASE_INVOICE_DETAILS" && this.permissions[48] != undefined && this.permissions[48]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_MARGIN" && this.permissions[49] != undefined && this.permissions[49]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PRODUCT_OFFER_LIST " && this.permissions[50] != undefined && this.permissions[50]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_BY_PRODUCT_DETAILS" && this.permissions[51] != undefined && this.permissions[51]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_ORDER_SUMMARY" && this.permissions[52] != undefined && this.permissions[52]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_REGISTER_LIST" && this.permissions[53] != undefined && this.permissions[53]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_DETAILS_BATCHNO" && this.permissions[54] != undefined && this.permissions[54]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_INVOICE_REPORT" && this.permissions[55] != undefined && this.permissions[55]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_DETAILS_ITEM" && this.permissions[56] != undefined && this.permissions[56]['activeS'] === 'Y') ||
          (obj['reportCode'] === "MARGIN_COMPARISON" && this.permissions[57] != undefined && this.permissions[57]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_ORDER_DETAILS" && this.permissions[58] != undefined && this.permissions[58]['activeS'] === 'Y')) {
          this.reportGroups.push(obj);
        }
      });
      this.spinnerservice.hide();
    })
  }
  showCrmReports() {
    this.spinnerservice.show();
    this.reportService.getReports().subscribe((res) => {
      this.reportData = res;
      this.reportGroups = [];
      this.reportData.forEach(obj => {
        if ((obj['reportCode'] === "CUSTOMER_MEMBERSHIP" && this.permissions[95] != undefined && this.permissions[95]['activeS'] === 'Y')
          || (obj['reportCode'] === "CUSTOMER_DETAILS" && this.permissions[96] != undefined && this.permissions[96]['activeS'] === 'Y')
          || (obj['reportCode'] === "MASTER_ACCOUNT_HISTORY" && this.permissions[46] != undefined && this.permissions[46]['activeS'] === 'Y')
          || (obj['reportCode'] === "EXPENDITURE_OF_CUSTOMER" && this.permissions[104] != undefined && this.permissions[104]['activeS'] === 'Y')) {
          this.reportGroups.push(obj);
        }
      });
      this.spinnerservice.hide();
    })
  }

  showFinanceReports() {
    this.spinnerservice.show();
    this.reportService.getReports().subscribe((res) => {
      this.reportData = res;
      this.reportGroups = [];
      this.reportData.forEach(obj => {
        if ((obj['reportCode'] === "DEBIT_NOTE" && this.permissions[59] != undefined && this.permissions[59]['activeS'] === 'Y') ||
          (obj['reportCode'] === "ACCOUNT_PAYABLES" && this.permissions[60] != undefined && this.permissions[60]['activeS'] === 'Y') ||
          (obj['reportCode'] === "CREDIT_NOTE" && this.permissions[61] != undefined && this.permissions[61]['activeS'] === 'Y') ||
          (obj['reportCode'] === "ACCOUNT_RECEIVABLES" && this.permissions[62] != undefined && this.permissions[62]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_RETURN" && this.permissions[63] != undefined && this.permissions[63]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PURCHASE_RETURNS" && this.permissions[64] != undefined && this.permissions[64]['activeS'] === 'Y') ||
          (obj['reportCode'] === "GENERAL_LEDGER_ENTRIES_REPORT" && this.permissions[65] != undefined && this.permissions[65]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_PROFIT_ATTRIBUTION" && this.permissions[73] != undefined && this.permissions[73]['activeS'] === 'Y') ||
          (obj['reportCode'] === "BANK_TRANSACTION_HISTORY" && this.permissions[75] != undefined && this.permissions[75]['activeS'] === 'Y') ||
          (obj['reportCode'] === "PETTY_CASH_EXPENDITURE" && this.permissions[74] != undefined && this.permissions[74]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SUPPLIER_STATEMENT" && this.permissions[78] != undefined && this.permissions[78]['activeS'] === 'Y') ||
          (obj['reportCode'] === "CUSTOMER_STATEMENT" && this.permissions[79] != undefined && this.permissions[79]['activeS'] === 'Y') ||
          (obj['reportCode'] === "EXPENSES" && this.permissions[82] != undefined && this.permissions[82]['activeS'] === 'Y') ||
          (obj['reportCode'] === "CHART_OF_ACCOUNTS" && this.permissions[83] != undefined && this.permissions[83]['activeS'] === 'Y') ||
          (obj['reportCode'] === "TILL_BALANCE" && this.permissions[84] != undefined && this.permissions[84]['activeS'] === 'Y') ||
          (obj['reportCode'] === "BANK_TRANSACTIONS" && this.permissions[85] != undefined && this.permissions[85]['activeS'] === 'Y') ||
          (obj['reportCode'] === "OUTSTANDING_PAYABLES" && this.permissions[92] != undefined && this.permissions[92]['activeS'] === 'Y') ||
          (obj['reportCode'] === "OUTSTANDING_RECEIVABLES" && this.permissions[93] != undefined && this.permissions[93]['activeS'] === 'Y') ||
          (obj['reportCode'] === "UPCOMING_PAYABLES" && this.permissions[103] != undefined && this.permissions[103]['activeS'] === 'Y') ||
          (obj['reportCode'] === "CUSTOMER_STATEMENT_BY_MASTERACCOUNT" && this.permissions[107] != undefined && this.permissions[107]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_ATTRIBUTION_VAT" && this.permissions[109] != undefined && this.permissions[109]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SUPPLIER_VAT" && this.permissions[110] != undefined && this.permissions[110]['activeS'] === 'Y') ||
          (obj['reportCode'] === "ACCOUNT_RECEIVABLES_RECEIPT_DUAL" && this.permissions[113] != undefined && this.permissions[113]['activeS'] === 'Y') ||
          (obj['reportCode'] === "TRANSACTIONS_BY_ACCOUNT_TYPE" && this.permissions[115] != undefined && this.permissions[115]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALES_TILL_BALANCE" && this.permissions[116] != undefined && this.permissions[116]['activeS'] === 'Y') ||
          (obj['reportCode'] === "CREDIT_NOTE_SUMMARY" && this.permissions[118] != undefined && this.permissions[118]['activeS'] === 'Y') ||
          (obj['reportCode'] === "SALE_PURCHASE_PRICE_FOR_YEARLY_DATA" && this.permissions[122] != undefined && this.permissions[122]['activeS'] === 'Y')) {

          this.reportGroups.push(obj);
        }
      });
      this.spinnerservice.hide();
    })
  }

  getEndDateFromPeriod(startDate, endDate) {

    if (this.period == "1 Month") {
      endDate.setMonth(startDate.getMonth() + 1)
    } if (this.period == "2 Months") {
      endDate.setMonth(startDate.getMonth() + 2)
    } if (this.period == "3 Months") {
      endDate.setMonth(startDate.getMonth() + 3)
    }
    if (this.period == "4 Months") {
      endDate.setMonth(startDate.getMonth() + 4)
    } if (this.period == "5 Months") {
      endDate.setMonth(startDate.getMonth() + 5)
    }
    if (this.period == "6 Months") {
      endDate.setMonth(startDate.getMonth() + 6)
    } if (this.period == "7Months") {
      endDate.setMonth(startDate.getMonth() + 7)
    }
    if (this.period == "8 Months") {
      endDate.setMonth(startDate.getMonth() + 8)
    } if (this.period == "9 Months") {
      endDate.setMonth(startDate.getMonth() + 9)
    }
    if (this.period == "10 Months") {
      endDate.setMonth(startDate.getMonth() + 10)
    } if (this.period == "11 Months") {
      endDate.setMonth(startDate.getMonth() + 11)
    }
    if (this.period == "12 Months") {
      endDate.setMonth(startDate.getMonth() + 12)
    }
    if (this.period == "1 Week") {
      endDate.setDate(startDate.getDate() + 7)
    } if (this.period == "2 Weeks") {
      endDate.setDate(startDate.getDate() + 14)
    } if (this.period == "3 Weeks") {
      endDate.setDate(startDate.getDate() + 21)
    }

    this.setJson["FROM_DATE"] = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
    this.setJson["TO_DATE"] = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
    this.setJson['ReportCode'] = this.reportDetails['reportCode'];

    var encoded = encodeURIComponent(JSON.stringify(this.setJson));
    this.reportURI = encoded;

    this.setTODate = this.setJson['TO_DATE']
    this.setFromDate = this.setJson['FROM_DATE']
  }

  getStartDateFromPeriod(startDate, endDate) {

    if (this.period == "1 Month") {
      startDate.setMonth(endDate.getMonth() - 1)
    } if (this.period == "2 Months") {
      startDate.setMonth(endDate.getMonth() - 2)
    } if (this.period == "3 Months") {
      startDate.setMonth(endDate.getMonth() - 3)
    }
    if (this.period == "4 Months") {
      startDate.setMonth(startDate.getMonth() - 4)
    } if (this.period == "5 Months") {
      startDate.setMonth(startDate.getMonth() - 5)
    }
    if (this.period == "6 Months") {
      endDate.setMonth(startDate.getMonth() - 6)
    } if (this.period == "7 Months") {
      endDate.setMonth(startDate.getMonth() - 7)
    }
    if (this.period == "8 Months") {
      startDate.setMonth(startDate.getMonth() - 8)
    } if (this.period == "9 Months") {
      startDate.setMonth(startDate.getMonth() - 9)
    }
    if (this.period == "10 Months") {
      startDate.setMonth(startDate.getMonth() - 10)
    } if (this.period == "11 Months") {
      startDate.setMonth(startDate.getMonth() - 11)
    }
    if (this.period == "12 Months") {
      startDate.setMonth(startDate.getMonth() - 12)
    }
    if (this.period == "1 Week") {
      startDate.setDate(endDate.getDate() - 7)
    } if (this.period == "2 Weeks") {
      startDate.setDate(endDate.getDate() - 14)
    } if (this.period == "3 Weeks") {
      startDate.setDate(endDate.getDate() - 21)
    }

    this.setJson["FROM_DATE"] = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
    this.setJson["TO_DATE"] = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
    this.setJson['ReportCode'] = this.reportDetails['reportCode'];

    var encoded = encodeURIComponent(JSON.stringify(this.setJson));
    this.reportURI = encoded;

    this.setTODate = this.setJson['TO_DATE']
    this.setFromDate = this.setJson['FROM_DATE']
  }


  onSelectStockTakeStatus(event){


  }


  checkExpiryOrStockValueForStockTake(){
    if((this.reportDetails['reportCode']=='STOCK_TAKE' || this.reportDetails['reportCode']=='STOCK_TAKE_EXPIRY') && this.stockTakeStatus){

     
      if(this.stockTakeStatus['name']==='EXPIRY STOCK VALUE'){

        this.reportDetails['reportCode']='STOCK_TAKE_EXPIRY'
        console.log(this.reportDetails)
        console.log(this.reportURI)
      }else{

        this.reportDetails['reportCode']='STOCK_TAKE'
      }

    }
  }

  getReport() {

    this.display_form = false;
    this.display_grid = true;
    this.show_report_tabs = false;


    
    this.checkExpiryOrStockValueForStockTake();

    //For chart of Account,Expense,Bank Transactions,Till Balance taking date as system date

    if (this.reportDetails['inputParameters'] != '' && this.reportDetails['inputParameters'] != null && this.reportDetails['inputParameters'] != undefined) {
      //For slow moving product details report

      if (!this.reportURI) {
        this.spinnerservice.show();

        if (this.reportDetails['reportCode'] == "CHART_OF_ACCOUNTS") {
          this.reportURI = encodeURIComponent(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'] }))

        } else if (this.reportDetails['reportCode'] == "BANK_TRANSACTIONS") {
          this.reportURI = encodeURIComponent(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'], "FROM_TRANSACTION_DATE": this.datePipe.transform(new Date(), 'yyyy-MM-dd') }))
        }
        else {

          this.reportURI = encodeURIComponent(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'], "FROM_AS_OF_DATE": this.datePipe.transform(new Date(), 'yyyy-MM-dd') }))
        }

        this.reportService.getReportData(this.reportURI).subscribe((res) => {
          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              this.rowData = res['result'];
              if (this.rowData.length == 0) {
                this.spinnerservice.hide();
                this.toasterService.warning('No Data Found', ' ', {
                  timeOut: 3000
                });
                return;
              }
              this.spinnerservice.hide();
              this.toasterService.success('Retreived Successfully', 'Success', {
                timeOut: 3000
              });
            } else {
              this.spinnerservice.hide();
              this.toasterService.error('Please contact administrator', 'Error Occurred', {
                timeOut: 5000
              });
            }
          }

        }, error => {
          this.spinnerservice.hide();
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
        });

        for (let i of JSON.parse(this.reportDetails['reportHeader'])) {
          this.columnDefs.push({
            headerName: i.displayName,
            field: i.columnName,
            sortable: true,
            filter: true,
            editable: true,
            resizable: true,
            width: 90, minWidth: 50,
          })
        }
      } else {

        this.spinnerservice.show();
        this.reportService.getReportDataByInputParams(this.reportURI).subscribe((res) => {
          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              this.rowData = res['result'];
              if (this.rowData.length == 0) {
                this.spinnerservice.hide();
                this.toasterService.warning('No Data Found', ' ', {
                  timeOut: 3000
                });
                return;
              }
              if (this.setJson['ReportCode'] == "PURCHASE_PRICE_VALUE_FOR_CURRENT_STOCK") {
                this.rowData.forEach(obj => {

                  this.totalPurchaseValueAmount += obj['PURCHASE_VALUE'];
                })

                this.totalPurchaseValueAmount = Number(this.totalPurchaseValueAmount).toFixed(2);

                if (this.totalPurchaseValueAmount > Number(this.threshHoldValue)) {
                  this.toasterService.warning("Total Purchase Value" + " " + this.totalPurchaseValueAmount + " " + "Exceeds Threshhold", " ", {
                    timeOut: 3000
                  })
                } else {

                }
              }

              if (this.setJson['ReportCode'] == "EXPENDITURE_OF_CUSTOMER") {
                this.showCustExpTotals = true;
                this.rowData.forEach(obj => {

                  this.custExpTotalAmount += obj['TOTAL_AMOUNT'];
                  this.custExpTotalAmountPaid += obj['PAID_AMOUNT'];
                  this.custExpTotalAmountOut += obj['BALANCE_AMOUNT'];
                  this.custExpTotalDiscount += obj['OVERALL_DISCOUNT'];
                })

                this.custExpTotalAmount = Number(this.custExpTotalAmount).toFixed(2);
                this.custExpTotalAmountPaid = Number(this.custExpTotalAmountPaid).toFixed(2);
                this.custExpTotalAmountOut = Number(this.custExpTotalAmountOut).toFixed(2);
                this.custExpTotalDiscount = Number(this.custExpTotalDiscount).toFixed(2);
              }
              else {
                this.showCustExpTotals = false;
              }


              if (this.setJson['ReportCode'] == "SALES_REGISTER_DETAILS") {

                this.showTotals = true;
                this.rowData.forEach(obj => {
                  if (obj.TYPE == "CARD") {
                    this.totalCard = (this.totalCard + obj['AMOUNT']);
                  }
                  else if (obj.TYPE == "CASH") {
                    this.totalCash = (this.totalCash + obj['AMOUNT']);
                  }
                  else if (obj.TYPE == "CHEQUE") {
                    this.totalCheque = (this.totalCheque + obj['AMOUNT']);
                  }
                  else if (obj.TYPE == "CREDIT") {
                    this.totalCredit = (this.totalCredit + obj['AMOUNT']);
                  }
                  else if (obj.TYPE == "INSURANCE") {
                    this.totalInsurance = (this.totalInsurance + obj['AMOUNT']);
                  }
                  else if (obj.TYPE == "M-PESA") {
                    this.totalMPesa = (this.totalMPesa + obj['AMOUNT']);
                  }
                  else if (obj.TYPE == "UPI") {
                    this.totalUPI = (this.totalUPI + obj['AMOUNT']);
                  }
                  else if (obj.TYPE == "CREDIT NOTE") {
                    this.totalCreditNoteAmt = (this.totalCreditNoteAmt + obj['AMOUNT']);
                  }

                  this.totalVat = (this.totalVat + obj['VAT_AMT']);
                });
                console.log(this.totalCreditNoteAmt)
                this.totalCard = this.totalCard.toFixed(2);
                this.totalCash = this.totalCash.toFixed(2);
                this.totalCheque = this.totalCheque.toFixed(2);
                this.totalCredit = this.totalCredit.toFixed(2);
                this.totalInsurance = this.totalInsurance.toFixed(2);
                this.totalMPesa = this.totalMPesa.toFixed(2);
                this.totalCreditNoteAmt = parseFloat(this.totalCreditNoteAmt).toFixed(2);
                this.totalUPI = this.totalUPI.toFixed(2);
                this.totalVat = this.totalVat.toFixed(2);
                this.totalAmount = (parseFloat(this.totalCard) + parseFloat(this.totalCash) + parseFloat(this.totalCheque) + parseFloat(this.totalCredit) + parseFloat(this.totalInsurance) + parseFloat(this.totalMPesa) + parseFloat(this.totalCreditNoteAmt) + parseFloat(this.totalUPI) - parseFloat(this.totalVat));
                this.grandTotalWithVat = this.totalAmount + parseFloat(this.totalVat);

                this.totalAmount = this.totalAmount.toFixed(2);

                this.grandTotalWithVat = this.grandTotalWithVat.toFixed(2);

              } else {
                this.showTotals = false;
              }

              this.spinnerservice.hide();
              this.toasterService.success('Retreived Successfully', 'Success', {
                timeOut: 3000
              });
            } else {
              this.spinnerservice.hide();
              this.toasterService.error('Please contact administrator', 'Error Occurred', {
                timeOut: 5000
              });
            }
          }

        }, error => {
          this.spinnerservice.hide();
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
        });

        if (this.reportDetails['reportCode'] == "SALES_RECEIPT_DUAL" ||
          this.reportDetails['reportCode'] == "CREDIT_NOTE" ||
          this.reportDetails['reportCode'] == "DEBIT_NOTE" ||
          this.reportDetails['reportCode'] == "PURCHASE_RETURNS" ||
          this.reportDetails['reportCode'] == "SALES_RETURN" ||
          this.reportDetails['reportCode'] == "DELIVERY_NOTE_DUAL" ||
          this.reportDetails['reportCode'] == "ACCOUNT_RECEIVABLES_RECEIPT_DUAL") {
          this.columnDefs.push(
            {
              headerName: "#",
              field: "",
              checkboxSelection: true,
              suppressSizeToFit: true,
              width: 40, cellStyle: { 'border': '1px solid #BDC3C7' }
            })
        } else {

        }

        for (let i of JSON.parse(this.reportDetails['reportHeader'])) {

          this.columnDefs.push({
            headerName: i.displayName,
            field: i.columnName,
            sortable: true,
            filter: true,
            editable: true,
            resizable: true,
            suppressSizeToFit: true,
            width: 90, minWidth: 50,
          })
        }

      }
    }
    else {
      this.spinnerservice.show();
      this.reportService.getReportData(encodeURIComponent(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'] }))).subscribe((res) => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.rowData = res['result'];
            this.spinnerservice.hide();
            this.toasterService.success('Retreived Successfully', 'Success', {
              timeOut: 3000
            });
          } else {
            this.spinnerservice.hide();
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
          }
        }

      }, error => {
        this.spinnerservice.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      });

      for (let i of JSON.parse(this.reportDetails['reportHeader'])) {
        this.columnDefs.push({
          headerName: i.displayName,
          field: i.columnName,
          sortable: true,
          filter: true,
          editable: true,
          resizable: true,
          width: 90, minWidth: 50,
        })
      }
    }

    this.resetFields();
  }
  setThreshHold(event) {

    if (this.reportDetails['reportCode'] == "PURCHASE_PRICE_VALUE_FOR_CURRENT_STOCK") {
      this.setJson['THRESHHOLD_VALUE'] = Number(this.threshHoldValue)
    }
    var encoded = encodeURIComponent(JSON.stringify(this.setJson));
    this.reportURI = encoded;

  }
  //Purchase Invoice Details
  onSupplierPIDKeyEnter(event) {
    let searchTerm = event['target']['value'];

    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getSuppliersPIDBySearch(searchTerm).subscribe((res) => {
        this.supplierDataPID = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  onInvoiceNoPIDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getInvoiceNosPIDBySearch(searchTerm).subscribe((res) => {
        this.invoiceNoDataPID = res['result'];
        this.spinnerservice.hide()
      });
    }
  };
  onInvoiceDtPIDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getInvoiceDtPIDBySearch(searchTerm).subscribe((res) => {
        this.InvoiceDtDataPID = res['result'];
        this.spinnerservice.hide()

      });
    }
  }
  getAllInvoiceNumbersInPID() {
    this.spinnerservice.show()
    this.reportService.getAllInvoiceNumbersPID().subscribe((res) => {
      this.invoiceNumbersDataPID = res['result'];
      this.spinnerservice.hide()
    });
  }
  onInvoiceNumbersPIDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getInvoiceNumbersPIDBySearch(searchTerm).subscribe((res) => {
        this.invoiceNumbersDataPID = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  //Purchase Margin Comparison

  onSupplierPMCKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getSuppliersPMCBySearch(searchTerm).subscribe((res) => {
        this.supplierDataPMC = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  onItemPMCKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getItemsPMCBySearch(searchTerm).subscribe((res) => {
        this.itemDataPMC = res['result'];
        this.spinnerservice.hide()
      });
    }

  }
  //Purchase Invoice Report

  onSupplierPIRKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getSuppliersPIRBySearch(searchTerm).subscribe((res) => {
        this.suppliersPIRData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  onInvoiceDtPIRKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getInvoiceDtPIRBySearch(searchTerm).subscribe((res) => {
        this.invoiceDtPIRData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  //manufacturer wise sales

  onManufacturerMWS(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getManufacturersBySearch(searchTerm).subscribe((res) => {
        this.spinnerservice.hide()
        // this.manufacturerMWS=res['result'];
        this.manufacturerMWS = []
        res['result'].forEach(manufacturer => {

          this.manufacturerMWS.push(manufacturer['name']);
        });
      });
    }
  }

  onItemNameSearchMWS(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getItemNameBySearch(searchTerm).subscribe((res) => {
        // this.itemNameMWS = res['result'];
        this.spinnerservice.hide()
        this.itemNameMWS = []
        res['result'].forEach(itemNM => {

          this.itemNameMWS.push(itemNM['itemName']);
        });
      });
    }
  }

  //supplier wise sales

  onSupplierSearchSWS(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getSupplierBySearch(searchTerm).subscribe((res) => {
        // this.supplierSWS = res['result'];
        this.spinnerservice.hide()
        this.supplierSWS = []
        res['result'].forEach(sup => {

          this.supplierSWS.push(sup['name']);
        });
      });
    }
  }
  onItemNameSearchSWS(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getItemNameBySearch(searchTerm).subscribe((res) => {
        // this.itemNameSWS = res['result'];
        this.spinnerservice.hide()
        this.itemNameSWS = []
        res['result'].forEach(itemNM => {

          this.itemNameSWS.push(itemNM['itemName']);
        });
      });
    }
  }

  //Chart of Accounts
  getAllAccountTypes() {
    this.accountTypeData = []
    this.spinnerservice.show()
    this.reportService.getAllAccountTypes().subscribe(res => {
      this.spinnerservice.hide()
      res['result'].forEach(type => {

        this.accountTypeData.push(type['accountType'])
      });
    })
  }

  //Sales By Product Details
  onCustomerNameSBPDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getCustomersSBPDBySearch(searchTerm).subscribe((res) => {
        this.customerSBPDData = res['result'];
        this.spinnerservice.hide()
      });


    }
  }

  onBillDateSBPDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getBillDatesSBPDBySearch(searchTerm).subscribe((res) => {
        this.billDtDataSBPD = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  //Customer membership report
  getCreditDays() {
    this.spinnerservice.show()
    this.reportService.getAllCreditDays().subscribe(res => {
      this.creditDaysArray = res['result']
      this.spinnerservice.hide()
    })
  }
  getAllMembershipCardNames() {
    this.memCardData = []
    this.spinnerservice.show()
    this.reportService.getAllMemCardNames().subscribe(res => {
      this.memCardData = res['result']
      this.spinnerservice.hide()
    })
  }
  onMembershipCardKeyEnter() {

    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getMemCardNamesBySearch(searchTerm).subscribe((res) => {
        this.memCardData = res['result']
        this.spinnerservice.hide()
      });
    }
  }

  onCustomerAccNoEnter() {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getCustomerAccNoBySearch(searchTerm).subscribe((res) => {
        this.customerAccountNoData = res['result']
        this.spinnerservice.hide()

      });
    }
  }
  getCustomerAccNo() {
    this.spinnerservice.show()
    this.reportService.getAllCustomerAccountNo().subscribe(res => {
      this.customerAccountNoData = res['result']
      this.spinnerservice.hide()
    })
  }
  familyCustomers = []
  onFamilyCustomerNameEnter() {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getFamilyCustomerNameBySearch(searchTerm).subscribe((res) => {

        this.familyCustomers = res['result']
        this.spinnerservice.hide()

      });
    }
  }

  masterCustomers = []
  onMasterCustomerNameEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getMasterCustomerNameBySearch(searchTerm).subscribe((res) => {

        this.masterCustomers = res['result']
        this.spinnerservice.hide()

      });
    }
  }
  //Customer Details Report
  getAllMembershipCardNos() {
    this.memCardData = []
    this.spinnerservice.show()
    this.reportService.getAllMemCardNumbers().subscribe(res => {
      this.memCardNumberData = res['result']
      this.spinnerservice.hide()
    })
  }

  onMembershipCardNoKeyEnter() {

    let searchTerm = event['target']['value'];
    this.reportService.getMemCardNumbersBySearch(searchTerm).subscribe((res) => {
      this.memCardNumberData = res['result']
    });
  }

  getAllCustomerFirstNames() {
    this.spinnerservice.show()
    this.reportService.getAllCustomerNames().subscribe(res => {
      this.customerFirstNamesData = res['result']
      this.spinnerservice.hide()
    })
  }

  onCustomerFirstNameKeyEnter() {

    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getCustomerNamesBySearch(searchTerm).subscribe((res) => {
        this.customerFirstNamesData = res['result']
        this.spinnerservice.hide()
      });
    }
  }

  onCustomerLastNameKeyEnter() {

    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getCustomerLastNamesBySearch(searchTerm).subscribe((res) => {
        this.customerLastNamesData = res['result']
        this.spinnerservice.hide()
      });
    }
  }

  getAllCustomerLastNames() {
    this.spinnerservice.show()
    this.reportService.getAllCustomerLastNames().subscribe(res => {

      this.customerLastNamesData = res['result']
      this.spinnerservice.hide()

    })
  }

  paymentType: any;
  supplierName: any;
  invoiceNo: any;
  itemName: any;
  cstNo: any;
  status: any;
  memCardName: any
  creditDays: any
  manufacturerName: any;
  doctorName: any;
  customerName: any;
  accountNo: any;
  customerLastName: any;
  location: any;
  pharmacy: any
  billCode: any;
  batchNo: any;
  itemCode: any;
  PurNo: any;
  creditNoteNo: any;
  receiptNo: any;
  customer: any;
  servedBy: any;
  debitNumber: any;
  paymentNumber: any;
  salesReturnNo: any;
  grnNo: any;
  paymentStatus: any;
  partyNumber: any;
  accountType: any;
  counterPartyAccountType: any;
  transactionType: any;
  transactionMode: any;
  counterParty: any;
  startDate: Date
  endDate: Date
  setTODate
  setFromDate
  saleFromDate
  saleToDate
  customerDisable: boolean

  periods: any = []
  periodObj: any

  onSelectField(event, columnName, selectedOption) {

    if (selectedOption == undefined)
      selectedOption = event['target']['value'];

    if (this.reportDetails['reportCode'] == "SALES_REGISTER_AREAWISE_DETAILS") {

      this.setJson[columnName] = selectedOption['pharmacyId']
    } else {

      if(columnName){
      this.setJson[columnName] = selectedOption;
      }

    }

    if (this.reportDetails['reportName'] == "SALES RETURN-CREDIT NOTE") {

      //this.setJson['BILL_CODE'] = this.billCode
      this.setJson[columnName] = selectedOption
    }

    if (this.reportDetails['reportCode'] == "UPCOMING_PAYABLES" && columnName == "CREDIT_DAYS") {

      this.periodObj = this.periodsArray.find(period => period['periodName'] == event);
      //this.setJson['BILL_CODE'] = this.billCode
      this.setJson[columnName] = this.periodObj['periodValue']
    }

    if (this.setJson['FROM_DATE'] && !this.period && !this.setJson['TO_DATE']) {
      this.startDate = new Date(this.setJson['FROM_DATE'])
      this.endDate = new Date()
      this.getEndDateFromPeriod(this.startDate, this.endDate)
      this.setTODate = this.setJson['TO_DATE']

    }

    if (this.setJson['TO_DATE'] && !this.period && !this.setJson['FROM_DATE'] && !this.setJson['PHARMACY_ID']) {
      this.startDate = new Date(this.setJson['TO_DATE'])
      this.endDate = new Date();
      this.getStartDateFromPeriod(this.startDate, this.endDate)
      this.setFromDate = this.setJson['FROM_DATE']
    }

    //console.log(this.stockTakeStatus)
    //console.log(this.reportDetails['reportCode'])
  
    if((this.reportDetails['reportCode']==='STOCK_TAKE' || this.reportDetails['reportCode']==='STOCK_TAKE_EXPIRY') && this.stockTakeStatus){
     
      if(this.stockTakeStatus['name']==='EXPIRY STOCK VALUE'){

        this.reportDetails['reportCode']='STOCK_TAKE_EXPIRY'
        
       // console.log(this.reportDetails)
       // console.log(this.reportURI)
      }else{
        this.reportDetails['reportCode']='STOCK_TAKE'
      }
    }
    //For encoding setjson

      //console.log(this.reportDetails)
    this.setJson['ReportCode'] = this.reportDetails['reportCode'];
    var encoded = encodeURIComponent(JSON.stringify(this.setJson));
    this.reportURI = encoded;
    this.disable = false

  }

  onSelectPeriod(event, periodSelected) {

    this.period = periodSelected
    this.disable = false
    if (this.setJson['FROM_DATE'] && this.period && (this.reportDetails['reportCode'] == 'STOCK_ITEMS_UPCOMING_EXPIRY' || this.reportDetails['reportCode'] == 'UPCOMING_PAYABLES')) {
      this.startDate = new Date(this.setJson['FROM_DATE'])

      this.endDate = new Date()
      this.getEndDateFromPeriod(this.startDate, this.endDate)
    }
    // if (this.setJson['FROM_DATE'] && !this.period && !this.setJson['TO_DATE']) {

    //   this.startDate = new Date(this.setJson['FROM_DATE'])
    //   this.endDate = new Date()
    //   this.getEndDateFromPeriod(this.startDate, this.endDate)
    // }
    else if (this.setJson['TO_DATE'] && this.period) {

      this.startDate = new Date()
      this.endDate = new Date(this.setJson['TO_DATE']);
      this.getStartDateFromPeriod(this.startDate, this.endDate)
    } else {

    }
    // if (this.setJson['TO_DATE'] && !this.period && !this.setJson['FROM_DATE']) {
    //   this.startDate = new Date()
    //   this.endDate = new Date(this.setJson['TO_DATE'])
    //   this.getStartDateFromPeriod(this.startDate, this.endDate)
    // }
    if (this.period && !this.setJson['TO_DATE'] && !this.setJson['FROM_DATE']) {

      this.startDate = new Date()
      this.endDate = new Date()
      this.getEndDateFromPeriod(this.startDate, this.endDate)
    }
    if (!this.period && this.setJson['TO_DATE'] && this.setJson['FROM_DATE']) {


    }

  }

  resetFields() {
    this.paymentType = undefined;
    this.supplierName = undefined;
    this.invoiceNo = undefined;
    this.itemName = undefined;
    this.cstNo = undefined;
    this.manufacturerName = undefined;
    this.memCardName = undefined;
    this.status = undefined;
    this.creditDays = undefined;
    this.doctorName = undefined;
    this.customerName = undefined;
    this.customerType = undefined
    this.accountNo = undefined;
    this.customerLastName = undefined;
    this.servedBy = undefined
    this.location = undefined;
    this.billType = undefined
    this.pharmacy = undefined
    this.billCode = undefined;
    this.batchNo = undefined;
    this.itemCode = undefined;
    this.PurNo = undefined;
    this.creditNoteNo = undefined;
    this.receiptNo = undefined;
    this.debitNumber = undefined;
    this.paymentNumber = undefined;
    this.salesReturnNo = undefined;
    this.grnNo = undefined;
    this.paymentStatus = undefined;
    this.partyNumber = undefined;
    this.accountType = undefined;
    this.counterPartyAccountType = undefined;
    this.transactionType = undefined;
    this.transactionMode = undefined;
    this.counterParty = undefined
    this.category = undefined;
    this.mode = undefined;
    this.partyNumber = undefined
    this.stockTakeStatus=""
  }

  //Purchase Invoice Details

  getAllSuppliersInPID() {
    this.spinnerservice.show()
    this.reportService.getAllSuppliersPID().subscribe((res) => {
      this.supplierDataPID = res['result'];
      this.spinnerservice.hide();
    }, error => {
      this.spinnerservice.hide()
    });
  }
  getAllInvoiceNoInPID() {
    this.spinnerservice.show()
    this.reportService.getAllInvoiceNosPID().subscribe((res) => {
      this.invoiceNoDataPID = res['result'];
      this.spinnerservice.hide()
    });
  }
  getAllInvoiceDtInPID() {
    this.spinnerservice.show()
    this.reportService.getAllInvoiceDtPID().subscribe((res) => {
      this.InvoiceDtDataPID = res['result'];
      this.spinnerservice.hide()
    });
  }

  //Purchase Margin Comparison

  getAllItemsInPMC() {
    this.spinnerservice.show()
    this.reportService.getAllItemsPMC().subscribe((res) => {
      this.itemDataPMC = res['result'];
      this.spinnerservice.hide()
    });
  }
  getAllSuppliersInPMC() {
    this.spinnerservice.show()
    this.reportService.getAllSuppliersPMC().subscribe((res) => {
      this.supplierDataPMC = res['result'];
      this.spinnerservice.hide()
    });
  }
  //Product Offer List

  getAllSuppliersInPOL() {
    this.spinnerservice.show()
    this.reportService.getAllSuppliersPOL().subscribe((res) => {
      this.supplierDataPOL = res['result'];
      this.spinnerservice.hide()
    });
  }
  onSupplierPOLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getSuppliersPOLBySearch(searchTerm).subscribe((res) => {
        this.supplierDataPOL = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllManufacturerInPOL() {
    this.spinnerservice.show()
    this.reportService.getAllManufacturersPOL().subscribe((res) => {
      this.manufacturerDataPOL = res['result'];
      this.spinnerservice.hide()
    });
  }
  onManufacturerPOLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getManufacturerPOLBySearch(searchTerm).subscribe((res) => {
        this.manufacturerDataPOL = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllInvoiceDateInPOL() {
    this.spinnerservice.show()
    this.reportService.getAllInvoiceDatesPOL().subscribe((res) => {
      this.invoiceDateDataPOL = res['result'];
      this.spinnerservice.hide()
    });
  }
  onInvoiceDatePOLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getInvoiceDatePOLBySearch(searchTerm).subscribe((res) => {
        this.invoiceDateDataPOL = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  //Sales Cancellation List 

  getAllManufacturerInSCL() {
    this.spinnerservice.show()
    this.reportService.getAllManufacturersSCL().subscribe((res) => {
      this.manufacturerDataSCL = res['result'];
      this.spinnerservice.hide()
    });
  }
  onManufacturerSCLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getManufacturersclBySearch(searchTerm).subscribe((res) => {
        this.manufacturerDataSCL = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllDoctorssInSCL() {
    this.spinnerservice.show()
    this.reportService.getAllDoctorsSCL().subscribe((res) => {
      this.doctorsDataSCL = res['result'];
      this.spinnerservice.hide()
    });
  }
  onDoctorsSCLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getDoctorssclBySearch(searchTerm).subscribe((res) => {
      this.doctorsDataSCL = res['result'];
    });
  }
  getAllBillDatesInSCL() {
    this.spinnerservice.show()
    this.reportService.getAllBillDatesSCL().subscribe((res) => {
      this.billDateDataSCL = res['result'];
      this.spinnerservice.hide()
    });
  }
  onBillDateSCLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getBillDatesclBySearch(searchTerm).subscribe((res) => {
        this.billDateDataSCL = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  //Purchase By Product Details

  getAllManufacturerInPBPD() {
    this.spinnerservice.show()
    this.reportService.getAllManufacturersPBPD().subscribe((res) => {
      this.manufacturerDataPBPD = res['result'];
      this.spinnerservice.hide()
    });
  }
  onManufacturerPBPDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getManufacturersPBPDBySearch(searchTerm).subscribe((res) => {
        this.manufacturerDataPBPD = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  getAllSuppliersInPBPD() {
    this.spinnerservice.show()
    this.reportService.getAllSuppliersPBPD().subscribe((res) => {
      this.supplierDataPBPD = res['result'];
      this.spinnerservice.hide()
    });
  }
  onSupplierPBPDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getSuppliersPBPDBySearch(searchTerm).subscribe((res) => {
        this.supplierDataPBPD = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  //Supplier By Manufacturer List
  onSupplierNameSBMLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getSuppliersSBMLBySearch(searchTerm).subscribe((res) => {
        this.supplierSBMLData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  getAllSupplierNamesSBML() {
    this.spinnerservice.show()
    this.reportService.getAllSuppliersSBML().subscribe((res) => {
      this.supplierSBMLData = res['result'];
      this.spinnerservice.hide()
    });
  }
  //Purchase Invoice Report
  getAllSuppliersInPIR() {
    this.spinnerservice.show()
    this.reportService.getAllSuppliersPIR().subscribe((res) => {
      this.suppliersPIRData = res['result'];
      this.spinnerservice.hide()
    });
  }
  getAllInvoiceDtInPIR() {
    this.spinnerservice.show()
    this.reportService.getAllInvoiceDtPIR().subscribe((res) => {
      this.invoiceDtPIRData = res['result'];
      this.spinnerservice.hide()
    });
  }

  //Sales By Product Details
  getAllCustomerNamesSBPD() {
    this.spinnerservice.show()
    this.reportService.getAllCustomersSBPD().subscribe((res) => {
      this.customerSBPDData = res['result'];
      this.spinnerservice.hide()
    });
  }
  getAllBillDatesSBPD() {
    this.spinnerservice.show()
    this.reportService.getAllBillDatesSBPD().subscribe((res) => {
      this.billDtDataSBPD = res['result'];
      this.spinnerservice.hide()
    });
  }
  //Dummy Bill List
  getAllDoctorssInDBL() {
    this.spinnerservice.show()
    this.reportService.getAllDoctorsDBL().subscribe((res) => {
      this.doctorsDataDBL = res['result'];
      this.spinnerservice.hide()
    });
  }
  onDoctorsDBLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getDoctorsdblBySearch(searchTerm).subscribe((res) => {
        this.doctorsDataDBL = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllManufacturerInDBL() {
    this.spinnerservice.show()
    this.reportService.getAllManufacturersDBL().subscribe((res) => {
      this.manufacturersDataDBL = res['result'];
      this.spinnerservice.hide()
    });
  }
  onManufacturerDBLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getManufacturerdblBySearch(searchTerm).subscribe((res) => {
        this.manufacturersDataDBL = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  //Sales Register Details 
  getAllTypeInSRD() {
    this.typesDataSRD = []
    this.spinnerservice.show()
    this.reportService.getAllTypesSRD().subscribe((res) => {
      this.typesDataSRD = res['result'];
      this.spinnerservice.hide()
      this.typesDataSRD.push("CREDIT NOTE")
    });

  }
  ontypeSRDKeyEnter(event) {
    this.typesDataSRD = []
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getTypesrdBySearch(searchTerm).subscribe((res) => {
        this.typesDataSRD = res['result'];
        this.typesDataSRD.push("CREDIT NOTE")

        this.spinnerservice.hide()
      });
    }
  }
  //Sales Register AreaWise Details
  getAllLocationInSRAD() {
    this.spinnerservice.show()
    this.reportService.getAllLocationsSRAD().subscribe((res) => {
      this.locationDataSRAD = res['result'];
      this.spinnerservice.hide()
    });

  }
  onlocationSRADKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getLocationsradBySearch(searchTerm).subscribe((res) => {
        this.locationDataSRAD = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  getAllPharmaciesInSRAD() {
    this.spinnerservice.show()
    this.reportService.getAllPharmaciesSRAD().subscribe((res) => {
      // res['result'].forEach(pharmacy => {
      //   this.pharmacyDataSRAD=[]
      //   this.pharmacyDataSRAD.push(pharmacy['pharmacyName']);
      // });
      this.pharmacyDataSRAD = res['result'];
      this.spinnerservice.hide()
    });
  }

  //Sales By Product Summary

  getAllItemNamesInSPS() {
    this.spinnerservice.show()
    this.reportService.getAllitemsSPS().subscribe((res) => {
      this.itemNamesDataSPS = res['result'];
      this.spinnerservice.hide()
    });
  }
  onItemNameSPSKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      
      this.spinnerservice.show()
      this.reportService.getItemNamespsBySearch(searchTerm).subscribe((res) => {
        this.itemNamesDataSPS = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllCustomerInSPS() {
    this.spinnerservice.show()
    this.reportService.getAllcustomersSPS().subscribe((res) => {
      this.customerDataSPS = res['result'];
      this.spinnerservice.hide()
    });
  }
  onCustomerSPSKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getcustomerSPSBySearch(searchTerm).subscribe((res) => {
        this.customerDataSPS = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  //Sales Report By Bill Id
  getAllBillCodeInSRBB() {
    this.spinnerservice.show()
    if (!this.customerName && !this.saleToDate && !this.saleFromDate) {
      this.reportService.getAllBillCodesSRBB().subscribe((res) => {
        this.billCodeDataSRBB = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  onBillCodeSRBBKeyEnter(event) {
    //  if (!this.customerName && !this.saleToDate && !this.saleFromDate) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getBillCodesrbbBySearch(searchTerm).subscribe((res) => {
        this.billCodeDataSRBB = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  // SALES_TILL_BALANCE
  tillCustomers
  tillAccounts
  getAllTillCustomers() {
    this.spinnerservice.show()
    this.reportService.getAllTillcustomers().subscribe((res) => {
      this.tillCustomers = res['result'];
      this.spinnerservice.hide()
    });
  }

  onTillCustomerKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getTillCustomersBySearch(searchTerm).subscribe((res) => {
        this.tillCustomers = res['result'];
        this.spinnerservice.hide()

      });
    }
  }

  getAllTillAccounts() {
    this.spinnerservice.show()
    this.reportService.getAllTillAccounts().subscribe((res) => {
      this.tillAccounts = res['result'];
      this.spinnerservice.hide()
    });
  }

  onTillAccountKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getTillAccountsBySearch(searchTerm).subscribe((res) => {
        this.tillAccounts = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  onCustomerSRBBKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getCustomersBySearchSRBB(searchTerm).subscribe((res) => {
        this.customerDataSRBB = res['result'];
        this.spinnerservice.hide()

      });
    }
  }

  getAllCustomersInSRBB() {
    this.spinnerservice.show()
    this.reportService.getAllCustomersSRBB().subscribe((res) => {
      this.customerDataSRBB = res['result'];
      this.spinnerservice.hide()

    });
  }
  getAllSalesPersonInSRBB() {
    this.salesPersonDataSRBB = []
    this.spinnerservice.show()
    this.reportService.getAllSalesPersonSRBB().subscribe((res) => {
      res['result'].forEach(person => {
        this.salesPersonDataSRBB.push(person['empName'])
      });
      this.spinnerservice.hide()
    });
  }


  onBillCodeClear() {
    this.customerDataSRBB = []
    this.customerName = undefined
    this.disable = true
  }
  //Sales Returns

  onCustomerNameSRCNKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getCustomerBySearch(searchTerm).subscribe((res) => {
        this.spinnerservice.hide()
        this.customerSRCNData = []
        res['result'].forEach(sup => {

          this.customerSRCNData.push(sup['customerName']);
        });
      });
    }
  }
  // sales return credit note
  selectedEmpCode;
  getAllSalesPersonInSRCN(event) {
    this.salesPersonDataSRCN = []
    this.reportService.getAllSalesPersonSRBB().subscribe((res) => {

      res['result'].forEach(person => {
        this.salesPersonDataSRCN.push(person['empName'])
      });
    });
  }

  gettingCodesByEmp: any = [];
  gettingCodesByCust: any = [];

  getBillCodes() {
    //this.billCodeDataSRBB = [];
    this.billCodeDataSRBB = this.gettingCodesByEmp;

  }

  onSelectEmp(event) {

    this.reportService.getLastSRIByEmp(event).subscribe(res => {

      this.gettingCodesByEmp = res

    })
  }

  onSelectCust(event) {

    this.reportService.getLastSRIByCust(event).subscribe(res => {

      this.gettingCodesByCust = res;

    })
  }

  onClear() {
    let decodeReportURI = JSON.parse(decodeURI(this.reportURI))
    delete decodeReportURI['BILL_CODE']
    this.reportURI = encodeURIComponent(JSON.stringify(decodeReportURI));
    this.billCode = undefined;
    this.disable = false;


  }



  //Purchase Returns

  getAllSalesPersonInPRCN() {
    this.salesPersonDataPRCN = []
    this.spinnerservice.show()
    this.reportService.getAllSalesPersonSRBB().subscribe((res) => {
      res['result'].forEach(person => {
        this.salesPersonDataPRCN.push(person['empName'])
      });
      this.spinnerservice.hide()
    });
  }
  getAllGRNNOInPR() {
    this.spinnerservice.show()
    this.reportService.getAllGRNNosPR().subscribe((res) => {
      this.grnNoDataPR = res['result'];
      this.spinnerservice.hide()
    });
  }
  onGRNNoPRKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getGRNNosPRBySearch(searchTerm).subscribe((res) => {
        this.grnNoDataPR = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllSuppliersInPR() {
    this.spinnerservice.show()
    this.reportService.getAllSuppliersPR().subscribe((res) => {
      this.suppliersDataPR = res['result'];
      this.spinnerservice.hide()
    });
  }
  onSupplierPRKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getSuppliersPRBySearch(searchTerm).subscribe((res) => {
        this.suppliersDataPR = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllInvoiceNoInPR() {
    this.spinnerservice.show()
    this.reportService.getAllInvoiceNoPR().subscribe((res) => {
      this.invoiceNoDataPR = res['result'];
      this.spinnerservice.hide()
    });
  }
  onInvoiceNoPRKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getInvoiceNoPRBySearch(searchTerm).subscribe((res) => {
        this.invoiceNoDataPR = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  //Sales Return
  onBillCodeSRETURNKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getBillCodesrbbBySearch(searchTerm).subscribe((res) => {
        this.billCodeDataSRETURN = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllBillCodeInSRETURN() {
    this.spinnerservice.show()
    this.reportService.getAllBillCodesSRBB().subscribe((res) => {
      this.billCodeDataSRETURN = res['result'];
      this.spinnerservice.hide()
    });
  }

  onSRETURNNoKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getSrNosrBySearch(searchTerm).subscribe((res) => {
        this.salesReurnNosDataSRETURN = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllsalesReturnNosInSRETURN() {
    this.spinnerservice.show()
    this.reportService.getAllRNosSR().subscribe((res) => {
      this.salesReurnNosDataSRETURN = res['result'];
      this.spinnerservice.hide()
    });
  }

  //Purchase Order Details By Purchase Order No
  getAllPurNoInPDPO() {
    this.spinnerservice.show()
    this.reportService.getAllPurNoPDPO().subscribe((res) => {
      this.PurOrdNoDataPDPO = res['result'];
      this.spinnerservice.hide()
    });
  }
  onPurNOKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getPurNoPDPOBySearch(searchTerm).subscribe((res) => {
        this.PurOrdNoDataPDPO = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  onSupplierNamePODPOKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getSuppliersPDPOBySearch(searchTerm).subscribe((res) => {
        this.suppliersPODPOData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllSuppliersPODPO() {
    this.spinnerservice.show()
    this.reportService.getAllSupplersPDPO().subscribe((res) => {
      this.suppliersPODPOData = res['result'];
      this.spinnerservice.hide()
    });
  }


  //upcoming payables
  accPayInvoiceData: any[] = [];
  onApInvoiceKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getAPInvoiceBySearch(searchTerm).subscribe((res) => {
        this.accPayInvoiceData = res['result'];
        this.spinnerservice.hide()

      });
    }
  }
  //Debit Note

  onDebitNoKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getDebitNosBySearch(searchTerm).subscribe((res) => {
        this.debiitNosData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllDebitNos() {
    this.spinnerservice.show()
    this.reportService.getDebitNos().subscribe((res) => {
      this.debiitNosData = res['result'];
      this.spinnerservice.hide()
    });
  }
  onDebitNoteSupplierKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getDebitNoteSuppBySearch(searchTerm).subscribe((res) => {
        this.debitNoteSuppliersData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllDebitNoteSuppliers() {
    this.spinnerservice.show()
    this.reportService.getDebitNoteSuppliers().subscribe((res) => {
      this.debitNoteSuppliersData = res['result'];
      this.spinnerservice.hide()
    });
  }

  getAllDebitNoteReturnType() {
    this.spinnerservice.show()
    this.reportService.getDebitNoteReturnTypes().subscribe((res) => {
      this.debitNoteReturnTypeData = res['result'];
      this.spinnerservice.hide()
    });
  }
  onDebitNoteInvoiceKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getDebitNoteInvoiceBySearch(searchTerm).subscribe((res) => {
        this.debitNoteInvoiceData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  getAllDebitNoteInvoiceNo() {
    this.spinnerservice.show()
    this.reportService.getDebitNoteInvoices().subscribe((res) => {
      this.debitNoteInvoiceData = res['result'];
      this.spinnerservice.hide()
    });
  }

  //Quotation Details

  quotationNo
  supplier
  quotationStatus
  quotationNoData: any[] = []
  quotationStatusData: any[] = []

  getAllQtnNo() {
    this.spinnerservice.show()
    this.reportService.getAllQtnNo().subscribe((res) => {
      this.quotationNoData = res['result'];
      this.spinnerservice.hide()
    });
  }

  onQtnNoKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getQtnNoBySearch(searchTerm).subscribe((res) => {
        this.quotationNoData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  onQtnSupplierKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getSuppliersInQtnBySearch(searchTerm).subscribe((res) => {
        this.suppliersAPData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  getAllQuotationStatus() {
    this.quotationStatusData = []

    this.spinnerservice.show()
    this.reportService.getAllQtnStatus().subscribe((res) => {
      res['result'].forEach(qtnStatus => {
        this.quotationStatusData.push(qtnStatus['status'])
      });
      this.spinnerservice.hide()
    });
  }
  //Account payables

  onPaymentNoKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getPaymentNosBySearch(searchTerm).subscribe((res) => {
      this.paymentNosDataAP = res['result'];
    });
  }

  getAllPaymentNosAP() {
    this.spinnerservice.show()
    this.reportService.getPaymentNos().subscribe((res) => {
      this.paymentNosDataAP = res['result'];
    });
  }

  onSupplierNameAPKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getSupplierNamesBySearchInAP(searchTerm).subscribe((res) => {
      this.suppliersAPData = res['result'];
    });
  }
  getAllSupplierNamesAP() {
    this.spinnerservice.show()
    this.reportService.getSupplierNamesInAP().subscribe((res) => {
      this.suppliersAPData = res['result'];
      this.spinnerservice.hide()
    });
  }
  // onPaymentStatusAPKeyEnter(event){
  //   let searchTerm = event['target']['value'];
  //   this.reportService.getSupplierNamesBySearchInAP(searchTerm).subscribe((res) => {
  //     this.paymentStatusAPData = res['result'];
  //   });
  // }
  // getAllPaymentStatusAP(){
  //   this.reportService.getSupplierNamesInAP().subscribe((res) => {
  //     this.paymentStatusAPData = res['result'];
  //   });
  // }


  //Credit Note
  getAllCreditNoteNoCN() {
    this.spinnerservice.show()
    this.reportService.getAllCreditNoteNoCN().subscribe((res) => {
      this.CreditNoteNoDataCN = res['result'];
      this.spinnerservice.hide()
    });
  }

  getAllCNByBillTypes(event) {

    this.CreditNoteNoDataCN = []
    this.reportService.getCNByBillTypes(event).subscribe(billTypes => {

      this.CreditNoteNoDataCN = billTypes['result']
    });
  }

  getBillTypes() {
    this.spinnerservice.show()
    this.reportService.getBillTypes().subscribe(billTypes => {
      this.ListAllCNByBillTypes = billTypes
      this.spinnerservice.hide()
    });
  }

  listOfPaymentStatus
  getAllPaymentStatus() {
    this.spinnerservice.show()
    this.reportService.getAllCreditNotePaymentStatus().subscribe(res => {
      this.listOfPaymentStatus = res['result']
      this.spinnerservice.hide()
    });
  }

  getAllDebitNotePaymentStatus() {
    this.spinnerservice.show()
    this.reportService.getAllDebitNotePaymentStatus().subscribe(res => {
      this.listOfPaymentStatus = res['result']
      this.spinnerservice.hide()
    });
  }


  onCreditNoteNoKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getCreditNoteNoCNBySearch(searchTerm).subscribe((res) => {
        this.CreditNoteNoDataCN = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  onCreditNoteCustomerKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getCreditNoteCustomerBySearch(searchTerm).subscribe((res) => {
        this.creditNoteCustomersData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllCreditNoteCustomers() {
    this.spinnerservice.show()
    this.reportService.getCreditNoteCustomers().subscribe((res) => {
      this.creditNoteCustomersData = res['result']
      this.spinnerservice.hide()
    })
  }

  //Master Account history

  gettingCodesByCreditNo: any = [];

  onSelectCreditNo() {
    this.spinnerservice.show()
    this.reportService.getCreditNoForMAH().subscribe(res => {
      this.gettingCodesByCreditNo = res['result']
      this.spinnerservice.hide()

    })
  }


  //Account Receivables
  getAllReceiptNoAR() {
    this.spinnerservice.show()
    this.reportService.getAllReceiptNoAR().subscribe((res) => {
      this.ReceiptNoDataAR = res['result'];
      this.spinnerservice.hide()
    });
  }
  onReceiptNoKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getReceiptNoARBySearch(searchTerm).subscribe((res) => {
        this.ReceiptNoDataAR = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  onCustomerNameARKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getCustomerNamesARBySearch(searchTerm).subscribe((res) => {
        this.customersARData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllCustomerNamesAR() {
    this.spinnerservice.show()
    this.reportService.getAllCustomerNamesAR().subscribe((res) => {
      this.customersARData = res['result'];
      this.spinnerservice.hide()
    });
  }
  //Purchase Details By Batch No
  onBatchNoPDBNKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getbatchNoPDBNBySearch(searchTerm).subscribe((res) => {
        this.batchNoPDBNData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  getAllBatchNoPDBN() {
    this.spinnerservice.show()
    this.reportService.getAllBatchNoPDBN().subscribe((res) => {
      this.batchNoPDBNData = res['result'];
      this.spinnerservice.hide()
    });
  }
  onSupplierNamePDBNKeyEnter() {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getsuppliersPDBNBySearch(searchTerm).subscribe((res) => {
        this.suppliersPDBNData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllSuppliersPDBN() {
    this.spinnerservice.show()
    this.reportService.getAllsuppliersPDBN().subscribe((res) => {
      this.suppliersPDBNData = res['result'];
      this.spinnerservice.hide()
    });
  }

  //Supplier vat report
  onCstNoKeyEnter() {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getCstNoBySearch(searchTerm).subscribe((res) => {
        this.cstNoData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  getAllCstNo() {
    this.spinnerservice.show()
    this.reportService.getAllCstNo().subscribe((res) => {
      this.cstNoData = res['result'];
      this.spinnerservice.hide()
    });
  }
  //Purchase Details By Product Name

  onItemNamePDPNKeyEnter() {
    let searchTerm = event['target']['value'];
    this.reportService.getItemsPDPNBySearch(searchTerm).subscribe((res) => {
      this.itemsPDPNData = res['result'];
    });
  }
  getAllSuppliersPDPN() {
    this.spinnerservice.show()
    this.reportService.getAllItemsPDPN().subscribe((res) => {
      this.itemsPDPNData = res['result'];
      this.spinnerservice.hide()
    });
  }
  //Purchase Register List
  onSupplierNamePRLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getSuppliersPRLBySearch(searchTerm).subscribe((res) => {
        this.suppliersPRLData = res['result'];
        this.spinnerservice.hide()

      });
    }
  }
  getAllSuppliersPRL() {
    this.spinnerservice.show()
    this.reportService.getAllSuppliersPRL().subscribe((res) => {
      this.suppliersPRLData = res['result'];
      this.spinnerservice.hide()
    });
  }
  onPayTypePRLKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getPayTypePRLBySearch(searchTerm).subscribe((res) => {
        this.paymentTypesPRLData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllPayTypesPRL() {
    this.spinnerservice.show()
    this.reportService.getAllPayTypesPRL().subscribe((res) => {
      this.paymentTypesPRLData = res['result'];
      this.spinnerservice.hide()
    });
  }

  //Slow Moving Product Details
  getAllItemNamesSMPD() {
    this.spinnerservice.show()
    this.reportService.getAllItemNamesSMPD().subscribe((res) => {
      this.itemsDataSMPD = res['result'];
      this.spinnerservice.hide()
    });
  }
  onItemNameSMPDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getItemNameSMPDBySearch(searchTerm).subscribe((res) => {
        this.itemsDataSMPD = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllItemCodesSMPD() {
    this.spinnerservice.show()
    this.reportService.getItemCodesSMPD().subscribe((res) => {
      this.itemsCodesDataSMPD = res['result'];
      this.spinnerservice.hide()
    });
  }
  onItemCodeSMPDKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getItemCodesSMPDBySearch(searchTerm).subscribe((res) => {
        this.itemsCodesDataSMPD = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  // Bank Transactions
  onPartyDetailsKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getPartyAccountBySearch(searchTerm).subscribe((res) => {
        this.partyAccountData = res['result'];
        this.spinnerservice.hide()
      });
    }
  }

  getAllPartyAccountDetails() {
    this.spinnerservice.show()
    this.reportService.getAllPartyAccountDetails().subscribe((res) => {
      this.partyAccountData = res['result'];
      this.spinnerservice.hide()
    });
  }

  onCounterPartyDetailsKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getCounterPartyAccountBySearch(searchTerm).subscribe((res) => {
      this.counterPartyAccountData = res['result'];
    });
  }
  getAllCounterPartyAccountDetails() {
    this.spinnerservice.show()
    this.reportService.getAllCounterPartyDetails().subscribe((res) => {
      this.counterPartyAccountData = res['result'];
      this.spinnerservice.hide()
    });
  }

  transactionRefNoData
  transactionRefNo
  onTransactionRefNoKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getTransactionRefNoBySearch(searchTerm).subscribe((res) => {
      this.transactionRefNoData = res['result'];
    });
  }

  getAllTransactionRefNoDetails() {
    this.spinnerservice.show()
    this.reportService.getAllTransactionRefno().subscribe((res) => {
      this.transactionRefNoData = res['result'];
      this.spinnerservice.hide()
    });
  }

  transactionRefNoDataWithExpNo
  //Transaction history report by account type

  onTransactionRefNoKeyEnterWithExpNo(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getTransactionRefNoBySearchWithExpNo(searchTerm).subscribe((res) => {
      this.transactionRefNoDataWithExpNo = res['result'];
    });
  }

  getAllTransactionRefNoDetailsWithExpNo() {
    this.spinnerservice.show()
    this.reportService.getAllTransactionRefNoWithExpNo().subscribe((res) => {
      this.transactionRefNoData = res['result'];
      this.spinnerservice.hide()
    });
  }

  onCoaDetailsKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getCOAAccountBySearch(searchTerm).subscribe((res) => {
      this.partyAccountData = res['result'];
    });
  }

  getAllCoaAccountDetails() {
    this.spinnerservice.show()
    this.reportService.getAllCOAAccountDetails().subscribe((res) => {
      this.partyAccountData = res['result'];
      this.spinnerservice.hide()
    });
  }
  //Petty Cash Report

  onPettyPartyDetailsKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getPettyPartyAccountBySearch(searchTerm).subscribe((res) => {
      this.partyAccountData = res['result'];
    });
  }
  getAllPartyPartyAccountDetails() {
    this.spinnerservice.show()
    this.reportService.getAllPettyPartyDetails().subscribe((res) => {
      this.partyAccountData = res['result'];
      this.spinnerservice.hide()
    });
  }
  getAllPettyCounterPartyAccountDetails() {
    this.spinnerservice.show()
    this.reportService.getAllPettyCounterPartyAccountDetails().subscribe((res) => {
      this.counterPartyAccountData = res['result'];
      this.spinnerservice.hide()
    });
  }
  onPettyCounterPartyDetailsKeyEnter(event) {
    let searchTerm = event['target']['value'];
    this.reportService.getPettyCounterPartyAccountBySearch(searchTerm).subscribe((res) => {
      this.counterPartyAccountData = res['result'];
    });
  }

  //EXPENSES REPORT
  onPartyNameKeyEnter(event) {
    this.reportService.getAccountPartiesBySearch(event['target']['value']).subscribe(res => {
      this.accountPartiesData = res['result']
    })
  }

  getAllParties() {
    this.spinnerservice.show()
    this.reportService.getAllAccountParties().subscribe((res) => {
      this.accountPartiesData = res['result'];
      this.spinnerservice.hide()
    });
  }

  onExpenseCounterPartyKeyEnter(event) {
    this.reportService.getCounterPartiesBySearch(event['target']['value']).subscribe(res => {
      this.expenseCounterPartyData = res['result']
    })
  }

  getAllExpenseCounterParty() {
    this.spinnerservice.show()
    this.reportService.getAllCounterParties().subscribe((res) => {
      this.expenseCounterPartyData = res['result'];
      this.spinnerservice.hide()
    });
  }


  //stock take

  onInvoiceNumbersSTKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getInvoiceNoBySearchST(searchTerm).subscribe((res) => {
        this.invoiceNumbersDataST = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllInvoiceNumbersInST() {
    this.spinnerservice.show()
    this.reportService.getAllInvocieNosST().subscribe((res) => {
      this.invoiceNumbersDataST = res['result'];
      this.spinnerservice.hide()
    });
  }
  onItemSTKeyEnter(event) {
    let searchTerm = event['target']['value'];
    if (searchTerm) {
      this.spinnerservice.show()

      this.reportService.getItemNameBySearchST(searchTerm).subscribe((res) => {
        this.itemDataST = res['result'];
        this.spinnerservice.hide()
      });
    }
  }
  getAllItemsInST() {
    this.spinnerservice.show()
    this.reportService.getAllTransactionModes().subscribe((res) => {
      this.transactionTypeData = res['result'];
      this.spinnerservice.hide()
    });
  }

  getAllTransactionModeDetails() {
    this.transactionModeData = []
    this.spinnerservice.show()
    this.reportService.getModesOnCredit().subscribe((res) => {
      this.spinnerservice.hide()
      res['result'].forEach(mode => {
        this.transactionModeData.push(mode['name'])
      });
      this.spinnerservice.show()
      this.reportService.getModesOnDebit().subscribe((res) => {
        this.spinnerservice.hide()
        res['result'].forEach(mode => {
          this.transactionModeData.push(mode['name'])
        });
      })
    });

  }

  //expenses
  getExpensesModes() {
    this.spinnerservice.show()
    this.reportService.getAllModes().subscribe(res => {
      this.modes = []
      res['result'].forEach(mode => {
        this.modes.push(mode['name'])
      });
      this.spinnerservice.hide()
    })
  }


  loadReport(reportId) {
    this.resetFields();
    this.reportCode = reportId;
    this.display = true;
    this.display_grid = false;
    this.display_form = true;
    this.show_report_tabs = false;
    this.reportDetails = this.reportData.find(report => report['reportId'] == reportId);

    this.callingPeriods(this.reportDetails['reportCode']);

    if (this.reportDetails['reportCode'] == 'STOCK_ITEMS_UPCOMING_EXPIRY' || this.reportDetails['reportCode'] == 'UPCOMING_PAYABLES') {
      this.setFromDate = new Date();
      this.setFromDate = this.datePipe.transform(this.setFromDate, 'yyyy-MM-dd');

      this.setJson['FROM_DATE'] = this.setFromDate;
    }
    else if (this.reportDetails['reportCode'] == 'SLOW_MOVING_ITEMS' || this.reportDetails['reportCode'] == 'OVER_STOCK_REORDER_LEVEL' || this.reportDetails['reportCode'] == 'SALES_REGISTER_AREAWISE_DETAILS' || this.reportDetails['reportCode'] == 'FAST_MOVING_PRODUCT_DETAILS') {
      this.setTODate = new Date();
      this.setTODate = this.datePipe.transform(this.setTODate, 'yyyy-MM-dd');

      this.setJson['TO_DATE'] = this.setTODate;
    }

    //getting periods
    /*  if (this.reportDetails['reportCode'] == 'UPCOMING_EXPIRIES') {
      this.reportService.getAllPeriods().subscribe(res => {
        res['result'].forEach(period => {
          this.periods.push(period['periodName'])
        });
      })
    }
    else {
      this.reportService.getLimitedPeriods().subscribe(res => {
        res['result'].forEach(period => {
          this.periods.push(period['periodName'])
        });
      })
  
    }  */

    if (this.reportDetails['reportCode'] == "CHART_OF_ACCOUNTS" || this.reportDetails['reportCode'] == "EXPENSES" ||
      this.reportDetails['reportCode'] == "TILL_BALANCE" || this.reportDetails['reportCode'] == "BANK_TRANSACTIONS"
      || this.reportDetails['reportCode'] == "CUSTOMER_MEMBERSHIP" || this.reportDetails['reportCode'] == "CUSTOMER_DETAILS") {
      this.disable = false;
    }
    if (this.reportDetails['inputParameters'] != '' && this.reportDetails['inputParameters'] != null && this.reportDetails['inputParameters'] != undefined) {
      this.inputParameter = JSON.parse(this.reportDetails['inputParameters']);
      if (this.inputParameter.length == 0) {
        this.display_form = false;
        this.display_grid = true;
      }
    }
    else {
      this.disable = false;
    }
  }

  onPeriodClear() {
    this.setFromDate = ''
    this.setTODate = ''
  }

  close() {
    this.reportGroups = [];
    this.showMasterReports();
    this.singleReportData = [];
    this.inputParameter = 0;
    this.display = false;
    this.disable = true;
    this.display_grid = false;
    this.display_form = false;
    this.show_report_tabs = true;
    this.columnDefs = [];
    this.reportURI = "";
    this.setJson = {};
    this.setTODate = ''
    this.setFromDate = ''
    this.customerNames = undefined
    this.billCodes = undefined
    this.period = undefined
    this.periods = []
    this.saleToDate = undefined
    this.saleFromDate = undefined
    this.billCodeDataSRBB = []
    this.customerDisable = false
    this.threshHoldValue = undefined
    this.customerFamily = undefined
    this.customerAccNo = undefined
    this.customer = undefined
    this.masterCustomers = []
    this.familyCustomers = []
    this.totalPurchaseValueAmount = 0.00
    this.quotationNo = undefined
    this.quotationStatus = undefined
    this.quotationNoData = []
    this.suppliersAPData = []
    this.supplier = undefined
    this.customerType = undefined

  }
  close_grid() {
    this.rowData = [];
    this.familyCustomers = []
    this.masterCustomers = []
    this.display = true;
    this.disable = true;
    this.display_grid = false;
    this.display_form = true;
    this.columnDefs = [];
    this.reportURI = "";
    this.setJson = {};
    this.showTotals = false;
    this.totalCard = 0;
    this.totalCash = 0;
    this.totalCheque = 0;
    this.totalInsurance = 0;
    this.totalCredit = 0;
    this.totalMPesa = 0;
    this.totalUPI = 0;
    this.totalCreditNoteAmt = 0;
    this.custExpTotalAmount = 0;
    this.custExpTotalAmountPaid = 0;
    this.custExpTotalAmountOut = 0;
    this.custExpTotalDiscount = 0;
    this.totalAmount = 0;
    this.totalVat = 0;
    this.setFromDate = ''
    this.setTODate = ''
    this.customerNames = undefined
    this.billCodes = undefined
    this.period = undefined;
    this.periods = [];
    this.billCodeDataSRBB = [];
    this.saleFromDate = undefined
    this.saleToDate = undefined
    this.customerDisable = false
    this.threshHoldValue = undefined
    this.customerFamily = undefined
    this.customerAccNo = undefined
    this.customer = undefined
    this.totalPurchaseValueAmount = 0.00
    this.quotationNo = undefined
    this.quotationStatus = undefined
    this.quotationNoData = []
    this.suppliersAPData = []
    this.supplier = undefined
    this.accountTypeData = []
    this.transactionRefNo = undefined
    this.customerType = undefined
    this.stockTakeStatus=""

    this.callingPeriods(this.reportDetails['reportCode']);
    if (this.reportDetails['reportCode'] == 'STOCK_ITEMS_UPCOMING_EXPIRY' || this.reportDetails['reportCode'] == 'UPCOMING_PAYABLES') {
      this.setFromDate = new Date();
      this.setFromDate = this.datePipe.transform(this.setFromDate, 'yyyy-MM-dd');

      this.setJson['FROM_DATE'] = this.setFromDate;
    }
    else if (this.reportDetails['reportCode'] == 'SLOW_MOVING_ITEMS' || this.reportDetails['reportCode'] == 'OVER_STOCK_REORDER_LEVEL' || this.reportDetails['reportCode'] == 'SALES_REGISTER_AREAWISE_DETAILS' || this.reportDetails['reportCode'] == 'FAST_MOVING_PRODUCT_DETAILS') {
      this.setTODate = new Date();
      this.setTODate = this.datePipe.transform(this.setTODate, 'yyyy-MM-dd');

      this.setJson['TO_DATE'] = this.setTODate;
    } else {

    }

    if (this.reportDetails['inputParameters'] == "" ||
      this.reportDetails['reportCode'] == "CHART_OF_ACCOUNTS" ||
      this.reportDetails['reportCode'] == "EXPENSES" ||
      this.reportDetails['reportCode'] == "TILL_BALANCE" ||
      this.reportDetails['reportCode'] == "BANK_TRANSACTIONS" ||
      this.reportDetails['reportCode'] == "CUSTOMER_MEMBERSHIP" ||
      this.reportDetails['reportCode'] == "CUSTOMER_DETAILS") {
      this.disable = false;
    }

    

  }
  downloadPdf() {

    if (this.reportDetails['reportCode'] == "SALES_RECEIPT_DUAL") {
      this.reportURI = undefined
      let saleJson = {
        "ReportCode": "SALES_RECEIPT",
        "BILL_CODE": this.reportsGridOptions.api.getSelectedRows()[0]['BILL_CODE']
      }
      this.reportURI = encodeURIComponent(JSON.stringify(saleJson));
    }
    else if (this.reportDetails['reportCode'] == "DELIVERY_NOTE_DUAL") {
      this.reportURI = undefined
      let saleJson = {
        "ReportCode": "DELIVERY_NOTE",
        "BILL_CODE": this.reportsGridOptions.api.getSelectedRows()[0]['BILL_CODE']
      }
      this.reportURI = encodeURIComponent(JSON.stringify(saleJson));
    }
    else if (this.reportDetails['reportCode'] == "CREDIT_NOTE") {
      this.reportURI = undefined
      let creditNoteJson = {
        "ReportCode": "CREDIT_NOTE",
        "credit_note_no": this.reportsGridOptions.api.getSelectedRows()[0]['credit_note_no']
      }
      this.reportURI = encodeURIComponent(JSON.stringify(creditNoteJson));
    } else if (this.reportDetails['reportCode'] == "PURCHASE_RETURNS") {
      this.reportURI = undefined
      let pReturnJson = {
        "ReportCode": "PURCHASE_RETURNS",
        "GRN_NO": this.reportsGridOptions.api.getSelectedRows()[0]['GRN_NO']
      }
      this.reportURI = encodeURIComponent(JSON.stringify(pReturnJson));
    }

    else if (this.reportDetails['reportCode'] == "ACCOUNT_RECEIVABLES_RECEIPT_DUAL") {
      this.reportURI = undefined
      let pReturnJson = {
        "ReportCode": "ACCOUNT_RECEIVABLES_RECEIPT",
        "UNIQUE_RECEIPT_NO": this.reportsGridOptions.api.getSelectedRows()[0]['UNIQUE_RECEIPT_NO']
      }
      this.reportURI = encodeURIComponent(JSON.stringify(pReturnJson));
    }
    else if (this.reportDetails['reportCode'] == "SALES_RETURN") {
      this.reportURI = undefined
      let pReturnJson = {
        "ReportCode": "SALES_RETURN",
        "SALES_RETURN_NO": this.reportsGridOptions.api.getSelectedRows()[0]['SALES_RETURN_NO']
      }
      this.reportURI = encodeURIComponent(JSON.stringify(pReturnJson));
    }
    else if (this.reportDetails['reportCode'] == "DEBIT_NOTE") {

      this.reportURI = undefined
      let debitNoteJson = {
        "ReportCode": "DEBIT_NOTE",
        "debit_note_no": this.reportsGridOptions.api.getSelectedRows()[0]['debit_note_no']
      }

      this.reportURI = encodeURIComponent(JSON.stringify(debitNoteJson));
    } else {
      if (this.reportDetails['inputParameters'] != "" && this.reportURI != undefined) {
        if (!this.reportURI) {

          if (this.reportDetails['reportCode'] == "CHART_OF_ACCOUNTS") {
            this.reportURI = encodeURIComponent(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'] }))

          } else if (this.reportDetails['reportCode'] == "BANK_TRANSACTIONS") {
            this.reportURI = encodeURIComponent(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'], "FROM_TRANSACTION_DATE": this.datePipe.transform(new Date(), 'yyyy-MM-dd') }))
          }
          else {

            this.reportURI = encodeURIComponent(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'], "FROM_AS_OF_DATE": this.datePipe.transform(new Date(), 'yyyy-MM-dd') }))
          }

        }
        else {
          this.reportURI = this.reportURI;
        }

      }

      else {

        this.reportURI = encodeURIComponent(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'] }));

      }
    }

    this.spinnerservice.show();
    this.reportService.downloadPdfFile(this.reportURI).subscribe((data: any) => {
      this.blob = new Blob([data], { type: 'application/pdf' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      if (this.reportDetails['reportCode'] == "SALES_RECEIPT_DUAL") {

        link.download = this.reportsGridOptions.api.getSelectedRows()[0]['BILL_CODE'] + '.pdf';
      } else {
        link.download = this.reportDetails['reportName'] + '.pdf';
      }
      link.click();
      this.spinnerservice.hide();
    })

  }
  downloadExcel() {
    if (this.reportDetails['reportCode'] == "SALES_RECEIPT_DUAL") {
      this.reportURI = undefined
      let saleJson = {
        "ReportCode": "SALES_RECEIPT",
        "BILL_CODE": this.reportsGridOptions.api.getSelectedRows()[0]['BILL_CODE']
      }
      this.reportURI = encodeURIComponent(JSON.stringify(saleJson));
    }
    else if (this.reportDetails['reportCode'] == "DELIVERY_NOTE_DUAL") {
      this.reportURI = undefined
      let saleJson = {
        "ReportCode": "DELIVERY_NOTE",
        "BILL_CODE": this.reportsGridOptions.api.getSelectedRows()[0]['BILL_CODE']
      }
      this.reportURI = encodeURIComponent(JSON.stringify(saleJson));
    }
    else if (this.reportDetails['reportCode'] == "ACCOUNT_RECEIVABLES_RECEIPT_DUAL") {
      this.reportURI = undefined
      let pReturnJson = {
        "ReportCode": "ACCOUNT_RECEIVABLES_RECEIPT",
        "UNIQUE_RECEIPT_NO": this.reportsGridOptions.api.getSelectedRows()[0]['UNIQUE_RECEIPT_NO']
      }
      this.reportURI = encodeURIComponent(JSON.stringify(pReturnJson));
    }
    else if (this.reportDetails['reportCode'] == "CREDIT_NOTE") {
      this.reportURI = undefined
      let creditNoteJson = {
        "ReportCode": "CREDIT_NOTE",
        "credit_note_no": this.reportsGridOptions.api.getSelectedRows()[0]['credit_note_no']
      }
      this.reportURI = encodeURIComponent(JSON.stringify(creditNoteJson));
    }
    else if (this.reportDetails['reportCode'] == "DEBIT_NOTE") {

      this.reportURI = undefined
      let debitNoteJson = {
        "ReportCode": "DEBIT_NOTE",
        "debit_note_no": this.reportsGridOptions.api.getSelectedRows()[0]['debit_note_no']
      }

      this.reportURI = encodeURIComponent(JSON.stringify(debitNoteJson));
    } else if (this.reportDetails['reportCode'] == "PURCHASE_RETURNS") {
      this.reportURI = undefined
      let pReturnJson = {
        "ReportCode": "PURCHASE_RETURNS",
        "GRN_NO": this.reportsGridOptions.api.getSelectedRows()[0]['GRN_NO']
      }
      this.reportURI = encodeURIComponent(JSON.stringify(pReturnJson));
    }
    else if (this.reportDetails['reportCode'] == "SALES_RETURN") {
      this.reportURI = undefined
      let pReturnJson = {
        "ReportCode": "SALES_RETURN",
        "SALES_RETURN_NO": this.reportsGridOptions.api.getSelectedRows()[0]['SALES_RETURN_NO']
      }
      this.reportURI = encodeURIComponent(JSON.stringify(pReturnJson));
    }
    else {
      if (this.reportDetails['inputParameters'] != "" && this.reportURI != undefined) {
        if (!this.reportURI) {

          if (this.reportDetails['reportCode'] == "CHART_OF_ACCOUNTS") {
            this.reportURI = encodeURIComponent(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'] }))

          } else if (this.reportDetails['reportCode'] == "BANK_TRANSACTIONS") {
            this.reportURI = encodeURIComponent(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'], "FROM_TRANSACTION_DATE": this.datePipe.transform(new Date(), 'yyyy-MM-dd') }))
          }
          else {

            this.reportURI = encodeURIComponent(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'], "FROM_AS_OF_DATE": this.datePipe.transform(new Date(), 'yyyy-MM-dd') }))
          }

        } else {
          this.reportURI = this.reportURI;
        }
      } else {
        this.reportURI = encodeURIComponent(JSON.stringify({ "ReportCode": this.reportDetails['reportCode'] }));
      }
    }
    this.spinnerservice.show();
    this.reportService.downloadExcelFile(this.reportURI).subscribe((data: any) => {
      this.blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      if (this.reportDetails['reportCode'] == "SALES_RECEIPT_DUAL") {
        link.download = this.reportsGridOptions.api.getSelectedRows()[0]['BILL_CODE'] + '.xlsx';
      } else {
        link.download = this.reportDetails['reportName'] + '.xlsx';
      }
      link.click();
      this.spinnerservice.hide();
    })

  }

  customersData: any = [];
  /* customers based on dummy bills */
  /* getCustomers() {
   this.reportService.getCustomers().subscribe(
     res => {
       if (res instanceof Object) {
         if (res['responseStatus']['code'] === 200) {
           this.customersData = res['result'];
         } 
         }
       
     }
   );
  } */

  billsData: any = [];
  /* bills based on dummy bills */
  /* getBills() {
   this.reportService.getBills().subscribe(
     res => {
       if (res instanceof Object) {
         if (res['responseStatus']['code'] === 200) {
           this.billsData = res['result'];
         } 
         }
       
     }
   );
  } */


  getCustomersByDummyBills() {
    this.spinnerservice.show()
    this.reportService.getCustomers().subscribe(res => {

      this.customersData = res['result']
      this.spinnerservice.hide()

    })
  }

  getBillsByDummyBills() {
    this.spinnerservice.show()
    this.reportService.getBills().subscribe(res => {

      this.billsData = res['result']
      this.spinnerservice.hide()
    })

  }

  /* onperiodClick(reportCode){
      //getting periods
      if (reportCode === 'UPCOMING_EXPIRIES') {
        this.reportService.getAllPeriods().subscribe(res => {
          res['result'].forEach(period => {
            this.periods.push(period['periodName'])
          });
        })
      }
      else {
        this.reportService.getLimitedPeriods().subscribe(res => {
          res['result'].forEach(period => {
            this.periods.push(period['periodName'])
          });
        })
   
      }
  } */

  periodsArray: any
  callingPeriods(reportCode) {
    if (reportCode == 'STOCK_ITEMS_UPCOMING_EXPIRY' || reportCode == 'UPCOMING_PAYABLES') {
      this.reportService.getAllPeriods().subscribe(res => {
        this.periodsArray = res['result']
        res['result'].forEach(period => {
          this.periods.push(period['periodName'])
        });
      })
    }
    else {
      this.reportService.getLimitedPeriods().subscribe(res => {
        res['result'].forEach(period => {
          this.periods.push(period['periodName'])
        });
      })

    }

  }

}
