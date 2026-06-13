import { NumericEditor } from 'src/app/core/numeric-editor.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { ICellRendererParams, IGetRowsParams } from 'ag-grid-community';
import { AddPurchaseorderService } from "./../add-purchaseorder.service";
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AddpurchaseorderinvoiceService } from '../../purchase-invoice/addpurchaseorderinvoice.service';

@Component({
  selector: 'app-pending-purchase-order',
  templateUrl: './pending-purchase-order.component.html',
  styleUrls: ['./pending-purchase-order.component.scss'],
  providers: [AddPurchaseorderService]
})
export class PendingPurchaseOrderComponent implements OnInit {

  columnDefs = [
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
    {
      headerName: 'PO No',
      field: 'purchaseOrderNo',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'PO Desc',
      field: 'poDesc',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Supplier',
      field: 'supplierModel.name',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Manufacturer',
      field: 'manuName',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Remarks',
      field: 'remarks',
      sortable: true,
      resizable: true,
      filter: true
    }
  ];

  paginationSize = 10;

  quotationGridOptions: GridOptions;
  pendingPurchaseOrderGridOptions: GridOptions;
  pendingPurchaseOrderForm: FormGroup;
  pendingPurchaseOrderFormValidations = {
    purchaseOrderId: new FormControl('', [Validators.required]),
    purchaseOrderNo: new FormControl('', [Validators.required]),
    medicalOrNonMedical: new FormControl('', [Validators.required]),
    emergency: new FormControl('', [Validators.required]),
    cash: new FormControl('', [Validators.required]),
    purchaseOrderDate: new FormControl('', [Validators.required]),
    deliveryTime: new FormControl('', [Validators.required]),
    quotationDate: new FormControl('', [Validators.required]),
    quotationNo: new FormControl('', [Validators.required]),
    paymentType: new FormControl('', [Validators.required]),
    shippingAddress: new FormControl('', Validators.required),
    paymentTime: new FormControl('', Validators.required),
    advance: new FormControl('', Validators.required),
    balance: new FormControl('', Validators.required),
    otherCharges: new FormControl('', Validators.required),
    discountPercentage: new FormControl('', Validators.required),
    discount: new FormControl('', Validators.required),
    poValue: new FormControl('', Validators.required),
    poTerm: new FormControl('', Validators.required),
    remarks: new FormControl('', Validators.required),
    totalAmount: new FormControl('', Validators.required),
    totalValue: new FormControl('', Validators.required),
    taxAmt: new FormControl(),
    poDesc: new FormControl(),
  };
  getTotalA;
  pendingOrderDetails: any;
  constructor(private service: AddPurchaseorderService, private spinnerService: Ng4LoadingSpinnerService,
    private datePipe: DatePipe, private toasterService: ToastrService, private addpurchaseorderinvoiceService: AddpurchaseorderinvoiceService) {
    this.pendingPurchaseOrderGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.pendingPurchaseOrderGridOptions.rowSelection = 'single';
    this.pendingPurchaseOrderGridOptions.columnDefs = this.columnDefs;
    this.pendingPurchaseOrderGridOptions.rowData = [];

    this.getApprovedData(this.pharmacyId);

    this.quotationGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.quotationGridOptions.rowSelection = 'single';
    this.quotationGridOptions.columnDefs = this.quotationcolumnDefs;
    this.quotationGridOptions.rowData = [];
    this.quotationGridOptions.onCellValueChanged = this.purchaseOrderGridModified.bind(this);
    this.pendingPurchaseOrderForm = new FormGroup(this.pendingPurchaseOrderFormValidations);
    this.getalldeliverytypes();
    this.getAllTaxCategories();


    this.quotationGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }
    this.pendingPurchaseOrderGridOptions.getRowStyle = function (params) {
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
  pharmacyId = 1;
  quotationcolumnDefs = [
  
    {
      headerName: "",
      field: "",
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      checkboxSelection: true,
      width: 30
    },
    {
      headerName: 'Quotation Id',
      field: 'quotationId',
      sortable: true,
      resizable: true,
      filter: true,
      hide: true
    },
    {
      headerName: 'Item Code',
      field: 'itemsModel.itemCode',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Item Name',
      field: 'itemsModel.itemName',
      sortable: true,
      resizable: true,
      filter: true,
      cellRenderer: this.tooltipRenderer
    },
    {
      headerName: 'Form',
      field: 'itemsModel.itemForm.form',
      sortable: true,
      resizable: true,
      filter: true,
      hide: true
    },
    {
      headerName: 'Qty',
      field: 'quantity',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      width: 60
    },
    {
      headerName: 'Supplier',
      field: 'name',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Mfg',
      field: 'itemsModel.manufacturer.name',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Description',
      field: 'itemDescription',
      sortable: true,
      resizable: true,
      filter: true,
      hide: true
    }, {
      headerName: 'Bonus Qty',
      field: 'bonus',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      hide: false,
      singleClickEdit: true,
      width: 90,
      cellEditorFramework: NumericEditor,
    },
    {
      headerName: 'Pack',
      field: 'pack',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      singleClickEdit: true,
      width: 80,
      cellEditorFramework: NumericEditor,
      valueGetter: function (params) {
        if (params.data.pack == undefined || params.data.pack == null) {
          if (params.data.itemName) {
            var pack = params.data.itemsModel ? params.data.itemsModel.pack != null && params.data.itemsModel.pack != undefined ? params.data.itemsModel.pack : null : null;
            params.data.pack = pack;
          }
        }

        return params.data.pack;
      }
    },
    {
      headerName: 'Pack P.Price',
      field: 'packRate',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      singleClickEdit: true,
      width: 120,
      cellEditorFramework: NumericEditor,
      valueGetter: function (params) {

        let uRate = params.data.packRate / params.data.pack
        params.data.unitRate = Math.round(uRate).toFixed(2);

        return isNaN(params.data.packRate) ? 0 : Number(params.data.packRate).toFixed(2);
      }

    },
    {
      headerName: 'Unit P.Price',
      field: 'unitRate',
      sortable: true,
      resizable: true,
      filter: true,
      editable: false,
      width: 120,
      hide: true,
      cellEditorFramework: NumericEditor
    },
    {
      headerName: 'P.disc%',
      field: 'discountPercentage',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      width: 100,
      singleClickEdit: true,
      cellEditorFramework: NumericEditor,
      valueGetter: function (params) {
        var qty = isNaN(params.data.quantity) ? 0 : params.data.quantity;
        var ppRate = isNaN(params.data.packRate) ? 0 : params.data.packRate;
        var pDisc = isNaN(params.data.discountPercentage) ? 0 : params.data.discountPercentage;
        params.data.discount = (Math.round(qty * ppRate * (pDisc / 100))).toFixed(2);
        return params.data.discountPercentage;
      }
    },
    {
      headerName: 'P.disc Amt',
      field: 'discount',
      sortable: true,
      resizable: true,
      filter: true,
      editable: false,
      cellEditorFramework: NumericEditor,
      width: 130,
      hide: true
      /*    valueGetter: function (params) {
           var qty = isNaN(params.data.quantity) ? 0 : params.data.quantity;
           var ppRate = isNaN(params.data.packRate) ? 0 : params.data.packRate;
           var pDisc = isNaN(params.data.discountPercentage) ? 0 : params.data.discountPercentage;
           params.data.discount = Math.round(qty * ppRate * (pDisc / 100));
           return params.data.discount;
         } */
    },
    {
      headerName: 'Tax',
      field: 'tax',
      sortable: true,
      resizable: true,
      filter: true,
      editable: false,
      width: 80,
      pinned: "right",
      cellEditor: "agSelectCellEditor",
      singleClickEdit: false,

      valueGetter: function (params) {
        if (params.data.itemsModel.itemName) {
          var tax = params.data.itemsModel ? params.data.itemsModel.tax != null && params.data.itemsModel.tax != undefined ? params.data.itemsModel.tax.categoryCode : null : null;
          params.data.tax = tax;
        }
        return params.data.tax;
      }
    },
    {
      headerName: 'Net Amount',
      field: 'netAmount',
      sortable: true,
      resizable: true,
      filter: true,
      editable: false,
      width: 120,
      pinned: 'right',
      cellEditorFramework: NumericEditor,
      valueGetter: this.netAmountCalc.bind(this)
    }
  ];


  netAmountCalc(params) {
    var qty = isNaN(params.data.quantity) ? 0 : params.data.quantity;

    var packPrice = isNaN(params.data.packRate) ? 0 : params.data.packRate;

    var pDisc = isNaN(params.data.discountPercentage) ? 0 : params.data.discountPercentage;

    var tax = params.data.tax == 'A' ? this.taxValue : 0;

    params.data.netAmount = Number(((qty * packPrice * (1 - pDisc / 100) * (1 + tax / 100)) * 100) / 100).toFixed(2);

    return Number(params.data.netAmount).toFixed(2);
  }

  modifyMfgName(params) {
    var str = params.data.manufacturerName;

    params.data.manufacturerName = str != null && str != undefined ? str.substr(0, 4) : "";
    return params.data.manufacturerName;
  }
  en_dis = false;
  getApprovedData(id) {

    this.loadRowData([], this.pendingPurchaseOrderGridOptions);
    this.showApprovedGrid = false;
    this.loadRowData([], this.pendingPurchaseOrderGridOptions);
    this.showApprovedGrid = true;

    this.showApprovedGrid = false;
    this.service.getpartiallypurchaseordersbypharmacy(id).subscribe(
      res => {
        let data = res;
        for (var i = 0; i < res['result'].length; i++) {
          if (res['result'][i]['purchaseorderitems'][0] != undefined) {
            data['result'][i]['itemCode'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['itemCode'] : null : null;
            data['result'][i]['itemName'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['itemName'] : null : null;
            data['result'][i]['quantity'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['quantity'] : null;
            data['result'][i]['manuName'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['manufacturer']['name'] : null : null;
            data['result'][i]['packRate'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['packRate'] : null;
            data['result'][i]['netAmount'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['netAmount'] : null;
          }

        }
        this.loadRowData(data['result'], this.pendingPurchaseOrderGridOptions);

      }
    );
    this.showApprovedGrid = true;
  }

  loadRowData(inputRowData: Object[], gridoptions: GridOptions) {
    try {
      gridoptions.rowData = inputRowData;
      gridoptions.api.setRowData(gridoptions.rowData);
    } catch (e) {
      gridoptions.rowData = inputRowData;
    }
  }

  showApprovedGrid: boolean = true;

  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.pendingPurchaseOrderGridOptions.api.setQuickFilter($event.target.value);
    if (this.pendingPurchaseOrderGridOptions.api.getDisplayedRowCount() === 0) {
      this.pendingPurchaseOrderGridOptions.api.showNoRowsOverlay();
    } else {
      this.pendingPurchaseOrderGridOptions.api.hideOverlay();
    }
  }

  ngOnInit() {
    $(document).ready(function () {

      $('.submit-for-approval, .submit-later').click(function (e) {
        e.preventDefault();
        $('.grid-area').show();
        $('.po-details').hide();
      });
      $('.edit-btn').click(function (e) {
        e.preventDefault();
        $('.po-details').show();
        $('.grid-area').hide();
      });

    });
  }
  selectedGridRow;
  getTotalItems = 0;
  getTotalQ = 0;

  onCellClicked(params){
    
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows[0] !== undefined) {
      this.selectedGridRow = selectedRows[0];
      this.setData(selectedRows[0]);
      this.getTotalItem();
      this.getTotalQuantity();
      this.getTotalAmount();
    }
  }

  onSelectionChanged(params) {
    this.selectedPurchaseRow=params.api.getSelectedRows()[0]
  }

  private gridApi;
  private gridColumnApi;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  dataToSend
  setData(data) {
    /*   this.pendingPurchaseOrderForm.patchValue({
        purchaseOrderNo: data.purchaseOrderNo,

      }); */
    /*  $('#purchaseOrderNo').val(data.purchaseOrderNo);
     $('#quotationDate').val(data.quotationModel != null ? data.quotationModel.quotationDate : null);
     var date = new Date(data.purchaseOrderDate);
     $('#purchaseOrderDate').val(date);
     $('#deliveryTime').val(data.deliveryTime); */

    this.pendingOrderDetails = data;
    this.selectedPaymentType = data.paymentType;
    this.pendingPurchaseOrderForm.patchValue({
      purchaseOrderNo: data.purchaseOrderNo,
      purchaseOrderDate: this.datePipe.transform(data.purchaseOrderDate, 'yyyy-MM-dd'),
      deliveryTime: data.deliveryTime,
      quotationDate: data.quotationModel != null ? data.quotationModel.quotationDt : null,
      quotationNo: data.quotationModel != null ? data.quotationModel.quotationNo : null,
      poDesc: data.poDesc,
      shippingAddress: data.shippingAddress,
      cash: data.paymentType != null ? data.paymentType : null,
      paymentTime: data.creditDays,
      poTerm: data.poTerm,
      remarks: data.remarks,
      advance: data.advance,
      otherCharges: data.otherCharges,
      balance: data.balance

    });

    if (data['deliveryTypesModel'] != null) {
      this.selectedDeliveryId = this.deliveries.find(x => x.deliveryTypeId == data['deliveryTypesModel']['deliveryTypeId'])
    }
    this.quotationGridOptions.api.setRowData(
      data.purchaseorderitems);
    setTimeout(() => {
      $('#pendingModal').modal('show');
      this.dataToSend = data;
    }, 100);
    this.gridApi.forEachNodeAfterFilter(function (node) {
      node.setSelected(false);
    });

  }
  purchaseOrderGridModified(modifiedRowNode) {
    if (modifiedRowNode.oldValue != modifiedRowNode.newValue) {
      this.postCellEditOperations(modifiedRowNode);
    }
  }

  postCellEditOperations(modifiedRowNode: ICellRendererParams) {
    if (modifiedRowNode.colDef.field == 'quantity') {
      this.getTotalQuantity();
      //this.getTotalAmount();
    }
    if (modifiedRowNode.colDef.field == 'packRate') {
      this.getTotalAmount();
    }
    if (modifiedRowNode.colDef.field == 'discountPercentage') {
      this.getTotalAmount();
    }
  }
  deliveries = [];
  selectedDeliveryId
  getalldeliverytypes() {
    this.service.getalldeliverytypes().subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.deliveries = res['result'];
            // this.purchaseOrderInformationForm.patchValue({ selectedDeliveryId: res['result'] });
          }
        }
      }
    );
  }

  onSubmit() {

  }
  private gridApi2;
  private gridColumnApi2;
  private getRowNodeId;
  onGridReady2(params) {
    this.getPaymentTypes();
    this.gridApi2 = params.api;
    this.gridColumnApi2 = params.columnApi;
  }

  getTotalItem() {
    let item = 0;
    this.gridApi2.forEachNode(function (rowNode, index) {
      if (rowNode.data.itemsModel.itemName) {
        item += 1;
      }
    });
    this.getTotalItems = item;
  }
  getTotalQuantity() {
    let quant = 0;
    this.gridApi2.forEachNode(function (rowNode, index) {
      if (rowNode.data.itemsModel.itemName) {
        quant += Number(rowNode.data.quantity);
      }
    });
    this.getTotalQ = quant;
    this.getAmount();
  }
  getTotalAmount() {
    let amt = 0;
    this.gridApi2.forEachNode(function (rowNode, index) {
      amt += rowNode.data.packRate;
    });
    const quant = this.getTotalQ;
    amt = amt ? amt : 0;
    this.getTotalA = (quant * amt).toFixed(2);
    this.getAmount();
  }

  poValueCalculate(param) {
    let val = 0;
    if (param) {
      if (isNaN(Number(param.srcElement.value))) {
        val = Number(this.pendingPurchaseOrderForm.get('totalAmount').value);
      }
      else {
        val = Number(param.srcElement.value);
      }
    } else {
      val = Number(this.pendingPurchaseOrderForm.get('totalAmount').value);
    }

    let adv = Number(this.pendingPurchaseOrderForm.get('advance').value);
    let bal = Number(this.pendingPurchaseOrderForm.get('balance').value);
    let charg = Number(this.pendingPurchaseOrderForm.get('otherCharges').value);

    let p = Number(this.pendingPurchaseOrderForm.get('discountPercentage').value);
    if (p > 0) {

      p = 0.01 * Number(p);
      const ta = val;
      let dis_amt = p * Number(ta);
      dis_amt = Math.round(dis_amt * 100) / 100;
      let dis = ta - dis_amt;
      val = dis + charg + bal - adv;
    } else {

      val = val + charg + bal - adv;

    }
    this.pendingPurchaseOrderForm.patchValue({ 'poValue': val.toFixed(2) });
  }

  selectedPaymentType: Object = {};
  paymentTypes: any[] = [];

  getPaymentTypes() {
    this.addpurchaseorderinvoiceService.getallpaymenttypes().subscribe(
      getallpaymenttypesResponse => {
        if (getallpaymenttypesResponse['responseStatus']['code'] === 200) {
          this.paymentTypes = getallpaymenttypesResponse['result'];
        }
      }
    );
  }

  onPaymentTypeChange(event: Event) {
    try {
      this.selectedPaymentType = this.paymentTypes.find(x => x.paymentTypeId === event['paymentTypeId']);
    } catch (error) {
      this.selectedPaymentType = undefined;
    }
  }

  getAmount() {
    var items = [];
    var obj = {}
    this.gridApi2.forEachNode(function (rowNode, index) {
      if (rowNode.data.itemsModel.itemName) {
        obj = {
          activeS: rowNode.data.activeS,
          formulation: rowNode.data.formulation,
          itemCode: rowNode.data.itemCode,
          itemDescription: rowNode.data.itemDescription,
          itemId: rowNode.data.itemId,
          itemName: rowNode.data.itemName,
          itemSupplierId: rowNode.data.itemSupplierId,
          itemsId: rowNode.data.itemsId,
          itemsModel: rowNode.data.itemsModel,
          manufacturerLicense: rowNode.data.manufacturerLicense,
          manufacturerName: rowNode.data.manufacturerName,
          percentage: rowNode.data.percentage,
          supplierId: rowNode.data.supplierId,
          supplierModel: rowNode.data.supplierModel,
          supplierName: rowNode.data.supplierName,
          supplierPriority: rowNode.data.supplierPriority,
          quantity: rowNode.data.quantity,
          bonus: rowNode.data.bonus,
          pack: rowNode.data.pack,
          packRate: rowNode.data.packRate,
          unitRate: rowNode.data.unitRate,
          discountPercentage: rowNode.data.discountPercentage,
          discount: isNaN(rowNode.data.discount) ? 0 : rowNode.data.discount,

          //tax: rowNode.data.tax == 'A' ? { taxCategoryId: 1 } : rowNode.data.tax == 'B' ? { taxCategoryId: 2 } : { taxCategoryId: 3 },
          tax: rowNode.data.itemsModel.tax,
          netAmount: rowNode.data.netAmount,
          validity: rowNode.data.validity,
        };

        items.push(obj);
        //}
      }
    });
    this.getTotalA = 0;
    var totalDiscount = 0;
    var totalTaxAmount = 0;

    for (var i = 0; i < items.length; i++) {
      this.getTotalA += Number(items[i]['netAmount']);
      this.pendingPurchaseOrderForm.get('totalAmount').setValue(this.getTotalA.toFixed(2));
      totalDiscount += Number(items[i]['discount']);
      this.pendingPurchaseOrderForm.get('discount').setValue(totalDiscount.toFixed(2));

      totalTaxAmount += Number(items[i]['quantity'] * items[i]['packRate'] *
        (1 - Number(items[i]['discountPercentage']) / 100) * ((items[i]['tax']['categoryCode'] == 'A' ? this.taxValue : 0) / 100));

      this.pendingPurchaseOrderForm.get('taxAmt').setValue(totalTaxAmount.toFixed(2));
      this.poValueCalculate(event);
    }
  }

  deleteQuotationItem() {
    const row = this.gridApi2.getSelectedRows();
    if (row.length > 0) {
      const id = row[0].purchaseOrderItemsId;
      this.service.deletepurchaseOrderItem(id).subscribe(
        res => {
          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              try {
                this.quotationGridOptions.api.updateRowData({ remove: row });
                let deleteIndex: number = this.findObjectIndex(this.quotationGridOptions.rowData, row[0], 'purchaseOrderItemsId');
                if (deleteIndex == -1) {
                  this.quotationGridOptions.rowData.splice(deleteIndex, 1);
                  this.getApprovedData(this.pharmacyId);
                  this.getTotalItem();
                  this.getTotalAmount();
                  this.getTotalQuantity();
                  // $('#pendingModal').modal('hide');
                }
              } catch (e) {

              }
            }
          }
        }
      );
    }
  }
  findObjectIndex(rowArray: Object[], rowObject: Object, key: string): number {
    return rowArray.findIndex(x => x[key] === rowObject[key]);
  }

  formatData() {
    let sendData = {};
    let purchaseorderitems = [];
    this.quotationGridOptions.api.forEachNode(node => {
      if (node.data['itemsModel']['itemId']) {
        purchaseorderitems.push({
          "createdUser": localStorage.getItem('id'),
          "lastUpdateUser": localStorage.getItem('id'),
          "discount": node.data['discount'] ? node.data['discount'] : 0,
          "discountPercentage": node.data['discountPercentage'] ? node.data['discountPercentage'] : 0,
          "purchaseOrderItemsId": node.data['purchaseOrderItemsId'],
          "itemsModel": node.data['itemsModel'] ? node.data['itemsModel'] : null,
          "quantity": node.data['quantity'] ? node.data['quantity'] : 0, //check
          "netAmount": node.data['netAmount'] ? node.data['netAmount'] : 0,
          "bonus": node.data['bonus'] ? node.data['bonus'] : 0,
          "unitRate": node.data['unitRate'] ? node.data['unitRate'] : 0,
          //"tax": node.data['tax'] == 'A' ? { taxCategoryId: 1 } : node.data['tax'] == 'B' ? { taxCategoryId: 2 } : { taxCategoryId: 3 },
          "tax": node.data['itemsModel']['tax'],
          "unitSaleRate": node.data['unitSaleRate'] ? node.data['unitSaleRate'] : 0,
          "pack": node.data['pack'] ? node.data['pack'] : 0,
          "packRate": node.data['packRate'] ? node.data['packRate'] : 0,
          "status": 'Y'
        });

      }

    })
    sendData['purchaseOrderId'] = this.pendingOrderDetails['purchaseOrderId'];
    sendData['advance'] = this.pendingPurchaseOrderForm.get('advance').value;
    sendData['paymentType'] = this.selectedPaymentType != null && this.selectedPaymentType != undefined ? { 'paymentTypeId': this.selectedPaymentType['paymentTypeId'] } : null;
    sendData['lastUpdateUser'] = localStorage.getItem('id');
    sendData['createdUser'] = localStorage.getItem('id');
    sendData['deliveryTime'] = this.pendingPurchaseOrderForm.get('deliveryTime').value;
    sendData['deliveryTypesModel'] = this.selectedDeliveryId != null && this.selectedDeliveryId != undefined ? { "deliveryTypeId": this.selectedDeliveryId.deliveryTypeId } : null;
    sendData['discount'] = this.pendingPurchaseOrderForm.get('discount').value;
    sendData['emergency'] = this.pendingOrderDetails.emergency ? "Y" : "N";
    sendData['medicalOrNonMedical'] = this.pendingPurchaseOrderForm.get('medicalOrNonMedical').value;
    sendData['paymentTime'] = this.pendingPurchaseOrderForm.get('paymentTime').value;
    sendData['pharmacyModel'] = { "pharmacyId": 1 };
    sendData['remarks'] = this.pendingPurchaseOrderForm.get('remarks').value;
    if (this.pendingOrderDetails.quotationModel != null && this.pendingOrderDetails.quotationModel != undefined) {
      sendData['quotationModel'] = { "quotationId": this.pendingOrderDetails.quotationModel != null ? this.pendingOrderDetails.quotationModel.quotationId : undefined }; //check
    }
    sendData['poAmount'] = this.pendingPurchaseOrderForm.get('poValue').value;
    sendData['purchaseorderitems'] = purchaseorderitems;
    sendData['poTerm'] = this.pendingPurchaseOrderForm.get('poTerm').value;
    //sendData['sentId'] = this.selectedQuote != null ? this.selectedQuote.sentId : null;
    sendData['shippingAddress'] = this.pendingPurchaseOrderForm.get('shippingAddress').value;
    sendData['poDesc'] = this.pendingPurchaseOrderForm.get('poDesc').value;
    sendData['balance'] = this.pendingPurchaseOrderForm.get('balance').value;
    sendData['otherCharges'] = this.pendingPurchaseOrderForm.get('otherCharges').value;
    sendData['deliveryDate'] = this.pendingOrderDetails.deliveryDate;
    sendData['supplierModel'] = this.pendingOrderDetails.supplierModel;
    sendData['purchaseOrderNo'] = this.pendingPurchaseOrderForm.get('purchaseOrderNo').value;
    sendData['purchaseOrderStatusModel'] = { "purchaseOrderStatusId": 0 };
    sendData['purchaseOrderDate'] = this.pendingPurchaseOrderForm.get('purchaseOrderDate').value;
    sendData['totalQuantity'] = this.getTotalQ;
    sendData['totalValue'] = this.getTotalA;
    sendData['creditDays'] = this.pendingPurchaseOrderForm.get('paymentTime').value

    return sendData;

  }

  approval() {
    //this.selectedGridRow['createdBy'] = { employeeId: this.selectedGridRow['createdBy'] };
    //this.selectedGridRow['quotationModel'] = { quotationId: this.selectedGridRow['quotationModel'] };
    this.pendingPurchaseOrderForm.get('poTerm').setErrors({ 'incorrect': true });
    this.spinnerService.show();
    const send = this.formatData();
    this.service.pendingpurchaseorder(send).subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.spinnerService.hide();

            this.pendingPurchaseOrderForm.reset();
            $('#pendingModal').modal('hide');
            this.getApprovedData(this.pharmacyId);
            this.toasterService.success(res['message'], 'Success', {
              timeOut: 3000
            });
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

  later() {

    $('#pendingModal').modal('hide');

  }

  selectedRows
  onSelectionChanged2() {
    this.selectedRows = this.gridApi2.getSelectedRows();
    if (this.selectedRows.length > 0) {
      this.en_dis = true;
    } else {
      this.en_dis = false;
    }
  }
  checkFormDisability() {

    return ((this.pendingPurchaseOrderForm.get('purchaseOrderDate').errors instanceof Object)
      || (this.pendingPurchaseOrderForm.get('purchaseOrderNo').errors instanceof Object)
      || (this.pendingPurchaseOrderForm.get('deliveryTime').errors instanceof Object)
      || (this.pendingPurchaseOrderForm.get('poTerm').errors instanceof Object)
      || (this.pendingPurchaseOrderForm.get('remarks').errors instanceof Object)

    );
  }

  taxValue: any;

  getAllTaxCategories() {
    this.service.getAllActiveSTaxes().subscribe(taxRes => {
      if (taxRes instanceof Object) {
        if (taxRes['responseStatus']['code'] === 200) {
          this.taxValue = taxRes['result'][0]['categoryValue'];
        }
      }
    })
  }


  blob:Blob
  selectedPurchaseRow
  onPrint() {
   
    if (this.selectedPurchaseRow) {
      
      let uri = { "ReportCode": 'PRINT_PURCHASE_ORDER_RECEIPT', "PURCHASE_ORDER_NO": this.selectedPurchaseRow.purchaseOrderNo };
      var encoded = encodeURI(JSON.stringify(uri));

      let reportURI = encoded;
      this.service.downloadPdfFile(reportURI).subscribe((data: any) => {
        this.blob = new Blob([data], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'PURCHASE ORDER DETAILS' + '.pdf';
        link.click();
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = downloadURL;
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
      });
    } else {
      this.toasterService.warning("Please select purchase order to print", "", {
        timeOut: 3000
      })
    }
  }
}

