import { GridOptions, IGetRowsParams } from 'ag-grid-community';
import { AppService } from 'src/app/core/app.service';
import { AddpurchaseorderinvoiceService } from './../../addpurchaseorderinvoice.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-outstanding-rejected-invoice',
  templateUrl: './outstanding-rejected-invoice.component.html',
  styleUrls: ['./outstanding-rejected-invoice.component.scss']
})
export class OutstandingRejectedInvoiceComponent implements OnInit {

  constructor(private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService,
    private addpurchaseorderinvoiceService: AddpurchaseorderinvoiceService, private appService: AppService, ) {

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

    //this.getApprovedData(localStorage.getItem('pharmacyId'));

    this.gridCacheOverFlowSize = 2;
    this.paginationSize = 10;
    this.invoiceMaxConcurrentDatasourceRequests = 2;
    this.approvedGridOptions.cacheBlockSize = 10;
    this.approvedGridOptions.rowModelType = 'infinite';
    this.getApprovedDataCount();


    this.approvedGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }




  }

  reason = "";

  gridApi;
  gridColumnApi;
  approvedGridOptions: GridOptions;
  gridCacheOverFlowSize = 2;
  paginationSize = 10;
  invoiceMaxConcurrentDatasourceRequests = 2;
  permissions: any;

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
      resizable: true,
      width: 40,
    },
    /* {
      headerName: 'PO No',
      field: 'poNo',
      sortable: true,
      filter: true,
      valueGetter: function (params) {

        params.data.poNo = params.data.invoiceItems != null && params.data.invoiceItems != undefined ?
          params.data.invoiceItems.length > 0 ?
            params.data.invoiceItems[0].purchaseOrderModel != null && params.data.invoiceItems[0].purchaseOrderModel != undefined ?
              params.data.invoiceItems[0].purchaseOrderModel.purchaseOrderNo : null : null : null;
        return params.data.poNo;
      }

    }, */
    {
      headerName: 'Invoice No',
      field: 'invoiceNo',
      sortable: true,
      resizable: true,
      filter: true,
      //valueGetter: this.dateFormatter.bind(this)
    },

    {
      headerName: 'invoiceDt',
      field: 'invoiceDt',
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
      headerName: 'GRN No',
      field: 'grnNo',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Invoice Amount',
      field: 'invoiceAmount',
      sortable: true,
      resizable: true,
      filter: true,
    },
    {
      headerName: 'Rejected Reason',
      field: 'rejectedReason',
      sortable: true,
      resizable: true,
      filter: true,
    },

  ];


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  ngOnInit() {
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
  getApprovedData(pharmacyId) {
    /* this.addpurchaseorderinvoiceService.getPurchaseInvoiceByPharmacyAndInvoiceStatus(pharmacyId, 3).subscribe(purchaseInvoiceRes => {
      if (purchaseInvoiceRes['responseStatus']['code'] === 200) {
        if (purchaseInvoiceRes['result'].length > 0) {
          this.approvedGridOptions.api.setRowData([]);
          this.approvedGridOptions.api.updateRowData({ add: purchaseInvoiceRes['result'] });
        }
        else {
          this.approvedGridOptions.api.setRowData([]);
        }

      }
    }) */
  }

  onCellClicked(params) {

    if (params.colDef.field !== '') {
      this.change(params.data);

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

  submit(statusId) {
    this.spinnerService.show();
    let payload = this.approvedGridOptions.api.getSelectedRows()[0];
    payload['invoiceStatus'] = { invoiceStatusId: statusId };
    this.addpurchaseorderinvoiceService.updatePurchaseInvoice(payload).subscribe(purchaseInvoiceUpdateRes => {
      if (purchaseInvoiceUpdateRes['responseStatus']['code'] === 200) {
        this.getApprovedDataCount();
        this.spinnerService.hide();
        this.toasterService.success(purchaseInvoiceUpdateRes['message'], 'Success', {
          timeOut: 3000
        });
      }
      else {
        this.spinnerService.hide();
      }
    },
      error => {
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
        this.spinnerService.hide();
      })
  }

  invoiceGridRowCount = 0;
  invoiceGridPageNumber = 0;
  invoiceNo = '';
  invoiceGridDataSource = {
    getRows: (params: IGetRowsParams) => {

      this.spinnerService.show();
      this.addpurchaseorderinvoiceService.getPurchaseInvoiceByPharmacyAndInvoiceStatus(localStorage.getItem('pharmacyId'), 3, this.invoiceGridPageNumber, 10, this.invoiceNo).subscribe(data => {
        params.successCallback(data['result'], this.invoiceGridRowCount)
        this.spinnerService.hide();
        if (data['responseStatus']['code'] === 200) {
          if (data['result']['length'] > 0) {

            this.invoiceGridPageNumber++;
          }
          else {
            this.approvedGridOptions.api.setRowData([]);
            this.toasterService.warning('No Data Found', 'No Data To Show', {
              timeOut: 3000
            });
          }
        }
      }, error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      });
    }

  }


  getApprovedDataCount() {
    this.invoiceGridPageNumber = 0;
    this.addpurchaseorderinvoiceService.getPurchaseInvoiceByPharmacyAndInvoiceStatusCount(localStorage.getItem('pharmacyId'), 3, this.invoiceNo).subscribe(res => {
      if (res['responseStatus']['code'] == 200) {
        this.invoiceGridRowCount = res['result'];
        this.approvedGridOptions.api.setDatasource(this.invoiceGridDataSource);
      }
    })
  }
}
