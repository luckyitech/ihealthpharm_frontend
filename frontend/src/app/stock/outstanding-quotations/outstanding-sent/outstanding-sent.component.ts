import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {
  Component,
  OnInit
} from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { SupplierQuotationsService } from '../../supplier-quotations/supplier-quotations.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-outstanding-sent',
  templateUrl: './outstanding-sent.component.html',
  styleUrls: ['./outstanding-sent.component.scss'],
  providers: [SupplierQuotationsService]
})
export class OutstandingSentComponent implements OnInit {

  gridApi;
  gridColumnApi;

  approvedGridOptions: GridOptions;
  outstandingSentGridOptions: GridOptions;
  constructor(private supplierService: SupplierQuotationsService,
    private spinnerService: Ng4LoadingSpinnerService, private toastrService: ToastrService) {
    this.approvedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.approvedGridOptions.rowSelection = 'single';
    this.approvedGridOptions.columnDefs = this.columnDefs;
    this.approvedGridOptions.rowData = [];

    this.outstandingSentGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.outstandingSentGridOptions.rowSelection = 'single';
    this.outstandingSentGridOptions.columnDefs = this.outstandingSentDefs;
    this.outstandingSentGridOptions.rowData = [];


    this.getApprovedData();
  }

  ngOnInit() { }




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
      headerName: 'Qtn No',
      field: 'quotationNo',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true
    },
    {
      headerName: 'Qtn Name',
      field: 'description',
      sortable: true,
      resizable: true,
      filter: true
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
      headerName: 'Requested By',
      field: 'requestedName',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Approved By',
      field: 'approvedName',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Sent By',
      field: 'sentName',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Sent Date',
      field: 'sentDt',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Sent Mode',
      field: 'quotationSendMode',
      sortable: true,
      resizable: true,
      filter: true
    }
  ];


  outstandingSentDefs = [
    {
      headerName: 'Item Code',
      field: 'item.itemCode',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Item Name',
      field: 'item.itemName',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Formulation',
      field: 'item.itemForm.form',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Bonus',
      field: 'bonus',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Supplier',
      field: 'supplier.name',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Manufacturer',
      field: 'item.manufacturer.name',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Description',
      field: 'item.itemDescription',
      sortable: true,
      resizable: true,
      filter: true
    }
  ];

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
    this.approvedGridOptions.api.setQuickFilter($event.target.value);
    if (this.approvedGridOptions.api.getDisplayedRowCount() == 0) {
      this.approvedGridOptions.api.showNoRowsOverlay();
    } else {
      this.approvedGridOptions.api.hideOverlay();
    }
  }

  rowData: any;

  getApprovedData() {
    this.spinnerService.show();
    this.supplierService.getAllSentMailQuotations().subscribe(getAllMailsRes => {
      if (getAllMailsRes instanceof Object) {
        if (getAllMailsRes['responseStatus']['code'] === 200) {
         
          this.rowData = getAllMailsRes['result'];
          this.spinnerService.hide();
        }
      }
    });

  }

  onCellClicked(params) {
    
    if (params.column.colId !== 'check') {
      
      this.change(params.data);
      setTimeout(() => {
        $('#outstandingSentModal').modal('show');
      }, 200);
    }
  }

  sentRowData: any;

  change(params) {
    const data = params;
   
    $('#requestQtNumber').val(data['quotationNo']);
    $('#requestQtRequested').val(data['requestedName']);
    $('#requestQtCreated').val(data['createdName']);
    $('#requestQtDated').val(data['quotationDt']);
    $('#requestQtExpiry').val(data['quotationExpiryDt']);
    $('#requestQtDesc').val(data['description']);
    $('#remarks').val(data['remarks']);
    this.sentRowData = data['quotationItems'];
  }

  OnOutStandingQtnSearch(event) {
   
    this.supplierService.getQtnsBasedonQtnNoForOustanding(event['target']['value']).subscribe(qtnRes => {

      if (qtnRes instanceof Object) {
        if (qtnRes['responseStatus']['code'] === 200) {
          const data = qtnRes;
          if ((data['result']).length > 0) {
            this.rowData = data['result'];
          } else {
            this.toastrService.warning('No Data Found', 'Search Criteria', {
              timeOut: 5000
            })
          }
        }
      }
    })
  }

  blob:Blob
  selectedQuotationRow
  onPrint() {
    this.selectedQuotationRow=this.gridApi.getSelectedRows()[0]
    if (this.selectedQuotationRow) {
      
      //console.log(this.selectedQuotationRow)

      let uri = { "ReportCode": 'PRINT_QUOTATION_RECEIPT', "QUOTATION_NO": this.selectedQuotationRow.quotationNo };
      var encoded = encodeURI(JSON.stringify(uri));

      let reportURI = encoded;
      this.supplierService.downloadPdfFile(reportURI).subscribe((data: any) => {
        this.blob = new Blob([data], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'REQUEST FOR QUOTATION' + '.pdf';
        link.click();
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = downloadURL;
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
      });
    } else {
      this.toastrService.warning("Please select quotation to print", "", {
        timeOut: 3000
      })
    }
  }

}
