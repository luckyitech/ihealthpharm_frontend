import { GridOptions, ColDef } from 'ag-grid-community';
import { Component, OnInit, Input } from '@angular/core';
import { DebitNoteService } from './shared/debit-note.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CustomerService } from 'src/app/masters/customer/shared/customer.service';
import { SupplierService } from 'src/app/masters/supplier/shared/supplier.service';
import { EmployeeService } from 'src/app/masters/employee/shared/employee.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrls: ['./debit-note.component.scss'],
  providers: [DebitNoteService, SupplierService, CustomerService, EmployeeService]
})

export class DebitNoteComponent implements OnInit {
  debitNoteNo: any;
  debitDate: string;
  amount: string;
  @Input() invoiceId: any;
  remarks: string;
  selectedSupplier: any;
  selectedCustomer: any;
  billId: any;
  selectedPaymentNumber: any;

  debitNoteHistoryGridOptions: GridOptions;

  constructor(private customerService: CustomerService, private employeeService: EmployeeService,
    private supplierService: SupplierService, private debitNoteService: DebitNoteService,
    private datePipe: DatePipe, private toasterService: ToastrService,
    private spinnerService: Ng4LoadingSpinnerService) {

    this.debitNoteService.getDebitNoteNumber().subscribe(debitNoteNum => {
      if (debitNoteNum['responseStatus']['code'] == 200) {
        this.debitNoteNo = debitNoteNum['result'];
      }
    });

    this.debitNoteService.getAccountPayablesNumber().subscribe(paymentNumber => {
      if (paymentNumber['responseStatus']['code'] == 200) {
        this.selectedPaymentNumber = paymentNumber['result'];
      }
    });

    this.debitNoteService.getAccountReceivablessNumber().subscribe(receiptNumber => {
      if (receiptNumber['responseStatus']['code'] == 200) {
        this.selectedReceiptNumber = receiptNumber['result'];
      }
    });

    this.debitNoteHistoryGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };

    this.debitNoteHistoryGridOptions.rowSelection = 'single';
    this.debitNoteHistoryGridOptions.columnDefs = this.debitGridDefs;
    this.debitNoteHistoryGridOptions.rowData = [];

