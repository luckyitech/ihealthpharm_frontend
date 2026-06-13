import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ReceiptsService } from './../../finance/receipts/shared/receipts.service';
import { isNumeric } from 'rxjs/util/isNumeric';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GridOptions, ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SalesBillingService } from 'src/app/sales/sales-billing/sales-billing.service';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-sales-returns',
  templateUrl: './sales-returns.component.html',
  styleUrls: ['./sales-returns.component.scss'],
  providers: [ReceiptsService]
})

export class SalesReturnsComponent implements OnInit {

  salesReturnNumber: any;
  private gridApi;
  payload: Object;
  salesReturnHistoryGridOptions: GridOptions;
  salesReturnHistoryItemsGridOptions: GridOptions;

  constructor(private salesService: SalesBillingService, private toasterService: ToastrService,
    private datePipe: DatePipe, private receiptsService: ReceiptsService,
    private spinnerService: Ng4LoadingSpinnerService) {

    this.salesReturnGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.salesReturnGridOptions.rowSelection = 'single';
    this.salesReturnGridOptions.columnDefs = this.columnDefs;

    this.salesReturnHistoryItemsGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.salesReturnHistoryItemsGridOptions.rowSelection = 'single';
    this.salesReturnHistoryItemsGridOptions.columnDefs = this.historyColumnDefs;

    this.salesService.getSalesReturnBillNumber().subscribe(
      salesReturnNumber => {
        if (salesReturnNumber['responseStatus']['code'] === 200) {
          this.salesReturnNumber = salesReturnNumber['result'];
        }
      }
    );

    this.salesService.getCreditNoteNumber().subscribe(creditNoteNum => {
      if (creditNoteNum['responseStatus']['code'] == 200) {
        this.creditNoteNo = creditNoteNum['result'];
      }
    });

    this.receiptsService.getAccountReceivablessNumber().subscribe(receiptNumber => {
      if (receiptNumber['responseStatus']['code'] == 200) {
        this.selectedReceiptNumber = receiptNumber['result'];
      }
    });

    this.salesReturnGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.salesReturnGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }

