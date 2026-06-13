import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CreditNoteService } from './../shared/credit-note.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/masters/employee/shared/employee.service';
import { SupplierService } from 'src/app/masters/supplier/shared/supplier.service';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-main-credit-note',
  templateUrl: './main-credit-note.component.html',
  styleUrls: ['./main-credit-note.component.scss']
})
export class MainCreditNoteComponent implements OnInit {

  creditNoteNo: any;
  type1: string = 'Y';
  type2: string = 'N';
  purchaseReturnType: any;
  salesReturnType: any;
  billId: any;
  selectedSupplier: any;
  selectedCustomer: any;
  amount: string;
  netAmount: number = 0;
  invoiceId: any;
  remarks: string;
  pharmacyId: number = 1;
  listOfBillTypes: any = [];
  selectedBillType: Object = undefined;
  selectedReceiptNumber: any;
  selectedPayablesNumber: any;

  selectedPaymentType: Object = undefined;
  saveButton: boolean = false;
  paymentTypes: any[] = [];


  constructor(private supplierService: SupplierService, private employeeService: EmployeeService
    , private creditNoteService: CreditNoteService, private datePipe: DatePipe,
    private toasterService: ToastrService,
    private spinnerService: Ng4LoadingSpinnerService) {

    this.creditNoteService.getCreditNoteNumber().subscribe(creditNoteNum => {
      if (creditNoteNum['responseStatus']['code'] == 200) {
        this.creditNoteNo = creditNoteNum['result'];
      }
    });

    this.creditNoteService.getAccountReceivablessNumber().subscribe(receiptNumber => {
      if (receiptNumber['responseStatus']['code'] == 200) {
        this.selectedReceiptNumber = receiptNumber['result'];
      }
    });

    this.creditNoteService.getAccountPayablesNumber().subscribe(res => {
      if (res['responseStatus']['code'] == 200) {
        this.selectedPayablesNumber = res['result'];
      }
    })

    this.getSuppliersData();
    this.getCustomersData();
    this.getEmployeeData();
    this.getPaymentTypes();
    this.getListOfBillTypes();
    this.getAllPrTypes();
    this.getAllsrTypes();
  }


  ngOnInit() {
    this.creditNoteInformationForm = new FormGroup(this.creditNoteFormValidations);

    $(document).ready(function () {

      $("#purchase").click(function () {

        $("#salesReturns").hide();
        $("#purchaseReturns").show();

      });
      $("#sales").click(function () {
        $("#salesReturns").show();
        $("#purchaseReturns").hide();

      });
    });
  }

  getListOfBillTypes() {
    this.creditNoteService.getBillTypes().subscribe(billTypes => {
      this.listOfBillTypes = billTypes;
    });
  }

  selectPayType(event) {
    this.selectedPaymentType = event
    //console.log(this.selectedPaymentType)
  }

  selectBillType(event) {
    let selectedType = event['type'];

    this.selectedBillType = selectedType;
    //console.log(this.selectedBillType)

    if (selectedType == 'Sales') {
      this.creditNoteService.getCreditNoteNumberByBillType('CSB').subscribe(creditNoteNum => {

        if (creditNoteNum['responseStatus']['code'] == 200) {
          this.creditNoteNo = creditNoteNum['result'];
        }
      });
    }
    else if (selectedType == 'Credit Note') {
      this.creditNoteService.getCreditNoteNumberByBillType('CRN').subscribe(creditNoteNum => {
        if (creditNoteNum['responseStatus']['code'] == 200) {
          this.creditNoteNo = creditNoteNum['result'];
        }
      });
    }
    else if (selectedType == "Cash Payment") {
      this.creditNoteService.getCreditNoteNumberByBillType('CSH').subscribe(creditNoteNum => {
        if (creditNoteNum['responseStatus']['code'] == 200) {
          this.creditNoteNo = creditNoteNum['result'];
        }
      });
    }
    else if (selectedType == 'Cash Back') {
      this.creditNoteService.getCreditNoteNumberByBillType('CB').subscribe(creditNoteNum => {
        if (creditNoteNum['responseStatus']['code'] == 200) {
          this.creditNoteNo = creditNoteNum['result'];
        }
      });
    }
    else if (selectedType == 'Account') {
      this.creditNoteService.getCreditNoteNumberByBillType('AC').subscribe(creditNoteNum => {
        if (creditNoteNum['responseStatus']['code'] == 200) {
          this.creditNoteNo = creditNoteNum['result'];
        }
      });
    }
  }