    this.getSuppliersData();
    this.getCustomersData();
    this.getEmployeeData();
    this.getPaymentTypes();
    // this.getAllDebitData();
    this.getAllPrTypes();
    this.getAllsrTypes();
  }

  selectedReceiptNumber: any;
  ngOnInit() {
    this.debitNoteInformationForm = new FormGroup(this.debitNoteFormValidations);
    this.debitNotePopForm = new FormGroup(this.debitNotePopFormValidations)

    $(document).ready(function () {
      $("#purchase").click(function () {
        $("#salesReturns").hide();
        $("#purchaseReturns").show();
      });
      $("#sales").click(function () {
        $("#salesReturns").show();
        $("#purchaseReturns").hide();
      });
      $("#debitInputSupplier").change(function () {
        $('#itemSearchModal').modal('show');
      });
    });
  }

  selectedPaymentType: Object = undefined;
  paymentTypes: any[] = [];

  getPaymentTypes() {
    this.supplierService.getallpaymenttypes().subscribe(
      getallpaymenttypesResponse => {
        if (getallpaymenttypesResponse['responseStatus']['code'] === 200) {
          this.paymentTypes = getallpaymenttypesResponse['result'];
        }
      }
    );
  }

  status = [
    { name: 'Approved' },
    { name: 'Not Approved' },
  ];

  selectedStatus: any = { name: "Not Approved" };
  purchaseReturns: any;
  salesReturn: any;

  getAllPrTypes() {
    this.debitNoteService.getAllpurchaseReturnTypes().subscribe(prRes => {
      if (prRes['responseStatus']['code'] == 200) {
        this.purchaseReturns = prRes['result'];
      }
    })
  }

  getAllsrTypes() {
    this.debitNoteService.getAllSalesReturnTypes().subscribe(prRes => {
      if (prRes['responseStatus']['code'] == 200) {
        this.salesReturn = prRes['result'];
      }
    })
  }

  debitNoteInformationForm: FormGroup;

  debitNoteFormValidations = {
    debitNoteNo: new FormControl(''),
    debitDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]),
    amount: new FormControl('', [Validators.required, Validators.pattern(/[0-9]$/)]),
    returnType: new FormControl('', [Validators.required]),
    returnTypeReason: new FormControl('', [Validators.required]),
    selectedSupplier: new FormControl(''),
    selectedCustomer: new FormControl(''),
    billId: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
    invoiceId: new FormControl('', [Validators.required]),
    remarks: new FormControl(''),
    approvedBy: new FormControl(''),
    approvedPin: new FormControl('', [Validators.pattern(/^[1-9][0-9]{5}$/)]),
    approvedDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    approvedByEmp: new FormControl(''),
    selectedStatus: new FormControl(''),
    paymentType: new FormControl('', [Validators.required]),
    tax: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)]),
    discount: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{0,2}$/)])
  }

  checkFormDisability() {
    if (this.type1 == 'Y' || this.type2 == 'Y') {
      return (this.debitNoteInformationForm.get('debitDate').errors instanceof Object)
        || this.debitNoteInformationForm.get('amount').invalid
        || this.debitNoteInformationForm.get('amount').errors instanceof Object
        || this.debitNoteInformationForm.get('invoiceId').invalid
        || this.debitNoteInformationForm.get('invoiceId').errors instanceof Object
        || this.debitNoteInformationForm.get('returnTypeReason').errors instanceof Object
        || this.debitNoteInformationForm.get('paymentType').errors instanceof Object
        || this.debitNoteInformationForm.get('selectedStatus').errors instanceof Object
        || this.debitNoteInformationForm.get('tax').invalid
    }
    else if (this.type1 == 'N' || this.type2 == 'N') {
      return (this.debitNoteInformationForm.get('debitDate').errors instanceof Object)
        || this.debitNoteInformationForm.get('amount').invalid
        || this.debitNoteInformationForm.get('amount').errors instanceof Object
        || this.debitNoteInformationForm.get('billId').invalid
        || this.debitNoteInformationForm.get('billId').errors instanceof Object
        || this.debitNoteInformationForm.get('returnTypeReason').errors instanceof Object
        || this.debitNoteInformationForm.get('paymentType').errors instanceof Object
        || this.debitNoteInformationForm.get('selectedStatus').errors instanceof Object
        || this.debitNoteInformationForm.get('tax').invalid
    }

  }
  approvedBy: any;
  taxAmt: number;
  amounts: number;
  netAmount: number = 0;
  discount: number = 0;

  amountEntered(event) {
    this.amounts = event['target']['value'];
    if ((this.amounts != null && this.amounts != undefined)) {
      let amount = Number(this.amounts);
      this.netAmount = Number(amount.toFixed(2));
    }
    if (event['target']['value'] == '') {

      this.debitNoteInformationForm.get('discount').setValue('')
      this.amounts = undefined;
      this.taxAmt = undefined
    }

  }

  taxEntered(event) {
    this.taxAmt = event['target']['value'];

    if ((this.taxAmt != null && this.taxAmt != undefined)) {
      let disc = this.discount != null && this.discount != undefined ? this.discount : 0;

      let taxAmount = (Number(this.amounts) + Number(this.taxAmt)) - ((Number(disc) / 100) * this.amounts);
      this.netAmount = Number(taxAmount.toFixed(2));
    }
    if (event['target']['value'] == '') {
      let amt = this.amounts != null && this.amounts != undefined ? this.amounts : 0;
      let disc = this.discount != null && this.discount != undefined ? this.discount : 0;
      let finalAmt = amt - ((disc / 100) * amt);

      let net = finalAmt - event['target']['value'];

      this.netAmount = Number(net.toFixed(2))

    }
  }


  onDiscountEntered(event) {
    this.discount = event['target']['value'];

    if ((this.discount != null && this.discount != undefined)) {
      let tax = this.taxAmt != null && this.taxAmt != undefined ? this.taxAmt : 0;

      let totalAmount = this.amounts - ((this.discount / 100) * this.amounts) + Number(tax);
      this.netAmount = Number(totalAmount.toFixed(2));
    }
  }



  onSubmit() {
    if (this.type1 == 'Y' || this.type2 == 'Y') {

      let payload = Object.assign({}, this.debitNoteInformationForm.value);
      payload['returnType'] = 'Purchase'
      payload['returnTypeReason'] = this.purchaseReturnType['purchase'];
      payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
      payload['createdUser'] = localStorage.getItem('id');
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['supplierModel'] = this.selectedSupplier;
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['createdUser'] = localStorage.getItem('id');
      payload['approvedBy'] = this.approvedBy != null && this.approvedBy != undefined ? this.approvedBy : { 'employeeId': localStorage.getItem('id') };
      payload['netAmount'] = this.netAmount;
      payload['paymentStatus'] = 'Pending'

      this.onSaveDebitNote(payload);

    } else if (this.type1 == 'N' || this.type2 == 'N') {

      let payload = Object.assign({}, this.debitNoteInformationForm.value);
      payload['returnType'] = 'Sales'
      payload['returnTypeReason'] = this.salesReturnType['sales'];
      payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
      payload['createdUser'] = localStorage.getItem('id');
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['customerModel'] = this.selectedCustomer;
      payload['approvedBy'] = this.approvedBy != null && this.approvedBy != undefined ? this.approvedBy : { 'employeeId': localStorage.getItem('id') };
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['createdUser'] = localStorage.getItem('id');
      payload['netAmount'] = this.netAmount;
      payload['paymentStatus'] = 'Pending';

      this.onSaveDebitNote(payload);
    }
  }

  statusGrid = false;
  showApproveByDate = false;
  showPaymentStatus = false;

  statusSelected(event) {
    this.selectedStatus = event['name'];
    this.statusGrid = true;
  }

  show: boolean;
  password() {
    this.show = !this.show;
  }

  close() {
    this.statusGrid = false;
    this.selectedStatus = { name: "Not Approved" };
  }

  savePin() {
    if (event['name'] == "approvedPin") {
      this.selectedStatus = "Not Approved";
    } else {
      this.selectedStatus = "Approved";
    }
    this.statusGrid = false;
    this.showApproveByDate = true;
    this.showPaymentStatus = true;
    this.selectedEmployee = undefined;
  }
  makePin = true;

  pinEnter(event) {
    if (this.approvedBy['accessPin'] == event['target']['value']) {
      this.makePin = false;
    } else { this.makePin = true }
  }

  approvedEmpName: any;
  selectedEmployee(event) {
    this.approvedBy = event;
    this.approvedEmpName = event['empName'];
  }

  suppliers: any[] = [];

  getSuppliersData() {
    this.debitNoteService.getRowDataFromServer().subscribe(
      getSupplierResponse => {
        if (getSupplierResponse instanceof Object) {
          if (getSupplierResponse['responseStatus']['code'] === 200) {
            this.suppliers = getSupplierResponse['result'];
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


  onTypeChange(event) {
    if (this.type1 == 'N') {
      this.netAmount = 0;
      this.onResetDebitNote();

    } else if (this.type1 == 'Y') {
      this.netAmount = 0;
      this.onResetDebitNote();
    }
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
  customers: any[] = [];

  getCustomersData() {
    this.debitNoteService.getRowDataFromServerForCustomer().subscribe(
      getCustomerResponse => {
        if (getCustomerResponse instanceof Object) {
          if (getCustomerResponse['responseStatus']['code'] === 200) {
            this.customers = getCustomerResponse['result'];
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

  onCustomerSearch(event) {
    if (event['term'] != "") {
      this.debitNoteService.getCustomerByName(event['term']).subscribe(customerSearchRes => {
        if (customerSearchRes['responseStatus']['code'] == 200) {
          this.customers = customerSearchRes['result'];
        }
      });
    }
  }

  type1: string = 'Y';
  type2: string = 'N';
  purchaseReturnType: any;
  salesReturnType: any;
  pharmacyId: number = 1;
  savedDebitNote: any;
  updatePayablesAmt: any;

  onSaveDebitNote(debitNoteInformationForm: Object) {
    if (this.type1 == 'Y' || this.type1 == 'N' || this.type2 == 'Y' || this.type2 == 'N') {

      if (this.selectedStatus === 'Approved') {
        this.debitNoteInformationForm.get('debitDate').setErrors({ 'incorrect': true })
        this.spinnerService.show();
        this.debitNoteService.saveDebitNoteData(debitNoteInformationForm).subscribe(
          savedDeditNoteResponse => {
            if (savedDeditNoteResponse instanceof Object) {
              if (savedDeditNoteResponse['responseStatus']['code'] === 200) {
                this.spinnerService.hide();
                this.savedDebitNote = savedDeditNoteResponse['result'];
                //console.log(this.savedDebitNote)
                this.updatePayablesAmt = -1 * this.savedDebitNote['netAmount'];

                if (this.savedDebitNote['supplierModel'] != null || this.savedDebitNote['supplierModel'] != undefined) {
                  let accountPayablesObject = {
                    'paymentNumber': this.selectedPaymentNumber,
                    'paymentDate': this.savedDebitNote['debitDate'],
                    'supplierModel': this.savedDebitNote['supplierModel'],
                    'selectedStatus': 'Not Approved',
                    'createdUser': localStorage.getItem('id'),
                    'lastUpdateUser': localStorage.getItem('id'),
                    'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                    'selectedPaymentStatus': 'Pending',
                    'totalAmountPaid': 0,
                    'activeS': 'Y',
                    'invoiceNo': this.savedDebitNote['invoiceId'],
                    'source': this.savedDebitNote['debitNoteId'],
                    'sourceRef': this.savedDebitNote['debitNoteNo'],
                    'sourceType': 'Debit Note',
                    'totalAmountToBePaid': this.updatePayablesAmt,
                    'supplierName': this.savedDebitNote['supplierModel'] != null && this.savedDebitNote['supplierModel'] != undefined ? this.savedDebitNote['supplierModel']['name'] : '',
                    'customerName': this.savedDebitNote['customerModel'] != null && this.savedDebitNote['customerModel'] != undefined ? this.savedDebitNote['customerModel']['customerName'] : ''
                  }

                  this.debitNoteService.saveAccountPayables(accountPayablesObject).subscribe(Response => {

                  })
                } else {
                  let updateAccRecievablesObject = {
                    'amountToBeReceived': -1 * this.updatePayablesAmt,
                    'amountReceived': 0,
                    'receiptDate': this.savedDebitNote['debitDate'],
                    'source': this.savedDebitNote['debitNoteId'],
                    'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                    'receiptNumber': this.selectedReceiptNumber,
                    'status': 'Not Approved',
                    'createdUser': localStorage.getItem('id'),
                    'lastUpdateUser': localStorage.getItem('id'),
                    'paymentStatus': 'Pending',
                    'paymentTypeId': { 'paymentTypeId': 1 },
                    'sourceType': 'Debit Note',
                    'activeS': 'Y',
                    'sourceRef': this.savedDebitNote['debitNoteNo'],
                    'approvedDate': this.savedDebitNote['debitDate'],
                    'approvedBy': localStorage.getItem('id'),
                    'supplierName': this.savedDebitNote['supplierModel'] != null && this.savedDebitNote['supplierModel'] != undefined ? this.savedDebitNote['supplierModel']['name'] : '',
                    'customerName': this.savedDebitNote['customerModel'] != null && this.savedDebitNote['customerModel'] != undefined ? this.savedDebitNote['customerModel']['customerName'] : ''
                  }
                  if (this.savedDebitNote['paymentType']['type'] == 'CREDIT') {
                    this.debitNoteService.saveAccountReceivables(updateAccRecievablesObject).subscribe(response => {

                    });
                  }
                }

                this.toasterService.success(savedDeditNoteResponse['message'], 'Success', {
                  timeOut: 3000
                });
                this.netAmount = 0;
                this.debitNoteInformationForm.patchValue({
                  'debitDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd')
                })
              }
              else {
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
        this.onResetDebitNote();
        this.approvedBy = undefined;
      } else {
        this.toasterService.warning('Status Not Selected', "", {
          timeOut: 5000
        })
      }
    }
  }

  onResetDebitNote() {
    this.debitNoteInformationForm.reset();
    this.debitNoteInformationForm.patchValue({
      'debitDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      'approvedDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });

    this.selectedStatus = { name: "Not Approved" };
    this.billId = '',
      this.selectedSupplier = '',
      this.selectedCustomer = '',
      this.amount = '',
      this.invoiceId = '',
      this.remarks = '',
      this.selectedSupplier = undefined;
    this.approvedEmpName = undefined;
    this.selectedCustomer = undefined;
    this.showApproveByDate = undefined;
    this.showPaymentStatus = undefined;
    this.debitNoteService.getDebitNoteNumber().subscribe(debitNoteNum => {
      if (debitNoteNum['responseStatus']['code'] == 200) {
        this.debitNoteNo = debitNoteNum['result'];
      }
    });
    this.taxAmt = undefined;
    this.amounts = undefined;
    this.debitNoteInformationForm.get('discount').setValue('')
    this.netAmount = 0;
    this.discount = undefined;
    this.savedDebitNote=undefined;
    
  }

  // history code with tab switching

  debitNote = true;
  history = false;

  DebitNoteFun() {
    this.history = false;
    this.debitNote = true;
    this.rowData = undefined;
    this.searchTypeValue = undefined;
    this.searchTerm = undefined;
  }

  DebitNoteHistory() {
    this.rowData = undefined;
    this.history = true;
    this.debitNote = false;
    this.getAllDebitData();
  }

  searchType = [{ name: "Invoice No" }, { name: "Bill No" }]
  searchTerm: any;
  paginationSize = 50;

  debitGridDefs: ColDef[] = [
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
    { headerName: 'Debit No', field: 'debitNoteNo', sortable: true, resizable: true, filter: true, editable: true, width: 150 },
    {
      headerName: 'Payment Status', field: 'paymentStatus', sortable: true, resizable: true, filter: true, width: 140
    },
    {
      headerName: 'Invoice No', field: 'invoiceId', sortable: true, resizable: true, filter: true, width: 140,
      valueGetter: function (params) {
        var invoiceNo = params.data.invoiceId != '' && params.data.invoiceId != null && params.data.invoiceId != undefined ? params.data.invoiceId : '--';
        return invoiceNo;
      }
    },
    {
      headerName: 'Bill No', field: 'billId', sortable: true, filter: true, resizable: true, width: 140,
      valueGetter: function (params) {
        var billId = params.data.billId != '' && params.data.billId != null && params.data.billId != undefined ? params.data.billId : '--';
        return billId;
      }
    },
    {
      headerName: 'Approved Date', field: 'approvedDate', sortable: true, resizable: true, filter: true, width: 140,
      valueGetter: this.dateFormatter.bind(this)
    },
    {
      headerName: 'Debit Note To', field: 'debitTo', sortable: true, resizable: true, filter: true, width: 220,
      valueGetter: function (params) {
        var supplier = params.data.supplierModel != null && params.data.supplierModel != undefined ? params.data.supplierModel.name + ' Supplier' : null;
        var customer = params.data.customerModel != null && params.data.customerModel != undefined ? params.data.customerModel.customerName + ' Customer' : null;
        let debitTo
        if (supplier != null && supplier != undefined) {
          debitTo = supplier;
          return debitTo;
        } else {
          debitTo = customer;
          return debitTo;
        }
      }
    },
    { headerName: 'Return Type', field: 'returnType', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Return Type Reason', field: 'returnTypeReason', sortable: true, resizable: true, filter: true,
    },
    {
      headerName: 'Net Amount', field: 'netAmount', sortable: true, resizable: true, filter: true, width: 130,
      valueGetter: function (params) {
        if (params.data.netAmount != null && params.data.netAmount != 'null' && params.data.netAmount != undefined) {
          return params.data.netAmount;
        } else {
          var data = 0.0;
          params.data.netAmount = data;
          return params.data.netAmount;
        }
      }
    },

    {
      headerName: 'Approved By', field: 'empName', sortable: true, resizable: true, filter: true, width: 150,
    }
  ];

  rowData: any;

  dateFormatter(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.approvedDate != null && params.data.approvedDate != undefined && params.data.approvedDate != '') {
        try {
          params.data.approvedDate = this.datePipe.transform(params.data.approvedDate, "dd-MM-yyy");
        }
        catch (error) {
        }
        return params.data.approvedDate;
      }
    }
  }

  getAllDebitData() {
    this.spinnerService.show();
    this.debitNoteService.getAllDebitNotes().subscribe(debitRes => {
      if (debitRes instanceof Object) {
        if (debitRes['responseStatus']['code'] == 200) {
          this.spinnerService.hide();
          this.rowData = debitRes['result'];
        }
      }
    })
  }

  searchTypeValue: any;

  onTypeSelection(event) {
    if (event != null && event != undefined) {
      this.searchTypeValue = event['name'];
    } else {
      this.searchTerm = undefined;
      this.searchTypeValue = undefined;
      this.getAllDebitData();
    }
  }

  onSearch(event) {
    if (event['target']['value'] != null && event['target']['value'] != undefined && event['target']['value'] != '') {
      if (this.searchTypeValue != null && this.searchTypeValue != undefined) {
        this.debitNoteService.getAllBySearches(this.searchTypeValue, this.searchTerm).subscribe(searchRes => {
          if (searchRes instanceof Object) {
            if (searchRes['responseStatus']['code'] == 200) {
              this.rowData = searchRes['result'];
              if (searchRes['result'].length <= 0) {
                this.toasterService.warning('No Data Found', '', {
                  timeOut: 5000
                })
              }
            }
          }
        })
      }
    } else {
      this.getAllDebitData();
    }
  }

  onCellClicked(params) {
    if (params.column.colId !== 'check') {
      this.change(params.data);
      setTimeout(() => {
        $('#approvedModal').modal('show');
      }, 200);
    }
  }

  debitNotePopForm: FormGroup;
  debitData: any;
  finalAmount: any;

  supplierDiv = true;
  customerDiv = false;

  change(params) {
    const data = params;

    this.debitNoteService.getDNbyId(data.debitNoteId).subscribe(debitRes => {
      if (debitRes instanceof Object) {
        if (debitRes['responseStatus']['code'] == 200) {
          this.debitData = debitRes['result'];

          this.debitNotePopForm.patchValue({
            debitNoteNumber: this.debitData['debitNoteNo'],
            debitRaisedDate: this.debitData['debitDate'],
            status: this.debitData['selectedStatus'],
            returnTYPE: this.debitData['returnType'],
            returnTypeReasons: this.debitData['returnTypeReason'],
            supplier: this.debitData['supplierModel'] != null && this.debitData['supplierModel'] != undefined ? this.debitData['supplierModel']['name'] : '',
            customer: this.debitData['customerModel'] != null && this.debitData['customerModel'] != undefined ? this.debitData['customerModel']['customerName'] : '',
            billNo: this.debitData['billId'],
            invoiceNo: this.debitData['invoiceId'],
            remarksInfo: this.debitData['remarks'],
            payStatus: this.debitData['paymentStatus'],
            payType: this.debitData['paymentType'] != null && this.debitData['paymentType'] ? this.debitData['paymentType']['type'] : '',
            taxRate: this.debitData['tax'],
            discountAmt: this.debitData['discount'],
            amt: this.debitData['amount']
          });
          this.finalAmount = this.debitData['netAmount'];

          if (this.debitData['supplierModel'] != null && this.debitData['supplierModel'] != undefined) {
            this.customerDiv = false;
            this.supplierDiv = true;
            (<HTMLInputElement>document.getElementById('purchase')).checked = true;
            (<HTMLInputElement>document.getElementById('sales')).disabled = true;
          }
          else if (this.debitData['customerModel'] != null && this.debitData['customerModel'] != undefined) {
            this.customerDiv = true;
            this.supplierDiv = false;
            (<HTMLInputElement>document.getElementById('sales')).checked = true;
            (<HTMLInputElement>document.getElementById('purchase')).disabled = true;
          }

          this.debitNotePopForm.get('status').disable();
          this.debitNotePopForm.get('returnTypeReasons').disable();
          this.debitNotePopForm.get('supplier').disable();
          this.debitNotePopForm.get('customer').disable();
          this.debitNotePopForm.get('payType').disable();


        }
      }
    });
  }

  debitNotePopFormValidations = {
    debitNoteNumber: new FormControl(''),
    debitRaisedDate: new FormControl(''),
    status: new FormControl(''),
    returnTYPE: new FormControl(''),
    returnTypeReasons: new FormControl(''),
    supplier: new FormControl(''),
    customer: new FormControl(''),
    billNo: new FormControl(''),
    invoiceNo: new FormControl(''),
    remarksInfo: new FormControl(''),
    payStatus: new FormControl(''),
    payType: new FormControl(''),
    taxRate: new FormControl(''),
    discountAmt: new FormControl(''),
    amt: new FormControl('')
  }

  onClosePopup() {
    $('#approvedModal').modal('hide');
  }

}
