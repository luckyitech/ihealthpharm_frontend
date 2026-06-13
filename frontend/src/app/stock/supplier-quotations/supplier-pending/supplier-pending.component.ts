import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { SupplierQuotationsService } from '../../supplier-quotations/supplier-quotations.service';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import * as $ from 'jquery';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-supplier-pending',
  templateUrl: './supplier-pending.component.html',
  styleUrls: ['./supplier-pending.component.scss'],
  providers: [SupplierQuotationsService]
})
export class SupplierPendingComponent implements OnInit {

  private gridApi;
  private gridColumnApi;

  constructor(private supplierService: SupplierQuotationsService, private router: Router,
    private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.pendingVendorApprovalGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.pendingVendorApprovalGridOptions.rowSelection = 'single';
    this.pendingVendorApprovalGridOptions.columnDefs = this.columnDefs;
    this.pendingVendorApprovalGridOptions.rowData = [];

    this.supplierQtnPendingGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.supplierQtnPendingGridOptions.rowSelection = 'single';
    this.supplierQtnPendingGridOptions.columnDefs = this.supplierQtnDefs;
    this.supplierQtnPendingGridOptions.rowData = [];

    this.getEmailSendData();
  }


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

  supplierQtnDefs = [
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

  pendingVendorApprovalGridOptions: GridOptions;
  supplierQtnPendingGridOptions: GridOptions;
  rowData: any;

  getEmailSendData() {
    this.supplierService.getAllSentMailQuotations().subscribe(getAllMailsRes => {
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





  getSupplierPending() {

    this.loadRowData([], this.pendingVendorApprovalGridOptions);

    this.supplierService.getpendingquotationitems().subscribe(
      res => {
        const data = res;
        if ((data['result']).length > 0) {
          for (var i = 0; i < (data['result']).length; i++) {
            data['result'][i]['quotationName'] = data['result'][i]['quotation']['quotationName'];
            data['result'][i]['itemCode'] = data['result'][i]['quotation']['quotationItems'][0]['item']['itemCode'];
            data['result'][i]['itemName'] = data['result'][i]['quotation']['quotationItems'][0]['item']['itemName'];
            data['result'][i]['supplierName'] = data['result'][i]['quotation']['quotationItems'][0]['supplier']['name'];
            data['result'][i]['quantity'] = data['result'][i]['quotation']['quotationItems'][0]['quantity'];
          }
          this.loadRowData(data['result'], this.pendingVendorApprovalGridOptions);
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

  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.pendingVendorApprovalGridOptions.api.setQuickFilter($event.target.value);
    if (this.pendingVendorApprovalGridOptions.api.getDisplayedRowCount() === 0) {
      this.pendingVendorApprovalGridOptions.api.showNoRowsOverlay();
    } else {
      this.pendingVendorApprovalGridOptions.api.hideOverlay();
    }
  }


  suppliersListUnderQuotation
  getSuppliersListUnderQuotation() {
    this.supplierService.getSuppliersListFortheQuotationForPriceUpdate(this.selectedQuotationRow['quotationNo']).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.suppliersListUnderQuotation = res['result']
          if (!this.suppliersListUnderQuotation.length) {

          }
        }
      }
    })
  }

  ngOnInit() {
  }
  reason = "";
  dataToSend;
  approve() {
    this.spinnerService.show();
    const data = this.pendingVendorApprovalGridOptions.api.getSelectedRows();
    this.dataToSend = data[0];

    let send = {};

    send['createdUser'] = this.dataToSend['createdUser'];
    send['approvedBy'] = this.dataToSend['approvedBy']
    send['approvedDt'] = this.dataToSend['approvedDt']
    send['approvedId'] = this.dataToSend['approvedId']
    send['approvedName'] = this.dataToSend['approvedName']
    send['cancelledReason'] = this.dataToSend['cancelledReason']
    send['createdBy'] = this.dataToSend['createdBy']
    send['createdId'] = this.dataToSend['createdId']
    send['createdName'] = this.dataToSend['createdName']
    send['createdUser'] = this.dataToSend['createdUser']
    send['description'] = this.dataToSend['description']
    send['itemName'] = this.dataToSend['itemName']
    send['lastUpdateUser'] = localStorage.getItem('id')
    send['modifiedDt'] = this.dataToSend['modifiedDt']
    send['modifiedId'] = this.dataToSend['modifiedId']
    send['modifiedName'] = this.dataToSend['modifiedName']
    send['pharmacyModel'] = { 'pharmacyId': this.dataToSend['pharmacyModel']['pharmacyId'] }
    send['quotationDt'] = this.dataToSend['quotationDt']
    send['quotationExpiryDt'] = this.dataToSend['quotationExpiryDt']
    send['quotationId'] = this.dataToSend['quotationId']
    send['quotationItems'] = this.dataToSend['quotationItems']
    send['quotationNo'] = this.dataToSend['quotationNo']
    send['quotationSendMode'] = 'Mail Sent'
    send['quotationStatusModel'] = { 'quotationStatusId': this.dataToSend['quotationStatusModel']['quotationStatusId'] }

    send['requestedId'] = this.dataToSend['requestedId']
    send['requestedName'] = this.dataToSend['requestedName']
    send['requestedby'] = this.dataToSend['requestedby']
    //for normal send qtn by mail 
    send['sentBy'] = this.dataToSend['sentBy']
    send['sentDt'] = this.dataToSend['sentDt'];
    send['supplierQtnApprovedDt'] = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    send['supplierQtnApprovedBy'] = Number(localStorage.getItem('id'))

    this.supplierService.approvedSupplierQuotation(send).subscribe(
      approveRes => {

        if (approveRes instanceof Object) {
          if (approveRes['responseStatus']['code'] === 200) {
            this.pendingVendorApprovalGridOptions.api.setRowData([]);
            this.spinnerService.hide();
            this.getEmailSendData();
            this.toasterService.success('Approved SuccessFully', 'Success', {
              timeOut: 3000
            })

          }
        }
      }
    );
  }

  reject() {
    this.spinnerService.show();
    const data = this.pendingVendorApprovalGridOptions.api.getSelectedRows();
    this.dataToSend = data[0];

    let send = {};

    send['createdUser'] = this.dataToSend['createdUser'];
    send['approvedBy'] = this.dataToSend['approvedBy']
    send['approvedDt'] = this.dataToSend['approvedDt']
    send['approvedId'] = this.dataToSend['approvedId']
    send['approvedName'] = this.dataToSend['approvedName']
    send['cancelledReason'] = this.dataToSend['cancelledReason']
    send['createdBy'] = this.dataToSend['createdBy']
    send['createdId'] = this.dataToSend['createdId']
    send['createdName'] = this.dataToSend['createdName']
    send['createdUser'] = this.dataToSend['createdUser']
    send['description'] = this.dataToSend['description']
    send['itemName'] = this.dataToSend['itemName']
    send['lastUpdateUser'] = localStorage.getItem('id')
    send['modifiedDt'] = this.dataToSend['modifiedDt']
    send['modifiedId'] = this.dataToSend['modifiedId']
    send['modifiedName'] = this.dataToSend['modifiedName']
    send['pharmacyModel'] = { 'pharmacyId': this.dataToSend['pharmacyModel']['pharmacyId'] }
    send['quotationDt'] = this.dataToSend['quotationDt']
    send['quotationExpiryDt'] = this.dataToSend['quotationExpiryDt']
    send['quotationId'] = this.dataToSend['quotationId']
    send['quotationItems'] = this.dataToSend['quotationItems']
    send['quotationNo'] = this.dataToSend['quotationNo']
    send['quotationSendMode'] = 'Mail Sent'
    send['quotationStatusModel'] = { 'quotationStatusId': this.dataToSend['quotationStatusModel']['quotationStatusId'] }
    send['requestedId'] = this.dataToSend['requestedId']
    send['requestedName'] = this.dataToSend['requestedName']
    send['requestedby'] = this.dataToSend['requestedby']
    //for normal send qtn by mail 
    send['sentBy'] = this.dataToSend['sentBy']
    send['sentDt'] = this.dataToSend['sentDt']

    send['supplierQtnRejectedDt'] = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    send['supplierQtnRejectedBy'] = Number(localStorage.getItem('id'));
    send['supplierQtnRejectedReason'] = this.reason


    this.supplierService.rejectSupplierQutation(send).subscribe(
      approveRes => {
        if (approveRes instanceof Object) {
          if (approveRes['responseStatus']['code'] === 200) {
            this.reason = '';
            this.spinnerService.hide();
            this.toasterService.success('Rejected SuccessFully', 'Success', {
              timeOut: 3000
            })
            this.getEmailSendData();
          }
        }
      }
    );
  }

  onSelectionChanged(params) {

    this.selectedQuotationRow = params.api.getSelectedRows()[0]
    this.selectedSupplier=  this.selectedQuotationRow['quotationItems'][0]['supplier']
    this.getSuppliersListUnderQuotation();
  }

  onCellClicked(params) {

    if (params.column.colId !== 'check') {

      this.change(params.data);
      setTimeout(() => {
        $('#supplierQtnPendingModal').modal('show');
      }, 200);
    }
  }

  supplierQtnPendingRowData: any;

  change(params) {
    const data = params;

    $('#requestQtNumber').val(data['quotationNo']);
    $('#requestQtRequested').val(data['requestedName']);
    $('#requestQtCreated').val(data['createdName']);
    $('#requestQtDated').val(data['quotationDt']);
    $('#requestQtExpiry').val(data['quotationExpiryDt']);
    $('#requestQtDesc').val(data['description']);
    $('#remarks').val(data['remarks']);
    this.supplierQtnPendingRowData = data['quotationItems'];
  }

  OnSupplierQtnSearch(event) {

    this.supplierService.getQtnsBasedonQtnNoForOustanding(event['target']['value']).subscribe(qtnRes => {

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

  blob: Blob
  selectedQuotationRow
  onPrint() {
    this.selectedQuotationRow = this.gridApi.getSelectedRows()[0]
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

  selectedSupplier
  onSupplierChange(event) {
    this.selectedSupplier = event
  }

  excelFile
  newQuotationItemArray: any[] = []
  onChange(event: any) {
    this.excelFile = '';
    /* wire up file reader */

    if (!this.selectedQuotationRow) {
      this.toasterService.warning("Please select quotation before uploading", "", {
        timeOut: 3000
      })

      return;
    }

    if (!this.selectedSupplier) {
      this.toasterService.warning("Please select supplier before uploading", "", {
        timeOut: 3000
      })

      return;
    }

    this.excelFile = event.target.files[0]
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
     // console.log(data); // Data will be logged in array format containing objects

      this.readAndUpdateQuotationItemsData(data);
    };
  }

  supplierQuotationRefNo;
  readAndUpdateQuotationItemsData(excelQuotationData) {

    this.newQuotationItemArray = []

    if (!this.excelFile['name'].includes(this.selectedQuotationRow['quotationNo'])) {
      this.toasterService.warning("Selected spread sheet is different from quotation selected", "", {
        timeOut: 3000
      })
      this.excelFile = ''
      return;
    }

    if (!this.excelFile['name'].includes(this.selectedSupplier['name'])) {
      this.toasterService.warning("Selected spread sheet is different from supplier selected", "", {
        timeOut: 3000
      })
      this.excelFile = '';
      return;
    }


    let quotationItemData = this.selectedQuotationRow['quotationItems'];

    let supplierQuotationItems = quotationItemData.filter(x => x.supplier.supplierId === this.selectedSupplier['supplierId']);

    //console.log(supplierQuotationItems)
    for (var i = 17; i < excelQuotationData.length; i++) {
     // console.log(excelQuotationData[i])
      for (var j = 0; j < supplierQuotationItems.length; j++) {

        if (supplierQuotationItems[j]['item']['itemName'] === excelQuotationData[i]['__EMPTY']) {
         // console.log("============")
          supplierQuotationItems[j]['discountPercentage'] = excelQuotationData[i]['__EMPTY_4']
          supplierQuotationItems[j]['quantity'] = excelQuotationData[i]['__EMPTY_1']
          supplierQuotationItems[j]['bonus'] = excelQuotationData[i]['__EMPTY_2']
          supplierQuotationItems[j]['unitPurchasePrice'] = excelQuotationData[i]['__EMPTY_3']
          this.newQuotationItemArray.push(supplierQuotationItems[j])
          break;
        }
      }
    }

    this.supplierQuotationRefNo=excelQuotationData[15]['__EMPTY_1']?excelQuotationData[15]['__EMPTY_1']:excelQuotationData[15]['__EMPTY_2']?excelQuotationData[15]['__EMPTY_2']:null
  }


  updateQuotationItems() {

    if (!this.excelFile['name'].includes(this.selectedQuotationRow['quotationNo'])) {
      this.toasterService.warning("Selected spread sheet is different from quotation selected", "", {
        timeOut: 3000
      })
      this.excelFile = ''
      return;
    }

    if (!this.excelFile['name'].includes(this.selectedSupplier['name'])) {
      this.toasterService.warning("Selected spread sheet is different from supplier selected", "", {
        timeOut: 3000
      })
      this.excelFile = '';
      return;
    }

    //console.log(this.newQuotationItemArray)
    //const formData = new FormData();

    //formData.append('quotationItemsModels', JSON.stringify(this.newQuotationItemArray));


    let quotData=this.pendingVendorApprovalGridOptions.api.getSelectedRows()[0]
    let addData = {};

    addData['approvedBy'] = quotData['approvedBy']
    addData['approvedDt'] = quotData['approvedDt']
    addData['approvedId'] = quotData['approvedId']
    addData['approvedName'] = quotData['approvedName']
    addData['cancelledReason'] = quotData['cancelledReason']
    addData['createdBy'] = quotData['createdBy']
    addData['createdId'] = quotData['createdId']
    addData['createdName'] = quotData['createdName']
    addData['createdUser'] = quotData['createdUser']
    addData['description'] = quotData['description']
    addData['itemName'] = quotData['itemName']
    addData['lastUpdateUser'] = localStorage.getItem('id')
    addData['modifiedDt'] = quotData['modifiedDt']
    addData['modifiedId'] = quotData['modifiedId']
    addData['modifiedName'] = quotData['modifiedName']
    addData['pharmacyModel'] = { 'pharmacyId': quotData['pharmacyModel']['pharmacyId'] }
    addData['quotationDt'] = quotData['quotationDt']
    addData['quotationExpiryDt'] = quotData['quotationExpiryDt']
    addData['quotationId'] = quotData['quotationId']
    addData['quotationNo'] = quotData['quotationNo']
    addData['quotationSendMode'] = 'Mail Sent'
    addData['quotationStatusModel'] = { 'quotationStatusId': quotData['quotationStatusModel']['quotationStatusId'] }
    addData['requestedId'] = quotData['requestedId']
    addData['requestedName'] = quotData['requestedName']
    addData['requestedby'] = quotData['requestedby']
    //for normal send qtn by mail 
    addData['sentBy'] = localStorage.getItem('id')
    addData['sentDt'] = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    addData['quotationItems']=this.newQuotationItemArray
    addData['supplierSentQtnNo']=this.supplierQuotationRefNo

    this.spinnerService.show();
    this.supplierService.sendingQtnByMail(addData).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {

          this.selectedSupplier = undefined
          this.excelFile = undefined;
          this.getEmailSendData();
          this.spinnerService.hide()
        }
      }
    }, error => {
      this.spinnerService.hide();
      this.toasterService.error("Error occured plz contact admin", "", {
        timeOut: 5000
      })
    })

  }

}
