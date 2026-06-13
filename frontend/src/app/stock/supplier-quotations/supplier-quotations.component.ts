import {
  Component,
  OnInit
} from '@angular/core';
import { SupplierQuotationsService } from './supplier-quotations.service';
import { GridOptions, ColDef } from 'ag-grid-community';
import * as $ from 'jquery';

@Component({
  selector: 'app-supplier-quotations',
  templateUrl: './supplier-quotations.component.html',
  styleUrls: ['./supplier-quotations.component.scss'],
  providers: [SupplierQuotationsService]
})
export class SupplierQuotationsComponent implements OnInit {

  pharmacyId: number = 1;

  tab = "pending";
  constructor(private supplierQuotationsService: SupplierQuotationsService) {
    this.pendingVendorApprovalGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.pendingVendorApprovalGridOptions.rowSelection = 'single';
    this.pendingVendorApprovalGridOptions.columnDefs = this.columnDefs;
    this.pendingVendorApprovalGridOptions.rowData = [];

    this.approvedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.approvedGridOptions.rowSelection = 'single';
    this.approvedGridOptions.columnDefs = this.columnDefs;
    this.approvedGridOptions.rowData = [];

    this.rejectedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.rejectedGridOptions.rowSelection = 'single';
    this.rejectedGridOptions.columnDefs = this.columnDefs;
    this.rejectedGridOptions.rowData = [];

    this.getApprovedData(this.pharmacyId);
    this.getPendingData(this.pharmacyId);
    this.getRejectedData(this.pharmacyId);
  }

  columnDefs = [{
    headerName: 'Quotation No',
    field: 'quotationNo',
    sortable: true,
    filter: true,
    checkboxSelection: true
  },
  {
      headerName: 'Supplier',
      field: 'supplier',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      valueGetter: function (params) {
        var supplier = params.data.quotationItems[0].supplier.name;
        return supplier;
      }
    },
  {
    headerName: 'Description',
    field: 'description',
    sortable: true,
    filter: true
  }, ,
  {
    headerName: 'Quotation Expriry Date',
    field: 'quotationExpiryDt',
    sortable: true,
    filter: true
  },
  {
    headerName: 'Quotation Approved Date',
    field: 'approvedDt',
    sortable: true,
    filter: true
  },
  {
    headerName: 'Quotation Rejected Date',
    field: 'rejectedDate',
    sortable: true,
    filter: true
  },
  ];
  showpendingVendorApproval: boolean = true;
  pendingVendorApprovalGridOptions: GridOptions;

  showApprovedGrid: boolean = true;
  approvedGridOptions: GridOptions;

  showRejectedGrid: boolean = true;
  rejectedGridOptions: GridOptions;

  getApprovedData(pharmacyId: number) {
    this.showApprovedGrid = false;
    this.supplierQuotationsService.getreceivedapprovedquotationbypharmacy(pharmacyId).subscribe(
      approvedResponse => {
        if (approvedResponse instanceof Object) {
          if (approvedResponse['responseStatus']['code'] === 200) {
            this.approvedGridOptions.rowData = approvedResponse['result'];
            this.showApprovedGrid = true;
          }
        }
      }
    );
  }

  getPendingData(pharmacyId: number) {
    this.showpendingVendorApproval = false;
    this.supplierQuotationsService.getreceivedpendingquotationbypharmacy(pharmacyId).subscribe(
      approvedResponse => {
        if (approvedResponse instanceof Object) {
          if (approvedResponse['responseStatus']['code'] === 200) {
            this.pendingVendorApprovalGridOptions.rowData = approvedResponse['result'];
            this.showpendingVendorApproval = true;
          }
        }
      }
    );
  }

  getRejectedData(pharmacyId: number) {
    this.showRejectedGrid = false;
    this.supplierQuotationsService.getreceivedrejectedquotationbypharmacy(pharmacyId).subscribe(
      approvedResponse => {
        if (approvedResponse instanceof Object) {
          if (approvedResponse['responseStatus']['code'] === 200) {
            this.rejectedGridOptions.rowData = approvedResponse['result'];
            this.showRejectedGrid = true;
          }
        }
      }
    );
  }

  onQuickFilterChanged($event, gridOptions: GridOptions) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    gridOptions.api.setQuickFilter($event.target.value);
    if (gridOptions.api.getDisplayedRowCount() == 0) {
      gridOptions.api.showNoRowsOverlay();
    } else {
      gridOptions.api.hideOverlay();
    }
  }

  ngOnInit() {
    $(document).ready(function () {

      $('.submit-for-approval, .submit-later, .return-btn').click(function (e) {
        e.preventDefault();
        $('.grid-area').show();
        $('.quotation-details').hide();
        $('.view-details').hide();
      });
      $('.edit-btn').click(function (e) {
        e.preventDefault();
        $('.quotation-details').show();
        $('.grid-area').hide();
        $('.view-details').hide();
      });
      $('.view-btn').click(function (e) {
        e.preventDefault();
        $('.quotation-details').hide();
        $('.grid-area').hide();
        $('.view-details').show();
      });

    });
  }

}
