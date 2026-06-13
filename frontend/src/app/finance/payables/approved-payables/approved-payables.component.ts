import { GridOptions, ColDef, IGetRowsParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { PaymentsService } from './../pending-payables/shared/payments.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-approved-payables',
  templateUrl: './approved-payables.component.html',
  styleUrls: ['./approved-payables.component.scss'],
  providers: [PaymentsService]
})
export class ApprovedPayablesComponent implements OnInit {

  pendingChequeGridOptions: GridOptions;
  popUpChequeGridOptions: GridOptions;
  purchaseInvoiceGridOptions: GridOptions;
  confirmDeleteCheck = false;
  searchDropdownValues = ['Cheque No', 'Invoice No'];
  searchType = undefined;
  constructor(private datePipe: DatePipe, private paymentsService: PaymentsService,
    private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.pendingChequeGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.pendingChequeGridOptions.rowSelection = 'single';
    this.pendingChequeGridOptions.columnDefs = this.columnDefs;

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

    this.accountPayablesGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.accountPayablesGridOptions.rowSelection = 'multiple';
    this.accountPayablesGridOptions.columnDefs = this.gridColumnDefs;

    this.cacheOverflowSize = 2;
    this.maxConcurrentDatasourceRequests = 2;
    this.accountPayablesGridOptions.rowModelType = 'infinite';

    this.getAllEmpAccessDataHavingCheques();
    this.getMargin()
    this.getMaxDiscount();
    this.getConfigurationStatus();
    this.getalldeliverytypes();


    /*  this.accountPayablesGridOptions.getRowStyle = function (params) {
       if (params.node.rowIndex % 2 !== 0) {
         return { background: '#cccccc' }
       }
     } */


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
    { headerName: 'Requested By', field: 'requestedName', sortable: true, resizable: true, filter: true },
    { headerName: 'Level 1 Approver', field: 'firstLevelApproverName', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Type', field: 'payType', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Cheque Raised Date', field: 'chequeRaisedDt', sortable: true, filter: true, resizable: true,
      valueGetter: this.chequeDateFormatter.bind(this)
    }

  ];

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
    { headerName: 'Payment No', field: 'paymentNumber', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Invoice No', field: 'invoiceNo', sortable: true, resizable: true, filter: true,
    },
    { headerName: 'Source Ref', field: 'sourceRef', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Payment Date', field: 'paymentDate', sortable: true, resizable: true, filter: true,
      valueGetter: this.paymentDateFormatter.bind(this)
    },
    { headerName: 'Status', field: 'selectedStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Amount paid', field: 'totalAmountPaid', sortable: true, resizable: true, filter: true, hide: true },
    { headerName: 'Amount To Be Paid', field: 'totalAmountToBePaid', sortable: true, resizable: true, filter: true },
    { headerName: 'Payment Status', field: 'selectedPaymentStatus', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Type', field: 'sourceType', sortable: true, resizable: true, filter: true }

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
      //   cellEditorFramework: NumericEditor,
      valueGetter: this.netAmountCalc.bind(this), width: 120,
    }
  ];


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

  netAmountCalc(params) {
    var qty = isNaN(params.data.quantityApproved) ? 0 : params.data.quantityApproved;

    var ppPrice = isNaN(params.data.packPPrice) ? 0 : params.data.packPPrice;

    var discountPercentage = isNaN(params.data.discountPercentage) ? 0 : params.data.discountPercentage;

    var tax = params.data.tax != null && params.data.tax != undefined ? params.data.tax.categoryCode == 'A' ? 14 : 0 : 0;

    params.data.netAmount = Number((((qty * ppPrice * (1 - discountPercentage / 100)) * (1 + tax / 100)) * 100) / 100).toFixed(2);

    return Number(params.data.netAmount).toFixed(2);
  }



  rowData: any;
  selectedSupplier: any;

  getAllPendingCheques() {
    this.paymentsService.getCheques().subscribe(
      gridDataResponse => {
        if (gridDataResponse instanceof Object) {
          if (gridDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridDataResponse['result'];
            if (this.rowData.length < 0) {
              this.toasterService.warning('No Data Found', '', {
                timeOut: 5000
              })
            }
          }
        }
      }
    )
  }

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

  chequeRowData = [];

  onCellClicked(params) {
    if (params.column.colId !== 'check') {
      this.change(params.data)
      setTimeout(() => {
        $('#approvedModal').modal('show');
      }, 200);
    }
  }

  totalAmountToBePaid: any;
  selectedStatus: any;
  Advance: any;
  editBtn: boolean = true;
  oldChequeAccPayData: any;
  chequeId: any;

  change(params) {
    const data = params;
    var chequeItemsData = [];
    for (var i = 0; i < data.chequeItems.length; i++) {
      chequeItemsData.push(data['chequeItems'][i]['accountPayablesId'])
    }

    this.chequeRowData = chequeItemsData;

    this.oldChequeAccPayData = chequeItemsData;
    this.chequeId = data['chequeId'];
    this.chequeNumber = data['chequeNumber'];
    this.selectedSupplier = data['chequeItems'][0]['accountPayablesId']['supplierName'];
    this.totalAmountToBePaid = data['chequeAmt'];
    this.selectedStatus = { name: 'Not Approved' }
    this.Advance = '0.00';
    var firstLevelApproval = data['firstLevelApproval'];
    if (firstLevelApproval != null && firstLevelApproval != undefined && firstLevelApproval != '' &&
      firstLevelApproval != 'null') {
      this.editBtn = false;
    } else {
      this.editBtn = true;
    }
  }

  onChequeApprove() {

    const data = this.pendingChequeGridOptions.api.getSelectedRows();
    for (var i = 0; i < data[0]['chequeItems']['length']; i++) {
      data[0]['chequeItems'][i]['accountPayablesId']['paymentDate'] = null;
    }

    data[0]['lastUpdateUser'] = localStorage.getItem('id');
    data[0]['chequeDate'] = null;
    data[0]['chequeRaisedDt'] = null;


    if (data[0]['firstLevelApproval'] == null && data[0]['firstLevelApproval'] == undefined) {
      data[0]['firstLevelApproval'] = localStorage.getItem('id');
    } else {
      data[0]['status'] = 'Approved';
      data[0]['chequeApprovalStatus'] = 'Paid'
      data[0]['secondLevelApproval'] = localStorage.getItem('id');
    }
    this.paymentsService.updateChequeData(data[0]).subscribe(chequeRes => {
      if (chequeRes instanceof Object) {
        if (chequeRes['responseStatus']['code'] === 200) {
          this.toasterService.success('', 'Cheque Approved Successfully', {
            timeOut: 3000
          });
          this.getAllEmpAccessDataHavingCheques();
        }
      }
    }, error => {
      this.toasterService.error("Error Occured Please Contact Administrator", "", { timeOut: 5000 })
    })

  }

  chequeNo: any;

  OnChequePendingSearch() {
    if ((this.chequeNo != null && this.chequeNo != undefined && this.chequeNo != '') && (this.searchType == 'Cheque No')) {
      this.paymentsService.getAllPendingChequesBySearch(this.chequeNo, localStorage.getItem('id')).subscribe(searchRes => {
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
    } else if ((this.chequeNo != null && this.chequeNo != undefined && this.chequeNo != '') && (this.searchType == 'Invoice No')) {
      this.paymentsService.getAllChequesByInvoiceNo(this.chequeNo, "Not Approved").subscribe(searchRes => {
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
    else {
      this.getAllEmpAccessDataHavingCheques();
    }

  }

  // approval cheque access

  getAllEmpAccessDataHavingCheques() {
    this.spinnerService.show();
    this.paymentsService.getEmployeeAccessForCheques(localStorage.getItem('id')).subscribe(accessRes => {
      if (accessRes instanceof Object) {
        if (accessRes['responseStatus']['code'] === 200) {
          this.rowData = accessRes['result'];
          this.spinnerService.hide();
          if (this.rowData.length <= 0) {
            this.toasterService.warning('No Data Found', '', {
              timeOut: 5000
            })
          }
        }
      } else {
        this.spinnerService.hide();
      }
    })
  }
  //-------------------------------------------------------------------//-------------------------------------------------------------------//
  // inv popup functionality

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


  statusGrid = false;
  onInvoiceCellClicked(event) {
    let selectedObj = this.popUpChequeGridOptions.api.getSelectedRows();
    if (selectedObj[0]['invoiceNo'] != null && selectedObj[0]['invoiceNo'] != undefined) {
      this.statusGrid = true;
      this.paymentsService.getInvoiceSearch(selectedObj[0]['invoiceNo']).subscribe(invRes => {
        if (invRes instanceof Object) {
          if (invRes['responseStatus']['code'] === 200) {
            this.invDataChange(invRes['result']);
          }
        }
      })
    } else if (selectedObj[0]['invoiceNo'] == null || selectedObj[0]['invoiceNo'] == undefined) {
      this.statusGrid = false;
      this.paymentGrid = true;
      $('#approvedModal').modal('hide');
    }


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
    // $('#purchaseInvoiceCurrPeriod').val(data['creditDays'] != null && data['creditDays'] != undefined ? data['creditDays'] : '0')
    this.creditDays = data['creditDays'] != null && data['creditDays'] != undefined ? data['creditDays'] : '0';

    this.getTotalQuantity();

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

  onCrossSelected(event) {
    setTimeout(() => {
      $('#approvedModal').modal('show');
    }, 200);
    this.statusGrid = false;
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

  //-------------------------------------------------------------------------------------------------------------//
  // pending account payables code replication

  statusDropdown: boolean = true;
  public showPaymentType: boolean = false;
  cheque: boolean = false;
  chequeAmt: any;
  chequeNumber: any;
  chequeDate: any;
  paymentGrid = false;
  accountPayablesGridOptions: GridOptions;
  accountPayablesrowData: any;
  selectedPaymentStatus: any;
  startDate: any;
  endDate: any;
  searchCodeValue: any;
  cacheOverflowSize;
  maxConcurrentDatasourceRequests: any;
  makePayment = true;

  searchCode(event) {
    //  this.searchInvoice = event['target']['value'];
    this.searchCodeValue = event['target']['value'];
  }

  status = [
    { name: 'Approved' },
    { name: 'Not Approved' }
  ];

  paymentStatusArray: any[] = ["Paid", "Partially Paid", "Pending"];
  paymentType: any;

  onStatusChanged(event) {
    if (event['name'] == 'Approved') {
      this.showPaymentType = true;
    } else {
      this.showPaymentType = false;
    }
  }

  chequeSelected(event) {
    this.cheque = true;
    this.makePayment = false;
    this.paymentType = 'Cheque';
  }

  reset() {
    this.makePayment = true;
    this.cheque = false;
    this.popUpChequeGridOptions.api.setRowData([]);
    this.selectedStatus = { name: 'Not Approved' };
    this.statusDropdown = true;
    this.showPaymentType = false;
    this.status = [
      { name: 'Approved' },
      { name: 'Not Approved' }
    ];
    this.statusDropdown = true;
    $('#approvedModal').modal('hide');
    this.popUpChequeGridOptions.api.updateRowData(({ add: this.oldChequeAccPayData }));
    //this.totalAmountToBePaid = this.oldAccPayTotalAmt;
  }

  gridArray = [];
  deleteBtn = false;
  editGrid() {
    var selectedData = this.popUpChequeGridOptions.rowData;
    this.supplierName = selectedData[0]['supplierName'];

    this.popUpChequeGridOptions.api.updateRowData({ add: selectedData['chequeItems'] });

    this.popUpChequeGridOptions.api.updateRowData({ add: [{}], addIndex: 0 });

    this.deleteBtn = true;

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

    { headerName: 'Payment No', field: 'paymentNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Invoice No', field: 'invoiceNo', sortable: true, resizable: true, filter: true },
    { headerName: 'Source Ref', field: 'sourceRef', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Payment Date', field: 'paymentDate', sortable: true, resizable: true, filter: true,
      valueGetter: this.paymentDateFormatter.bind(this)
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

  paymentDateFormatter(params) {
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

  function(params) {
    var totalAmountPaid = params.data != null && params.data != undefined ? params.data.totalAmountPaid : 0;
    if (totalAmountPaid != null && totalAmountPaid != undefined) {
      return totalAmountPaid;
    } else {
      totalAmountPaid = 0;
      return totalAmountPaid;
    }
  }

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
  supplierName: any;


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

  selectedRows: any;
  oldGrid: any;
  chequeAmount: any;
  oldAccPayTotalAmt: any;

  getSelectedGridItems() {

    this.selectedRows = this.accountPayablesGridOptions.api.getSelectedRows();
    this.gridArray = [];
    var invoiceTotalAmount = 0;
    var invoiceTotalAdvance = 0;
    var invoiceTotalCredit = 0;
    var invoiceTotalDebit = 0;
    $('#approvedModal').modal('show');
    this.accountPayablesGridOptions.api.getSelectedRows().forEach(data => {
      this.paymentGrid = false;
      let gridItem = new Object({});
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
        //  this.paymentsInformationForm.get('selectedStatus').setValue(this.selectedStatus)
      }

      this.gridArray.push(gridItem);

    });

    if (this.oldChequeAccPayData != null && this.oldChequeAccPayData != undefined) {

      var totalAmtPaid = 0;
      for (var i = 0; i < this.oldChequeAccPayData.length; i++) {
        totalAmtPaid += parseFloat(this.oldChequeAccPayData[i]['totalAmountToBePaid']);
      }

      this.oldAccPayTotalAmt = totalAmtPaid;
      this.totalAmountToBePaid = parseFloat(this.totalAmountToBePaid + totalAmtPaid).toFixed(2);
    }
    console.log("cheque amt assigned")
    this.chequeAmt = this.totalAmountToBePaid;
    console.log(this.chequeAmt)


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

    var rowsExist = null

    rowsExist = this.popUpChequeGridOptions.rowData;
    if (rowsExist.length > 0) {
      this.popUpChequeGridOptions.api.updateRowData({ add: this.gridArray });
    }
    else {
      this.popUpChequeGridOptions.api.updateRowData({ add: [{}] })
      this.popUpChequeGridOptions.api.updateRowData({ add: this.gridArray });
    }
    this.statusDropdown = false;
  }


  statusSelected(event) {
    this.onPaymentsSubmit();
  }


  onPaymentsSubmit() {
    this.statusGrid = false;
    var data = [];

    this.popUpChequeGridOptions.api.forEachNode(node => {
      data.push(node.data);
    });
    this.savePaymentsInformationFormChanges(this.formatData(data));
  }

  approvedRecords = [];
  formatData(type) {
    let requestObjectArray = [];
    for (var i = 0; i < type.length; i++) {
      if (type[i]['paymentNumber'] != null && type[i]['paymentNumber'] != undefined) {
        if (type[i]['selectedStatus'] != 'Approved') {
          let payload = new Object({});

          payload['accountPayablesId'] = type[i]['accountPayablesId']
          payload['paymentNumber'] = type[i]['paymentNumber']
          payload['supplierModel'] = type[i]['supplierModel']
          payload['selectedPaymentStatus'] = 'Paid';
          payload['createdUser'] = type[i]['createdUser'],
            payload['lastUpdateUser'] = localStorage.getItem('id'),
            payload['sourceRef'] = type[i]['sourceRef'];
          payload['approvedBy'] = localStorage.getItem('id'),
            //     payload['approvedDate'] = type[i][''];
            payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
          payload['totalAmountToBePaid'] = 0;
          payload['sourceType'] = type[i]['sourceType']
          payload['source'] = type[i]['source']
          payload['totalAmountPaid'] = type[i]['totalAmountToBePaid']
          payload['supplierName'] = this.supplierName != null && this.supplierName != undefined ? this.supplierName : null;
          //  payload['customerName'] = this.customerName != null && this.customerName != undefined ? this.customerName : null;
          payload['invoiceNo'] = type[i]['invoiceNo']
          payload['paymentType'] = this.paymentType;
          payload['chequeAmount'] = this.chequeAmt != null && this.chequeAmt != undefined ? this.chequeAmt : '';

          requestObjectArray.push(payload);
        } else {
          this.approvedRecords.push(type[i])
        }
      }
    }
    return requestObjectArray;
  }

  savePaymentsInformationFormChanges(paymentsInformationForm: Object[]) {
    this.spinnerService.show();
    if (paymentsInformationForm[0]['paymentType'] == 'Cheque') {
      if ((this.chequeDate != null && this.chequeDate != undefined) && (this.chequeNumber != null && this.chequeNumber != undefined)) {
        let chequeItems = [];
        var obj = {};

        this.paymentsService.deleteAllChequeItems(this.chequeId).subscribe(res => {
          this.popUpChequeGridOptions.api.forEachNode(node => {
            if (node['data']['paymentNumber'] != null && node['data']['paymentNumber'] != undefined) {

              //node['data']['accountPayablesId']['paymentDate'] = null;
              obj = {
                'accountPayablesId': { 'accountPayablesId': node['data']['accountPayablesId'] },
                'activeS': 'Y',
                'createdUser': localStorage.getItem('id'),
                'lastUpdateUser': localStorage.getItem('id')
              }
              chequeItems.push(obj)
            }
          });


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
            'chequeRaisedDt': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            'chequeId': this.chequeId
          };

          this.paymentsService.saveChequeData(chequeObj).subscribe(chequeRes => {
            if (chequeRes instanceof Object) {
              if (chequeRes['responseStatus']['code'] === 200) {
                this.spinnerService.hide();
                this.toasterService.success(chequeRes['message'], 'Waiting For Approval', {
                  timeOut: 5000
                });
                // this.paymentsInformationForm.reset();
                this.selectedStatus = { name: 'Approved' };
                this.showPaymentType = false;
                this.totalAmountToBePaid = 0;
                this.oldGrid = undefined;
                this.gridArray = undefined;
                this.makePayment = false;
                this.cheque = false;
                this.makePayment = true;
                this.deleteBtn = false;
                this.reset();
                this.getAllEmpAccessDataHavingCheques();

              }
            }
          });
        })





      } else {
        this.spinnerService.hide();
        this.toasterService.warning('Please Provide Cheque Details', 'Cheque Date or Cheque No Missing', {
          timeOut: 5000
        })
      }

    }
    else {
      // this.savePayablesData(paymentsInformationForm)
    }

  }

  close() {
    //reset and close
    this.paymentGrid = false;
    this.selectedPaymentStatus = undefined;
    this.accountPayablesGridOptions.api.setRowData([]);
    this.reset();
  }

  closePopUp() {
    this.paymentGrid = false;
  }
  dataDeleted = false;
  deleteChequeItem() {
    const selectedRow = this.popUpChequeGridOptions.api.getFocusedCell();
    //this.popUpChequeGridOptions.api.updateRowData({ remove: selectedRow })
    var row = this.popUpChequeGridOptions.api.getSelectedRows();
    if (row[0]['accountPayablesId'] != null && row[0]['accountPayablesId'] != undefined && row[0]['accountPayablesId'] != "") {
      const id = this.popUpChequeGridOptions.rowData[selectedRow.rowIndex]

      var gridRowData = this.popUpChequeGridOptions.rowData;
      var temp = [];
      gridRowData.forEach(value => {
        if (value['accountPayablesId'] != row[0]['accountPayablesId']) {
          temp.push(value);
        }
      })
      //this.popUpChequeGridOptions.rowData.splice(selectedRow.rowIndex - 1, 1)
      this.popUpChequeGridOptions.rowData = []
      this.chequeRowData = temp;

      this.popUpChequeGridOptions.api.setRowData(temp)
      this.paymentsService.deleteChequeItem(row[0]['accountPayablesId']).subscribe(res => {
        this.dataDeleted = true;
        this.popUpChequeGridOptions.api.refreshCells();
        this.gridArray = [];
        var invoiceTotalAmount = 0;
        var invoiceTotalAdvance = 0;
        var invoiceTotalCredit = 0;
        var invoiceTotalDebit = 0;
        this.totalAmountToBePaid = 0;
        $('#approvedModal').modal('show');
        this.popUpChequeGridOptions.rowData.forEach(data => {
          if (data['accountPayablesId'] != null && data['accountPayablesId'] != undefined && data['accountPayablesId'] != "") {
            this.paymentGrid = false;

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

            // if (gridItem['selectedStatus'] == "Not Approved") {
            //   this.selectedStatus = gridItem['selectedStatus'] == "Not Approved" ? { name: 'Not Approved' } : { name: 'Approved' };
            //   //  this.paymentsInformationForm.get('selectedStatus').setValue(this.selectedStatus)
            // }

            // this.gridArray.push(gridItem);
          }
        });

        // if (this.oldChequeAccPayData != null && this.oldChequeAccPayData != undefined) {

        //   var totalAmtPaid = 0;
        //   for (var i = 0; i < this.oldChequeAccPayData.length; i++) {
        //     totalAmtPaid += parseFloat(this.oldChequeAccPayData[i]['totalAmountToBePaid']);
        //   }

        //   this.oldAccPayTotalAmt = totalAmtPaid;
        //   this.totalAmountToBePaid = parseFloat(this.totalAmountToBePaid + totalAmtPaid).toFixed(2);
        // }
        //this.popUpChequeGridOptions.api.updateRowData({ add: [{}] })
        this.chequeAmt = this.totalAmountToBePaid;
        this.popUpChequeGridOptions.api.updateRowData({ add: [{}], addIndex: 0 })
        this.reset();
        this.refreshChequeData()
      }, error => {
     
      })
    }

  }

  refreshChequeData() {
    this.editBtn = false;
    this.deleteBtn = false;
    if (this.dataDeleted) {
      this.getAllEmpAccessDataHavingCheques();
      this.dataDeleted = false;
    }

  }
  deleteChequePopup() {
    this.confirmDeleteCheck = true;
  }
  cancelDeleteChequePopup() {
    this.confirmDeleteCheck = false;
  }

  deleteChequeById() {
    let cheque = this.pendingChequeGridOptions.api.getSelectedRows();
    this.spinnerService.show();
    this.paymentsService.deleteChequeById(cheque[0]['chequeId']).subscribe(data => {
      this.toasterService.success("Cheque deleted", "Success", { timeOut: 5000 });
      this.getAllEmpAccessDataHavingCheques();
      this.confirmDeleteCheck = false;
      this.spinnerService.show();
    }, error => {
      this.toasterService.error("Please contact administrator", "Error Occurred", { timeOut: 5000 });
      this.spinnerService.show();
    });
  }
}
