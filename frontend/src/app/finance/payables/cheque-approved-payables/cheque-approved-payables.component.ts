import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { PaymentsService } from './../pending-payables/shared/payments.service';
import { DatePipe } from '@angular/common';
import { GridOptions, ColDef } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-cheque-approved-payables',
  templateUrl: './cheque-approved-payables.component.html',
  styleUrls: ['./cheque-approved-payables.component.scss'],
  providers: [PaymentsService]
})
export class ChequeApprovedPayablesComponent implements OnInit {

  approvedChequeGridOptions: GridOptions;
  popUpChequeGridOptions: GridOptions;
  purchaseInvoiceGridOptions: GridOptions;
  confirmDeleteCheck = false;
  searchDropdownValues = ['Cheque No', 'Invoice No'];
  searchType = undefined;
  constructor(private datePipe: DatePipe, private paymentsService: PaymentsService,
    private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.approvedChequeGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.approvedChequeGridOptions.rowSelection = 'single';
    this.approvedChequeGridOptions.columnDefs = this.columnDefs;

    this.popUpChequeGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.popUpChequeGridOptions.rowSelection = 'single';
    this.popUpChequeGridOptions.columnDefs = this.payablesGridDefs;
    this.popUpChequeGridOptions.rowData = [];

    this.purchaseInvoiceGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.purchaseInvoiceGridOptions.rowSelection = 'single';
    this.purchaseInvoiceGridOptions.columnDefs = this.invoiceGridDefs;
    this.purchaseInvoiceGridOptions.rowData = [];

    this.getAllApprovedCheques();
    this.getMargin()
    this.getMaxDiscount();
    this.getConfigurationStatus();
    this.getalldeliverytypes();
  }


