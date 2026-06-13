import { ToastrService } from 'ngx-toastr';
import {
  Component,
  OnInit
} from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { SupplierQuotationsService } from '../../supplier-quotations/supplier-quotations.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-rejected',
  templateUrl: './rejected.component.html',
  styleUrls: ['./rejected.component.scss'],
  providers: [SupplierQuotationsService]
})
export class RejectedComponent implements OnInit {

  rejectedGridOptions: GridOptions;
  constructor(private supplierService: SupplierQuotationsService, private toastrService: ToastrService) {
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
    this.rejectedGridOptions.columnDefs = this.quotationcolumnDefs;
    this.rejectedGridOptions.rowData = [];
   
    this.getApprovedData(this.pharmacyId);
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }
  onCellClicked(params) {
   
    if (params.column.colId !== 'check') {
      this.change(params.data);
      setTimeout(() => {
        $('#rejectedModal').modal('show');
      }, 200);
    }
  }
  gridApi;
  rejectedQtnRowData: any;

  change(params) {
    const data = params;
    
    $('#requestQtNumber').val(data['quotationNo']);
    $('#requestQtRequested').val(data['requestedName']);
    $('#requestQtCreated').val(data['createdName']);
    $('#requestQtDated').val(data['quotationDt']);
    $('#requestQtExpiry').val(data['quotationExpiryDt']);
    $('#requestQtDesc').val(data['description']);
    $('#remarks').val(data['remarks']);
    this.rejectedQtnRowData = data['quotationItems']

    /*  this.gridApi.forEachNodeAfterFilter(function (node) {
       node.setSelected(false);
     }); */
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
      filter: true,
      valueGetter: function (params) {
        var requestedName = params.data.requestedName;
     
        return requestedName;
      }
    },
    {
      headerName: 'Created By',
      field: 'createdName',
      sortable: true,
      resizable: true,
      filter: true,
      valueGetter: function (params) {
        var createdName = params.data.createdName;
        return createdName;
      }
    },
    {
      headerName: 'Created Date',
      field: 'quotationDt',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Rejected By',
      field: 'rejectedName',
      sortable: true,
      resizable: true,
      filter: true,
      valueGetter: function (params) {
        var rejectedName = params.data.rejectedName;
        return rejectedName;
      }
    },
    {
      headerName: 'Rejected Date',
      field: 'rejectedDate',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Reason',
      field: 'rejectedReason',
      sortable: true,
      resizable: true,
      filter: true
    }
  ];

  quotationcolumnDefs = [
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


  approvedGridOptions: GridOptions;
  rowData: any;


  pharmacyId: number = 1;

  getApprovedData(pharmacyId: number) {
    this.showApprovedGrid = false;
    this.supplierService.getrequestrejectedquotationbypharmacy(pharmacyId).subscribe(
      res => {
        
        const data = res;

        if ((data['result']).length > 0) {
          for (var i = 0; i < (data['result']).length; i++) {
            data['result'][i]['itemName'] = data['result'][i]['quotationItems'][0]['item']['itemName'];
          }

          setTimeout(() => {
            this.loadRowData(data['result'], this.approvedGridOptions);
            // this.approvedGridOptions.rowData = data['result'];
          }, 100);
          this.showApprovedGrid = true;
        }
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

  showApprovedGrid: boolean = true;



  ngOnInit() { }

  onQtnSearches(event) {
  
    this.supplierService.rejectedQuotationSearches(event['target']['value']).subscribe(qtnRes => {

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
    //console.log(this.gridApi.getSelectedRows())
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
