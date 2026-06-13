import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { isNumeric } from 'rxjs/util/isNumeric';
import { PurchaseReturnService } from './purchase-return.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { popUpService } from '../../shared/popUpService';
import { DebitNoteComponent } from '../../finance/debit-note/debit-note.component';
import { BsModalService } from 'ngx-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-purchase-returns',
  templateUrl: './purchase-returns.component.html',
  styleUrls: ['./purchase-returns.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PurchaseReturnsComponent implements OnInit {

  purchaseReturnNo: String;
  private gridApi;
  showPRFlag: boolean = true;
  purchaseReturnsGridOptions: GridOptions;

  constructor(private purchaseReturnSvc: PurchaseReturnService, private toasterService: ToastrService,
    private datePipe: DatePipe, private popUpService: popUpService, public modalService: BsModalService, private spinnerService: Ng4LoadingSpinnerService) {
    this.initPRInfo();
    this.purchaseReturnSvc.getDebitNoteNumber().subscribe(debitNoteNum => {
      if (debitNoteNum['responseStatus']['code'] == 200) {
        this.debitNoteNo = debitNoteNum['result'];
      }
    });

    this.purchaseReturnSvc.getAccountPayablesNumber().subscribe(paymentNumber => {
      if (paymentNumber['responseStatus']['code'] == 200) {
        this.selectedPaymentNumber = paymentNumber['result'];
      }
    });

    this.purchaseReturnsGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.purchaseReturnsGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }
  }

  tooltipRenderer = function (params) {
    if (params.value != null && params.value != undefined) {
      return '<span title="' + params.value + '">' + params.value + '</span>';
    }
    else {
      return '<span title="' + params.value + '">' + '' + '</span>';
    }
  }

  columnDefs = [{ headerName: 'Item Code', field: 'item', sortable: true, resizable: true, filter: true, checkboxSelection: true },
  { headerName: 'Item Name', field: 'description', sortable: true, resizable: true, filter: true, cellRenderer: this.tooltipRenderer },
  { headerName: 'Formulation', field: 'formulation', sortable: true, resizable: true, filter: true },
  { headerName: 'Quantity', field: 'quantity', sortable: true, resizable: true, filter: true, width: 100 },
  { headerName: 'Bonus', field: 'bonus', sortable: true, resizable: true, filter: true, width: 100 },
  { headerName: 'Batch No', field: 'batchNo', sortable: true, resizable: true, filter: true, width: 100 },
  { headerName: 'Return Type', field: 'returnType', sortable: true, resizable: true, filter: true, width: 150 },
  { headerName: 'Expiry', field: 'expiry', sortable: true, resizable: true, filter: true, width: 100 },
  { headerName: 'Return Qty', field: 'returnQty', sortable: true, resizable: true, filter: true, width: 100 },
  { headerName: 'Return Bonus Qty', field: 'returnBnsQty', sortable: true, resizable: true, filter: true, width: 100 },
  { headerName: 'Pack P.Price', field: 'pack', sortable: true, resizable: true, filter: true, width: 120 },
  { headerName: 'P.Price', field: 'pPrice', sortable: true, resizable: true, filter: true, width: 100, hide: true },
  { headerName: 'Disc %', field: 'pdiscount', sortable: true, resizable: true, filter: true, width: 100 },
  { headerName: 'P.VAT', field: 'vat', sortable: true, resizable: true, filter: true, width: 100 },
  { headerName: 'S.Price', field: 'sPrice', sortable: true, resizable: true, filter: true, width: 100, hide: true },
  { headerName: 'Margin', field: 'margin', sortable: true, resizable: true, filter: true, width: 100, hide: true },
  { headerName: 'Total', field: 'total', sortable: true, resizable: true, filter: true, width: 150 },

  ];

  rowData = [];

  prTypes = ['VEHICLE', 'PERSON', 'PARCEL', 'FEDX', 'COURIER'];
  itemTypes = ['Damaged', 'Wrong Price & Wrong Discount', 'Unwanted', 'Shortly expiry', 'Non Movable', 'Slow Moving', 'Not Required Any More', 'Late Delivered', 'Not Delivered'];
  prStatus = ['APPROVED', 'NOT APPROVED'];
  selectPRType: any;
  selectPRStatus: any;
  disableInvoice: boolean = false;
  selectedItem: string;
  itemsCount: number;
  totalQuantity: number = 0;
  roundOff: number = 0;
  serviceCharges = 0;
  totalAmount = 0;
  suppliers: any[] = [];
  purchaseRtnItems: any[] = [];
  grnNumber: string;
  fetchInvoiceSuccess: boolean = false;
  invoiceItems: any[] = [];
  selectedSupplier: Object;
  selectedItemModel: Object;
  respObj: Object;
  respItemObj: Object;
  invoiceId: string;
  invoiceModel: Object;
  prDate: string;
  grnDate: string;
  bonusQuantity = 0;
  returnType: string;
  bsModalRef: any;

  purchaseReturnsForm: FormGroup;
  purchaseReturnsFormValidations = {
    purchaseReturnNo: new FormControl(''),
    grnNumber: new FormControl(''),
    prDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]),
    grnDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]),
    invoiceDt: new FormControl(''),
    invoiceId: new FormControl('', [Validators.required, Validators.pattern(/[0-9]*/)]),
    selectPRStatus: new FormControl(''),
    selectPRType: new FormControl(''),
    totalQuantity: new FormControl(''),
    itemsCount: new FormControl(''),
    bonusQuantity: new FormControl(''),
    serviceCharges: new FormControl(''),
    roundOff: new FormControl(''),
    returnType: new FormControl('', [Validators.required]),
    returnQty: new FormControl('', [Validators.required]),
    bonusQty: new FormControl('')
  }


  debitNoteNo: any;
  selectedPaymentNumber: any;

  initPRInfo() {
    this.getActiveSuppliers();
    this.purchaseReturnSvc.fetchPRNumber().subscribe(CnNum => {
      if (CnNum['responseStatus']['code'] == 200) {
        this.purchaseReturnNo = CnNum['result'];
      }
    });
    this.generategrnno(1);
  }

  ngOnInit() {
    this.purchaseReturnsForm = new FormGroup(this.purchaseReturnsFormValidations);
  }

  checkFormDisability() {
    let itemsSum;
    if (this.gridApi) {
      itemsSum = this.gridApi.getDisplayedRowCount();
    }
    return itemsSum <= 0;
  }

  generatePRNum() {
    this.purchaseReturnSvc.fetchPRNumber().subscribe(CnNum => {
      if (CnNum['responseStatus']['code'] == 200) {
        this.purchaseReturnNo = CnNum['result'];
      }
    });
  }

  getActiveSuppliers() {
    this.purchaseReturnSvc.getSuppliersData('').subscribe(activeSupplierResponse => {
      if (activeSupplierResponse instanceof Object) {
        if (activeSupplierResponse['responseStatus']['code'] === 200) {
          this.suppliers = activeSupplierResponse['result'];
        }
      }
    }
    );
  }

  bonusDiv: boolean = false;

  onSupplierChange(selectedSupplier: any) {
    if (selectedSupplier instanceof Object) {
      this.selectedSupplier = selectedSupplier;
      this.retrieveSupplierItems(selectedSupplier['supplierId']);
    }
    else {
      this.selectedSupplier = undefined;
    }
  }

  itemId: any;
  selectedBonus: any;
  stockQty: any;
  originalStockQty: any;
  onItemCodeChange(selectedItemModel: any) {
    if (selectedItemModel['batchNo'] != null && selectedItemModel['batchNo'] != undefined) {
      this.itemId = selectedItemModel != null && this.selectedItemModel != undefined ? selectedItemModel['itemsModel']['itemId'] : this.bonusDiv = false;
      if (selectedItemModel instanceof Object) {
        this.selectedItemModel = selectedItemModel;
        let itemId = this.selectedItemModel != null && this.selectedItemModel != undefined ? this.selectedItemModel['itemsModel']['itemId'] : '';

        this.purchaseReturnSvc.getStockQty(this.selectedItemModel['batchNo'], itemId, this.invoiceGrnNo).subscribe(res => {
          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              this.stockQty = res['result'];
              let qty = res['result']['quantity'];
              this.originalStockQty = qty / res['result']['pack'];
            }
          }
        }
          , error => {
            this.toasterService.error('The Stock Dont Have Proper Details', 'Please Check In Edit Stock OR Contact Administrator', {
              timeOut: 5000
            })
          }
        );
      }
      else {
        this.selectedItemModel = undefined;
      }
      if (this.selectedItemModel['bonus'] != null && this.selectedItemModel['bonus'] != undefined
        && this.selectedItemModel['bonus'] != '') {
        this.bonusDiv = true;
      }
      if (this.selectedItemModel['bonus'] == Number(0)) {
        this.bonusDiv = false
      }
    }
    else {
      this.toasterService.error(selectedItemModel['itemsModel']['itemName'] + 'This Item Dont Have Any Batch No At Invoice Level,Couldn`t Return The Item', 'Please Contact Administrator', {
        timeOut: 5000
      })
    }

  }

  retrieveSupplierItems(supplierId: number) {
    this.purchaseReturnSvc.retrieveSupplierItems(supplierId).subscribe(
      retrieveSupplierItemsResponse => {
        if (retrieveSupplierItemsResponse instanceof Object) {
          if (retrieveSupplierItemsResponse['responseStatus']['code'] === 200) {

          }
        }
      }
    );
  }
  stockItem: any;


  addSelected() {
    this.formDisable = false;
    if (this.selectedItemModel['orderQuantity'] < this.purchaseReturnsForm.get('returnQty').value) {
      this.purchaseReturnsForm.controls['returnQty'].setErrors({ error: 'Return qty greater than order qty' });
      return;
    }

    if (this.selectedItemModel['bonus'] < this.purchaseReturnsForm.get('bonusQty').value) {
      this.purchaseReturnsForm.controls['bonusQty'].setErrors({ error: 'Bonus Qty greater than original bonus' });
      return;
    }

    this.bonusDiv = false;
    var newItems = [this.createNewRowData(this.selectedItemModel)];

    this.gridApi.updateRowData({ add: newItems });
    this.itemsCount = this.gridApi.getDisplayedRowCount();
    if (newItems[0] && isNumeric(newItems[0].returnQty)) {
      this.totalQuantity = +this.totalQuantity + +newItems[0].returnQty;
    }
    if (newItems[0] && isNumeric(newItems[0].total)) {
      let amt = +this.totalAmount + +newItems[0].total;
      this.totalAmount = parseFloat(amt.toFixed(2))

    }
    if (newItems[0] && isNumeric(newItems[0].bonus)) {
      this.bonusQuantity = +this.bonusQuantity + +newItems[0].bonus;
    }
    let supplierId = this.selectedItem['purchaseOrderModel'].supplierModel.supplierId


    this.selectedItem = undefined;
    this.returnType = undefined;
    this.purchaseReturnsForm.controls['returnQty'].setValue('');
    this.purchaseReturnsForm.controls['bonusQty'].setValue('');

  }

  onRemoveSelected() {
    var selectedData = this.gridApi.getSelectedRows();
    var res = this.gridApi.updateRowData({ remove: selectedData });
    this.itemsCount = this.gridApi.getDisplayedRowCount();
    let qty = selectedData[0].returnQty;

    if (selectedData[0] && isNumeric(selectedData[0].returnQty)) {
      this.totalQuantity = +this.totalQuantity - +selectedData[0].returnQty;
    }
    if (selectedData[0] && isNumeric(selectedData[0].total)) {
      this.totalAmount = parseFloat((+this.totalAmount - +selectedData[0].total).toFixed(2));

    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.itemsCount = this.gridApi.getDisplayedRowCount();
    this.totalQuantity = this.quantitySum(this.gridApi);
    this.totalAmount = this.totalSum(this.gridApi);

  }

  invoiceIdTogetReturn: any;
  invoiceGrnNo: any;

  fetchInvoiceDetails(invoiceNo: number) {
    this.purchaseReturnSvc.fetchByInvoiceByNumber(invoiceNo).subscribe(invoiceDetails => {
      if (invoiceDetails instanceof Object) {
        if (invoiceDetails['responseStatus']['code'] === 200) {
          this.invoiceModel = invoiceDetails['result'];
          this.invoiceGrnNo = this.invoiceModel['grnNo'];
          this.invoiceIdTogetReturn = this.invoiceModel['invoiceId'];
          this.populateDetails(this.invoiceModel);
        } else {
          this.purchaseReturnsForm.controls['invoiceId'].setErrors({ error: 'enter valid Invoice Number' });
        }
      }
    },
      err => this.purchaseReturnsForm.controls['invoiceId'].setErrors({ error: 'Could not fetch Invoice details' }));
  }

  createNewRowData(itemInfo: any) {

    let itemVal = 0.0;
    var retQty = parseInt((this.purchaseReturnsForm.get('returnQty').value));
    var uRate = Number(isNaN(itemInfo['unitRate']) ? 0 : itemInfo['unitRate']) * itemInfo['pack'];
    var pRate = (Number(isNaN(itemInfo['packPPrice']) ? 0 : itemInfo['packPPrice']))
    var disc = Number(isNaN(itemInfo['discountPercentage']) ? 0 : itemInfo['discountPercentage']);
    var tax = itemInfo['itemsModel'] != null && itemInfo['itemsModel'] != undefined ? itemInfo['itemsModel']['tax'] != null &&
      itemInfo['itemsModel']['tax'] != undefined ? (itemInfo['itemsModel']['tax']['categoryValue']) / 100 : 0 : 0
    itemVal = parseFloat((retQty * pRate * (1 - disc / 100) * (1 + tax)).toFixed(2));


    var rowData = {
      item: itemInfo['itemsModel'] != null && itemInfo['itemsModel'] != undefined ? itemInfo['itemsModel']['itemCode'] != null && itemInfo['itemsModel']['itemCode'] != undefined ? (itemInfo['itemsModel']['itemCode']) : 0 : 0,
      description: itemInfo['itemsModel'] != null && itemInfo['itemsModel'] != undefined ? itemInfo['itemsModel']['itemName'] != null ? itemInfo['itemsModel']['itemName'] : null : null,
      formulation: itemInfo['itemsModel'] != null && itemInfo['itemsModel'] != undefined ? itemInfo['itemsModel']['itemForm'] != null ? itemInfo['itemsModel']['itemForm']['form'] : null : null,

      quantity: itemInfo['orderQuantity'],
      bonus: itemInfo['bonus'],
      batchNo: itemInfo['batchNo'],
      returnType: this.purchaseReturnsForm.get('returnType').value,
      expiry: itemInfo['expiryDt'],
      discount: itemInfo['discount'],
      pdiscount: itemInfo['discountPercentage'],
      returnQty: this.purchaseReturnsForm.get('returnQty').value,
      pPrice: Number(isNaN(itemInfo['unitRate']) ? 0 : itemInfo['unitRate']).toFixed(2),
      sPrice: Number(isNaN(itemInfo['unitSaleRate']) ? 0 : itemInfo['unitSaleRate']),
      vat: itemInfo['itemsModel'] != null && itemInfo['itemsModel'] != undefined ? itemInfo['itemsModel']['tax'] != null && itemInfo['itemsModel']['tax'] != undefined ? (itemInfo['itemsModel']['tax']['categoryValue']) : 0 : 0,
      margin: Number(isNaN(itemInfo['margin']) ? 0 : itemInfo['margin']),
      total: itemVal.toFixed(2),
      itemObj: itemInfo,
      pack: (Number(isNaN(itemInfo['packPPrice']) ? 0 : itemInfo['packPPrice'])).toFixed(2),
      returnBnsQty: this.purchaseReturnsForm.get('bonusQty').value != null && this.purchaseReturnsForm.get('bonusQty').value != undefined && this.purchaseReturnsForm.get('bonusQty').value != '' ? this.purchaseReturnsForm.get('bonusQty').value : 0,
      stockId: this.stockQty['stockId']
    };

    return rowData;
  }

  quantitySum(values) {
    let quanty = 0;
    this.gridApi.forEachNode(function (node) {
      var n = node.data.qty;
      if (n && isNumeric(n)) {
        quanty = +quanty + +n;
      }
    });
    return quanty;
  }

  populateDetails(invoiceDetails: any) {
    this.onSupplierChange(invoiceDetails['supplierModel']);
    this.purchaseReturnsForm.controls['invoiceDt'].setValue(invoiceDetails['invoiceDt']);
    this.invoiceItems = invoiceDetails['invoiceItems'];
    this.purchaseReturnsForm.controls['selectPRStatus'].setValue(invoiceDetails['invoiceStatus'] ? invoiceDetails['invoiceStatus'].status : '');
    this.purchaseReturnSvc.fetchPurchaseReturnDataByInvoiceNo(invoiceDetails['invoiceNo']).subscribe(purchaseReturnDetails => {
      if (purchaseReturnDetails['responseStatus']['code'] === 200) {
        if (purchaseReturnDetails['result']['length'] > 0) {
          this.toasterService.error('Already a purchase return credit note exists for this invoice no', 'Error Occurred', {
            timeOut: 5000
          });
        }
      }
    });
  }

  updateTotalPrice(value: number, type: string) {
    this.totalAmount = this.totalSum(this.gridApi);

    if (isNumeric(value) || value == '') {
      if (type == 'purchaseReturnsCharges') {
        this.purchaseReturnsForm.controls['serviceCharges'].setValue(value);
        let totalAmount = +this.totalAmount.toFixed(2) + Number(value) + Number(this.purchaseReturnsForm.get('roundOff').value);
        this.totalAmount = parseFloat(Number(totalAmount).toFixed(2));

      } else if (type == 'purchaseReturnsRoundOff') {
        this.purchaseReturnsForm.controls['roundOff'].setValue(value);
        let amount = +this.totalAmount + Number(value) + Number(this.purchaseReturnsForm.get('serviceCharges').value);
        this.totalAmount = parseFloat(Number(amount).toFixed(2));
      }
    }
  }

  totalSum(values) {

    let sum = 0;
    this.gridApi.forEachNode(function (node) {
      var n = node.data.total;
      if (n && isNumeric(n)) {
        sum = +sum + +n;

      }
    });
    return sum;
  }
  formDisable = true;
  debitNoteId: any;
  update_Payables_Amt: any;
  purchaseReturnResponse: any;

  savePurchaseReturns() {
    this.spinnerService.show();
    this.formDisable = false;
    this.purchaseReturnSvc.savePurchaseReturns(this.createPayload()).subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] === 200) {
            //   this.spinnerService.hide();
            //console.log(this.createItemPayload(res['result']))
            this.purchaseReturnSvc.savePurchaseReturnItem(this.createItemPayload(res['result'])).subscribe(
              response => {
                if (response instanceof Object) {
                  if (response['responseStatus']['code'] === 200) {
                    this.purchaseReturnResponse = response['result'];


                    this.toasterService.success(response['message'], 'Success', {
                      timeOut: 3000
                    });

                    let debitNote = {
                      'debitNoteNo': this.debitNoteNo,
                      'debitDate': this.purchaseReturnsForm.get('prDate').value,
                      'returnType': 'Purchase Returns',
                      'returnTypeReason': 'Purchase Returns',
                      'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                      'invoiceId': res['result']['invoiceModel']['invoiceId'],
                      'supplierModel': res['result']['invoiceModel']['supplierModel'],
                      'amount': res['result']['totalAmount'],
                      'createdUser': localStorage.getItem('id'),
                      'lastUpdateUser': localStorage.getItem('id'),
                      'remarks': 'Purchase Returns',
                      'activeS': 'Y',
                      'netAmount': res['result']['totalAmount'],
                      'approvedBy': { 'employeeId': localStorage.getItem('id') },
                      'approvedDate': this.purchaseReturnsForm.get('prDate').value,
                      'selectedStatus': res['result']['status']
                    }

                    this.purchaseReturnSvc.saveDebitNoteData(debitNote).subscribe(
                      result => {
                        this.debitNoteId = result['result']

                        this.update_Payables_Amt = -1 * res['result']['totalAmount'];

                        let accountPayObject = {
                          'paymentNumber': this.selectedPaymentNumber,
                          'paymentDate': this.purchaseReturnsForm.get('prDate').value,
                          'supplierModel': res['result']['invoiceModel']['supplierModel'],
                          'selectedStatus': 'Not Approved',
                          'totalAmountPaid': 0,
                          'activeS': 'Y',
                          'createdUser': localStorage.getItem('id'),
                          'lastUpdateUser': localStorage.getItem('id'),
                          'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                          'selectedPaymentStatus': 'Pending',
                          'source': this.debitNoteId['debitNoteId'],
                          'sourceRef': this.purchaseReturnNo,
                          'invoiceNo': res['result']['invoiceModel']['invoiceNo'],
                          'totalAmountToBePaid': this.update_Payables_Amt,
                          'sourceType': 'Purchase Returns - Debit Note',
                          'supplierName': res['result']['invoiceModel']['supplierModel']['name']
                        }

                        this.purchaseReturnSvc.saveAccountPayables(accountPayObject).subscribe(
                          response => {
                            this.formDisable = true;
                            this.showPRFlag = false;
                            this.purchaseReturnsForm.reset();
                            this.totalAmount = 0;
                            this.selectedSupplier = undefined;
                            this.selectedItem = undefined;
                            this.gridApi.setRowData([]);
                            this.initPRInfo();
                            this.showPRFlag = true;
                            this.dateReset();
                            this.onReset();
                            this.stockQty = undefined;
                            this.originalStockQty = undefined;

                          }
                        )

                      }
                    )


                  }
                }
              }
            );
            this.spinnerService.hide();
          }
        }
      }, error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      }
    );
  }

  createItemPayload(purchaseReturn: any) {
    let purchaseRtnItem = [];
    this.gridApi.forEachNode(function (node) {
      let prItems = {
        purchaseReturnModel: {purchaseReturnId:purchaseReturn.purchaseReturnId},
        purchaseReturnType: node.data.returnType,
        batchNo: node.data.batchNo,
        itemsModel: node.data.itemObj.itemsModel,
        purchaseQuantity: node.data.quantity,
        returnQuantity: node.data.returnQty,
        bonusQuantity: node.data.bonus,
        amount: node.data.total,
        createdUser: localStorage.getItem('id'),
        lastUpdateUser: localStorage.getItem('id'),
        bonusQty: node.data.returnBnsQty,
        stockId: node.data.stockId
      }
      purchaseRtnItem.push(prItems)
    });
    return purchaseRtnItem;
  }

  createPayload() {
    this.formDisable = true;
    this.respObj = undefined;
    return this.respObj = {
      purchaseReturnNo: this.purchaseReturnsForm.get('purchaseReturnNo').value,
      purchaseReturnDt: this.purchaseReturnsForm.get('prDate').value,
      invoiceModel: this.invoiceModel,
      status: this.selectPRStatus,
      supplierModel: this.selectedSupplier,
      charges: this.purchaseReturnsForm.get('serviceCharges').value,
      totalAmount: this.totalAmount,
      genDebitNote: '',
      deliveryMode: this.purchaseReturnsForm.get('selectPRType').value,
       purchaseReturnitems: [],
      createdUser: localStorage.getItem('id'),
      lastUpdateUser: localStorage.getItem('id'),

    }
  }

  generategrnno(pharmacyId: number) {
    this.purchaseReturnSvc.generatepurchasegrnno(pharmacyId).subscribe(
      generategrnnoResponse => {
        if (generategrnnoResponse['responseStatus']['code'] == 200) {
          this.grnNumber = 'DP' + generategrnnoResponse['result'];
        }
      }
    );
  }

  onSubmit() {

  }

  addItems() {
    return this.selectedItemModel != undefined && this.purchaseReturnsForm.get('returnQty').value && this.returnType != undefined;
  }

  dateReset() {
    this.purchaseReturnsForm.patchValue({
      'prDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      'grnDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    });


  }

  onReset() {
    let prNumber = this.purchaseReturnsForm.get('purchaseReturnNo').value;
    let grnNumber = this.purchaseReturnsForm.get('grnNumber').value;
    let prdate = this.purchaseReturnsForm.get('prDate').value;
    let grndate = this.purchaseReturnsForm.get('grnDate').value;
    this.purchaseReturnsForm.reset();
    this.showPRFlag = false;
    this.purchaseReturnsForm.controls['purchaseReturnNo'].setValue(prNumber);
    this.purchaseReturnsForm.controls['grnNumber'].setValue(grnNumber);
    this.purchaseReturnsForm.controls['prDate'].setValue(prdate);
    this.purchaseReturnsForm.controls['grnDate'].setValue(grndate);
    this.totalAmount = 0;
    this.selectedSupplier = undefined;
    this.selectedItem = undefined;
    this.gridApi.setRowData([]);
    this.showPRFlag = true;
    this.bonusDiv = false;

    this.stockQty = undefined;
    this.originalStockQty = undefined;
  }

  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false,
    class: "my-modal",
    initialState: {}
  };

  debitNote(event) {
    this.config.initialState = { invoiceId: this.invoiceId };
    this.modalService.show(DebitNoteComponent, this.config);

  }
}
