import { AppService } from './../../../../core/app.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { GridOptions, ICellRendererParams } from 'ag-grid-community';
import { AddPurchaseorderService } from "./../../add-purchaseorder.service";
import { DatePipe } from '@angular/common';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NumericEditor } from 'src/app/core/numeric-editor.component';
import { AddpurchaseorderinvoiceService } from 'src/app/stock/purchase-invoice/addpurchaseorderinvoice.service';

@Component({
  selector: 'app-outstanding-pending',
  templateUrl: './outstanding-pending.component.html',
  styleUrls: ['./outstanding-pending.component.scss'],
  providers: [AddPurchaseorderService]
})

export class OutstandingPendingComponent implements OnInit {

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
      width: 40,
    },
    {
      headerName: 'PO No',
      field: 'purchaseOrderNo',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'PO Date',
      field: 'purchaseOrderDate',
      sortable: true,
      resizable: true,
      filter: true,
      //valueGetter: this.dateFormatter.bind(this)
    },

    {
      headerName: 'PO Description',
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
      headerName: 'Total Quantity',
      field: 'totalQuantity',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Total Value',
      field: 'totalValue',
      sortable: true,
      resizable: true,
      filter: true,
    },
    {
      headerName: 'Manufacturer',
      field: 'manuName',
      sortable: true,
      filter: true,
      resizable: true,
      hide: true
    },
    {
      headerName: 'PO Disc',
      field: 'discountPercentage',
      sortable: true,
      resizable: true,
      filter: true,
      hide: true
    }
  ];

  paginationSize = 10;

  approvedGridOptions: GridOptions;
  quotationGridOptions: GridOptions;
  permissions: any;
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
    totalItems:new FormControl(),
    totalQuantity:new FormControl()
  };
  getTotalA;
  pendingOrderDetails: any;
  constructor(private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private service: AddPurchaseorderService,
    private datePipe: DatePipe, private appService: AppService, private addpurchaseorderinvoiceService: AddpurchaseorderinvoiceService) {
    this.appService.getPermissions().subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];

      }
    });

    this.approvedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.approvedGridOptions.rowSelection = 'single';
    this.approvedGridOptions.columnDefs = this.columnDefs;
    this.approvedGridOptions.rowData = [];

    //  this.getApprovedData(this.pharmacyId);
    this.getLimitedPendingData(this.pharmacyId, 0, 20);
    this.getAllTaxCategories();

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


    this.approvedGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }

    this.quotationGridOptions.getRowStyle = function (params) {
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
  pharmacyId = Number(localStorage.getItem('pharmacyId'));
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
      editable: false,
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
      editable: false,
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
      editable: false,
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
      editable: false,
      singleClickEdit: true,
      width: 120,
      cellEditorFramework: NumericEditor,
      valueGetter: function (params) {

        let uRate = params.data.packRate / params.data.pack
        params.data.unitRate = Math.round(uRate).toFixed(2);

        return isNaN(params.data.packRate) ? 0 : params.data.packRate;
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
      editable: false,
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

  reason = "";

  gridApi;
  gridColumnApi;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
      balance: data.balance,
      totalItems:data.purchaseorderitems.length,
      totalQuantity:data.totalQuantity,
      totalAmount:data.totalAmount,
      poValue:data.totalValue,
      taxAmt:data.taxAmt
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

  poValueCalculate1() {
    let val = 0;
    val = Number(this.pendingPurchaseOrderForm.get('totalAmount').value);
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

          tax: rowNode.data.tax == 'A' ? { taxCategoryId: 4 } : rowNode.data.tax == 'B' ? { taxCategoryId: 2 } : { taxCategoryId: 3 },
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

      totalTaxAmount += Number((items[i]['quantity'] * items[i]['packRate'] *
        (1 - Number(items[i]['discountPercentage']) / 100)) * ((items[i]['tax']['categoryCode'] == 'A' ? this.taxValue : 0) / 100));

      this.pendingPurchaseOrderForm.get('taxAmt').setValue(totalTaxAmount.toFixed(2));
      this.poValueCalculate1();
    }
  }
  selectedGridRow;
  getTotalItems = 0;
  getTotalQ = 0;
  onSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows[0] !== undefined) {
      this.selectedGridRow = selectedRows[0];
      this.setData(selectedRows[0]);
      this.getTotalItem();
      this.getTotalQuantity();
      this.getTotalAmount();

    }
  }

  onCellClicked(params) {

    if (params.colDef.field !== '') {
      this.change(params.data);

    }
    this.pendingPurchaseOrderForm.get('cash').disable()
    this.setData(params.data)
  }
  approvePermissionCheck() {
    if (this.permissions instanceof Array) {
      if (this.permissions[14]['activeS'] === 'Y') {
        return false;
      }
      else {

        return true;
      }
    }
    else {
      return false;
    }
  }
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
  dateFormatter(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.purchaseOrderDate != null && params.data.purchaseOrderDate != undefined) {
        try {
          params.data.purchaseOrderDate = this.datePipe.transform(params.data.purchaseOrderDate, "dd-MM-yyyy");
        }
        catch (error) {

        }
        return params.data.purchaseOrderDate;
      }
    }
  }

  change(params) {
    const data = params;
    // setTimeout(() => {
    //   $('#pendingModal').modal('show');
    // }, 200);
    // this.gridApi.forEachNodeAfterFilter(function (node) {
    //   node.setSelected(false);
    // });
  }

  en_dis = false;
  getApprovedData(pharmacyId: number) {

    this.loadRowData([], this.approvedGridOptions);

    this.service.getpendingpurchaseordersbypharmacy(pharmacyId).subscribe(
      res => {
        const data = res;
        for (var i = 0; i < res['result']['length']; i++) {
          if (res['result'][i]['purchaseorderitems'].length > 0) {
            //data['result'][i]['itemCode'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['itemCode'] : null : null;
            //data['result'][i]['itemName'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['itemName'] : null : null;
            // data['result'][i]['quantity'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['totalQuantity'] : null;
            //  data['result'][i]['manuName'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['manufacturer']['name'] : null : null;
            // data['result'][i]['packRate'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['packRate'] : null;
          }

        }

        this.loadRowData(data['result'], this.approvedGridOptions);
      }
    );
  }

  getLimitedPendingData(pharmacyId: number, start, end) {

    this.loadRowData([], this.approvedGridOptions);

    this.service.getpendingpurchaseordersbypharmacyWithLimit(pharmacyId, start, end).subscribe(
      res => {
        const data = res;
        this.loadRowData(data['result'], this.approvedGridOptions);
      }
    );

  }

  loadRowData(inputRowData: Object[], gridoptions: GridOptions) {
    try {
      gridoptions.rowData = inputRowData;
      gridoptions.api.setRowData(gridoptions.rowData);
    } catch (e) {
      gridoptions.rowData = inputRowData;
    }
  }
  onCancel() {
    this.getApprovedData(this.pharmacyId)
  }
  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.approvedGridOptions.api.setQuickFilter($event.target.value);
    if (this.approvedGridOptions.api.getDisplayedRowCount() === 0) {
      this.approvedGridOptions.api.showNoRowsOverlay();
    } else {
      this.approvedGridOptions.api.hideOverlay();
    }
  }

  formatData(type, status) {
    let sendData = {};

    sendData['advance'] = type.advance;
    if (status === 'approve') {
      sendData['approvedDate'] = type.approvedDate;
      sendData['approvedId'] = localStorage.getItem('id');
      this.reason = undefined;
    }
    if (status === 'reject') {
      sendData['rejectedDate'] = type.approvedDate;
      sendData['rejectedId'] = localStorage.getItem('id');
      sendData['rejectedReason'] = type.rejectedReason;
      this.reason = undefined;
    }
    sendData['auditId'] = type.auditId;
    sendData['otherCharges'] = type.otherCharges;
    sendData['poCategory'] = type.poCategory;
    sendData['poNature'] = type.poNature;
    sendData['poTerm'] = type.poTerm;
    sendData['purchaseOrderDate'] = type.purchaseOrderDate;
    sendData['createdId'] = type.createdId;
    sendData['createdUser'] = type.createdUser;
    sendData['deliveryTime'] = type.deliveryTime;
    sendData['deliveryTypesModel'] = type.deliveryTypesModel;
    sendData['discount'] = type.discount;
    sendData['discountPercentage'] = type.discountPercentage;
    sendData['emergency'] = type.emergency;
    sendData['modifiedDate'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    sendData['modifiedBy'] = { 'employeeId': localStorage.getItem('id') }
    sendData['medicalOrNonMedical'] = type.medicalOrNonMedical;
    sendData['paymentTime'] = type.paymentTime;
    sendData['pharmacyModel'] = { 'pharmacyId': type.pharmacyModel.pharmacyId };
    if (type.quotationModel != null && type.quotationModel != undefined) {
      if(type['quotationModel']['quotationId']){
        sendData['quotationModel'] = { 'quotationId': type['quotationModel']['quotationId'] };
      }else{
        sendData['quotationModel'] = { 'quotationId': type['quotationModel'] };
      }
      
    }

    sendData['poAmount'] = type.poAmount;
    sendData['creditDays'] = type.creditDays;
    sendData['totalValue'] = type.totalValue;
    sendData['totalQuantity'] = type.totalQuantity;
    /* sendData['purchaseorderitems'] = [
      {
        "actualValue": type.purchaseorderitems[0].actualValue,
        "purchaseOrderItemsId": type.purchaseorderitems[0].purchaseOrderItemsId,
        "createdUser": type.createdUser,
        'auditId': type.auditId,
        "discount": type.discount,
        "discount_percentage": type.discountPercentage,
        "itemsModel": {
          "itemId": itemId //check
        },
        "quantity": quan ? quan : 0, //check
        "remarks": type.remarks,
        "unitRate": type.purchaseorderitems[0].unitRate,
        "unitSaleRate": type.purchaseorderitems[0].unitSaleRate,
        "totalQuantity": type.purchaseorderitems[0].totalQuantity,
        "totalValue": type.purchaseorderitems[0].totalValue
      }
    ]; */
    sendData['remarks'] = type.remarks;
    sendData['sentId'] = type.sentId;
    sendData['shippingAddress'] = type.shippingAddress;
    sendData['supplierModel'] = { 'supplierId': type.supplierModel.supplierId };
    sendData['purchaseOrderNo'] = type.purchaseOrderNo
    sendData['purchaseOrderStatusModel'] = type.purchaseOrderStatusModel;
    sendData['purchaseOrderId'] = type.purchaseOrderId;
    sendData['variationType'] = type.variationType;
    sendData['paymentType'] = type.paymentType;
    sendData['approvedDate'] = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    sendData['lastUpdateUser'] = localStorage.getItem('id');
    sendData['poDesc'] = type['poDesc']
    //data['result'][i]['']



    return sendData;
  }

  approve() {
    // let send = {};

    // itemsId pending
    // percentage pending
    // unitRate pending
    // validity pending
    // status
    this.spinnerService.show();

    let selectedQuotation = JSON.parse(JSON.stringify(this.approvedGridOptions.api.getSelectedRows()[0]));
    selectedQuotation['purchaseOrderDate'] = new Date(selectedQuotation['purchaseOrderDate'])//this.datePipe.transform(selectedQuotation['purchaseOrderDate'], "yyyy-MM-dd")

    const send = this.formatData(selectedQuotation, 'approve');

    this.service.approvedpurchaseorder(send).subscribe(
      approveRes => {
        if (approveRes instanceof Object) {
          if (approveRes['responseStatus']['code'] === 200) {
            this.spinnerService.hide();
            this.getApprovedData(this.pharmacyId);
            //location.reload();
            this.toasterService.success(approveRes['message'], 'Success', {
              timeOut: 3000
            });
          }
        }
      }, error => {
        this.spinnerService.show();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      }
    );
  }

  reject() {

    // itemsId pending
    // percentage pending
    // unitRate pending
    // validity pending
    // status

    let selectedQuotation = JSON.parse(JSON.stringify(this.approvedGridOptions.api.getSelectedRows()[0]));
    selectedQuotation['purchaseOrderDate'] = this.datePipe.transform(selectedQuotation['purchaseOrderDate'], "yyyy-MM-dd")
    const send = this.formatData(selectedQuotation, 'reject');

    this.service.rejectedpurchaseorder(send).subscribe(
      approveRes => {
        if (approveRes instanceof Object) {
          if (approveRes['responseStatus']['code'] == 200) {
            this.getApprovedData(this.pharmacyId);
            //location.reload();
            this.toasterService.success(approveRes['message'], 'Success', {
              timeOut: 3000
            });
          }
        }
      }
    );
  }

  ngOnInit() {
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
   
    this.selectedPurchaseRow=this.gridApi.getSelectedRows()[0]
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
