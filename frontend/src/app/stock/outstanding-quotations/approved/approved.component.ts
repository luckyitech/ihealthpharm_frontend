import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { Component, ChangeDetectorRef } from '@angular/core';
import { SupplierQuotationsService } from '../../supplier-quotations/supplier-quotations.service';
import { GridOptions } from 'ag-grid-community';
import * as $ from 'jquery';
import { formatDate } from '@angular/common';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.scss'],
  providers: [SupplierQuotationsService]
})
export class ApprovedComponent {

  approvedGridOptions: GridOptions;
  quotationGridOptions: GridOptions;
  emailGridOptions: GridOptions;


  pharmacyId: number = 1;

  mainData;
  rowData: any;
  gridApi;
  gridColumnApi;

  gridApi2;
  gridColumnApi2;

  constructor(private supplierService: SupplierQuotationsService, private cdRef: ChangeDetectorRef,
    private toastrService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.approvedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      },
      onGridReady: this.onGridReady.bind(this)
    };
    this.approvedGridOptions.rowSelection = 'single';
    this.approvedGridOptions.columnDefs = this.columnDefs;
    this.approvedGridOptions.rowData = [];

    this.quotationGridOptions = <GridOptions>{
      context: {
        componentParent: this
      },
      onGridReady: this.onGridReady.bind(this)
    };
    this.quotationGridOptions.rowSelection = 'single';
    this.quotationGridOptions.columnDefs = this.quotationcolumnDefs;
    this.quotationGridOptions.rowData = [];

    this.emailGridOptions = <GridOptions>{
      context: {
        componentParent: this
      },
      onGridReady: this.onGridReady2.bind(this)
    };
    this.emailGridOptions.rowSelection = 'single';
    this.emailGridOptions.columnDefs = this.emailColumns;
    this.emailGridOptions.rowData = [];

    this.getApprovedData(this.pharmacyId);

  }

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
      headerName: 'Approved By',
      field: 'approvedName',
      sortable: true,
      resizable: true,
      filter: true,
      valueGetter: function (params) {
        var approvedName = params.data.approvedName;

        return approvedName;
      }
    }, {
      headerName: 'Approved Date',
      field: 'approvedDt',
      sortable: true,
      resizable: true,
      filter: true
    }
  ];

  emailColumns = [
    {
      headerName: "",
      field: "",
      // checkboxSelection: true,
      sortable: true,
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40
    },
    {
      headerName: 'Supplier Details',
      field: 'supplier.name',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Supplier Email',
      field: 'supplier.emailId',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Sup Contact Email 1',
      field: 'supplier.contactPersonEmailID',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Sup Contact Email 2',
      field: 'supplier.contactPersonEmailIdTwo',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Sup Contact Email 3',
      field: 'supplier.contactPersonEmailIdThree',
      sortable: true,
      resizable: true,
      filter: true
    },
    {
      headerName: 'Sup Contact Email 4',
      field: 'supplier.contactPersonEmailIdFour',
      sortable: true,
      resizable: true,
      filter: true
    }
  ];


  onGridReady(params) {
    this.gridApi = params.api;
    // console.log(this.gridApi)
    this.gridColumnApi = params.columnApi;
  }

  onGridReady2(params) {
    this.gridApi2 = params.api;
    this.gridColumnApi2 = params.columnApi;

    // params.api.updateRowData({add: this.mainData});
  }

  en_dis = true;
  suppliersListUnderQuotation: any[] = []
  selectedSupplier
  onSelectionChanged(params) {
    //console.log(params.api.getSelectedRows()[0])
    this.selectedQuotationRow = params.api.getSelectedRows()[0]
    //console.log(this.selectedQuotationRow)

    var selectedRows = this.gridApi.getSelectedRows();
    this.getSuppliersListUnderQuotation()
    if (selectedRows.length > 0) {
      this.en_dis = false;
    } else {
      this.en_dis = true;
    }


  }

  en_dis2 = true;
  onSelectionChanged2() {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      this.en_dis2 = false;
    } else {
      this.en_dis2 = true;
    }
  }

  keys: string[];
  dataSheet = new Subject();
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  isExcelFile: boolean;
  excelFile: any
  onChange(evt) {
    if (!this.selectedSupplier) {
      this.toastrService.warning("Please select supplier", "", {
        timeOut: 3000
      })
      this.inputFile.nativeElement.value = '';
      return;
    }
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
      //console.log(this.excelFile)
      reader.onloadend = (e) => {

        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data)
      }
    } else {
      this.inputFile.nativeElement.value = '';
    }
  }

  emailData: any;

  getApprovedData(pharmacyId: number) {

    this.showApprovedGrid = true;
    this.loadRowData([], this.approvedGridOptions);
    // this.showApprovedGrid = true;

    // this.showApprovedGrid = false;
    this.supplierService.getrequestapprovedquotationbypharmacy(pharmacyId).subscribe(
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

          this.mainData = data['result'];
          // this.showApprovedGrid = true;
        }
      }
    );
  }

  emialGridData: any;
  send() {

    if (!this.selectedSupplier) {
      this.toastrService.warning("Please select supplier", "", {
        timeOut: 3000
      })
      return;
    }

    this.emailData = this.approvedGridOptions.api.getSelectedRows();
    this.emailData = this.emailData[0];

    //this.a
    var emailGridData = [];
    // for (var i = 0; i < this.emailData['quotationItems'].length; i++) {
    //   emailGridData.push(this.emailData['quotationItems'][i])
    // }

    emailGridData.push({ supplier: this.selectedSupplier })
    this.emialGridData = emailGridData;
  }


  mailSentSuppliers: any = [] = []
  getSuppliersListUnderQuotation() {
    this.mailSentSuppliers = []
    this.suppliersListUnderQuotation = []
    let quotationItemsData = this.selectedQuotationRow['quotationItems']

    this.selectedSupplier=quotationItemsData[0]['supplier']
    for (var i = 0; i < quotationItemsData.length; i++) {
      


      if (this.suppliersListUnderQuotation.length > 0) {
        let data = this.suppliersListUnderQuotation.find(obj => obj.name === quotationItemsData[i]['supplier']['name']);
        //console.log(data)
        if (!data) {
          this.suppliersListUnderQuotation.push(quotationItemsData[i]['supplier']);

        }
      } else {
        this.suppliersListUnderQuotation.push(quotationItemsData[i]['supplier']);

      }

      if (quotationItemsData[i]['supplierMailSent'] == 'Y') {

        if (this.mailSentSuppliers.length > 0) {
          let data = this.mailSentSuppliers.find(obj => obj === quotationItemsData[i]['supplier']['name']);
          //console.log(data)
          if (!data) {
            this.mailSentSuppliers.push(quotationItemsData[i]['supplier']['name']);
          }
        } else {
          this.mailSentSuppliers.push(quotationItemsData[i]['supplier']['name'])
        }
      }

      //console.log(this.mailSentSuppliers)
    }


    this.supplierService.getSuppliersListFortheQuotation(this.selectedQuotationRow['quotationNo']).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {

          if (!res['result'].length) {
            this.markQuotationAsSent()
          }
        }
      }
    })
  }

  markQuotationAsSent() {
    this.spinnerService.show();
   // this.emailData = this.approvedGridOptions.api.getSelectedRows();

    this.emailData = this.selectedQuotationRow

    let addData = {};

    addData['approvedBy'] = this.emailData['approvedBy']
    addData['approvedDt'] = this.emailData['approvedDt']
    addData['approvedId'] = this.emailData['approvedId']
    addData['approvedName'] = this.emailData['approvedName']
    addData['cancelledReason'] = this.emailData['cancelledReason']
    addData['createdBy'] = this.emailData['createdBy']
    addData['createdId'] = this.emailData['createdId']
    addData['createdName'] = this.emailData['createdName']
    addData['createdUser'] = this.emailData['createdUser']
    addData['description'] = this.emailData['description']
    addData['remarks'] = this.emailData['remarks']
    addData['itemName'] = this.emailData['itemName']
    addData['lastUpdateUser'] = localStorage.getItem('id')
    addData['modifiedDt'] = this.emailData['modifiedDt']
    addData['modifiedId'] = this.emailData['modifiedId']
    addData['modifiedName'] = this.emailData['modifiedName']
    addData['pharmacyModel'] = { 'pharmacyId': this.emailData['pharmacyModel']['pharmacyId'] }
    addData['quotationDt'] = this.emailData['quotationDt']
    addData['quotationExpiryDt'] = this.emailData['quotationExpiryDt']
    addData['quotationId'] = this.emailData['quotationId']
    
    addData['quotationNo'] = this.emailData['quotationNo']
    addData['quotationSendMode'] = 'Mail Sent'
    addData['quotationStatusModel'] = { 'quotationStatusId': this.emailData['quotationStatusModel']['quotationStatusId'] }

    addData['requestedId'] = this.emailData['requestedId']
    addData['requestedName'] = this.emailData['requestedName']
    addData['requestedby'] = this.emailData['requestedby']
    //for normal send qtn by mail 
    addData['sentBy'] = localStorage.getItem('id')
    addData['sentDt'] = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.emailData['quotationItems'].forEach(quotItem => {
      quotItem.supplierMailSent='Y';
    });
    addData['quotationItems'] = this.emailData['quotationItems']


    this.supplierService.sendingQtnByMail(addData).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] === 200) {
          this.spinnerService.hide();
          this.toastrService.success(res['message'], 'Success', {
            timeOut: 3000
          })
          this.getApprovedData(this.pharmacyId);

          this.cancelEmails()
        }

      }
    }, error => {
      this.spinnerService.hide();
      this.toastrService.error("Error occured while sending mail plz contact admin", '', {
        timeOut: 3000
      })
    })
  }

  sendingEmails() {
    if (!this.selectedSupplier) {
      this.toastrService.warning("Please select supplier", "", {
        timeOut: 3000
      })
      return;
    }
    if (!this.excelFile) {
      this.toastrService.warning("Please attach your excel spread sheet to send", "", {
        timeOut: 3000
      })
      return;
    }
    if (!this.excelFile['name'].includes(this.selectedSupplier['name'])) {
      this.toastrService.warning("Selected spread sheet is different from supplier selected", "", {
        timeOut: 3000
      })
      return;
    }

    this.spinnerService.show()

    delete this.selectedSupplier['country']
    delete this.selectedSupplier['state']

    const formData = new FormData();
    formData.append('quotationId', this.selectedQuotationRow['quotationId'])
    formData.append('excelFile', this.excelFile)
    formData.append('requestedName', this.emailData['requestedName'])
    formData.append('supplierModelObj', JSON.stringify(this.selectedSupplier))
    this.supplierService.sendExcelFileInMailForQtn(formData).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.spinnerService.hide();
          this.toastrService.success("Mail sent successfully", 'Success', {
            timeOut: 3000
          })
          this.selectedSupplier = undefined
          this.suppliersListUnderQuotation=[]
          this.emialGridData=[]
          this.excelFile=undefined
          this.getApprovedData(this.pharmacyId);
          this.getSuppliersListUnderQuotation()
          

        }
      }


    }, error => {
      this.spinnerService.hide();
      this.toastrService.error("Error occured plz contact admin", '', {
        timeOut: 3000
      })
    })


  }
  cancelEmails() {
    this.emialGridData = undefined;
    this.emailData = undefined;
  }

  download() {
    var gridApi = this.gridApi;
    this.setPrinterFriendly(gridApi);
    setTimeout(() => {
      print();
      this.setNormal(gridApi);
    }, 1000);
  }

  setPrinterFriendly(api) {
    var eGridDiv = document.querySelector("#approve");
    eGridDiv['style']['width'] = "";
    eGridDiv['style']['height'] = "";
    api.setDomLayout("print");
  }

  setNormal(api) {
    var eGridDiv = document.querySelector("#approve");
    eGridDiv['style']['width'] = "100%";
    eGridDiv['style']['height'] = "200px";
    api.setDomLayout(null);
  }


  onSupplierChange(event) {
    this.selectedSupplier = event
    if (this.mailSentSuppliers.length) {

      for (var j = 0; j < this.mailSentSuppliers.length; j++) {
        if (this.selectedSupplier['name'] === this.mailSentSuppliers[j]) {
          //this.suppliersListUnderQuotation[i].disabled=true
          this.selectedSupplier = undefined
          this.toastrService.warning("Already sent mail", "", {
            timeOut: 3000
          })

          break;

        } else {
          //this.suppliersListUnderQuotation[i].disable = false
          //console.log("===========")
        }
      }

    }
  }

  onCellClicked(params) {
    // console.log(params)
    if (params.column.colId !== 'check') {

      this.change(params.data);
      setTimeout(() => {
        $('#approvedModal').modal('show');
      }, 200);
    }
    this.selectedQuotationRow = params.data

  }

  approvedQtnRowData: any;

  change(params) {
    const data = params;

    $('#requestQuotationNumber').val(data['quotationNo']);
    $('#requestQuotationRequested').val(data['requestedName']);
    $('#requestQuotationCreated').val(data['createdName']);
    $('#requestQuotationDated').val(data['quotationDt']);
    $('#requestQuotationExpiry').val(data['quotationExpiryDt']);
    $('#requestQuotationDesc').val(data['description']);
    $('#remarks').val(data['remarks']);
    this.approvedQtnRowData = data['quotationItems']

    this.gridApi.forEachNodeAfterFilter(function (node) {
      node.setSelected(false);
    });
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

  OnQTNApprovedSearch(event) {

    this.supplierService.approvedQuotationSearches(event['target']['value']).subscribe(qtnRes => {

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



  blob: Blob
  selectedQuotationRow
  onPrint() {
    // console.log(this.gridApi.getSelectedRows())

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


  suppliers: any[] = []
  quotExcelBySupplier: any[] = []
  downloadURL: any[] = []
  onPrintExcel() {
    // console.log(this.gridApi.getSelectedRows())

    if (this.selectedQuotationRow) {
      if (!this.selectedSupplier) {
        this.toastrService.warning("Please select supplier", "", {
          timeOut: 3000
        })
        return;
      }

      let uri = { "ReportCode": 'PRINT_QUOTATION_RECEIPT', "QUOTATION_NO": this.selectedQuotationRow.quotationNo, "SP_NAME": this.selectedSupplier['name'] };
      var encoded = encodeURI(JSON.stringify(uri));

      let reportURI = encoded;
      this.supplierService.downloadExcelFile(reportURI).subscribe((data: any) => {

        this.blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;

        link.download = this.selectedQuotationRow.quotationNo + " - " + this.selectedSupplier['name'] + '.xlsx';

        link.click();


      })



    } else {
      this.toastrService.warning("Please select quotation to generate excel", "", {
        timeOut: 3000
      })
    }
  }


  downloadAll(filesForDownload) {

    var link = document.createElement("a");
    link.style.display = 'none';

    document.body.appendChild(link);

    for (var n = 0; n < filesForDownload.length; n++) {
      link.setAttribute('href', filesForDownload[n]);
      link.setAttribute('download', 'REQUEST FOR QUOTATION' + '.xlsx');

      link.click();
    }

    document.body.removeChild(link);
  }


}
