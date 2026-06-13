import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { AddPurchaseorderService } from "./../../add-purchaseorder.service";
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-outstanding-purchase-order-sent',
  templateUrl: './outstanding-purchase-order-sent.component.html',
  styleUrls: ['./outstanding-purchase-order-sent.component.scss'],
  providers: [AddPurchaseorderService]
})
export class OutstandingPurchaseOrderSentComponent implements OnInit {


  constructor(private service: AddPurchaseorderService, private datePipe: DatePipe,
    private toasterService:ToastrService) {
    this.approvedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.approvedGridOptions.rowSelection = 'single';
    this.approvedGridOptions.columnDefs = this.columnDefs;
    this.approvedGridOptions.rowData = [];
    this.getLimitedSentPOData(this.pharmacyId, 0, 50);
    //this.getApprovedData(this.pharmacyId);

    this.approvedGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }


    this.quotationGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.quotationGridOptions.rowSelection = 'single';
    this.quotationGridOptions.columnDefs = this.quotationcolumnDefs;
    this.quotationGridOptions.rowData = [];

    this.pendingPurchaseOrderForm = new FormGroup(this.pendingPurchaseOrderFormValidations);


  }

  tooltipRenderer = function (params) {

    if (params.value != null && params.value != undefined) {
      return '<span title="' + params.value + '">' + params.value + '</span>';
    }
    else {
      return '<span title="' + params.value + '">' + '' + '</span>';
    }


  }

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


    },
    {
      headerName: 'Unit P.Price',
      field: 'unitRate',
      sortable: true,
      resizable: true,
      filter: true,
      editable: false,
      width: 120,

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

    }
  ];

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
      filter: true
    },

    {
      headerName: 'PO Date',
      field: 'purchaseOrderDate',
      sortable: true,
      resizable: true,
      filter: true,
      valueGetter: this.dateFormatter.bind(this)
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
      resizable: true,
      filter: true,
      hide: true
    },
    {
      headerName: 'PO Disc',
      field: 'discountPercentage',
      sortable: true,
      resizable: true,
      filter: true,
      hide: true
    },
    {
      headerName: 'Sent By',
      field: 'sentBy',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Sent Date',
      field: 'sentDate',
      sortable: true,
      resizable: true,
      filter: true,
      valueGetter: this.dateFormatter.bind(this)
    },
    {
      headerName: 'Sent Mode',
      field: 'sentMode',
      sortable: true,
      resizable: true,
      filter: true
    }
  ];

  paginationSize = 10;

  approvedGridOptions: GridOptions;



  pharmacyId: number = 1;

  getApprovedData(pharmacyId: number) {
    this.showApprovedGrid = false;
    this.service.getsentpurchaseordersbypharmacy(pharmacyId).subscribe(
      res => {
        const data = res;

        for (var i = 0; i < res['result'].length; i++) {
          // data['result'][i]['itemCode'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['itemCode'] : null : null;
          // data['result'][i]['itemName'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['itemName'] : null : null;
          // data['result'][i]['quantity'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['quantity'] : null;
          //  data['result'][i]['manuName'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][0]['itemsModel']['manufacturer']['name'] : null : null;
          //   data['result'][i] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['packRate'] : null;
          //  data['result'][i]['unitRate'] = res['result'][i]['quotationModel'] != null ? res['result'][i]['quotationModel']['quotationItems'] != null ? res['result'][i]['quotationModel']['quotationItems'][0]['unitPurchasePrice'] : null : null;
        }

        this.loadRowData(data['result'], this.approvedGridOptions);
      }
    );
    this.showApprovedGrid = true;
  }

  getLimitedSentPOData(pharmacyId: number, start, end) {
    this.showApprovedGrid = false;
    this.service.getsentpurchaseordersbypharmacyWithLimit(pharmacyId, start, end).subscribe(
      res => {
        const data = res;
        this.loadRowData(data['result'], this.approvedGridOptions);
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



  showApprovedGrid: boolean = true;

  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.approvedGridOptions.api.setQuickFilter($event.target.value);
    if (this.approvedGridOptions.api.getDisplayedRowCount() == 0) {
      this.approvedGridOptions.api.showNoRowsOverlay();
    } else {
      this.approvedGridOptions.api.hideOverlay();
    }
  }

  gridApi
  gridColumnApi
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // params.api.updateRowData({add: this.mainData});
  }

  ngOnInit() {
  }

  pendingOrderDetails: any;
  selectedDeliveryId
  quotationGridOptions: GridOptions;

  pendingPurchaseOrderForm: FormGroup;
  pendingPurchaseOrderFormValidations = {
    purchaseOrderId: new FormControl(''),
    purchaseOrderNo: new FormControl(''),
    medicalOrNonMedical: new FormControl(''),
    emergency: new FormControl(''),
    cash: new FormControl(''),
    purchaseOrderDate: new FormControl(''),
    deliveryTime: new FormControl(''),
    quotationDate: new FormControl(''),
    quotationNo: new FormControl(''),
    paymentType: new FormControl(''),
    shippingAddress: new FormControl(''),
    paymentTime: new FormControl(''),
    advance: new FormControl(''),
    balance: new FormControl(''),
    otherCharges: new FormControl(''),
    discountPercentage: new FormControl(''),
    discount: new FormControl(''),
    poValue: new FormControl(''),
    poTerm: new FormControl(''),
    remarks: new FormControl(''),
    totalAmount: new FormControl(''),
    totalValue: new FormControl(''),
    taxAmt: new FormControl(),
    poDesc: new FormControl(),
    totalItems: new FormControl(),
    totalQuantity: new FormControl()
  };
  setData(data) {
    this.pendingOrderDetails = data;
   // console.log(data)
    $('#pendingModal').modal('show');
    this.pendingPurchaseOrderForm.patchValue({
      purchaseOrderNo: data.purchaseOrderNo,
      purchaseOrderDate: data.purchaseOrderDate,
      deliveryTime: data.deliveryTime,
      quotationDate: data.quotationModel != null ? data.quotationModel.quotationDt : null,
      quotationNo: data.quotationModel != null ? data.quotationModel.quotationNo : null,
      poDesc: data.poDesc,
      discount: data.discount,
      shippingAddress: data.shippingAddress,
      cash: data.paymentType != null ? data.paymentType : null,
      paymentTime: data.creditDays,
      poTerm: data.poTerm,
      remarks: data.remarks,
      advance: data.advance,
      otherCharges: data.otherCharges,
      balance: data.balance,
      totalItems: data.purchaseorderitems.length,
      totalQuantity: data.totalQuantity,
      totalAmount: data.totalAmount,
      totalValue: data.totalValue,
      taxAmt:data.taxAmt


    });
    if (data['deliveryTypesModel'] != null) {
      this.selectedDeliveryId = data['deliveryTypesModel']['deliveryTypeId']
    }

    this.quotationGridOptions.api.setRowData(
      data.purchaseorderitems);
  }

  onCellClicked(params) {

    this.setData(params.data)
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
