import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DatePipe } from '@angular/common';
import { CreditNoteService } from './../shared/credit-note.service';
import { GridOptions, ColDef } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-credit-note-history',
  templateUrl: './credit-note-history.component.html',
  styleUrls: ['./credit-note-history.component.scss']
})
export class CreditNoteHistoryComponent implements OnInit {

  creditNoteHistoryGridOptions: GridOptions;

  constructor(private creditNoteService: CreditNoteService, private datePipe: DatePipe,
    private spinnerService: Ng4LoadingSpinnerService, private toastrService: ToastrService) {
    this.creditNoteHistoryGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };

    this.creditNoteHistoryGridOptions.rowSelection = 'single';
    this.creditNoteHistoryGridOptions.columnDefs = this.creditGridDefs;
    this.creditNoteHistoryGridOptions.rowData = [];

    this.getAllData();

  }

  ngOnInit() {
    this.creditNoteInformationForm = new FormGroup(this.creditNoteFormValidations);
  }

  paginationSize = 50;

  creditGridDefs: ColDef[] = [
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

    { headerName: 'CreditNote No', field: 'creditNoteNo', sortable: true, resizable: true, filter: true, width: 160, editable: true },
    {
      headerName: 'Payment Status', field: 'paymentStatus', sortable: true, resizable: true, filter: true, width: 140,
    },
    {
      headerName: 'Invoice No', field: 'invoiceId', sortable: true, resizable: true, filter: true, width: 140,
      valueGetter: function (params) {
        var invoiceNo = params.data.invoiceId != '' && params.data.invoiceId != null && params.data.invoiceId != undefined ? params.data.invoiceId : '--';
        return invoiceNo;
      }
    },
    {
      headerName: 'Bill No', field: 'billId', sortable: true, filter: true, resizable: true, width: 140,
      valueGetter: function (params) {
        var billId = params.data.billId != '' && params.data.billId != null && params.data.billId != undefined ? params.data.billId : '--';
        return billId;
      }
    },
    {
      headerName: 'Approved Date', field: 'approvedDate', sortable: true, resizable: true, filter: true, width: 140,
      valueGetter: this.dateFormatter.bind(this)
    },
    {
      headerName: 'Credit Note To', field: 'creditTo', sortable: true, resizable: true, filter: true, width: 220,

      valueGetter: function (params) {
        var supplier = params.data.supplierModel != null && params.data.supplierModel != undefined ? params.data.supplierModel.name + ' Supplier' : null;
        var customer = params.data.customerModel != null && params.data.customerModel != undefined ? params.data.customerModel.customerName + ' Customer' : null;
        let creditTo
        if (supplier != null && supplier != undefined) {
          creditTo = supplier;
          return creditTo;
        } else {
          creditTo = customer;
          return creditTo;
        }
      }
    },
    { headerName: 'Return Type', field: 'returnType', sortable: true, resizable: true, filter: true },
    {
      headerName: 'Return Type Reason', field: 'returnTypeReason', sortable: true, resizable: true, filter: true,
    },
    {
      headerName: 'Net Amount', field: 'netAmount', sortable: true, resizable: true, filter: true, width: 130,
      valueGetter: function (params) {
        if (params.data.netAmount != null && params.data.netAmount != 'null' && params.data.netAmount != undefined) {
          return params.data.netAmount;
        } else {
          var data = 0.0;
          params.data.netAmount = data;
          return params.data.netAmount;
        }
      }
    },
    {
      headerName: 'Approved By', field: 'empName', sortable: true, resizable: true, filter: true, width: 150,
    }
  ];

  rowData: any;

  getAllData() {
    this.spinnerService.show();
    this.creditNoteService.getAllCN().subscribe(creditNotes => {
      if (creditNotes instanceof Object) {
        if (creditNotes['responseStatus']['code'] == 200) {
          this.rowData = creditNotes['result'];
          this.spinnerService.hide();
        }
      }
    });
    err => {
      this.spinnerService.hide();
    }
  }

  
  dateFormatter(params) {
    if (params.data != null && params.data != undefined) {
      if (params.data.approvedDate != null && params.data.approvedDate != undefined && params.data.approvedDate != '') {
        try {
          params.data.approvedDate = this.datePipe.transform(params.data.approvedDate, "dd-MM-yyy");
        }
        catch (error) {
        }
        return params.data.approvedDate;
      }
    }
  }

  searchType = [{ name: "Credit Note No" }, { name: "Bill No" }]
  searchTypeValue: any;


  onTypeSelection(event) {
    if (event != null && event != undefined) {
      this.searchTypeValue = event['name'];
    }
    else {
      this.searchTypeValue = undefined;
      this.getAllData();
    }
  }

  onSearch(event) {
    if (event['target']['value'] != null && event['target']['value'] != undefined && event['target']['value'] != '') {
      if (this.searchTypeValue != null && this.searchTypeValue != undefined) {
        this.creditNoteService.getAllCnForSearches(this.searchTypeValue, event['target']['value']).subscribe(searchRes => {
          if (searchRes instanceof Object) {
            if (searchRes['responseStatus']['code'] == 200) {
              this.rowData = searchRes['result'];
              if (searchRes['result'].length <= 0) {
                this.toastrService.warning('No Data Found', '', {
                  timeOut: 5000
                })
              }
            }
          }
        })
      }
    } else {
      this.getAllData();
    }

  }


  onCellClicked(params) {
    if (params.column.colId !== 'check') {

      this.change(params.data);
      setTimeout(() => {
        $('#approvedModal').modal('show');
      }, 200);
    }
  }

  creditNoteInformationForm: FormGroup;
  creditData: any;
  netAmount: any;
  supplierDiv = true;
  customerDiv = false;

  change(params) {
    const data = params;
    //console.log(data)
    this.creditNoteService.getCnDataById(data.creditNoteId).subscribe(creditNoteRes => {
      if (creditNoteRes instanceof Object) {
        if (creditNoteRes['responseStatus']['code'] == 200) {
          this.creditData = creditNoteRes['result'];

          this.creditNoteInformationForm.patchValue({
            creditNoteNo: this.creditData['creditNoteNo'],
            creditDate: this.creditData['creditDate'],
            selectedStatus: this.creditData['status'],
            invoiceId: this.creditData['invoiceId'],
            tax: this.creditData['tax'],
            returnTypeReason: this.creditData['returnTypeReason'],
            selectedSupplier: this.creditData['supplierModel'] != null && this.creditData['supplierModel'] != undefined ? this.creditData['supplierModel']['name'] : '',
            discount: this.creditData['discount'],
            approvedDate: this.creditData['approvedDate'],
            amount: this.creditData['amount'],
            paymentType: this.creditData['paymentType'] != null && this.creditData['paymentType'] != undefined ? this.creditData['paymentType']['type'] : '',
            remarks: this.creditData['remarks'],
            paymentStatus: this.creditData['paymentStatus'],
            selectedCustomer: this.creditData['customerModel'] != null && this.creditData['customerModel'] != undefined ? this.creditData['customerModel']['customerName'] : '',
            billId: this.creditData['billId'],
            billType: this.creditData['billType']
          });
          this.netAmount = this.creditData['netAmount'];
          if (this.creditData['supplierModel'] != null && this.creditData['supplierModel'] != undefined) {
            this.customerDiv = false;
            this.supplierDiv = true;

            (<HTMLInputElement>document.getElementById("sales")).disabled = true;
            (<HTMLInputElement>document.getElementById("purchase")).checked = true;
          }
          if (this.creditData['customerModel'] != null && this.creditData['customerModel'] != undefined) {
            this.customerDiv = true;
            this.supplierDiv = false;
            (<HTMLInputElement>document.getElementById("purchase")).disabled = true;
            (<HTMLInputElement>document.getElementById("sales")).checked = true;
          }

          this.creditNoteInformationForm.get('selectedStatus').disable();
          this.creditNoteInformationForm.get('returnTypeReason').disable();
          this.creditNoteInformationForm.get('selectedSupplier').disable();
          this.creditNoteInformationForm.get('selectedCustomer').disable();
          this.creditNoteInformationForm.get('paymentType').disable();
          this.creditNoteInformationForm.get('billType').disable();
        }
      }
    })
  }

  creditNoteFormValidations = {
    creditNoteNo: new FormControl(''),
    billId: new FormControl(''),
    invoiceId: new FormControl(''),
    remarks: new FormControl(''),
    selectedSupplier: new FormControl(''),
    selectedCustomer: new FormControl(''),
    creditDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    amount: new FormControl(''),
    returnType: new FormControl(''),
    returnTypeReason: new FormControl(''),
    approvedBy: new FormControl(''),
    approvedDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
    selectedStatus: new FormControl(''),
    approvedByEmp: new FormControl(''),
    approvedPin: new FormControl(''),
    paymentType: new FormControl(''),
    approveDate: new FormControl(''),
    tax: new FormControl(''),
    discount: new FormControl(''),
    billType: new FormControl(''),
    paymentStatus: new FormControl('')
  }

  onResetCreditNote() {
    $('#approvedModal').modal('hide');
  }


  onCheckBoxChanged(params) {
    this.selectedCreditNoteRow = params.api.getSelectedRows()[0]
  }

  blob: Blob
  selectedCreditNoteRow
  onPrint() {


    if (this.selectedCreditNoteRow) {

      let uri = { "ReportCode": 'CREDIT_NOTE', "credit_note_no": this.selectedCreditNoteRow.creditNoteNo };
      var encoded = encodeURI(JSON.stringify(uri));

      let reportURI = encoded;
      this.creditNoteService.downloadPdfFile(reportURI).subscribe((data: any) => {
        this.blob = new Blob([data], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'CREDIT NOTE' + '.pdf';
        link.click();
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = downloadURL;
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
      });
    } else {
      this.toastrService.warning("Please select a record to print", "", {
        timeOut: 3000
      })
    }
  }



}
