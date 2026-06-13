import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { AddPurchaseorderService } from "./../../add-purchaseorder.service";
import * as $ from 'jquery';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-outstanding-approved',
  templateUrl: './outstanding-approved.component.html',
  styleUrls: ['./outstanding-approved.component.scss'],
  providers: [AddPurchaseorderService]
})
export class OutstandingApprovedComponent implements OnInit {

  constructor(private service: AddPurchaseorderService, private datePipe: DatePipe,
    private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.approvedPurchaseGridOptions = <GridOptions>{
      context: {
        componentParent: this
      },
      onGridReady: this.onGridReady.bind(this)
    };
    this.approvedPurchaseGridOptions.rowSelection = 'single';
    this.approvedPurchaseGridOptions.columnDefs = this.columnDefs;
    this.approvedPurchaseGridOptions.rowData = [];

    this.emailGridOptions = <GridOptions>{
      context: {
        componentParent: this
      },
      onGridReady: this.onGridReady2.bind(this)
    };
    this.emailGridOptions.rowSelection = 'single';
    this.emailGridOptions.columnDefs = this.emailColumns;
    this.emailGridOptions.rowData = [];

    // this.getApprovedData(this.pharmacyId);
    this.getLimitedApprovedData(this.pharmacyId, 0, 10);



    this.approvedPurchaseGridOptions.getRowStyle = function (params) {
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
        if (params.data.itemsModel) {
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


  ngOnInit() {
    this.pendingPurchaseOrderForm = new FormGroup(this.pendingPurchaseOrderFormValidations);
  }

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
      headerName: 'Approved By',
      field: 'approvedName',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Approved Date',
      field: 'approvedDate',
      sortable: true,
      resizable: true,
      filter: true,
      //valueGetter :this.dateFormatter.bind(this)
    }
  ];

  paginationsize = 10;
  emailColumns = [
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
      headerName: 'Qtn No',
      field: 'quotationModel.quotationNo',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Qtn Name',
      field: 'quotationModel.description',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Supplier Details',
      field: 'supplierName',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Supplier Email ID',
      field: 'supplierEmail',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Sup Contact Email 1',
      field: 'supplierContactEmail1',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Sup Contact Email 2',
      field: 'supplierContactEmail2',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Sup Contact Email 3',
      field: 'supplierContactEmail3',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Sup Contact Email 4',
      field: 'supplierContactEmail4',
      sortable: true,
      resizable: true,
      filter: true
    }
  ];

  approvedPurchaseGridOptions: GridOptions;
  emailGridOptions: GridOptions;
  blob: Blob;


  pharmacyId: number = 1;

  mainData;

  gridApi;
  gridColumnApi;