  getPaymentTypes() {
    this.supplierService.getallpaymenttypes().subscribe(
      getallpaymenttypesResponse => {
        if (getallpaymenttypesResponse['responseStatus']['code'] === 200) {
          this.paymentTypes = getallpaymenttypesResponse['result'];
        }
      }
    );
  }

  getAllPrTypes() {
    this.creditNoteService.getAllpurchaseReturnTypes().subscribe(prRes => {
      if (prRes['responseStatus']['code'] == 200) {
        this.purchaseReturns = prRes['result'];
      }
    })
  }

  getAllsrTypes() {
    this.creditNoteService.getAllSalesReturnTypes().subscribe(prRes => {
      if (prRes['responseStatus']['code'] == 200) {
        this.salesReturn = prRes['result'];
      }
    })
  }

  status = [
    { name: 'Approved' },
    { name: 'Not Approved' },
  ];

  selectedStatus: any = { name: "Not Approved" };
  purchaseReturns: any;
  salesReturn: any;
  creditNoteInformationForm: FormGroup;

  creditNoteFormValidations = {
    creditNoteNo: new FormControl(''),
    billId: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
    invoiceId: new FormControl('', [Validators.required]),
    remarks: new FormControl(''),
    selectedSupplier: new FormControl(''),
    selectedCustomer: new FormControl('', Validators.required),
    creditDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]),
    amount: new FormControl('', [Validators.required, Validators.pattern(/[0-9]$/)]),
    returnType: new FormControl('', [Validators.required]),
    returnTypeReason: new FormControl('', [Validators.required]),
    approvedBy: new FormControl(''),
    approvedDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    selectedStatus: new FormControl('', [Validators.required]),
    approvedByEmp: new FormControl(''),
    approvedPin: new FormControl('', [Validators.pattern(/^[1-9][0-9]{5}$/)]),
    paymentType: new FormControl('', [Validators.required]),
    approveDate: new FormControl(''),
    tax: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)]),
    discount: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{0,2}$/)]),
    billType: new FormControl('', [Validators.required])
  }

  checkFormDisability() {
    if (this.type1 == 'Y' || this.type2 == 'Y') {
      return (this.creditNoteInformationForm.get('creditDate').errors instanceof Object)
        || this.creditNoteInformationForm.get('amount').invalid
        || this.creditNoteInformationForm.get('amount').errors instanceof Object
        || this.creditNoteInformationForm.get('invoiceId').invalid
        || this.creditNoteInformationForm.get('invoiceId').errors instanceof Object
        || this.creditNoteInformationForm.get('returnTypeReason').errors instanceof Object
        || this.creditNoteInformationForm.get('paymentType').errors instanceof Object
        || this.creditNoteInformationForm.get('selectedStatus').errors instanceof Object
        || this.creditNoteInformationForm.get('tax').invalid
        || this.creditNoteInformationForm.get('tax').errors instanceof Object
    }
    else if (this.type1 == 'N' || this.type2 == 'N') {
      return (this.creditNoteInformationForm.get('creditDate').errors instanceof Object)
        || this.creditNoteInformationForm.get('amount').invalid
        || this.creditNoteInformationForm.get('amount').errors instanceof Object
        || this.creditNoteInformationForm.get('billId').invalid
        || this.creditNoteInformationForm.get('billId').errors instanceof Object
        || this.creditNoteInformationForm.get('returnTypeReason').errors instanceof Object
        || this.creditNoteInformationForm.get('paymentType').errors instanceof Object
        || this.creditNoteInformationForm.get('selectedStatus').errors instanceof Object
        || this.creditNoteInformationForm.get('tax').invalid
        || this.creditNoteInformationForm.get('tax').errors instanceof Object
        || this.creditNoteInformationForm.get('selectedCustomer').errors instanceof Object
        || this.creditNoteInformationForm.get('billType').errors instanceof Object
    }
  }

  approvedBy: any;
  approvedEmpName: any;
  showApproveByDate = false;
  showPaymentStatus = false;
  taxAmt: number;
  amounts: number;
  discount: number;

  amountEntered(event) {
    this.amounts = event['target']['value'];
    if ((this.amounts != null && this.amounts != undefined)) {
      let amount = Number(this.amounts);
      this.netAmount = Number(amount.toFixed(2));
    }
    if (event['target']['value'] == '') {
      this.creditNoteInformationForm.get('discount').setValue('')
      this.amounts = undefined;
      this.taxAmt = undefined;
    }
  }

  taxEntered(event) {
    this.taxAmt = event['target']['value'];
    if ((this.taxAmt != null && this.taxAmt != undefined)) {
      let disc = this.discount != null && this.discount != undefined ? this.discount : 0;
      let totalAmount = (Number(this.amounts) + Number(this.taxAmt)) - ((Number(disc) / 100) * this.amounts);
      this.netAmount = Number(totalAmount.toFixed(2));
    }
    if (event['target']['value'] == '') {
      let amt = this.amounts != null && this.amounts != undefined ? this.amounts : 0;
      let disc = this.discount != null && this.discount != undefined ? this.discount : 0;

      let finalAmt = amt - ((disc / 100) * amt);
      let net = finalAmt - event['target']['value'];
      this.netAmount = Number(net.toFixed(2));
    }
  }

  onDiscountEntered(event) {
    this.discount = event['target']['value'];
    if ((this.discount != null && this.discount != undefined)) {
      let tax = this.taxAmt != null && this.taxAmt != undefined ? this.taxAmt : 0;
      let amt = this.amounts - ((this.discount / 100) * this.amounts) + Number(tax);
      this.netAmount = Number(amt.toFixed(2));
    }
  }


  selectEmployee(event) {
    this.approvedBy = event;
    this.approvedEmpName = event['empName'];
  }

  pinEnter(event) {
    if (this.approvedBy['accessPin'] == event['target']['value']) {
      this.makePin = false;
    } else {
      this.makePin = true;
    }
  }


  suppliers: any[] = [];

  getSuppliersData() {
    this.creditNoteService.getRowDataFromServer().subscribe(
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

  customers: any[] = [];

  onCustomerSearch(event) {
    if (event['term'] != "") {
      this.creditNoteService.getCustomerByName(event['term']).subscribe(customerSearchRes => {
        if (customerSearchRes['responseStatus']['code'] == 200) {
          this.customers = customerSearchRes['result'];
        }
      });


    }
  }

  onBillIdEnter(event) {
    if (this.selectedCustomer) {
      this.creditNoteService.getSalesDataByCustomerAndBillCode(this.selectedCustomer['customerId'], this.billId).subscribe(res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.spinnerService.hide()
            if (res['result']) {
              this.saleDataByBillRefAndCustomer = null
              this.saleDataByBillRefAndCustomer = res['result']
            }
          }
        }

      })
    }else{
      if (this.billId) {
      this.creditNoteService.getCustomerModelByBillCode(this.billId).subscribe(res=>{
        if(res instanceof Object){
          if(res['responseStatus']['code']==200){

            if(res['result']){
            let customerObj={
              customerId:res['result']['customerId'],
              customerName:res['result']['customerName']+" "+res['result']['lastName']
            }
            this.selectedCustomer=customerObj
            
            this.onSelectedCustomer( this.selectedCustomer)
            }
          }
        }
      })
      }
    }
  }


  onSelectedCustomer(event) {
    
    this.selectedCustomer = event;
    //console.log(this.selectedCustomer)
    this.getCustomerMasterByCustomerId(this.selectedCustomer['customerId'])
    if (this.billId) {
      this.saleDataByBillRefAndCustomer = null
      this.creditNoteService.getSalesDataByCustomerAndBillCode(this.selectedCustomer['customerId'], this.billId).subscribe(res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.spinnerService.hide()
            if (res['result']) {
              this.saleDataByBillRefAndCustomer = res['result']
            }
          }
        }

      })
    }

    //this.getcustomerDataById(this.selectedCustomer['customerId']);
  }

  getCustomersData() {
    this.creditNoteService.getRowDataFromServerForCustomer().subscribe(
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

  statusGrid = false;

  statusSelected(event) {
    this.statusGrid = true;
  }

  close() {
    this.statusGrid = false;
    this.selectedStatus = { name: "Not Approved" };
  }

  password() {
    this.show = !this.show;
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

  show: boolean;
  makePin = true;
  employees: any[] = [];
  updateAccRecievables: any;
  savedCreditNote: any;

  saleDataByBillRefAndCustomer
  onSubmit() {
    if (this.type1 == 'Y' || this.type2 == 'Y') {
      if ((this.purchaseReturnType['purchase'] == 'Cash Back' || this.purchaseReturnType['purchase'] == 'Cash Refund')
        && (this.selectedPaymentType['type'] == 'CREDIT')) {
        this.toasterService.warning("Can’t use Pay Type CREDIT for Cash Refund or Cash Back", " ", {
          timeOut: 5000
        })
        return;
      }

      console.log()
      this.creditNoteService.getExistingCreditNoteByInvoiceNo(this.invoiceId).subscribe(res=>{
        if(res instanceof Object){
          if (res['responseStatus']['code'] === 200) {
            if(res['result'].length > 0){
              this.toasterService.warning("Already Credit Note exists against this Invoice No", " ", {
                timeOut: 5000
              })
              return;
            }else{
              let payload = Object.assign({}, this.creditNoteInformationForm.value);
              payload['returnType'] = 'Purchase';
              payload['returnTypeReason'] = this.purchaseReturnType['purchase'];
              payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
              payload['createdUser'] = localStorage.getItem('id');
              payload['lastUpdateUser'] = localStorage.getItem('id');
              payload['supplierModel'] = this.selectedSupplier;
              payload['approvedByEmp'] = this.approvedEmpName;
              payload['status'] = this.selectedStatus;
              payload['approvedBy'] = { 'employeeId': localStorage.getItem('id') };
              payload['lastUpdateUser'] = localStorage.getItem('id');
              payload['createdUser'] = localStorage.getItem('id');
              payload['netAmount'] = this.netAmount;
              payload['billType'] = this.selectBillType['value']
              if (this.selectedPaymentType['type'] == 'CREDIT') {
                payload['paymentStatus'] = 'Pending';
              } else {
                payload['paymentStatus'] = 'Paid';
              }
        
        
              this.onSaveCreditNote(payload);
            }
          }
        }
      })

    }
    else if (this.type1 == 'N' || this.type2 == 'N') {



      if (this.saleDataByBillRefAndCustomer == null || this.saleDataByBillRefAndCustomer == undefined) {
        this.toasterService.warning("Bill No Invalid for Customer stated", " ", {
          timeOut: 5000
        })
        return;
      }

      if ((this.selectedBillType == 'Cash Back' || this.selectedBillType == 'Cash Payment'
        || this.selectedBillType == 'Cash Refund' || this.salesReturnType['sales'] == 'Cash Back' || this.salesReturnType['sales'] == 'Cash Refund')
        && (this.selectedPaymentType['type'] == 'CREDIT')) {
        this.toasterService.warning("Can’t use Pay Type CREDIT for Cash Refund or Cash Back", " ", {
          timeOut: 5000
        })
        return;
      }
      if ((this.selectedBillType == 'Account' || this.selectedBillType == 'Credit Note') && this.selectedPaymentType['type'] != 'CREDIT') {
        this.toasterService.warning("Pay Type must be CREDIT for Bill Type to be Account or Credit Note", " ", {
          timeOut: 5000
        })
        return;
      }

      if (!this.customerHaveCreditAccount && (this.selectedPaymentType['type'] == 'CREDIT' && this.selectedBillType == 'Account')) {
        this.toasterService.warning("Customer not eligible for credit – NO CREDIT ACCOUNT", " ", {
          timeOut: 5000
        })
        return;
      }

      if (this.selectedPaymentType['type'] == 'CREDIT' && this.selectedBillType == 'Account' && !this.saleDataByBillRefAndCustomer['creditAmount']) {
        this.toasterService.warning("Cannot create  Credit Note - Where Pay Type=Credit  and Bill Type=Account for selected Sales Bill with Pay Type not set to Credit", " ", {
          timeOut: 5000
        })
        return;
      }

    
     
      if (this.selectedPaymentType['type'] != 'CREDIT' && this.customerHaveCreditAccount && this.saleDataByBillRefAndCustomer['creditAmount']) {
      
        this.toasterService.warning("Pay Type must be CREDIT and Bill Type must be Account as Sales Bill Payment Type is Credit", " ", {
          timeOut: 5000
        })
        return;
      }
     
     
      if (this.selectedBillType != 'Account' && this.customerHaveCreditAccount && this.saleDataByBillRefAndCustomer['creditAmount']) {
        
        this.toasterService.warning("Pay Type must be CREDIT and Bill Type must be Account as Sales Bill Payment Type is Credit", " ", {
          timeOut: 5000
        })
        return;
      }

     
      let payload = Object.assign({}, this.creditNoteInformationForm.value);
      payload['returnType'] = 'Sales';
      payload['returnTypeReason'] = this.salesReturnType['sales'];
      payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
      payload['createdUser'] = localStorage.getItem('id');
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['customerModel'] = this.selectedCustomer;
      payload['status'] = this.selectedStatus;
      payload['approvedBy'] = { 'employeeId': localStorage.getItem('id') };
      payload['approvedByEmp'] = this.approvedEmpName;
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['createdUser'] = localStorage.getItem('id');
      payload['netAmount'] = this.netAmount;
      if (this.selectedPaymentType['type'] == 'CREDIT') {
        payload['paymentStatus'] = 'Pending';
      } else {
        payload['paymentStatus'] = 'Paid';
      }

      if (payload['billId'] != null && payload['billId'] != undefined) {
        this.creditNoteService.checkSalesData(payload['billId']).subscribe(salesResponse => {
          if (salesResponse['responseStatus']['code'] == 200) {
            if (salesResponse['result'] != null && salesResponse['result'] != undefined) {
              this.onSaveCreditNote(payload);
            } else {
              this.toasterService.warning('Bill No Invalid for Customer stated', " ", {
                timeOut: 2000
              })
            }

          }
        })
      }



    }
  }

  onSaveCreditNote(creditNoteInformationForm: Object) {
    if (this.type1 == 'Y' || this.type1 == 'N' || this.type2 == 'Y' || this.type2 == 'N') {
      if (this.selectedStatus === 'Approved') {

        this.creditNoteInformationForm.get('creditDate').setErrors({ 'incorrect': true })
        this.spinnerService.show();
        this.creditNoteService.saveCreditNoteData(creditNoteInformationForm).subscribe(
          savedCreditNoteResponse => {
            if (savedCreditNoteResponse instanceof Object) {
              if (savedCreditNoteResponse['responseStatus']['code'] === 200) {
                this.spinnerService.hide();
                this.savedCreditNote = savedCreditNoteResponse['result'];
                this.updateAccRecievables = this.savedCreditNote['netAmount'];

                if (this.savedCreditNote['customerModel'] == null || this.savedCreditNote['customerModel'] == undefined) {

                  let updateAaccPayablesObject = {
                    'totalAmountToBePaid': this.updateAccRecievables,
                    'paymentDate': this.savedCreditNote['creditDate'],
                    'source': this.savedCreditNote['creditNoteId'],
                    'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                    'paymentNumber': this.selectedPayablesNumber,
                    'selectedStatus': 'Not Approved',
                    'supplierModel': this.savedCreditNote['supplierModel'],
                    'createdUser': localStorage.getItem('id'),
                    'lastUpdateUser': localStorage.getItem('id'),
                    'selectedPaymentStatus': 'Pending',
                    'totalAmountPaid': 0,
                    'sourceType': 'Credit Note',
                    'invoiceNo': this.savedCreditNote['invoiceId'],
                    'sourceRef': this.savedCreditNote['creditNoteNo'],
                    'approvedDate': this.savedCreditNote['approvedDate'],
                    'approvedBy': localStorage.getItem('id'),
                    'supplierName': this.savedCreditNote['supplierModel'] != null && this.savedCreditNote['supplierModel'] != undefined ? this.savedCreditNote['supplierModel']['name'] : '',
                    'customerName': this.savedCreditNote['customerModel'] != null && this.savedCreditNote['customerModel'] != undefined ? this.savedCreditNote['customerModel']['customerName'] : '',
                    'activeS': 'Y'
                  }
                  this.creditNoteService.saveAccountPayables(updateAaccPayablesObject).subscribe(res => {

                  })

                } else {

                  let updateAccRecievablesObject = {
                    'amountToBeReceived': -1 * this.updateAccRecievables,
                    'amountReceived': 0,
                    'receiptDate': this.savedCreditNote['creditDate'],
                    'source': this.savedCreditNote['creditNoteId'],
                    'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                    'receiptNumber': this.selectedReceiptNumber,
                    'status': 'Not Approved',
                    'createdUser': localStorage.getItem('id'),
                    'lastUpdateUser': localStorage.getItem('id'),
                    'paymentStatus': 'Pending',
                    'activeS': 'Y',
                    'paymentTypeId': { 'paymentTypeId': 1 },
                    'sourceType': 'Credit Note',
                    'sourceRef': this.savedCreditNote['creditNoteNo'],
                    'approvedDate': this.savedCreditNote['approvedDate'],
                    'approvedBy': localStorage.getItem('id'),
                    'supplierName': this.savedCreditNote['supplierModel'] != null && this.savedCreditNote['supplierModel'] != undefined ? this.savedCreditNote['supplierModel']['name'] : '',
                    'customerName': this.savedCreditNote['customerModel'] != null && this.savedCreditNote['customerModel'] != undefined ? this.savedCreditNote['customerModel']['customerName'] : '',
                    'billRefNo': this.savedCreditNote['billId'],
                    'creditNumber': this.masterCreditNumber ? this.masterCreditNumber : ''
                  }

                  if (this.savedCreditNote['paymentType']['type'] != 'CREDIT' && (this.savedCreditNote['billType'] == 'Cash Payment' || this.savedCreditNote['billType'] == 'Cash Back')) {

                    // this.creditNoteService.updateCreditNotePaymentStatus(this.savedCreditNote['creditNoteId'], 'Paid').subscribe(res => {

                    // })

                  } else if (this.savedCreditNote['paymentType']['type'] == 'CREDIT' && this.savedCreditNote['billType'] == 'Credit Note') {
                    // this.creditNoteService.updateCreditNotePaymentStatus(this.savedCreditNote['creditNoteId'], 'Pending').subscribe(res => {

                    // })
                  } else {
                    if (this.savedCreditNote['paymentType']['type'] == 'CREDIT' && this.savedCreditNote['billType'] == 'Account') {
                      this.creditNoteService.saveAccountReceivables(updateAccRecievablesObject).subscribe(response => {

                      });
                    }
                  }

                }

                this.toasterService.success(savedCreditNoteResponse['message'], 'Success', {
                  timeOut: 3000
                });

                this.netAmount = 0;
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
        this.onResetCreditNote();
      } else {
        this.toasterService.warning('Status Not Selected', "", {
          timeOut: 5000
        })
      }
    }
  }

  onResetCreditNote() {
    this.creditNoteInformationForm.reset();
    this.approvedBy = undefined;
    this.creditNoteInformationForm.patchValue({
      'creditDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      'approvedDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      'approveDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    });
    this.selectedStatus = { name: ' Not Approved' };
    this.billId = '',
      this.selectedSupplier = '',
      this.selectedCustomer = '',
      this.invoiceId = '',
      this.remarks = '',
      this.selectedSupplier = undefined;
    this.showApproveByDate = false;
    this.selectedCustomer = undefined;
    this.showApproveByDate = undefined;
    this.showPaymentStatus = undefined;
    this.creditNoteService.getCreditNoteNumber().subscribe(CnNum => {
      if (CnNum['responseStatus']['code'] == 200) {
        this.creditNoteNo = CnNum['result'];
      }
    });
    this.netAmount = 0;
    this.discount = undefined;
    this.taxAmt = undefined;
    this.amounts = undefined;
  }

  onTypeChanged(event) {
    this.creditNoteInformationForm.patchValue({
      'creditDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      'approvedDate': '',
      'approveDate': '',
    });
    if (this.type2 == 'N') {
      this.netAmount = 0;
      this.onResetCreditNote();
    } else if (this.type2 == 'Y') {
      this.netAmount = 0;
      this.onResetCreditNote();
    }
  }


  customerHaveCreditAccount: boolean
  masterCreditNumber: boolean
  getCustomerMasterByCustomerId(customerId) {
    this.creditNoteService.getMasterByCustomerId(customerId).subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        if (res['result'] != null) {
          this.customerHaveCreditAccount = true;
          this.masterCreditNumber = res['result']['creditNumber']
        }
        else {
          this.customerHaveCreditAccount = false;
        }
      }
    })
  }


  getcustomerDataById(customerId){
    this.creditNoteService.getCustomerDataById(customerId).subscribe(res=>{
      if(res instanceof Object){
        if(!res['result']){
          this.toasterService.warning("Customer does not exist in system","",{
            timeOut:5000
          })
          
        }
      }
    })
  }
}