    this.salesReturnHistoryGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };

    this.salesReturnHistoryGridOptions.rowSelection = 'single';
    this.salesReturnHistoryGridOptions.columnDefs = this.salesReturnGridDefs;
    this.salesReturnHistoryGridOptions.rowData = [];

    this.getAllBillsByLimit(0, 100);
    this.getPaymentTypes();
    this.getListOfBillTypes();


  }


  paymentStatusRead: any
  getPaymentTypes() {
    this.salesService.getallpaymenttypes().subscribe(
      getallpaymenttypesResponse => {
        if (getallpaymenttypesResponse['responseStatus']['code'] === 200) {
          this.paymentTypes = getallpaymenttypesResponse['result'];
        }
      }
    );
  }

  getListOfBillTypes() {
    this.salesService.getBillTypes().subscribe(billTypes => {
      this.listOfBillTypes = billTypes;
    });
  }

  ngOnInit() {
    this.salesReturnFormInformation = new FormGroup(this.salesReturnFormInformationValidations);
    this.salesReturnGridOptions.api.setRowData([]);
  }


  salesReturnGridOptions: GridOptions;
  retrievedSales = [];
  showGrid: boolean = false;
  selectedItemModel: Object;
  newItems: any;
  needToUpdateSalesTotal: any;
  creditNoteNo: any;

  items = [];
  selectedBill: any;
  selectedPaymentType: any[] = [];
  selPaymetObj: Object;
  selectedReturnType: any;
  selectedStockStatus: any;

  itemsCount: number;
  totalQuantity: number = 0;
  bonusQuantity: number = 0;
  serviceCharges = 0;
  totalAmount = 0;

  listOfBillTypes: any = [];

  paymentTypes: any = []

  ReturnType = [
    { type: 'Not Required Any More' },
    { type: 'Customer Didn’t Turn Up' },
    { type: 'Medicine Changed' },
    { type: 'Treatment Changed' },
    { type: 'Wrong Medicine' }
  ];

  stockStatus = [
    { name: 'Not Approved' },
    { name: 'Approved' }
  ];

  defaultStockStatus = this.stockStatus[0];


  salesReturnFormInformation: FormGroup;

  salesReturnFormInformationValidations = {
    salesReturnNumber: new FormControl(''),
    salesReturnDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    status: new FormControl('', [Validators.required]),
    billNumber: new FormControl('', Validators.required),
    paymentType: new FormControl('', Validators.required),
    billType: new FormControl('', Validators.required),
    totalAmount: new FormControl(''),
    customerName: new FormControl(''),
    phoneNumber: new FormControl(''),
    policyCode: new FormControl(''),
    membershipCardNumber: new FormControl(''),
    items: new FormControl(''),
    salesReturnId: new FormControl(''),
    salesReturnType: new FormControl('', Validators.required),
    itemNameSelected: new FormControl('', Validators.required),
    purchaseQuantity: new FormControl(''),
    returnQuantity: new FormControl('', Validators.required),
    bonusItems: new FormControl(''),
    bonusQuantity: new FormControl(''),
    amount: new FormControl(''),
    charges: new FormControl('', [Validators.pattern(/^\d{0,7}(\.\d{1,2})?$/)]),
    itemsCount: new FormControl(''),
    totalQuantity: new FormControl(''),
    roundOff: new FormControl(''),
    activeS: new FormControl(''),
    createdUser: new FormControl(''),
    lastUpdateUser: new FormControl(''),
    salesItemId: new FormControl(''),
    paymentStatus: new FormControl('')
  }

  tooltipRenderer = function (params) {
    if (params.value != null && params.value != undefined) {
      return '<span title="' + params.value + '">' + params.value + '</span>';
    }
    else {
      return '<span title="' + params.value + '">' + '' + '</span>';
    }
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
    { headerName: 'Item Code', field: 'item', sortable: true, resizable: true, filter: true },
    { headerName: 'Item Name', field: 'itemName', sortable: true, resizable: true, filter: true, cellRenderer: this.tooltipRenderer },
    { headerName: 'Batch No', field: 'batchNo', sortable: true, resizable: true, filter: true },
    { headerName: 'Formulation', field: 'formulation', sortable: true, resizable: true, filter: true },
    { headerName: 'Purchase Quantity', field: 'quantity', sortable: true, resizable: true, filter: true },
    { headerName: 'Bonus', field: 'bonus', sortable: true, resizable: true, filter: true },
    { headerName: 'Return Quantity', field: 'returnQuantity', sortable: true, resizable: true, filter: true, editable: true },
    { headerName: 'Return Type', field: 'returnType', sortable: true, resizable: true, filter: true },
    { headerName: 'Expiry Date', field: 'expiryDt', sortable: true, resizable: true, filter: true },
    { headerName: 'Sale Price', field: 'salePrice', sortable: true, resizable: true, filter: true },
    { headerName: 'Disc. Percent', field: 'discountPercentage', sortable: true, resizable: true, filter: true, hide: true },
    {
      headerName: 'Discount', field: 'discount', sortable: true, resizable: true, filter: true,

      valueGetter: function (params) {
        let discount = Number(params.data.discountPercentage * params.data.returnQuantity * params.data.salePrice / 100);
        params.data.discount = discount.toFixed(2);
        return params.data.discount;
      }
    },
    { headerName: 'Vat', field: 'vat', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Amount', field: 'total', sortable: true, resizable: true, filter: true,
      valueGetter: function (params) {

        var unit = params.data.salePrice * params.data.returnQuantity;
        var vat = params.data.vat;

        var disc = params.data.discountPercentage != null && params.data.discountPercentage != undefined ? params.data.discountPercentage : 0;
        var retQty = params.data.returnQuantity != null && params.data.returnQuantity != undefined ? params.data.returnQuantity : 0;
        var sprice = params.data.salePrice != null && params.data.salePrice != undefined ? params.data.salePrice : 0;

        var discount = Number(retQty * sprice * disc / 100);
        var vats = 1 + (vat / 100)
        var totals = (unit - discount) * vats;
        let s = totals.toFixed(2);
        var total = parseFloat(s);

        return total;
      }
    }
  ];

  accountRecievbles = [];
  customername: any;

  billObj
  onBillSelected(bill: any) {
    this.selectedPaymentType = [];
    this.selectedBill = bill;
    this.billObj = bill
    //console.log(this.selectedBill)
    this.salesService.getSalesItemsBasedOnBillCode({ billId: this.selectedBill['billId'] }).subscribe(
      res => {
        if (res['responseStatus']['code'] === 200) {
          this.items = res['result'];
          this.billObj = this.items[0]['billId']
          let customerfirstName = this.items[0]['billId']['customerModel'] != null && this.items[0]['billId']['customerModel'] != undefined ? this.items[0]['billId']['customerModel']['customerName'] : null;
          let customerLastName = this.items[0]['billId']['customerModel'] != null && this.items[0]['billId']['customerModel'] != undefined ? this.items[0]['billId']['customerModel']['lastName'] : null;

          this.customername = customerfirstName + ' ' + customerLastName;

          this.salesReturnFormInformation.patchValue({

            customerName: this.items[0]['billId']['customerModel'] != null && this.items[0]['billId']['customerModel'] != undefined ? this.customername : null,
            phoneNumber: this.items[0]['billId']['customerModel'] != null && this.items[0]['billId']['customerModel'] != undefined ? this.items[0]['billId']['customerModel']['phoneNumber'] : null,
            policyCode: this.items[0]['billId']['customerInsuranceModel'] != null && this.items[0]['billId']['customerInsuranceModel'] != undefined ? this.items[0]['billId']['customerInsuranceModel']['policyCode'] : null,
            membershipCardNumber: this.items[0]['billId']['customerMembershipModel'] != null && this.items[0]['billId']['customerMembershipModel'] != undefined ? this.items[0]['billId']['customerMembershipModel']['membershipCardNumber'] : null,
          });

          this.getCustomerMasterByCustomerId(this.items[0]['billId']['customerModel']['customerId'])

        }
      }
    );

  }

  getAllBillsByLimit(start, end) {
    this.salesService.getBillsByLimit(start, end).subscribe(billResponse => {
      if (billResponse instanceof Object) {
        if (billResponse['responseStatus']['code'] === 200) {
          this.RetrievedSalesIds = billResponse['result'];
          this.spinnerService.hide();
        }
      }

    },
      error => {
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          });
      })
  }

  alternativeBillSearch(event) {
    this.spinnerService.show();
    this.salesService.getBillsByBillNo(event['target']['value']).subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.RetrievedSalesIds = res['result'];
        if (this.RetrievedSalesIds.length === 0) {

          this.toasterService.warning("With Bill Code", "No Data Found", {
            timeOut: 3000
          });
          this.getAllBillsByLimit(0, 100);
        }
        this.spinnerService.hide();
      }
    },
      error => {
        this.RetrievedSalesIds = [];
        this.spinnerService.hide();
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          });
      })
  }

  onChangeReturnType(event: Event) {
    this.selectedReturnType = event['type'];
  }

  onStockStatusChanged(event: Event) {
    this.selectedStockStatus = event['name'];
  }

  selectedItem: any;
  saleQty: any;
  salesReturnQty: any;
  viewReturnQty: any;

  onItemCodeChange(selectedItemModel: any) {
    if (selectedItemModel instanceof Object) {
      this.selectedItemModel = selectedItemModel;
      var selectedItemId = this.selectedItemModel['itemsModel']['itemId'];
      this.saleQty = this.selectedItemModel['saleQty'];

      this.salesService.getReturnQtyBasedOnId(selectedItemId, this.selectedBill['billId']).subscribe(res => {
        this.salesReturnQty = res['result'];
        this.viewReturnQty = this.saleQty - this.salesReturnQty;
      })
    }
  }

  // sales_return_amount: any;

  onGridReady(params) {
    this.gridApi = params.api;
    this.itemsCount = this.gridApi.getDisplayedRowCount();
    if (params.node.rowIndex !== 0) {
      return { background: '#cccccc' }
    }
  }

  totalTemp: any;

  addSelected() {

    if (this.viewReturnQty <= 0) {

      this.toasterService.error('Item Qty is Zero', 'Unable To Return',
        {
          timeOut: 5000
        })
      return 0;
    }
    if (this.viewReturnQty < this.salesReturnFormInformation.get('returnQuantity').value) {
      this.salesReturnFormInformation.controls['returnQuantity'].setErrors({ error: 'Return qty greater than sale qty' });
      return;
    }

    var newItems = [this.createNewRowData(this.selectedItemModel)];
    this.gridApi.updateRowData({ add: newItems });
    this.itemsCount = this.gridApi.getDisplayedRowCount();
    this.totalQuantity = this.quantitySum(this.gridApi);
    this.bonusQuantity = this.bonusSum(this.gridApi);
    this.totalAmount = this.totalSum(this.gridApi);
    this.totalTemp = this.totalAmount;
    //  this.sales_return_amount = this.totalAmount
    this.needToUpdateSalesTotal = newItems[0]['totalSaleAmount'];
    this.resetAddGrid();

  }


  resetAddGrid() {
    this.selectedItem = undefined;
    this.selectedReturnType = undefined;
    this.selectedItemModel = undefined;
    this.salesReturnFormInformation.get('returnQuantity').setValue('');
    this.viewReturnQty = undefined;
  }

  patchForm() {
    this.salesReturnFormInformation.patchValue({
      itemNameSelected: null,
      returnQuantity: null,
      salesReturnType: null
    });
  }

  createNewRowData(itemInfo: any) {
    var rowData = {
      itemId: itemInfo['itemsModel'] != null && itemInfo['itemsModel'] != undefined ? itemInfo['itemsModel']['itemId'] : 0,
      item: itemInfo['itemsModel'] != null && itemInfo['itemsModel'] != undefined ? itemInfo['itemsModel']['itemCode'] : null,
      itemName: itemInfo['itemsModel']['itemName'],
      formulation: itemInfo['itemsModel']['itemForm'] != null && itemInfo['itemsModel']['itemForm'] != undefined ? itemInfo['itemsModel']['itemForm']['form'] : null,
      quantity: itemInfo['saleQty'],
      bonus: itemInfo['qtyFree'] != null && itemInfo['qtyFree'] != undefined ? itemInfo['qtyFree'] : 0,
      batchNo: itemInfo['batchNo'] != null && itemInfo['batchNo'] != undefined ? itemInfo['batchNo'] : null,
      returnType: this.selectedReturnType,
      expiryDt: itemInfo['stockId'] != null && itemInfo['stockId'] != undefined ? itemInfo['stockId']['expiryDt'] : '0000-00-00',
      purchasePrice: Number(itemInfo['unitPurchasePrice']).toFixed(2),
      salePrice: Number(itemInfo['unitSalePrice'] != null && itemInfo['unitSalePrice'] != undefined ? itemInfo['unitSalePrice'] : 0).toFixed(2),
      returnQuantity: this.salesReturnFormInformation.get('returnQuantity').value,
      saleAmount: Number(itemInfo['saleAmount']).toFixed(2),
      vat: itemInfo['vat'],
      salesItemId: itemInfo['salesItemsId'],
      discountPercentage: itemInfo['discountPercentage'] != null && itemInfo['discountPercentage'] != undefined ? itemInfo['discountPercentage'] : 0,
      discount: Number(isNaN(itemInfo['discount'] ? 0 : itemInfo['discount'])),
      totalSaleAmount: itemInfo['billId']['totalAmount'],
      returnQty: (this.salesReturnFormInformation.get('returnQuantity').value != null && this.salesReturnFormInformation.get('returnQuantity').value != undefined ? this.salesReturnFormInformation.get('returnQuantity').value : 0),

      LabelledAmt: (((((itemInfo['unitSalePrice'] != null && itemInfo['unitSalePrice'] != undefined ? itemInfo['unitSalePrice'] : 0) * this.salesReturnFormInformation.get('returnQuantity').value)
        - (this.salesReturnFormInformation.get('returnQuantity').value * (itemInfo['unitSalePrice'] != null && itemInfo['unitSalePrice'] != undefined ? itemInfo['unitSalePrice'] : 0) * Number(isNaN(itemInfo['discount'] ? 0 : itemInfo['discount'])) / 100))
        * (1 + itemInfo['vat'] / 100)) - ((itemInfo['discount'] ? 0 : itemInfo['discount']))).toFixed(2),

    };
    return rowData;
  }

  payType: any;
  onPaymentTypeSelected(event) {
    this.payType = event;
    // console.log(this.payType)
  }

  totalSum(values) {
    let sum = 0;
    this.gridApi.forEachNode(function (node) {

      var unit = node.data.salePrice * node.data.returnQty;
      var vat = node.data.vat;
      var disc = node.data.discountPercentage;
      var returnQuantity = node.data.returnQty;
      var sprice = node.data.salePrice;
      var discount = Number(returnQuantity * sprice * disc / 100);
      var vats = 1 + (vat / 100);

      var s = (unit - discount) * vats;

      if (s && isNumeric(s)) {
        sum = +sum + +s;
      }
    });

    let sumoff = sum.toFixed(2);

    sum = parseFloat(sumoff);

    /* Math.round(sum) */
    return sum;
  }


  totalAmtCharges: any;
  onServiceCharge(event: Event) {
    console.log(event['target']['value']);
    let val = event['target']['value'];
    var am = Number(isNaN(val) ? 0 : val);
    am = (am < 0 ? 0 : am);
    var amt = this.totalSum(am);
    var amount = amt - am;
    this.totalAmount = parseFloat(amount.toFixed(2));
    this.totalAmtCharges = this.totalAmount;
  }



  onRoundOff(event: Event) {
    var roundOff = event['target']['value'];
    if (roundOff != null && roundOff != undefined && roundOff != 0) {
      this.totalAmount = Number(this.totalAmount) + Number(event['target']['value']);
    } else if (this.salesReturnFormInformation.get('charges').value != null) {
      this.totalAmount = this.totalAmtCharges;
    } else {
      this.totalAmount = this.totalTemp
    }

  }

  onBillTypeSelected(event) {

    this.selectedBillType = event['type'];
  }

  salesReturnModel: any;
  UpdateAccountRecievables = {};
  updateAccRecievables: any;
  creditNoteId: any;
  selectedReceiptNumber: any;
  saleReturnPayType: any;
  salesReturnBillType: any
  roundOffAmt: boolean = false;
  selectedBillType

  onSubmit() {

    if (this.selectedStockStatus === 'Approved') {

      /* if ((this.selectedBillType == 'Cash Back' || this.selectedBillType == 'Cash Payment'
         || this.selectedBillType == 'Cash Refund')
         && (this.payType['type'] == 'CREDIT')) {
         this.toasterService.warning("Can’t use Pay Type CREDIT for Cash Refund or Cash Back", " ", {
           timeOut: 5000
         })
         return;
       }*/

      if ((this.selectedBillType == 'Account' || this.selectedBillType == 'Credit Note') && this.payType['type'] != 'CREDIT') {
        this.toasterService.warning("Pay Type must be CREDIT for Bill Type to be Account or Credit Note", " ", {
          timeOut: 5000
        })
        return;
      }

      if (!this.customerHaveCreditAccount && (this.payType['type'] == 'CREDIT' && this.selectedBillType == 'Account')) {
        this.toasterService.warning("Type cannot be CREDIT and Bill Type Cannot be Account as Customer does not have a Credit Account – cannot create Sales Credit Note", " ", {
          timeOut: 5000
        })
        return;
      }

      if (this.payType['type'] == 'CREDIT' && this.selectedBillType == 'Account' && !this.billObj['creditAmount']) {
        this.toasterService.warning("Type cannot be CREDIT and Bill Type Cannot be Account as Sales Bill Payment Type is not Credit– cannot create Sales Credit Note", " ", {
          timeOut: 5000
        })
        return;
      }

      // console.log(this.billObj)
      if ((this.payType['type'] != 'CREDIT' && this.customerHaveCreditAccount && this.billObj['creditAmount'])) {
        this.toasterService.warning("Type must be CREDIT and Bill Type must be Account as Sales Bill Payment Type is Credit", " ", {
          timeOut: 5000
        })
        return;
      }
      //console.log(this.billObj['creditAmount'] >= 0)

      if (this.selectedBillType != 'Account' && this.customerHaveCreditAccount && this.billObj['creditAmount']) {
        //console.log("========")
        this.toasterService.warning("Type must be CREDIT and Bill Type must be Account as Sales Bill Payment Type is Credit", " ", {
          timeOut: 5000
        })
        return;
      }

      let saleReturnObject = {
        'salesReturnNumber': this.salesReturnNumber, 'billNumber': { 'billId': this.selectedBill['billId'] },
        'salesReturnDate': this.salesReturnFormInformation.value['salesReturnDate'],
        'status': this.selectedStockStatus, 'totalAmount': this.totalAmount,
        'paymentType': { 'paymentTypeId': this.payType['paymentTypeId'] },
        'billType': this.selectedBillType,
        'pharmacy': { 'pharmacyId': localStorage.getItem('pharmacyId') },
        'activeS': 'Y',
        'createdUser': localStorage.getItem('id'),
        'lastUpdateUser': localStorage.getItem('id')
      }

      if (this.payType['type'] == 'CREDIT') {
        saleReturnObject['paymentStatus'] = "Pending"
      } else {
        saleReturnObject['paymentStatus'] = "Paid"
      }
      let payload = Object.assign({}, this.salesReturnFormInformation.value);
      payload['lastUpdateUser'] = localStorage.getItem('id');
      payload['createdUser'] = localStorage.getItem('id');
      this.spinnerService.show();
      this.salesService.saveSalesReturnData(saleReturnObject).subscribe(
        saveFormResponse => {
          if (saveFormResponse instanceof Object) {
            if (saveFormResponse['responseStatus']['code'] === 200) {
              this.spinnerService.hide();
              this.salesReturnModel = saveFormResponse['result'];
              //console.log(this.salesReturnModel)

              let salesReturnsItemsArray: any[] = [];
              this.gridApi.forEachNode(function (node) {
                salesReturnsItemsArray.push(node.data);
              });

              let data = [];

              for (var i = 0; i < salesReturnsItemsArray.length; i++) {
                this.salesReturnFormInformation.get('items').setValue({ 'itemId': salesReturnsItemsArray[i]['itemId'] }),
                  this.salesReturnFormInformation.get('salesReturnType').setValue(salesReturnsItemsArray[i]['returnType']),
                  this.salesReturnFormInformation.get('salesReturnId').setValue({ 'salesReturnId': this.salesReturnModel['salesReturnId'] }),
                  this.salesReturnFormInformation.get('purchaseQuantity').setValue(salesReturnsItemsArray[i]['quantity']),
                  this.salesReturnFormInformation.get('bonusQuantity').setValue(salesReturnsItemsArray[i]['bonus']),
                  this.salesReturnFormInformation.get('returnQuantity').setValue(salesReturnsItemsArray[i]['returnQuantity']),
                  this.salesReturnFormInformation.get('amount').setValue(salesReturnsItemsArray[i]['LabelledAmt']),
                  this.salesReturnFormInformation.get('charges').setValue(this.salesReturnFormInformation.value['charges'])
                this.salesReturnFormInformation.get('paymentType').setValue({ 'paymentTypeId': this.payType['paymentTypeId'] }),
                  this.salesReturnFormInformation.get('createdUser').setValue(localStorage.getItem('id')),
                  this.salesReturnFormInformation.get('lastUpdateUser').setValue(localStorage.getItem('id')),
                  this.salesReturnFormInformation.get('activeS').setValue('Y'),
                  this.salesReturnFormInformation.get('salesItemId').setValue(salesReturnsItemsArray[i]['salesItemId'])
                if (this.payType['type'] == 'CREDIT') {
                  this.salesReturnFormInformation.get('paymentStatus').setValue('Pending')
                } else {
                  this.salesReturnFormInformation.get('paymentStatus').setValue('Paid')
                }

                data.push(this.salesReturnFormInformation.value)

              }
              // console.log(data)
              var finalAmt = 0;
              for (var i = 0; i < data.length; i++) {
                // console.log(data[i]['returnQuantity'])
                // console.log(data[i]['purchaseQuantity'])
                if (data[i]['returnQuantity'] == data[i]['purchaseQuantity']) {
                  this.roundOffAmt = true;
                  // console.log("in if");
                  finalAmt = Math.round(this.totalAmount)
                } else {
                  this.roundOffAmt = false;
                  finalAmt = this.totalAmount
                }
              }

              /* if (this.roundOffAmt = true) {
                
              } else {
                
              } */
              // console.log(this.roundOffAmt)
              // console.log(finalAmt)
              let creditNoteObject = {
                'creditNoteNo': this.creditNoteNo,
                'creditDate': saleReturnObject['salesReturnDate'],
                'returnType': 'Sales Returns',
                'returnTypeReason': 'Sales Returns',
                'billId': this.items[0]['billId']['billCode'],
                'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                'customerModel': this.items[0]['billId']['customerModel'],
                'amount': Math.round(finalAmt),
                'paymentType': { 'paymentTypeId': this.payType['paymentTypeId'] },
                'createdUser': localStorage.getItem('id'),
                'lastUpdateUser': localStorage.getItem('id'),
                'remarks': 'Sales Returns',
                'activeS': 'Y',
                'approvedBy': { 'employeeId': localStorage.getItem('id') },
                'approvedDate': saleReturnObject['salesReturnDate'],
                'status': this.selectedStockStatus,
                'billType': this.selectedBillType,
                'sourceRef': saleReturnObject['salesReturnNumber']

              }
              if (this.payType['type'] == 'CREDIT') {
                creditNoteObject['paymentStatus'] = 'Pending'
              } else {
                creditNoteObject['paymentStatus'] = 'Paid'
              }
              this.saleReturnPayType = this.payType;
              this.salesReturnBillType = this.selectedBillType


              this.salesService.saveCreditNote(creditNoteObject).subscribe(
                res => {
                  this.creditNoteId = res['result'];


                  this.salesService.saveSalesReturnItemsData(data).subscribe(
                    savesReturnItemResponse => {



                      if (savesReturnItemResponse instanceof Object) {
                        if (savesReturnItemResponse['responseStatus']['code'] === 200) {

                          this.spinnerService.hide();
                          // this.updateAccRecievables = this.sales_return_amount;

                          let obect = {
                            'amountToBeReceived': Math.round(finalAmt) * -1,
                            'netAmount': -1 * Math.round(finalAmt),
                            'amountReceived': 0,
                            'receiptDate': saleReturnObject['salesReturnDate'],
                            'source': this.creditNoteId['creditNoteId'],
                            'pharmacyModel': { 'pharmacyId': localStorage.getItem('pharmacyId') },
                            'receiptNumber': this.selectedReceiptNumber,
                            'status': 'Not Approved',
                            'createdUser': localStorage.getItem('id'),
                            'lastUpdateUser': localStorage.getItem('id'),
                            'paymentTypeId': res['result']['paymentType'],
                            'paymentStatus': 'Pending',
                            'sourceType': 'Sales Returns - Credit Note',
                            'sourceRef': this.salesReturnModel['salesReturnNumber'],
                            'approvedDate': saleReturnObject['salesReturnDate'],
                            'approvedBy': localStorage.getItem('id'),
                            'customerName': this.customername,
                            'activeS': 'Y',
                            'billRefNo': this.billObj['billCode'],
                            'creditNumber': this.masterAccountDetails ? this.masterAccountDetails['creditNumber'] : '',
                            'salesBillId': this.salesReturnModel['billNumber']['billId']
                          }


                          if (this.saleReturnPayType['type'] == 'CREDIT' && this.salesReturnBillType == 'Account') {
                            this.receiptsService.saveAccountReceivables(obect).subscribe(res => {

                            });
                          }

                          //Printing sales return credit note
                          console.log(this.creditNoteId['creditNoteNo'])
                          if (this.creditNoteId['creditNoteNo']) {
                            let creditNoteNo = this.creditNoteId['creditNoteNo'];
                            let uri = {"credit_note_no":creditNoteNo,"ReportCode":"CREDIT_NOTE"};

                            var encoded = encodeURI(JSON.stringify(uri));

                            let reportURI = encoded;
                            this.salesService.downloadPdfFile(reportURI).subscribe((data: any) => {
                              this.blob = new Blob([data], { type: 'application/pdf' });
                              var downloadURL = window.URL.createObjectURL(data);
                              var link = document.createElement('a');
                              link.href = downloadURL;
                              link.download = 'CREDIT NOTE-' + creditNoteNo + '.pdf';
                              link.click();
                              const iframe = document.createElement('iframe');
                              iframe.style.display = 'none';
                              iframe.src = downloadURL;
                              document.body.appendChild(iframe);
                              iframe.contentWindow.print();
                            })
                          }


                        }
                      }
                    }
                  );
                }
              )
              this.toasterService.success("Data Saved", 'Success', {
                timeOut: 3000
              });
              this.onReset();
              this.items = [];
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
    } else {
      this.toasterService.warning('Status Not Selected', "", {
        timeOut: 5000
      })
    }
  }





  bonusSum(values) {
    let sum = 0;
    this.gridApi.forEachNode(function (node) {
      var b = node.data.bonus;
      if (b && isNumeric(b)) {
        sum = +sum + +b;
      }
    });
    return sum;
  }

  quantitySum(values) {
    let quantity = 0;
    this.gridApi.forEachNode(function (node) {
      var n = node.data.returnQuantity;
      if (n && isNumeric(n)) {
        quantity = +quantity + +n;
      }
    });
    return quantity;
  }

  checkFormDisability() {
    return (this.salesReturnFormInformation.get('status').errors instanceof Object)
      || (this.salesReturnFormInformation.get('billNumber').errors instanceof Object)
      || (this.salesReturnFormInformation.get('paymentType').errors instanceof Object)
      || (this.salesReturnFormInformation.get('billType').errors instanceof Object)
      || (this.salesReturnFormInformation.get('charges').errors instanceof Object)

  }

  checkFormGrid() {
    return (this.salesReturnFormInformation.get('itemNameSelected').errors instanceof Object)
      || (this.salesReturnFormInformation.get('returnQuantity').errors instanceof Object)
      || (this.salesReturnFormInformation.get('salesReturnType').errors instanceof Object)
  }

  onReset() {

    this.salesReturnFormInformation.reset();
    this.selectedBill = undefined;
    this.selectedPaymentType = undefined;
    this.gridApi.setRowData([]);
    this.selectedItemModel = null;
    this.totalAmount = 0;
    this.selectedReturnType = undefined;
    this.payType = undefined;
    this.selPaymetObj = undefined;
    this.selectedItem = undefined;
    this.viewReturnQty = undefined;

    this.salesReturnFormInformation.patchValue({
      'salesReturnDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      'status': this.stockStatus[0]
    });

    this.salesService.getSalesReturnBillNumber().subscribe(
      salesReturnNumber => {
        if (salesReturnNumber['responseStatus']['code'] === 200) {
          this.salesReturnNumber = salesReturnNumber['result'];
        }
      }
    );

  }



  RetrievedSalesIds: any[] = [];
  onBillEntered(event) {

    this.spinnerService.show();
    this.salesService.getSalesBySearchNumber(event['target']['value']).subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.RetrievedSalesIds = res['result']
        this.spinnerService.hide();
      }
    },
      error => {
        this.RetrievedSalesIds = [];
        this.spinnerService.hide();
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          });
      })
  }


  //******************************************** Sales Return History Tab ***********************************************************//

  history = false;
  salesReturnForm = true;
  historyData: any;

  SalesReturnHistory() {

    this.history = true;
    this.salesReturnForm = false;
    this.getAllSalesReturnHistory();
  }

  SalesReturnFun() {
    this.history = false;
    this.salesReturnForm = true;
  }

  salesReturnGridDefs: ColDef[] = [
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
    { headerName: 'SR No', field: 'salesReturnNumber', sortable: true, resizable: true, filter: true, editable: true, width: 150 },
    {
      headerName: 'Status', field: 'status', sortable: true, resizable: true, filter: true, width: 140
    },
    {
      headerName: 'Bill No', field: 'billNumber.billCode', sortable: true, resizable: true, filter: true, width: 140,
    },
    {
      headerName: 'Return Date', field: 'salesReturnDate', sortable: true, resizable: true, filter: true, width: 140,
      valueGetter: this.dateFormatter.bind(this)
    },
    { headerName: 'Payment Type', field: 'paymentType.type', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Net Amount', field: 'totalAmount', sortable: true, resizable: true, filter: true, width: 130,
      valueGetter: function (params) {
        if (params.data.totalAmount != null && params.data.totalAmount != 'null' && params.data.totalAmount != undefined) {
          return params.data.totalAmount;
        } else {
          var data = 0.0;
          params.data.totalAmount = data;
          return params.data.totalAmount;
        }
      }
    },
    {
      headerName: 'Approved By', field: 'empName', sortable: true, resizable: true, filter: true, width: 150,
    }
  ];


  onCellClicked(params) {
    if (params.column.colId !== 'check') {
      this.change(params.data);
      setTimeout(() => {
        $('#approvedModal').modal('show');
      }, 200);
    }
  }

  dateFormatter(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.salesReturnDate != null && params.data.salesReturnDate != undefined && params.data.salesReturnDate != '') {
        try {
          params.data.salesReturnDate = this.datePipe.transform(params.data.salesReturnDate, "dd-MM-yyy");
        }
        catch (error) {
        }
        return params.data.salesReturnDate;
      }
    }
  }

  salesReturnData: any;
  finalAmount: any;
  historyItemsList = [];
  historyItemsGridList = [];
  salesReturnNo: any;
  salesReturnDate: any;
  status: any;
  remarks: any;
  billNumber: any;
  paymentType: any;
  customerNm: any;
  custPhNo: any;
  custPolicyCd: any;
  custMembershipCardNo: any;
  historyGridData: any;
  itemList: any;
  billType: any
  change(params) {
    this.onPopupReset()
    const data = params;
    this.historyItemsList = []
    this.historyItemsGridList = []
    this.itemList = []
    this.salesService.getSaleItemsById(data.billNumber.billId).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          for (var i = 0; i < res['result'].length; i++) {
            this.historyItemsList.push(res['result'][i]['itemsModel']);
            this.historyItemsGridList.push(res['result'][i]);
          }
          this.itemList = this.historyItemsList;

          // console.log(this.itemList)
          this.salesService.getSalesReturnDatabyId(data.salesReturnId).subscribe(debitRes => {
            if (debitRes instanceof Object) {
              if (debitRes['responseStatus']['code'] == 200) {
                this.salesReturnData = debitRes['result'];
                if (this.salesReturnData != null && this.salesReturnData != undefined) {
                  this.salesReturnHistoryItemsGridOptions.api.updateRowData({ add: this.createGridNewRowData(this.historyItemsGridList) });
                }

                this.salesReturnNo = data['salesReturnNumber'];
                this.salesReturnDate = /* this.datePipe.transform( */data['salesReturnDate']/* , 'yyyy-MM-dd'); */
                this.status = data['status']
                this.billNumber = data['billNumber'] != null && data['billNumber'] != undefined ? data['billNumber']['billCode'] : '';
                this.paymentType = data['paymentType'] != null && data['paymentType'] != undefined ? data['paymentType']['type'] : '';
                this.billType = data['billType'] != null && data['billType'] != undefined ? data['billType'] : '';
                this.customerNm = data['billNumber'] != null && data['billNumber'] != undefined ? data['billNumber']['customerModel']['customerName'] : '';
                this.custPhNo = data['billNumber'] != null && data['billNumber'] != undefined ? data['billNumber']['customerModel']['phoneNumber'] : '';
                this.custPolicyCd = data['billNumber']['customerInsuranceModel'] != null && data['billNumber']['customerInsuranceModel'] != undefined ? data['billNumber']['customerInsuranceModel']['policyCode'] : '';
                this.custMembershipCardNo = data['billNumber']['customerMembershipModel'] != null && data['billNumber']['customerMembershipModel'] != undefined ? data['billNumber']['customerMembershipModel']['membershipCardNumber'] : '';
                this.remarks = data['remarks'] != null && data['remarks'] != undefined ? data['remarks'] : '';
                this.paymentStatusRead = data['paymentStatus'] != null && data['paymentStatus'] != undefined ? data['paymentStatus'] : '';
                let amt = 0;
                this.salesReturnHistoryItemsGridOptions.api.forEachNode(function (node) {
                  var discount = Number(node.data.returnQuantity * node.data.salePrice * node.data.discountPercentage / 100);
                  var vats = 1 + (node.data.vat / 100);
                  var unit = node.data.salePrice * node.data.returnQuantity;
                  var totals = (unit - discount) * vats;
                  let s = totals.toFixed(2);
                  amt += Number(s)
                })
                this.finalAmount = amt.toFixed(2);

              }
            }
          });
        }
      }
    })

  }

  getAllSalesReturnHistory() {
    this.spinnerService.show();
    this.salesService.getSalesReturnHistory().subscribe(salesHistoryRes => {
      if (salesHistoryRes instanceof Object) {
        if (salesHistoryRes['responseStatus']['code'] == 200) {
          this.spinnerService.hide();
          this.historyData = salesHistoryRes['result'];
        }
      }
    })
  }

  onCheckBoxChanged(params) {
    this.selectedSalesReturnRow = params.api.getSelectedRows()[0]
  }

  blob: Blob
  selectedSalesReturnRow
  onPrint() {


    if (this.selectedSalesReturnRow) {

      let uri = { "ReportCode": 'SALES_RETURN', "SALES_RETURN_NO": this.selectedSalesReturnRow.salesReturnNumber };
      var encoded = encodeURI(JSON.stringify(uri));

      let reportURI = encoded;
      this.salesService.downloadPdfFile(reportURI).subscribe((data: any) => {
        this.blob = new Blob([data], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'SALES RETURN-CREDIT NOTE' + '.pdf';
        link.click();
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = downloadURL;
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
      });
    } else {
      this.toasterService.warning("Please select a record to print", "", {
        timeOut: 3000
      })
    }
  }

  totalQty: any;
  totalCount: any;
  bonus: any;
  charges: any;
  historyColumnDefs: ColDef[] = [
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
    { headerName: 'Item Code', field: 'item', sortable: true, resizable: true, filter: true },
    { headerName: 'Item Name', field: 'itemName', sortable: true, resizable: true, filter: true, cellRenderer: this.tooltipRenderer },
    { headerName: 'Batch No', field: 'batchNo', sortable: true, resizable: true, filter: true },
    { headerName: 'Formulation', field: 'formulation', sortable: true, resizable: true, filter: true },
    { headerName: 'Purchase Quantity', field: 'quantity', sortable: true, resizable: true, filter: true },
    { headerName: 'Bonus', field: 'bonus', sortable: true, resizable: true, filter: true },
    { headerName: 'Return Quantity', field: 'returnQuantity', sortable: true, resizable: true, filter: true, editable: true },
    { headerName: 'Return Type', field: 'returnType', sortable: true, resizable: true, filter: true },
    { headerName: 'Expiry Date', field: 'expiryDt', sortable: true, resizable: true, filter: true },
    { headerName: 'Sale Price', field: 'salePrice', sortable: true, resizable: true, filter: true },
    { headerName: 'Disc. Percent', field: 'discountPercentage', sortable: true, resizable: true, filter: true, hide: true },
    {
      headerName: 'Discount', field: 'discount', sortable: true, resizable: true, filter: true,
      valueGetter: function (params) {
        let discount = Number(params.data.discountPercentage * params.data.returnQuantity * params.data.salePrice / 100);
        params.data.discount = discount.toFixed(2);
        return params.data.discount;
      }
    },
    { headerName: 'Vat', field: 'vat', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Amount', field: 'total', sortable: true, resizable: true, filter: true,
      valueGetter: function (params) {
        var unit = params.data.salePrice * params.data.returnQuantity;
        var vat = params.data.vat;

        var disc = params.data.discountPercentage != null && params.data.discountPercentage != undefined ? params.data.discountPercentage : 0;
        var retQty = params.data.returnQuantity != null && params.data.returnQuantity != undefined ? params.data.returnQuantity : 0;
        var sprice = params.data.salePrice != null && params.data.salePrice != undefined ? params.data.salePrice : 0;

        var discount = Number(retQty * sprice * disc / 100);
        var vats = 1 + (vat / 100)
        var totals = (unit - discount) * vats;
        let s = totals.toFixed(2);
        var total = parseFloat(s);

        return total;
      }
    },

  ];

  finalAmts = [];
  amounts = []
  createGridNewRowData(itemInfo: any) {
    var array = [];
    //console.log(itemInfo.length)
    let totalQty = 0;
    var bonus = 0;
    var charges = 0;

    for (var i = 0; i < this.salesReturnData.length; i++) {
      this.amounts.push(this.salesReturnData[i]);
      totalQty += Number(this.salesReturnData[i]['returnQuantity'])
      bonus += Number(this.salesReturnData[i]['bonusQuantity'])
      charges += Number(this.salesReturnData[i]['charges']);
    }

    this.totalQty = totalQty;

    this.totalCount = this.salesReturnData.length;
    this.bonus = bonus;
    this.charges = charges
    for (var i = 0; i < itemInfo.length; i++) {
      var rowData = {
        item: itemInfo[i]['itemsModel'] != null && itemInfo[i]['itemsModel'] != undefined ? itemInfo[i]['itemsModel']['itemCode'] : null,
        itemName: itemInfo[i]['itemsModel']['itemName'],
        formulation: itemInfo[i]['itemsModel']['itemForm'] != null && itemInfo[i]['itemsModel']['itemForm'] != undefined ? itemInfo[i]['itemsModel']['itemForm']['form'] : null,
        batchNo: itemInfo[i]['batchNo'] != null && itemInfo[i]['batchNo'] != undefined ? itemInfo[i]['batchNo'] : null,
        quantity: itemInfo[i]['saleQty'],
        bonus: itemInfo[i]['qtyFree'] != null && itemInfo[i]['qtyFree'] != undefined ? itemInfo[i]['qtyFree'] : 0,
        expiryDt: itemInfo[i]['stockId'] != null && itemInfo[i]['stockId'] != undefined ? itemInfo[i]['stockId']['expiryDt'] : '0000-00-00',
        returnType: this.amounts[i] != null && this.amounts[i] != undefined ? this.amounts[i]['salesReturnType'] : '',
        purchasePrice: Number(itemInfo[i]['unitPurchasePrice']).toFixed(2),
        salePrice: Number(itemInfo[i]['unitSalePrice'] != null && itemInfo[i]['unitSalePrice'] != undefined ? itemInfo[i]['unitSalePrice'] : 0).toFixed(2),
        returnQuantity: this.amounts[i] != null && this.amounts[i] != undefined ? this.amounts[i]['returnQuantity'] : 0,
        saleAmount: Number(itemInfo[i]['saleAmount']).toFixed(2),
        vat: itemInfo[i]['vat'],
        discountPercentage: itemInfo[i]['discountPercentage'] != null && itemInfo[i]['discountPercentage'] != undefined ? itemInfo[i]['discountPercentage'] : 0,
        discount: Number(isNaN(itemInfo[i]['discount'] ? 0 : itemInfo[i]['discount'])),
        totalSaleAmount: itemInfo[i]['billId']['totalAmount'],
        returnQty: this.amounts[i] != null && this.amounts[i] != undefined ? this.amounts[i]['returnQuantity'] : 0,
        LabelledAmt: (((((itemInfo[i]['unitSalePrice'] != null && itemInfo[i]['unitSalePrice'] != undefined ? itemInfo[i]['unitSalePrice'] : 0) * this.amounts[i] != null && this.amounts[i] != undefined ? this.amounts[i]['returnQuantity'] : 0)
          - (this.amounts[i] != null && this.amounts[i] != undefined ? this.amounts[i]['returnQuantity'] : 0 * (itemInfo[i]['unitSalePrice'] != null && itemInfo[i]['unitSalePrice'] != undefined ? itemInfo[i]['unitSalePrice'] : 0) * Number(isNaN(itemInfo[i]['discount'] ? 0 : itemInfo[i]['discount'])) / 100))
          * (1 + itemInfo[i]['vat'] / 100)) - ((itemInfo[i]['discount'] ? 0 : itemInfo[i]['discount']))).toFixed(2),
      };
      array.push(rowData)
    }
    var data = array;
    return data;
  }

  onPopupReset() {
    $('#approvedModal').modal('hide');
    this.totalQty = undefined;
    this.totalCount = undefined;
    this.bonus = undefined;
    this.charges = undefined;
    this.finalAmts = undefined;
    this.salesReturnHistoryItemsGridOptions.api.setRowData([]);
    this.itemList = undefined;
    this.salesReturnData = undefined;
    this.historyGridData = undefined;
    this.historyItemsList = [];
    this.historyItemsGridList = [];
  }
  customerHaveCreditAccount: boolean
  masterAccountDetails
  getCustomerMasterByCustomerId(customerId) {
    this.salesService.getMasterByCustomerId(customerId).subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        if (res['result'] != null) {
          this.customerHaveCreditAccount = true;
          this.masterAccountDetails = res['result']
        }
        else {
          this.customerHaveCreditAccount = false;
        }
      }
    })
  }

}