  gridApi2;
  gridColumnApi2;

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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // params.api.updateRowData({add: this.mainData});
  }

  onGridReady2(params) {
    this.gridApi2 = params.api;
    this.gridColumnApi2 = params.columnApi;

    // params.api.updateRowData({add: this.mainData});
  }

  //this method is not required not used anywhere
  getApprovedData(pharmacyId: number) {


    this.loadRowData([], this.approvedPurchaseGridOptions);
    // this.showApprovedGrid = true;

    // this.showApprovedGrid = false;
    this.service.getapprovedpurchaseordersbypharmacy(pharmacyId).subscribe(
      res => {
        const data = res;

        for (var i = 0; i < res['result'].length; i++) {

          // data['result'][i]['itemCode'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][i]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][i]['itemsModel']['itemCode'] : null : null;
          //  data['result'][i]['itemName'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][i]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][i]['itemsModel']['itemName'] : null : null;
          // data['result'][i]['totalQuantity'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0] != null && res['result'][i]['purchaseorderitems'][0] != undefined ? res['result'][i]['purchaseorderitems'][0]['quantity'] : null : null;
          // data['result'][i]['totalValue'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0] !=null && res['result'][i]['purchaseorderitems'][0] !=undefined ? res['result'][i]['purchaseorderitems'][0]['totalValue'] :null: null;
          //data['result'][i]['approvedDate'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0] != null && res['result'][i]['purchaseorderitems'][0] != undefined ? res['result'][i]['purchaseorderitems'][0]['approvedDate'] : null : null;
          //data['result'][i]['manuName'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][i]['itemsModel'] != null ? res['result'][i]['purchaseorderitems'][i]['itemsModel']['manufacturer']['name'] : null : null;
          //  data['result'][i]['unitRate'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][0]['unitRate'] : null;
          //data['result'][i]['packRate'] = res['result'][i]['purchaseorderitems'] != null ? res['result'][i]['purchaseorderitems'][i]['packRate'] : null;
        }

        this.loadRowData(data['result'], this.approvedPurchaseGridOptions);
      }
    );
  }

  getLimitedApprovedData(pharmacyId: number, start, end) {
    this.loadRowData([], this.approvedPurchaseGridOptions);

    this.service.getapprovedpurchaseordersbypharmacyWithLimit(pharmacyId, start, end).subscribe(
      res => {
        const data = res;

        this.loadRowData(data['result'], this.approvedPurchaseGridOptions);
      }
    );
  }



  keys: string[];
  dataSheet = new Subject();
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  isExcelFile: boolean;
  excelFile: any
  onChange(evt) {

    let data, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {

      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws);
      };

      reader.readAsBinaryString(target.files[0]);
      this.excelFile = evt.target.files[0]
     // console.log(this.excelFile)
      reader.onloadend = (e) => {

        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data)
      }
    } else {
      this.inputFile.nativeElement.value = '';
    }
  }

  emailGridRowData: any
  send() {
    let data = this.approvedPurchaseGridOptions.api.getSelectedRows()[0];

    
    let addData = {};

    addData = data;
    addData['supplierName'] = data['supplierModel']['name'];
    addData['supplierEmail'] = data['supplierModel']['emailId'];
    addData['supplierContactEmail1'] = data['supplierModel']['contactPersonEmailID'];
    addData['supplierContactEmail2'] = data['supplierModel']['contactPersonEmailIdTwo'];
    addData['supplierContactEmail3'] = data['supplierModel']['contactPersonEmailIdThree'];
    addData['supplierContactEmail4'] = data['supplierModel']['contactPersonEmailIdFour'];
    var emailGridData = [];

    emailGridData.push(addData)

    this.emailGridRowData = emailGridData
    this.gridApi2.updateRowData({ add: [addData], addIndex: 0 });
  }


  selectedPO
  sendPoByMail() {

    this.selectedPO = this.gridApi.getSelectedRows()[0]

    if (!this.selectedPO) {
      this.toasterService.warning("Please select purchase order", "", {
        timeOut: 3000
      })
      return;
    }
    if (!this.excelFile) {
      this.toasterService.warning("Please select excel attachment", "", {
        timeOut: 3000
      })
      return;
    }

    if (!this.excelFile['name'].includes(this.approvedPurchaseGridOptions.api.getSelectedRows()[0]['purchaseOrderNo'])) {
      this.toasterService.warning("Selected excel is different from selected excel", "", {
        timeOut: 3000
      })
      return;
    }

    this.spinnerService.show()

    const formData = new FormData();
    formData.append('purchaseOrderId', this.selectedPO['purchaseOrderId'])
    formData.append('excelFile', this.excelFile)
    formData.append('supplierModelObj', JSON.stringify(this.selectedPO['supplierModel']))
    this.service.sendExcelFileInMailForPurchaseOrder(formData).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.spinnerService.hide();
          this.toasterService.success("Mail sent successfully", 'Success', {
            timeOut: 3000
          })



        }
      }


    }, error => {
      this.spinnerService.hide();
      this.toasterService.error("Error occured plz contact admin", '', {
        timeOut: 3000
      })
    })


  }

  download() {

    // var gridApi = this.gridApi;
    // this.setPrinterFriendly(gridApi);
    // setTimeout(() => {
    //   print();
    //   this.setNormal(gridApi);
    // }, 1000);
    let uri = { "ReportCode": 'PURCHASE_ORDER_DETAILS' };

    var encoded = encodeURI(JSON.stringify(uri));

    let reportURI = encoded;
    this.service.downloadPdfFile(reportURI).subscribe((data: any) => {
      this.blob = new Blob([data], { type: 'application/pdf' });
      var downloadURL = window.URL.createObjectURL(data);
      //var link = document.createElement('a');
      //link.href = downloadURL;
      // link.download = 'SALES REPORT BY BILLID' + '.pdf';
      // link.click();

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = downloadURL;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    })
  }

  setPrinterFriendly(api) {
    var eGridDiv = document.querySelector("#approvePurchase");
    eGridDiv['style']['width'] = "";
    eGridDiv['style']['height'] = "";
    api.setDomLayout("print");
  }

  setNormal(api) {
    var eGridDiv = document.querySelector("#approvePurchase");
    eGridDiv['style']['width'] = "100%";
    eGridDiv['style']['height'] = "200px";
    api.setDomLayout(null);
  }

  onCellClicked(params) {

    this.setData(params.data)
  }

  loadRowData(inputRowData: Object[], gridoptions: GridOptions) {
    try {
      gridoptions.rowData = inputRowData;
      gridoptions.api.setRowData(gridoptions.rowData);
    } catch (e) {
      gridoptions.rowData = inputRowData;
    }
  }

  onQuickFilterChanged($event) {

    this.onQuickFilterChanged["searchEvent"] = $event;
    this.approvedPurchaseGridOptions.api.setQuickFilter($event.target.value);
    if (this.approvedPurchaseGridOptions.api.getDisplayedRowCount() === 0) {
      this.approvedPurchaseGridOptions.api.showNoRowsOverlay();
    } else {
      this.approvedPurchaseGridOptions.api.hideOverlay();
    }
  }

  selectedGridRow;

  onSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows[0] !== undefined) {
      this.selectedGridRow = selectedRows[0];
      this.setData(selectedRows[0]);
      $('#pendingModal').modal('show');

    }
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
    purchaseOrderDate: new FormControl(),
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

  poDate
  setData(data) {
    this.pendingOrderDetails = data;

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
      taxAmt: data.taxAmt

    });

    if (data['deliveryTypesModel'] != null) {
      this.selectedDeliveryId = data['deliveryTypesModel']['deliveryTypeId']
    }

    this.quotationGridOptions.api.setRowData(
      data.purchaseorderitems);
  }


  selectedPurchaseRow
  onPrint() {

    this.selectedPurchaseRow = this.gridApi.getSelectedRows()[0]
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


  onPrintExcel() {
    // console.log(this.gridApi.getSelectedRows())
    this.selectedPurchaseRow = this.gridApi.getSelectedRows()[0]
    if (this.selectedPurchaseRow) {


      let uri = { "ReportCode": 'PRINT_PURCHASE_ORDER_RECEIPT', "PURCHASE_ORDER_NO": this.selectedPurchaseRow.purchaseOrderNo };
      var encoded = encodeURI(JSON.stringify(uri));

      let reportURI = encoded;
      this.service.downloadExcelFile(reportURI).subscribe((data: any) => {

        this.blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;

        link.download = this.selectedPurchaseRow.purchaseOrderNo + '.xlsx';

        link.click();


      })



    } else {
      this.toasterService.warning("Please select purchase order to generate excel", "", {
        timeOut: 3000
      })
    }
  }
}
