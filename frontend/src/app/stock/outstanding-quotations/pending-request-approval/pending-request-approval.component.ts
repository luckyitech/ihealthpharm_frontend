import { ToastrService } from 'ngx-toastr';
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { SupplierQuotationsService } from '../../supplier-quotations/supplier-quotations.service';
import { GridOptions } from 'ag-grid-community';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { ApprovedComponent } from '../approved/approved.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-pending-request-approval',
  templateUrl: './pending-request-approval.component.html',
  styleUrls: ['./pending-request-approval.component.scss'],
  providers: [SupplierQuotationsService, ApprovedComponent],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingRequestApprovalComponent implements OnInit {

  constructor(private supplierService: SupplierQuotationsService, private router: Router, private cdr: ChangeDetectorRef,
    private app_comp: ApprovedComponent, private toastrService: ToastrService) {
    this.aapprovedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.aapprovedGridOptions.rowSelection = 'single';
    this.aapprovedGridOptions.columnDefs = this.columnDefs;
    this.aapprovedGridOptions.rowData = [];

    this.quotationGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.quotationGridOptions.rowSelection = 'single';
    this.quotationGridOptions.columnDefs = this.quotationcolumnDefs;
    this.quotationGridOptions.rowData = [];

    this.getApprovedData(this.pharmacyId);
  }


  rowData: any;

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
      headerName: 'Expiry Date',
      field: 'quotationExpiryDt',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      filter: true,
      hide: true
    },
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


  aapprovedGridOptions: GridOptions;
  quotationGridOptions: GridOptions;

  ngOnInit() {

  }

  pharmacyId = Number(localStorage.getItem('pharmacyId'));

  reason = "";

  private gridApi;
  private gridColumnApi;

  quotationsRowData: any;

  change(params) {
    const data = params;

    $('#requestQuotNumber').val(data.quotationNo);
    $('#requestQuotRequested').val(data.requestedName);
    $('#requestQuotCreated').val(data.createdName);
    $('#requestQuotDated').val(data.quotationDt);
    $('#requestQuotExpiry').val(data.quotationExpiryDt);
    $('#requestQuotDesc').val(data.description);
    $('#remarks').val(data.remarks);
    this.quotationsRowData = data['quotationItems']
    /*  this.quotationGridOptions.api.setRowData(
       [{
         itemCode: data.quotationItems.item.itemCode,
         itemName: data.quotationItems.item.itemName,
         itemDescription: data.description,
         name: data.quotationItems.supplier.name,
         quantity: data.quotationItems.quantity,
         manuf: data.quotationItems.item.manufacturer.name,
         formulation: data.quotationItems.item.itemForm.form
       }]); */
    // setTimeout(() => {
    //   $('#pendingModal').modal('show');
    // }, 200);
    this.gridApi.forEachNodeAfterFilter(function (node) {
      node.setSelected(false);
    });
  }

  onCellClicked(params) {

    if (params.column.colId !== 'check') {
      this.change(params.data);
      setTimeout(() => {
        $('#pendingModal').modal('show');
      }, 200);
    }
  }

  onSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getApprovedData(pharmacyId: number) {

    this.loadRowData([], this.quotationGridOptions);
    this.showApprovedGrid = false;
    this.loadRowData([], this.aapprovedGridOptions);
    this.showApprovedGrid = true;

    this.showApprovedGrid = false;
    this.supplierService.getrequestpendingquotationbypharmacy(pharmacyId).subscribe(
      res => {
        const data = res;
        
        if ((data['result']).length > 0) {
          this.aapprovedGridOptions.api.updateRowData({ add: data['result'] });
        } else {
          this.toastrService.warning('No Data Found', '', {
            timeOut: 5000
          })
        }
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

  showApprovedGrid: boolean = true;



  dataToSend;

  onQuotationApprove(type) {

    const data = this.aapprovedGridOptions.api.getSelectedRows();
    this.dataToSend = data[0];
    
    if (type === 'approve') {
      let send = {};
      send['quotationNo'] = this.dataToSend.quotationNo;
      send['quotationDt'] = this.dataToSend.quotationDt;
      send['quotationExpiryDt'] = this.dataToSend.quotationExpiryDt;
      send['description'] = this.dataToSend.description;
      send['remarks'] = this.dataToSend.remarks;

      /*  if (this.dataToSend['createdBy'] instanceof Object) {
         send['createdBy'] = this.dataToSend['createdBy']
       } else {
         send['createdBy'] = { 'employeeId': this.dataToSend['createdBy']['employeeId'] }
       } */
      send['createdBy'] = Number(this.dataToSend['quotationItems'][0]['createdUser'])
      //   = this.dataToSend['createdBy'] != null && this.dataToSend['createdBy'] != undefined ? this.dataToSend['createdBy'] : 
      send['createdUser'] = Number(this.dataToSend['quotationItems'][0]['createdUser']);
      send['lastUpdateUser'] = localStorage.getItem('id')

      // if (this.dataToSend['requestedby'] instanceof Object) {
      send['requestedby'] = this.dataToSend['requestedby'];
      // } else {
      //   send['requestedby'] = { 'employeeId': this.dataToSend.requestedby.employeeId }
      // }
      send['quotationStatusModel'] = { 'quotationStatusId': 3 }
      send['requestedId'] = this.dataToSend.requestedby.employeeId;
      send['pharmacyModel'] = { "pharmacyId": this.dataToSend.pharmacyModel.pharmacyId };
      send['quotationId'] = this.dataToSend.quotationId;
      send['approvedDt'] = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      send['approvedBy'] = localStorage.getItem('id')
      send['modifiedDt'] = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      //send['approvedId']=


      send['quotationItems'] = this.dataToSend.quotationItems


      // send['approvedId'] = localStorage.getItem('id');
      
      // send['rejectedReason'] = this.reason;

      this.supplierService.saverequestapprovedquotation(send).subscribe(
        approveRes => {
          if (approveRes instanceof Object) {
            if (approveRes['responseStatus']['code'] === 200) {
              this.reason = '';
              this.toastrService.success('Approved Successfully', 'Quotation', {
                timeOut: 3000
              })
              this.getApprovedData(this.pharmacyId);

            }
          }
        }
      );
    }
    // itemsId pending
    // percentage pending
    // unitRate pending
    // validity pending
    // status


    if (type === 'reject') {
      let send = {};
      send['quotationId'] = this.dataToSend.quotationId;
      send['quotationNo'] = this.dataToSend.quotationNo;
      send['quotationDt'] = this.dataToSend.quotationDt;
      send['quotationExpiryDt'] = this.dataToSend.quotationExpiryDt;
      send['description'] = this.dataToSend.description;
      send['createdBy'] = Number(this.dataToSend['quotationItems'][0]['createdUser'])
      send['lastUpdateUser'] = localStorage.getItem('id');
      send['requestedby'] = this.dataToSend['requestedby'];
      send['quotationStatusModel'] = { 'quotationStatusId': 4 }
      send['createdUser'] = Number(this.dataToSend['quotationItems'][0]['createdUser']);
      send['requestedId'] = this.dataToSend.requestedby.employeeId;
      send['pharmacyModel'] = { "pharmacyId": this.dataToSend.pharmacyModel.pharmacyId };
      send['rejectedReason'] = this.reason
      send['rejectedDate'] = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      send['rejectedBy'] = localStorage.getItem('id')
      send['modifiedDt'] = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      send['remarks'] = this.dataToSend['remarks'];

      send['quotationItems'] = this.dataToSend.quotationItems


      //  send['approvedId'] = localStorage.getItem('id');
      
      this.supplierService.saverequestrejectedquotation(send).subscribe(
        approveRes => {
          if (approveRes instanceof Object) {
            if (approveRes['responseStatus']['code'] === 200) {

              this.toastrService.success('Rejected Successfully', 'Quotation', {
                timeOut: 3000
              })
              this.getApprovedData(this.pharmacyId);
              // this.router.navigate(['/stock']);
              // this.router.navigate(['/stock/outstandingquotations']);
              /*  setTimeout(() => {
                 this.reloadCurrentRoute();
               }, 200); */
            }
          }
        }
      );
      this.reason = undefined;
    }


  }

  reject() {

    const data = this.aapprovedGridOptions.api.getSelectedRows();
    this.dataToSend = data[0];

    let send = {};

    // itemsId pending
    // percentage pending
    // unitRate pending
    // validity pending
    // status

    send['createdId'] = this.dataToSend.createdBy.employeeId;
    send['createdUser'] = this.dataToSend.createdUser;
    send['requestedId'] = this.dataToSend.requestedby.employeeId;
    send['pharmacyModel'] = { "pharmacyId": this.dataToSend.pharmacyModel.pharmacyId };

    send['supplier'] = { 'supplierId': this.dataToSend.quotationItems[0].supplier.supplierId };
    send['description'] = this.dataToSend.description;
    send['quotationDt'] = this.dataToSend.quotationDt;
    send['quotationExpiryDt'] = this.dataToSend.quotationExpiryDt;
    send['quotationNo'] = this.dataToSend.quotationNo;
    send['quotationItems'] = [{
      'activeS': this.dataToSend.quotationItems[0].item.activeS,
      'item': { 'itemId': this.dataToSend.quotationItems[0].item.itemId },
      'createdUser': this.dataToSend.createdUser, 'discountPercentage': this.dataToSend.quotationItems[0].discountPercentage,
      'formulation': this.dataToSend.quotationItems[0].item.itemForm.form,
      'manufacturerLicense': this.dataToSend.quotationItems[0].item.manufacturer.licence,
      'manufacturerName': this.dataToSend.quotationItems[0].item.manufacturer.name,
      'quantity': this.dataToSend.quotationItems[0].quantity,
      'supplier': { 'supplierId': this.dataToSend.quotationItems[0].supplier.supplierId },
      'quotationItemId': this.dataToSend.quotationItems[0].quotationItemId
    }];
    send['quotationId'] = this.dataToSend.quotationId;
    send['rejectedReason'] = this.reason;
    send['rejectedId'] = localStorage.getItem('id');
    // send['rejectedBy'] = localStorage.getItem('user');
    send['rejectedDate'] = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

    this.supplierService.saverequestrejectedquotation(send).subscribe(
      approveRes => {
        if (approveRes instanceof Object) {
          if (approveRes['responseStatus']['code'] == 200) {
            this.reason = undefined;
            this.getApprovedData(this.pharmacyId);
          }
        }
      }
    );
  }


  onQuotationSearch(event) {
 
    this.supplierService.PendingRequestApprovalQuotationSearches(event['target']['value']).subscribe(qtnRes => {
      
      if (qtnRes instanceof Object) {
        if (qtnRes['responseStatus']['code'] === 200) {
         
          const data = qtnRes;
          if ((data['result']).length > 0) {

            this.rowData = data['result']
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
      this.toastrService.warning("Please select quotation to print", "", {
        timeOut: 3000
      })
    }
  }

}
