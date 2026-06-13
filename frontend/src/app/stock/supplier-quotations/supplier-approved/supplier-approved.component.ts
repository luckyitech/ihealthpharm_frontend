import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { SupplierQuotationsService } from '../../supplier-quotations/supplier-quotations.service';
import { GridOptions } from 'ag-grid-community';
import * as $ from 'jquery';

@Component({
  selector: 'app-supplier-approved',
  templateUrl: './supplier-approved.component.html',
  styleUrls: ['./supplier-approved.component.scss'],
  providers: [SupplierQuotationsService]
})
export class SupplierApprovedComponent implements OnInit {

  approvedGridOptions: GridOptions;
  supplierQtnApprovedGridOptions: GridOptions;

  constructor(private supplierService: SupplierQuotationsService, private toasterService: ToastrService) {
    this.approvedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.approvedGridOptions.rowSelection = 'single';
    this.approvedGridOptions.columnDefs = this.columnDefs;
    this.approvedGridOptions.rowData = [];

    this.supplierQtnApprovedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.supplierQtnApprovedGridOptions.rowSelection = 'single';
    this.supplierQtnApprovedGridOptions.columnDefs = this.approvedQtnDefs;
    this.supplierQtnApprovedGridOptions.rowData = [];

    this.getEmailApprovedData();
  }

  ngOnInit() {
  }

  private gridApi;
  private gridColumnApi;
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
      filter: true
    },
    {
      headerName: 'Approved By',
      field: 'supplierMailApproverName',
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

  approvedQtnDefs = [
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

  onCellClicked(params) {
   
    if (params.column.colId !== 'check') {
    
      this.change(params.data);
      setTimeout(() => {
        $('#supplierQtnApprovedModal').modal('show');
      }, 200);
    }
  }

  supplierQtnApprovedRowData: any;

  change(params) {
    const data = params;
  
    $('#requestQtNumber').val(data['quotationNo']);
    $('#requestQtRequested').val(data['requestedName']);
    $('#requestQtCreated').val(data['createdName']);
    $('#requestQtDated').val(data['quotationDt']);
    $('#requestQtExpiry').val(data['quotationExpiryDt']);
    $('#requestQtDesc').val(data['description']);
    $('#remarks').val(data['remarks']);
    this.supplierQtnApprovedRowData = data['quotationItems'];
  }


  getSupplierPending() {

    this.loadRowData([], this.approvedGridOptions);

    this.supplierService.getapprovedquotationitems().subscribe(
      res => {
        const data = res;
        if ((data['result']).length > 0) {
          for (var i = 0; i < (data['result']).length; i++) {
            data['result'][i]['quotationName'] = data['result'][i]['quotation']['quotationName'];
            data['result'][i]['itemCode'] = data['result'][i]['quotation']['quotationItems'][0]['item']['itemCode'];
            data['result'][i]['itemName'] = data['result'][i]['quotation']['quotationItems'][0]['item']['itemName'];
            data['result'][i]['supplierName'] = data['result'][i]['quotation']['quotationItems'][0]['supplier']['name'];
            data['result'][i]['quantity'] = data['result'][i]['quotation']['quotationItems'][0]['quantity'];
            data['result'][i]['approvedBy'] = data['result'][i]['quotation']['approvedBy'];
            data['result'][i]['approvedDt'] = data['result'][i]['quotation']['approvedDt'];
          }
          this.loadRowData(data['result'], this.approvedGridOptions);
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


  rowData: any
  getEmailApprovedData() {
    this.supplierService.getAllMailApprovedQuotations().subscribe(getAllMailsRes => {
      if (getAllMailsRes instanceof Object) {
        if (getAllMailsRes['responseStatus']['code'] === 200) {

          if ((getAllMailsRes['result']).length > 0) {
            this.rowData = getAllMailsRes['result'];
          } else {
            this.toasterService.warning('No Data Found', '', {
              timeOut: 5000
            });
          }
        }
      }
    });
  }

  onQuickFilterChanged(event) {
  
    this.supplierService.getQtnsBasedonQtnNoForApproved(event['target']['value']).subscribe(qtnRes => {

      if (qtnRes instanceof Object) {
        if (qtnRes['responseStatus']['code'] === 200) {
          const data = qtnRes;
          if ((data['result']).length > 0) {
            this.rowData = data['result'];
          } else {
            this.toasterService.warning('No Data Found', 'Search Criteria', {
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
      
     // console.log(this.selectedQuotationRow)

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
      this.toasterService.warning("Please select quotation to print", "", {
        timeOut: 3000
      })
    }
  }

}
