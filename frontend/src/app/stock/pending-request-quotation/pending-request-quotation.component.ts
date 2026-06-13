import { formatDate } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';
import * as $ from 'jquery';
import { SupplierQuotationsService } from '../supplier-quotations/supplier-quotations.service';
import { GridOptions, ColDef } from 'ag-grid-community';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/core/app.service';
import { AddPurchaseorderService } from '../purchase-order/add-purchaseorder.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-pending-request-quotation',
  templateUrl: './pending-request-quotation.component.html',
  styleUrls: ['./pending-request-quotation.component.scss'],
  providers: [SupplierQuotationsService, AddPurchaseorderService]
})
export class PendingRequestQuotationComponent implements OnInit {

  private getRowNodeId;



  constructor(private supplierQuotationsService: SupplierQuotationsService, private toasterService: ToastrService,
    private appService: AppService, private spinnerService: Ng4LoadingSpinnerService,
    private addPurchaseOrderService: AddPurchaseorderService) {

    this.approvedGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.approvedGridOptions.rowSelection = 'single';
    this.approvedGridOptions.columnDefs = this.columnDefs;
    this.approvedGridOptions.rowData = [];
    // this.getApprovedData(this.pharmacyId)

    this.quotationGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.quotationGridOptions.rowSelection = 'single';
    this.quotationGridOptions.columnDefs = this.quotationcolumnDefs;
    this.quotationGridOptions.rowData = [];

    this.itemGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.itemGridOptions.rowSelection = 'single';
    this.itemGridOptions.columnDefs = this.itemColumDefs;
    this.itemGridOptions.rowData = [];

    // this.appService.getPurchaseOrderDeletedRow().subscribe(
    //   (deletedRow: ICellRendererParams) => {
    //     if (deletedRow instanceof Object) {
    //       let deleteData = this.quotationGridOptions.rowData.filter(
    //         x => x.itemId === deletedRow.data.itemId
    //       );
    //       try {
    //         this.quotationGridOptions.api.updateRowData({ remove: deleteData });
    //         let deleteIndex: number = this.findObjectIndex(this.quotationGridOptions.rowData, deleteData[0], 'itemId');
    //         let deleteRowObj: Object = this.quotationGridOptions.rowData[deleteIndex];
    //         if (deleteRowObj.hasOwnProperty('quotationItemsId') && this.showForm == false) {
    //           this.deleteQuotationItem(deleteRowObj['quotationItemsId']);
    //         }
    //         if (deleteIndex !== -1) {
    //           this.quotationGridOptions.rowData.splice(deleteIndex, 1);
    //         }
    //       } catch (e) {
    //        
    //       }
    //     }
    //   }
    // );
    this.retrieveInitialValues();


    this.approvedGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }

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
      // checkboxSelection: true
    },
    {
      headerName: 'Qtn Name',
      field: 'description',
      sortable: true,
      resizable: true,
      filter: true
    }, ,
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

  approvedGridOptions: GridOptions;
  pharmacyId: number = 1;

  showApprovedGrid: boolean = true;

  // onQuickFilterChanged($event) {

  //   this.onQuickFilterChanged["searchEvent"] = $event;
  //   // this.approvedGridOptions.api.setQuickFilter($event.target.value);
  //   this.onsearchrequestnewquotationbypharmacy($event);
  //   // if (this.approvedGridOptions.api.getDisplayedRowCount() == 0) {
  //   //   this.approvedGridOptions.api.showNoRowsOverlay();
  //   // } else {
  //   //   this.approvedGridOptions.api.hideOverlay();
  //   // }
  // }

  onsearchrequestnewquotationbypharmacy(val) {
    this.addPurchaseOrderService.searchrequestnewquotationbypharmacy(this.pharmacyId, val).subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {

            this.approvedGridOptions.rowData = res['result'];
            this.showApprovedGrid = true;
          }
        }
      }
    );
  }

  // getApprovedData(pharmacyId: number) {
  //   this.showApprovedGrid = false;
  //   this.supplierQuotationsService.getrequestpendingquotationbypharmacy(pharmacyId).subscribe(
  //     res => {
  //       if (res instanceof Object) {
  //         if (res['responseStatus']['code'] == 200) {
  //           this.approvedGridOptions.rowData = res['result'];
  //           this.showApprovedGrid = true;
  //         }
  //       }
  //     }
  //   )
  // }

  ngOnInit() {
    $(document).ready(function () {

      $('.submit-for-approval, .submit-later').click(function (e) {
        e.preventDefault();
        $('.grid-area').show();
        $('.quotation-details').hide();
      });
      $('.edit-btn').click(function (e) {
        e.preventDefault();
        $('.quotation-details').show();
        $('.grid-area').hide();
      });

    });
    this.quotationInformationForm = new FormGroup(this.quotationInformationFormValidations);

  }

  selctedQuotation;

  editGrid() {
    this.showForm = false;
    this.selctedQuotation = JSON.parse(JSON.stringify(this.approvedGridOptions.api.getSelectedRows()[0]));
    this.quotationInformationForm.setValue({
      quotationNo: this.selctedQuotation.quotationNo,
      description: this.selctedQuotation.description,
      createdBy: this.selctedQuotation.createdBy,
      quotationDt: this.selctedQuotation.quotationDt,
      quotationExpiryDt: this.selctedQuotation.quotationExpiryDt,
      remarks:this.selctedQuotation.remarks,
      quantity: '',
      
    });
    this.selectedEmployee = this.employees.find(x => x.employeeId == this.selctedQuotation.requestedby.employeeId);
  }

  checkFormDisability() {
    if (this.quotationGridOptions.rowData instanceof Array) {
      return ((this.quotationInformationForm.get('quotationNo').errors instanceof Object)
        || (this.quotationInformationForm.get('description').errors instanceof Object)
        || (this.quotationInformationForm.get('quotationDt').errors instanceof Object)
        || (this.quotationInformationForm.get('quotationExpiryDt').errors instanceof Object)
        || !(this.selectedEmployee instanceof Object)
        || this.quotationGridOptions.rowData.length === 0)
    }
  }

  quotationInformationForm: FormGroup;

  quotationInformationFormValidations = {
    quotationNo: new FormControl('', [Validators.required]),
    selectedEmployee: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    quotationDt: new FormControl('', [Validators.required]),
    quotationExpiryDt: new FormControl('', [Validators.required]),
    quantity: new FormControl('', Validators.required),
    remarks: new FormControl(''),
  };

  itemParameter: string = "";
  itemSearchTerm
  selectedItem;
  quotationGridOptions: GridOptions;

  allowAddItem: boolean
  onItemSelected() {
    $('#itemSearchModal').modal('hide');
    $('#pendingModal').modal('show');
    this.selectedItem = JSON.parse(JSON.stringify(this.itemGridOptions.api.getSelectedRows()[0]));
    //console.log(this.selectedItem)
    //console.log(this.quotationGridOptions.rowData)

    for (var i = 0; i < this.quotationGridOptions.rowData.length; i++) {

      if ((this.selectedItem['itemName'].trim() == this.quotationGridOptions.rowData[i]['item']['itemName'].trim()) && (this.selectedItem['supplierId'] != this.quotationGridOptions.rowData[i]['supplier']['supplierId'])) {
        this.allowAddItem = true
        break;
      } else if ((this.selectedItem['itemName'].trim() != this.quotationGridOptions.rowData[i]['item']['itemName'].trim()) && (this.selectedItem['supplierId'] == this.quotationGridOptions.rowData[i]['supplier']['supplierId'])) {
        this.allowAddItem = true
        break;
      }
      else {

        if (i == this.quotationGridOptions.rowData.length - 1) {
          //console.log(this.quotationGridOptions.rowData[i]['itemName'])
          this.allowAddItem = false
          this.toasterService.warning("Cannot select different suppliers", "", {
            timeOut: 3000
          })
        }
      }


    }

    if (this.allowAddItem == true || !this.quotationGridOptions.rowData.length) {
      //console.log("==================")
      this.itemGridOptions.api.setRowData([]);
      $('#itemParams').value = '';
      this.itemParameter = "itemName";
      this.addRowsToPurchaseOrderGrid();
      (document.getElementById('searchTerm') as HTMLInputElement).value = '';
    }


  }
  selectedSearchTerms
  itemSearchKey
  addQuotationItem() {
    this.itemParameter = "itemName";
    document.getElementById('itemSearchModal').classList.add("show");
    $('#pendingModal').modal('hide');
    document.getElementById('pendingModal').classList.add("hide");
    $('#itemSearchModal').modal('show');
    // document.getElementById('itemSearchModal').style.display = "block";

  }

  onCloseItemGrid() {
    // console.log("on Item grid close")
    $('#itemSearchModal').modal('hide');
    document.getElementById('itemSearchModal').classList.add("hide");
    document.getElementById('itemSearchModal').style.display = "none";
    $('#pendingModal').modal('show');
    document.getElementById('pendingModal').classList.add("show");
  }

  selectedRowItem
  addRowsToPurchaseOrderGrid() {

    this.selectedRowItem = {
      item: this.selectedItem['itemsModel'],
      quantity: this.selectedItem['quantity'],
      supplier: { name: this.selectedItem['supplierName'], supplierId: this.selectedItem['supplierId'] },
      "discountPercentage": this.selectedItem['discountPercentage'],
      "priority": this.selectedItem['priority'],
      "unitPurchasePrice": this.selectedItem['unitRate'],
      "createdUser": localStorage.getItem('id'),
      "lastUpdateUser": localStorage.getItem('id'),

    }


    const addItem = JSON.parse(JSON.stringify(this.selectedRowItem));
    this.quotationGridOptions.api.updateRowData({
      add: [addItem],
      addIndex: 0
    });
    this.quotationGridOptions.rowData = this.quotationGridOptions.rowData.concat(addItem);

    //console.log(this.quotationGridOptions.rowData)
  }

  checkItemDisability() {
    if (this.selectedItem instanceof Object && this.quotationGridOptions.rowData.length > 0) {
      return this.quotationGridOptions.rowData.map(x => x.itemsModel.itemId).some(x => x == this.selectedItem['itemsModel']['itemId']);
    }
    else return false;
  }

  suppliers = [];

  getActiveSuppliers(searchTerm: string) {
    this.addPurchaseOrderService.getSuppliersData(searchTerm).subscribe(
      activeSupplierResponse => {
        if (activeSupplierResponse instanceof Object) {
          if (activeSupplierResponse['responseStatus']['code'] === 200) {
            this.suppliers = activeSupplierResponse['result'];
          }
        }
      }
    );
  }

  selectedSupplier;
  selectedSupplierName: string = '';

  onSupplierChange(selectedSupplier: any) {
    if (selectedSupplier instanceof Object) {
      this.selectedItem = undefined;
      this.selectedSupplier = selectedSupplier;
      this.selectedSupplierName = selectedSupplier['name'];
      this.retrieveSupplierItems(selectedSupplier['supplierId']);
    }
    else {
      this.selectedSupplier = undefined;
    }
  }

  retrieveSupplierItems(supplierId: number) {
    this.showItemGrid = false;
    this.addPurchaseOrderService.retrieveSupplierItems(supplierId).subscribe(
      retrieveSupplierItemsResponse => {
        if (retrieveSupplierItemsResponse instanceof Object) {
          if (retrieveSupplierItemsResponse['responseStatus']['code'] === 200) {
            this.itemGridOptions.rowData = retrieveSupplierItemsResponse['result'];
            this.showItemGrid = true;
          }
        }
      }
    );
  }

  /**
 * Item Grid Changes
 * Start
 */

  itemGridOptions: GridOptions;
  showItemGrid: boolean = false;
  itemColumDefs: ColDef[] = [
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
    { headerName: 'Item Code', field: 'itemCode', sortable: true, resizable: true, filter: true, width: 100 },
    { headerName: 'Item Name', field: 'itemName', sortable: true, resizable: true, filter: true, width: 180 },
    { headerName: 'Formulation', field: 'formulation', sortable: true, resizable: true, filter: true, width: 100 },
    { headerName: 'Supplier', field: 'supplierName', sortable: true, resizable: true, filter: true, width: 150 },
    { headerName: 'Manufacturer', field: 'manufacturerName', sortable: true, resizable: true, filter: true, width: 120 },
    { headerName: 'Item Description', field: 'itemDescription', sortable: true, resizable: true, filter: true, width: 280 },
    { headerName: 'Tax', field: 'itemsModel.tax.categoryValue', sortable: true, resizable: true, filter: true, width: 80 },
    { headerName: 'Pack', field: 'itemsModel.pack', sortable: true, resizable: true, filter: true, width: 100 },
    { headerName: 'P.Price', field: 'unitRate', sortable: true, resizable: true, filter: true, width: 100 },
    // { headerName: 'Bonus', field: 'itemsModel.tax.categoryValue', sortable: true, resizable: true, filter: true,width:100 },
    { headerName: 'Discount', field: 'discountPercentage', sortable: true, resizable: true, filter: true, width: 100 }
  ]


  /**
   * Item Grid Changes
   * End
   */

  quotationcolumnDefs = [
    {
      headerName: "",
      field: "",
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40,
      checkboxSelection: true
    },
    {
      headerName: 'Quotation Id',
      field: 'quotation.quotationId',
      sortable: true,
      resizable: true,
      filter: true,
      hide: true
    },
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
      filter: true,
      resizable: true,
      editable: true
    },
    {
      headerName: 'Bonus',
      field: 'bonus',
      sortable: true,
      filter: true,
      resizable: true,
      editable: true
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




  deleteQuotationItem() {
    const row = this.gridApi2.getSelectedRows();

    if (row.length > 0) {
      const id = row[0].quotationItemId;

      if (id) {
        this.addPurchaseOrderService.deletequotationItem(id).subscribe(
          res => {
            if (res instanceof Object) {
              if (res['responseStatus']['code'] == 200) {
                try {
                  this.quotationGridOptions.api.updateRowData({ remove: row });
                  let deleteIndex: number = this.findObjectIndex(this.quotationGridOptions.rowData, row[0], 'quotationItemId');
                  if (deleteIndex !== -1) {
                    this.quotationGridOptions.rowData.splice(deleteIndex, 1);

                  }
                } catch (e) {
                }

              }
            }
          }
        );
      }
      else {
        const row = this.quotationGridOptions.api.getSelectedRows();

        if (row.length > 0) {
          const id = row[0].itemId;

          //  try {
          this.quotationGridOptions.api.updateRowData({ remove: row });

          let deleteIndex: number = this.findObjectIndex(this.quotationGridOptions.rowData, row[0], id);

          if (deleteIndex !== -1) {
            this.quotationGridOptions.rowData.splice(deleteIndex, 1);

          }
        }
      }
    }
  }

  employees: any[];
  selectedEmployee;

  getAllEmployees() {
    this.addPurchaseOrderService.getallemployeesdata().subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.employees = res['result'];
          }
        }
      }
    )
  }

  findObjectIndex(rowArray: Object[], rowObject: Object, key: string): number {
    return rowArray.findIndex(x => x[key] === rowObject[key]);
  }

  generateQuotationNo() {
    this.supplierQuotationsService.generateQuotationNo().subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.quotationInformationForm.patchValue({ quotationNo: res['result'] })
          }
        }
      }
    )
  }

  checkQuantity() {
    if (typeof this.quotationInformationForm.get('quantity').value === 'number') {
      return true;
    }
    else return false;
  }

  blob: Blob;
  selectedQuotationRow
  printSuppliers: any[] = []
  onPrint() {
    this.selectedQuotationRow = this.gridApi.getSelectedRows()[0]
    //console.log(this.gridApi.getSelectedRows()[0])

    if (this.selectedQuotationRow) {

      //console.log(this.selectedQuotationRow)

      let uri = { "ReportCode": 'PRINT_QUOTATION_RECEIPT', "QUOTATION_NO": this.selectedQuotationRow.quotationNo };
      var encoded = encodeURI(JSON.stringify(uri));

      let reportURI = encoded;
      this.supplierQuotationsService.downloadPdfFile(reportURI).subscribe((data: any) => {
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

  onCellClicked(params) {
    //console.log(params)

    this.onSelectionChanged()
  }
  getactiveItemsData() {
    this.showItemGrid = false;
    this.supplierQuotationsService.getactiveitemsdata().subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.itemGridOptions.rowData = res['result'];
            this.showItemGrid = true;
          }
        }
      }
    )
  }


  onSeachTermClick() {
    this.getItembysupplieritemcditemname(this.selectedSupplier['supplierId'], this.itemParameter, this.itemSearchTerm);
  }

  getItembysupplieritemcditemname(supplierId: number, itemCode: string, itemName: string) {
    this.showItemGrid = false;
    this.addPurchaseOrderService.getItembysupplieritemcditemname(supplierId, itemCode, itemName).subscribe(
      itemReponse => {
        if (itemReponse instanceof Object) {
          if (itemReponse['responseStatus']['code'] == 200) {
            this.itemGridOptions.rowData = itemReponse['result'];
            this.showItemGrid = true;
          }
        }
      }
    );
  }

  onSubmit() {

  }

  getitemsbyitemcodeoritemnameoritemdescForQuotation(itemCode: string, itemName: string) {
    this.showItemGrid = false;

    if (itemCode === 'itemCode' || itemCode === 'itemName') {
      this.addPurchaseOrderService.getitemsbyitemcodeoritemnameoritemdescForQuotation(itemCode, itemName).subscribe(
        itemReponse => {

          if (itemReponse instanceof Object) {
            if (itemReponse['responseStatus']['code'] === 200) {
              this.spinnerService.hide();
              this.itemGridOptions.rowData = itemReponse['result'];
              this.showItemGrid = true;
              if (this.itemGridOptions.rowData.length === 0) {
                this.toasterService.warning('Search Criteria', 'No Data Found', {
                  timeOut: 5000
                })
              }
            }
          }
        }
      );
    }

    if (itemCode === 'description') {
      this.addPurchaseOrderService.getitemsbyitemdescForQuotation(itemName).subscribe(
        itemReponse => {

          if (itemReponse instanceof Object) {
            if (itemReponse['responseStatus']['code'] === 200) {
              this.spinnerService.hide();

              if (itemReponse['result'].length === 0) {
                this.toasterService.warning('Search Criteria', 'No Data Found', {
                  timeOut: 5000
                })
              }
              this.itemGridOptions.rowData = itemReponse['result'];
              //  this.itemGridOptions.api.updateRowData({ add: itemReponse['result'] })

              //this.itemGridOptions.rowData = itemReponse['result'];

              this.showItemGrid = true;
            }
          }
        }
      );
    }

    if (itemCode === 'barcode') {
      if(itemName && itemName.length>13){
        var barcode=itemName.substring(3,16)
      }else{
        var barcode=itemName
      }
      this.addPurchaseOrderService.getitemsbyitembarcodeForQuotation(barcode).subscribe(
        itemReponse => {

          if (itemReponse instanceof Object) {
            if (itemReponse['responseStatus']['code'] === 200) {
              this.spinnerService.hide();

              if (itemReponse['result'].length === 0) {
                this.toasterService.warning('Search Criteria', 'No Data Found', {
                  timeOut: 5000
                })
              }
              this.itemGridOptions.rowData = itemReponse['result'];
              //  this.itemGridOptions.api.updateRowData({ add: itemReponse['result'] })

              //this.itemGridOptions.rowData = itemReponse['result'];

              this.showItemGrid = true;
            }
          }
        },error=>{
          this.spinnerService.hide()
        }
      );
    }
  }

  onEnter(){
    this.onSeachItemTermClick();
  }

  onSeachItemTermClick() {
    this.spinnerService.show();
    this.getitemsbyitemcodeoritemnameoritemdescForQuotation(this.itemParameter, this.itemSearchTerm);
  }

  private gridApi;
  private gridColumnApi;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  private gridApi2;
  private gridColumnApi2;

  onGridReady2(params) {
    this.gridApi2 = params.api;
    this.gridColumnApi2 = params.columnApi;
  }


  showForm: boolean = true;
  createdBy: any;

  retrieveInitialValues() {

    this.createdBy = localStorage.user;
    this.itemParameter = "";
    this.itemSearchTerm = "";
    this.selectedEmployee = undefined;
    this.selectedSupplier = undefined;
    this.selectedItem = undefined;
    this.selectedSupplierName = '';
    this.generateQuotationNo();
    this.getActiveSuppliers('');
    this.getAllEmployees();
    this.showItemGrid = false;
    this.loadRowData([], this.itemGridOptions);
    this.showItemGrid = true;
    this.showGrid = false;
    this.loadRowData([], this.approvedGridOptions);
    this.showGrid = true;

    this.addPurchaseOrderService.getrequestnewquotationbypharmacy(this.pharmacyId).subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {

            const data = res;
            if ((data['result']).length > 0) {
              for (var i = 0; i < (data['result']).length; i++) {
                if (data['result'][i]['quotationItems']) {
                  //  data['result'][i]['status'] = data['result'][i]['quotationItems'][0]['quotationItemStatus']['status'] != null ? data['result'][i]['quotationItems'][0]['quotationItemStatus']['status'] : null;
                  // data['result'][i]['itemName'] = data['result'][i]['quotationItems'][0]['item']['itemName'];
                  //  data['result'][i]['itemId'] = data['result'][i]['quotationItems'][0]['item']['itemId'];
                }
              }
              this.approvedGridOptions.api.updateRowData({ add: data['result'] });

            } else {
              this.toasterService.warning('No Data Found', '', {
                timeOut: 5000
              })
            }
          }
        }
      }
    );

  }

  dataToSend: any;

  requestedBy: any;
  modifiedDesc: any;

  onQuotDesc(event) {

    this.modifiedDesc = event['target']['value']
  }


  setData(data) {

    this.dataToSend = data;


    // this.addPurchaseOrderService.getQuotationItemsBasedOnQuotationId(data.quotationId).subscribe(dataRes => {

    // if (dataRes instanceof Object) {
    //  if (dataRes['responseStatus']['code'] === 200) {

    // this.requestedBy=
    $('#requestQuotNumber').val(data.quotationNo);
    data.requestedby ? $('#requestQuotRequested').val(data.requestedName) : $('#requestQuotRequested').val(data.requestedName);
    data.requestedby ? $('#requestQuotCreated').val(data.createdName) : $('#requestQuotCreated').val(data.createdName);
    $('#requestQuotDated').val(data.quotationDt);
    $('#requestQuotExpiry').val(data.quotationExpiryDt);
    $('#requestQuotDesc').val(data.description);
    $('#remarks').val(data.remarks);

    // this.approvedGridOptions.api.updateRowData({ add: dataRes['result'] });
    //this.quotationGridOptions.api = dataRes['result'];
    // this.quotationGridOptions.api.setRowData(
    /* [{
      itemCode: dataRes['result']['item']['itemCode'],
      quotationId: data.quotationId,
      itemName: data.quotationItems ? data.quotationItems[0].item.itemName : '',
      itemDescription: data.description,
      name: data.quotationItems ? data.quotationItems[0].supplier.name : '',
      quantity: data.quotationItems ? data.quotationItems[0].quantity : '',
      manuf: data.quotationItems ? data.quotationItems[0].item.manufacturer.name : '',
      formulation: data.quotationItems ? data.quotationItems[0].item.itemForm.form : ''
    }] */
    //);
    let gridData = data

    for (var i = 0; i < data['quotationItems'].length; i++) {
      if (data['quotationItems'][i] != undefined && data['quotationItems'][i] != null) {
        gridData['quotationItems'][i]['itemCode'] = data['quotationItems'][i] != null ? data['quotationItems'][i]['item'] != null ? data['quotationItems'][i]['item']['itemCode'] : null : null;
        //  gridData['quotationItems'][i]['itemCode'] = data['quotationItems'][i] != null ? data['quotationItems'][i]['item'] != null ? data['quotationItems'][i]['item']['itemCode'] : null : null;
      }
    }

    this.loadRowData(data['quotationItems'], this.quotationGridOptions)
    setTimeout(() => {
      $('#pendingModal').modal('show');
      //   this.dataToSend = data;

    }, 100);
    this.gridApi.forEachNodeAfterFilter(function (node) {
      node.setSelected(false);
    });




  }

  onSelectionChanged() {

    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows[0] !== undefined) {
      this.setData(selectedRows[0]);
    }
  }

  en_dis = false;

  onSelectionChanged2() {
    var selectedRows = this.gridApi2.getSelectedRows();
    if (selectedRows.length > 0) {
      this.en_dis = true;
    } else {
      this.en_dis = false;
    }
  }

  onFilterTextBoxChanged() {

    this.onsearchrequestnewquotationbypharmacy($('#filter-text-box').val());
    this.gridApi.setQuickFilter($('#filter-text-box').val());
  }

  showGrid: boolean = true;

  loadRowData(inputRowData: Object[], gridoptions: GridOptions) {

    try {
      gridoptions.rowData = inputRowData;
      gridoptions.api.setRowData(gridoptions.rowData);
    } catch (e) {
      gridoptions.rowData = inputRowData;
    }
  }




  approval() {
    let sendData = {};

    this.quotationInformationForm.get('description').setErrors({ 'incorrect': true });


    this.addPurchaseOrderService.deleteQuotationItemsByQuotationId(this.dataToSend['quotationId']).subscribe(res => {

      let quotationItemArray = [];

      this.quotationGridOptions.api.forEachNode(node => {

        // console.log(node)
        if (node['data'] != null && node['data'] != undefined) {
          quotationItemArray.push({
            "supplier": { 'supplierId': node['data']['supplier']['supplierId'] },
            "item": { 'itemId': node['data']['item']['itemId'] },

            "tax": { 'taxCategoryId': node['data']['item']['tax']['taxCategoryId'] },
            "discountPercentage": node['data']['discountPercentage'],
            "priority": node['data']['priority'],
            "quantity": node['data']['quantity'],
            "bonus": node['data']['bonus'] != null && node['data']['bonus'] != undefined ? node['data']['bonus'] : 0,
            "unitPurchasePrice": node['data']['unitPurchasePrice'],
            "createdUser": node['data']['createdUser'],
            "lastUpdateUser": node['data']['lastUpdateUser']
          }
          );
        }
      });

      sendData['quotationItems'] = quotationItemArray;


      sendData['requestedId'] = this.dataToSend.requestedby ? this.dataToSend.requestedby.employeeId : this.dataToSend.requestedId;
      if (this.dataToSend.pharmacyModel) {
        sendData['pharmacyModel'] = { "pharmacyId": this.dataToSend.pharmacyModel ? this.dataToSend.pharmacyModel.pharmacyId : '' };
      }

      //sendData['supplier'] = { 'supplierId': this.dataToSend.quotationItems ? this.dataToSend.quotationItems[0].supplier.supplierId : '' };
      sendData['description'] = this.modifiedDesc != undefined && this.modifiedDesc != null ? this.modifiedDesc : $('#requestQuotDesc').val();
      sendData['remarks']=$('#remarks').val();
      sendData['quotationDt'] = this.dataToSend.quotationDt;
      sendData['quotationExpiryDt'] = this.dataToSend.quotationExpiryDt;
      sendData['quotationNo'] = this.dataToSend.quotationNo;
      sendData['requestedby'] = this.dataToSend['requestedby']
      sendData['createdBy'] = Number(quotationItemArray[0]['createdUser'])
      sendData['createdUser'] = Number(quotationItemArray[0]['createdUser'])
      sendData['quotationId'] = this.dataToSend.quotationId;
      sendData['lastUpdateUser'] = localStorage.getItem('id')
      sendData['modifiedDt'] = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      sendData['approvedBy'] = localStorage.getItem('id')
      sendData['approvedDt'] = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

      for (var i = 0; i < sendData['quotationItems'].length; i++) {

        if (sendData['quotationItems'][i]['quantity'] != null && sendData['quotationItems'][i]['quantity'] != undefined &&
          sendData['quotationItems'][i]['quantity'] == 0 && sendData['quotationItems'][i]['quantity'] == "" || sendData['quotationItems'][i]['quantity'] == null) {

          this.spinnerService.hide();
          this.toasterService.error('Please Enter The Qty', 'Error Occured', {
            timeOut: 5000
          });
          return;
        }
      }


      this.addPurchaseOrderService.approvalquotation(sendData).subscribe(
        res => {
          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              this.retrieveInitialValues();
              this.quotationInformationForm.reset();
              $('#pendingModal').modal('hide');
              this.toasterService.success(res['message'], 'Success', {
                timeOut: 3000
              });
            }
          }
        }
      );
    })


  }


  onCancel() {
    this.quotationInformationForm.reset();
    this.retrieveInitialValues();
    this.showForm = true;
  }

  later() {

    let sendData = {};



    this.addPurchaseOrderService.deleteQuotationItemsByQuotationId(this.dataToSend['quotationId']).subscribe(res => {

      let quotationItemArray = [];

      this.quotationGridOptions.api.forEachNode(node => {

        // console.log(node)
        if (node['data'] != null && node['data'] != undefined) {
          quotationItemArray.push({
            "supplier": { 'supplierId': node['data']['supplier']['supplierId'] },
            "item": { 'itemId': node['data']['item']['itemId'] },

            "tax": { 'taxCategoryId': node['data']['item']['tax']['taxCategoryId'] },
            "discountPercentage": node['data']['discountPercentage'],
            "priority": node['data']['priority'],
            "quantity": node['data']['quantity'],
            "bonus": node['data']['bonus']!=null && node['data']['bonus']!=undefined ? node['data']['bonus']:0,
            "unitPurchasePrice": node['data']['unitPurchasePrice'],
            "createdUser": node['data']['createdUser'],
            "lastUpdateUser": node['data']['lastUpdateUser']
          }
          );
        }
      });

      sendData['quotationItems'] = quotationItemArray;


      sendData['requestedId'] = this.dataToSend.requestedby ? this.dataToSend.requestedby.employeeId : this.dataToSend.requestedId;
      if (this.dataToSend.pharmacyModel) {
        sendData['pharmacyModel'] = { "pharmacyId": this.dataToSend.pharmacyModel ? this.dataToSend.pharmacyModel.pharmacyId : '' };
      }

      //sendData['supplier'] = { 'supplierId': this.dataToSend.quotationItems ? this.dataToSend.quotationItems[0].supplier.supplierId : '' };
      sendData['description'] = this.modifiedDesc != undefined && this.modifiedDesc != null ? this.modifiedDesc : $('#requestQuotDesc').val();
      sendData['quotationDt'] = this.dataToSend.quotationDt;
      sendData['remarks']=$('#remarks').val();
      sendData['quotationExpiryDt'] = this.dataToSend.quotationExpiryDt;
      sendData['quotationNo'] = this.dataToSend.quotationNo;
      sendData['requestedby'] = this.dataToSend['requestedby']
      sendData['createdBy'] = Number(quotationItemArray[0]['createdUser'])
      sendData['createdUser'] = Number(quotationItemArray[0]['createdUser'])
      sendData['quotationId'] = this.dataToSend.quotationId;
      sendData['lastUpdateUser'] = localStorage.getItem('id')
      sendData['modifiedDt'] = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

      for (var i = 0; i < sendData['quotationItems'].length; i++) {

        if (sendData['quotationItems'][i]['quantity'] != null && sendData['quotationItems'][i]['quantity'] != undefined &&
          sendData['quotationItems'][i]['quantity'] == 0 && sendData['quotationItems'][i]['quantity'] == "" || sendData['quotationItems'][i]['quantity'] == null) {

          this.spinnerService.hide();
          this.toasterService.error('Please Enter The Qty', 'Error Occured', {
            timeOut: 5000
          });
          return;
        }
      }


      this.addPurchaseOrderService.laterquotation(sendData).subscribe(
        res => {
          if (res instanceof Object) {
            if (res['responseStatus']['code'] == 200) {
              this.retrieveInitialValues();
              this.quotationInformationForm.reset();
              $('#pendingModal').modal('hide');
              this.toasterService.success(res['message'], 'Success', {
                timeOut: 3000
              });

            }
          }
        }
      );
    })


  }
  rowData: any;

  onQuotationSearch(event) {

    this.addPurchaseOrderService.PendingRequestQuotationSearches(event['target']['value']).subscribe(qtnRes => {

      if (qtnRes instanceof Object) {
        if (qtnRes['responseStatus']['code'] == 200) {

          const data = qtnRes;
          if ((data['result']).length > 0) {

            this.rowData = data['result']
          } else {
            this.toasterService.warning('No Data Found', 'Search Criteria', {
              timeOut: 5000
            })
          }
        }
      }
    })
  }

  onMouseEnter(){
    this.itemSearchTerm=undefined
  }

}