  customer: string = 'Y';
  supplier: string = 'N';
  ngOnInit() {
    this.supplier = "Y";
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

    { headerName: 'Cheque No', field: 'chequeNumber', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Supplier', field: 'supplier', sortable: true, resizable: true, filter: true,
      valueGetter: function (params) {
        if (params.data['chequeItems']['length'] > 0) {
          return params.data['chequeItems'][0]['accountPayablesId']['supplierName'];
        }
        return "";
      }
    },
    {
      headerName: 'Cheque Date', field: 'chequeDate', sortable: true, resizable: true, filter: true,
      valueGetter: this.dateFormatter.bind(this)
    },
    { headerName: 'Status', field: 'status', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount ', field: 'chequeAmt', sortable: true, resizable: true, filter: true },
    { headerName: 'Level 1 Approver', field: 'firstLevelApproverName', sortable: true, resizable: true, filter: true },
    { headerName: 'Level 2 Approver', field: 'secondLevelApproverName', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Type', field: 'payType', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Cheque Raised Date', field: 'chequeRaisedDt', sortable: true, filter: true, resizable: true,
      valueGetter: this.chequeDateFormatter.bind(this)
    },


  ];

  dateFormatter(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.chequeDate != null && params.data.chequeDate != undefined) {
        try {
          params.data.chequeDate = this.datePipe.transform(params.data.chequeDate, "dd-MM-yyyy");

        }
        catch (error) {
        }
        return params.data.chequeDate;
      }
    }
  }

  chequeDateFormatter(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.chequeRaisedDt != null && params.data.chequeRaisedDt != undefined) {
        try {
          params.data.chequeRaisedDt = this.datePipe.transform(params.data.chequeRaisedDt, "dd-MM-yyy");
        }
        catch (error) {
        }
        return params.data.chequeRaisedDt;
      }
    }
  }

  rowData: any;

  getAllApprovedCheques() {
    this.spinnerService.show();
    this.paymentsService.getApprovedCheques().subscribe(
      gridDataResponse => {
        if (gridDataResponse instanceof Object) {
          if (gridDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridDataResponse['result'];
            this.spinnerService.hide();
            if (this.rowData.length < 0) {
              this.toasterService.warning('No Data Found', '', {
                timeOut: 5000
              })
            }
          }
        } else {
          this.spinnerService.hide();
          this.toasterService.error('Please Contact Administrator', '', {
            timeOut: 3000
          })
        }
      }
    )
  }

  payablesGridDefs: ColDef[] = [
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

    { headerName: 'Payment No', field: 'accountPayablesId.paymentNumber', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Invoice No', field: 'accountPayablesId.invoiceNo', sortable: true, resizable: true, filter: true,
    },
    { headerName: 'Source Ref', field: 'accountPayablesId.sourceRef', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Payment Date', field: 'paymentDate', sortable: true, resizable: true, filter: true,
      valueGetter: this.payablesdateFormatter.bind(this)
    },
    { headerName: 'Status', field: 'accountPayablesId.selectedStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount paid', field: 'accountPayablesId.totalAmountPaid', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount To Be Paid', field: 'accountPayablesId.totalAmountToBePaid', sortable: true, resizable: true, filter: true, hide: true },
    { headerName: 'Payment Status', field: 'accountPayablesId.selectedPaymentStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Type', field: 'accountPayablesId.sourceType', sortable: true, resizable: true, filter: true }

  ];


  invoiceGridDefs: ColDef[] = [
    {
      headerName: "",
      field: "",
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40,
      resizable: true,
      checkboxSelection: false

    },
    { headerName: 'Item Code', field: 'itemsModel.itemCode', sortable: true, filter: true, resizable: true, hide: true },
    { headerName: 'Item Name', field: 'itemsModel.itemName', sortable: true, filter: true, resizable: true, width: 400 },

    {
      headerName: 'Total Qty', field: 'orderQuantity', sortable: true, filter: true, resizable: true, singleClickEdit: true, width: 100,
    },
    {
      headerName: 'Bonus', field: 'bonus', sortable: true, filter: true, resizable: true, singleClickEdit: true, editable: false, width: 80,
    },
    {
      headerName: 'Pack', field: 'pack', sortable: true, filter: true, resizable: true, width: 80, editable: false, cellStyle: (params) => {

        if (params.node.rowIndex % 2 !== 0) {
          return { background: '#cccccc' }
        }
      },
      valueGetter: function (params) {
        if (params.data.pack != null && params.data.pack != undefined) {
          return params.data.pack;
        }
        else {
          params.data.pack = 1;
          return params.data.pack;
        }
      }
    },
    {
      headerName: 'Batch', field: 'batchNo', sortable: true, filter: true, resizable: true, editable: false, width: 100,
      singleClickEdit: true,
      cellStyle: (params) => {
        if (params.node.rowIndex % 2 !== 0) {
          return { background: '#cccccc' }
        }
      }
    },
    {
      headerName: 'Expiry', field: 'expiryDt', sortable: true, filter: true, resizable: true, singleClickEdit: true,

    },


    {
      headerName: 'Appd Qty', field: 'quantityApproved', width: 100, sortable: true, resizable: true, filter: true, singleClickEdit: true, editable: false,

    },

    {
      headerName: 'Rjt Qty', field: 'reject', sortable: true, width: 90, filter: true, resizable: true, singleClickEdit: true, editable: false,
      cellRenderer: (data) => {
        if ((Number(data.value) + (Number(data.data.bonus) ? Number(data.data.bonus) : 0) + (Number(data.data.quantityApproved) ? Number(data.data.quantityApproved) : 0)) > data.data.quantity) {
          return '0';
        }
        return data.value ? data.value : '0';
      },
      cellStyle: (params) => {
        if (params.node.rowIndex % 2 !== 0) {
          return { background: '#cccccc' }
        }
      }
    },

    {
      headerName: 'Pack P.Price', field: 'packPPrice', sortable: true, singleClickEdit: true, resizable: true, filter: true, editable: false, width: 120,

      valueGetter: function (params) {
        var pack = params.data.pack != null && params.data.pack != undefined ? params.data.pack : 1;
        var ppPrice = params.data.packPPrice != null && params.data.packPPrice != undefined ? params.data.packPPrice : 0;
        params.data.unitRate = (((ppPrice / pack) * 100) / 100).toFixed(2);

        return params.data.packPPrice;

      },

    },


    {
      headerName: 'MRP', field: 'mrp', sortable: true, width: 80, filter: true, resizable: true, singleClickEdit: true, editable: false, hide: true,
      cellStyle: (params) => {
        if (params.node.rowIndex % 2 !== 0) {
          return { background: '#cccccc' }
        }
      }
    },
    { headerName: 'P.Disc%', field: 'discountPercentage', sortable: true, resizable: true, singleClickEdit: true, filter: true, editable: false, width: 80, },


    {
      headerName: 'Pack.S.Price', field: 'packSaleRate', sortable: true, resizable: true, singleClickEdit: true, filter: true,
      editable: false, width: 120,
      cellStyle: (params) => {
        if (params.node.rowIndex % 2 !== 0) {
          return { background: '#cccccc' }
        }
      },

      valueGetter: this.packSalePrice.bind(this)
    },

    {
      headerName: 'S.Disc%', field: 'saleDiscountPercentage', sortable: true, resizable: true, singleClickEdit: false, filter: true, editable: false, width: 100, hide: false,
      cellStyle: (params) => {
        if (params.node.rowIndex % 2 !== 0) {
          return { background: '#cccccc' }
        }
      }
    },

    { headerName: 'Tax', field: 'tax.categoryCode', sortable: true, resizable: true, singleClickEdit: false, filter: true, editable: false, width: 80, },
    {
      headerName: 'Margin%', field: 'marginPer', sortable: true, resizable: true, singleClickEdit: false, filter: true, editable: false, width: 100,

    },
    {
      headerName: 'Net Amount',
      field: 'netAmount',
      pinned: 'right',
      sortable: true,
      filter: true,
      editable: false,
      resizable: true,
      valueGetter: this.netAmountCalc.bind(this), width: 120,
    }
  ];

  netAmountCalc(params) {
    var qty = isNaN(params.data.quantityApproved) ? 0 : params.data.quantityApproved;

    var ppPrice = isNaN(params.data.packPPrice) ? 0 : params.data.packPPrice;

    var discountPercentage = isNaN(params.data.discountPercentage) ? 0 : params.data.discountPercentage;

    var tax = params.data.tax != null && params.data.tax != undefined ? params.data.tax.categoryCode == 'A' ? 14 : 0 : 0;

    params.data.netAmount = Number((((qty * ppPrice * (1 - discountPercentage / 100)) * (1 + tax / 100)) * 100) / 100).toFixed(2);

    return Number(params.data.netAmount).toFixed(2);
  }



  payablesdateFormatter(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.accountPayablesId.paymentDate != null && params.data.accountPayablesId.paymentDate != undefined) {
        try {
          params.data.paymentDate = this.datePipe.transform(params.data.accountPayablesId.paymentDate, "dd-MM-yyy");
        }
        catch (error) {
        }
        return params.data.paymentDate;
      }
    }
  }

  packSalePrice(params) {

    params.colDef.singleClickEdit = this.editable;
    params.colDef.editable = this.editable;
    var pack = (params.data.pack != null && params.data.pack) != undefined ? params.data.pack : 1;
    var psRate = (params.data.packSaleRate != null && params.data.packSaleRate != undefined) ? params.data.packSaleRate : 0;
    if (this.editable) {
      params.data.packSaleRate = pack * (params.data.unitSaleRate ? params.data.unitSaleRate : 0)
    }
    else {
      var itemMargin = params.data.itemsModel.itemCategory ? params.data.itemsModel.itemCategory.marginPercentage ? Number(params.data.itemsModel.itemCategory.marginPercentage) : this.globalMargin ? this.globalMargin : this.globalMargin ? this.globalMargin : 0 : this.globalMargin ? this.globalMargin : 0;
      // var discPer = params.data.saleDiscountPercentage ? Number(params.data.saleDiscountPercentage) : Number(this.maxDiscount);
      var discPer = this.maxDiscount ? Number(this.maxDiscount) : 0;


      var puchasePrice = params.data.packPPrice;
      var purchaseDiscPer = params.data.discountPercentage;
      var purchasePriceAfterDisc = (puchasePrice * (100 - purchaseDiscPer) / 100);
      var salesdiscPer = params.data.saleDiscountPercentage ? params.data.saleDiscountPercentage : 0;
      var salesDiscountPrice = (puchasePrice - purchasePriceAfterDisc * (100 - salesdiscPer) / 100) - (puchasePrice - purchasePriceAfterDisc);
      var marginPer = itemMargin ? itemMargin : 0;
      var markupPer = this.maxDiscount ? this.maxDiscount : 0;
      var marginPrice = purchasePriceAfterDisc * ((100 + marginPer) / 100)
      var markupPrice = puchasePrice * ((100 + markupPer) / 100)
      var marginPulseMarkupPrice = marginPrice + (markupPrice - puchasePrice);
      var finalSalesPrice = marginPulseMarkupPrice - salesDiscountPrice

      params.data.packSaleRate = (finalSalesPrice).toFixed(2);
    }


    params.data.unitSaleRate = (((psRate / pack) * 100) / 100).toFixed(2);
    params.data.mrp = params.data.unitSaleRate;

    return params.data.packSaleRate;


  }

  maxDiscount: any;
  globalMargin: any;
  getMaxDiscount() {
    this.paymentsService.getMaxDiscount().subscribe(res => {
      this.maxDiscount = res['result'];

    });
  }

  getMargin() {
    this.paymentsService.getMargin().subscribe(res => {
      this.globalMargin = res['result'];
    });
  }

  editable = true;
  getConfigurationStatus() {
    this.paymentsService.getConfigurationStatus().subscribe(response => {

      if (response['responseStatus']['code'] === 200) {

        if (response['result'] != null && response['result'] != undefined) {
          if (response['result']['configStatusValue'] == 'activate') {
            this.editable = false;
          }
        }
      }
    });
  }

  chequeRowData: any;

  onCellClicked(params) {
    if (params.column.colId !== 'check') {
      this.change(params.data);
      setTimeout(() => {
        $('#approvedModal').modal('show');
      }, 200);
    }
  }

  statusGrid = false;
  onInvoiceCellClicked(event) {
    this.statusGrid = true;
    let selectedObj = this.popUpChequeGridOptions.api.getSelectedRows();
    this.paymentsService.getInvoiceSearch(selectedObj[0]['accountPayablesId']['invoiceNo']).subscribe(invRes => {
      if (invRes instanceof Object) {
        if (invRes['responseStatus']['code'] === 200) {
          this.invDataChange(invRes['result']);
        }
      }
    })
  }

  paymentTypes: any[] = [];
  getPaymentTypes(data) {
    this.paymentsService.getallpaymenttypes().subscribe(
      getallpaymenttypesResponse => {
        if (getallpaymenttypesResponse['responseStatus']['code'] === 200) {
          this.paymentTypes = getallpaymenttypesResponse['result'];
          this.selectedPaymentType = data['paymentType'];
        }
      }
    );
  }

  deliveries;
  selectedDeliveryId;
  deliveryType;
  getalldeliverytypes() {
    this.paymentsService.getalldeliverytypes().subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.deliveries = res['result'];
            this.selectedDeliveryId = this.deliveries[1];
            this.deliveryType = this.selectedDeliveryId['type'];
          }
        }
      }
    );
  }

  selectedPurchaseOrder: any;
  ddd: any;
  selectedPaymentType: any;
  purchaseInvData: any;
  supPayType: any;
  creditDays: any;
  invDataChange(data) {
    this.getPaymentTypes(data);
    this.purchaseInvoiceGridOptions.api.setRowData([]);
    this.purchaseInvoiceGridOptions.api.updateRowData({ add: data['invoiceItems'] });
    $('#purchaseInvoiceGRN').val(data['grnNo']);
    $('#purchaseInvoiceDate').val(data['invoiceDt']);
    $('#purchaseInvoiceGRNDate').val(data['invoiceDt']);
    this.ddd = data['invoiceStatus']['status'];
    this.supPayType = data['paymentType']['type'];
    this.selectedPurchaseOrder = data['invoiceItems'][0]['purchaseOrderModel'] != null && data['invoiceItems'][0]['purchaseOrderModel'] != undefined ? data['invoiceItems'][0]['purchaseOrderModel']['purchaseOrderNo'] : '';
    $('#purchaseInvoiceInvNo').val(data['invoiceNo']);
    $('#purchaseInvoiceParcel').val(data['parcelNo']);
    $('#purchaseInvoiceBRBy').val(data['broughtBy']);
    $('#purchaseInvoiceLabelName').val(data['supplierModel']['name']);
    $('#purchaseInvoiceDlNo').val(data['supplierModel']['dlNo']);
    $('#purchaseInvoiceLabelAddOne').val(data['supplierModel']['addressLine1']);
    $('#netPayDays').val(data['supplierModel']['paymentCreditNetDays']);
    $('#invDesc').val(data['reason']);
    $('#purchaseInvoiceRejects').val(data['totalRejects']);
    $('#purchaseInvoiceCharge').val(data['handlingCharges']);
    $('#purchaseInvoiceRoundOff').val(data['roundOff']);
    $('#purchaseInvoiceRemark').val(data['remarks'])
    $('#purchaseInvoiceBalance').val(data['balance']);
    $('#purchaseInvoiceAdvance').val(data['advance']);
    this.creditDays = data['creditDays'] != null && data['creditDays'] != undefined ? data['creditDays'] : '0';




    this.getTotalQuantity();

  }

  totalQuantity: any;
  totalItems: any;
  bonus: any;
  netAmt: any;
  disc: any;

  getTotalQuantity() {
    var tQuantity = 0;
    var tBonus = 0;
    var tItems = 0;
    var disc = 0;
    var totalNetAmount = 0;
    var totalRejects = 0;

    this.purchaseInvoiceGridOptions.api.forEachNode(node => {
      tQuantity += Number(node['data']['quantityApproved']);
      disc += Number(isNaN(node['data']['discount']) ? 0 : node['data']['discount']);
      totalNetAmount += Number(isNaN(node['data']['netAmount']) ? 0 : node['data']['netAmount']);

      tBonus += Number(node['data']['bonus'])
      tItems++;
    })
    this.totalQuantity = tQuantity;
    this.totalItems = tItems;
    this.bonus = tBonus;
    this.netAmt = totalNetAmount.toFixed(2);
    this.disc = disc.toFixed(2);
  }



  totalAmountToBePaid: any;
  selectedStatus: any;
  selectedSupplier: any;
  Advance: any;

  change(params) {
    const data = params;

    this.chequeRowData = data['chequeItems'];
    this.selectedSupplier = data['chequeItems'][0]['accountPayablesId']['supplierName'];
    this.totalAmountToBePaid = data['chequeAmt'];
    this.selectedStatus = { name: 'Approved' }
    this.Advance = '0.00';
  }

  OnApprovedChequeSearch(event) {
    if ((this.searchType == 'Cheque No')) {
      this.paymentsService.getAllApprovedChequesBySearch(event['target']['value']).subscribe(searchRes => {
        if (searchRes instanceof Object) {
          if (searchRes['responseStatus']['code'] === 200) {
            this.rowData = searchRes['result'];
            if (this.rowData.length <= 0) {
              this.toasterService.warning('No Data Found', '', {
                timeOut: 5000
              })
            }
          }
        }
      })
    } else if ((this.searchType == 'Invoice No')) {
      this.paymentsService.getAllChequesByInvoiceNo(event['target']['value'], "Approved").subscribe(searchRes => {
        if (searchRes instanceof Object) {
          if (searchRes['responseStatus']['code'] === 200) {
            this.rowData = searchRes['result'];
            if (this.rowData.length <= 0) {
              this.toasterService.warning('No Data Found', '', {
                timeOut: 5000
              })
            }
          }
        }
      })
    }

  }

  onCrossSelected(event) {
    setTimeout(() => {
      $('#approvedModal').modal('show');
    }, 200);
    this.statusGrid = false;
  }

  deleteChequePopup() {
    this.confirmDeleteCheck = true;
  }

  deleteChequeById() {
    let cheque = this.approvedChequeGridOptions.api.getSelectedRows();
    this.spinnerService.show();
    this.paymentsService.deleteChequeById(cheque[0]['chequeId']).subscribe(data => {
      this.toasterService.success("Cheque deleted", "Success", { timeOut: 5000 });
      this.getAllApprovedCheques();
      this.confirmDeleteCheck = false;
      this.spinnerService.show();
    }, error => {
      this.toasterService.error("Please contact administrator", "Error Occurred", { timeOut: 5000 });
      this.spinnerService.show();
    });
  }

  cancelDeleteChequePopup() {
    this.confirmDeleteCheck = false;
  }
}
