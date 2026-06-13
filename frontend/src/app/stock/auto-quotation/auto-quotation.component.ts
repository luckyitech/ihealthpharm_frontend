import {
  Component,
  ElementRef,
  OnInit
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GridOptions, ColDef, ICellRendererParams, RowNode } from 'ag-grid-community';
import { SupplierQuotationsService } from '../supplier-quotations/supplier-quotations.service';
import { AddPurchaseorderService } from '../purchase-order/add-purchaseorder.service';
import { AppService } from 'src/app/core/app.service';
import { ToastrService } from 'ngx-toastr';
import $ from 'jquery';
import { Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { forkJoin } from 'rxjs';
import { ViewChild } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-auto-quotation',
  templateUrl: './auto-quotation.component.html',
  styleUrls: ['./auto-quotation.component.scss'],
  providers: [SupplierQuotationsService, AddPurchaseorderService]
})
export class AutoQuotationComponent implements OnInit {


  constructor(private supplierQuotationsService: SupplierQuotationsService, private toasterService: ToastrService,
    private appService: AppService, private datePipe: DatePipe,
    private spinnerService: Ng4LoadingSpinnerService, private addPurchaseOrderService: AddPurchaseorderService, private router: Router) {
    this.quotationGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.quotationGridOptions.rowSelection = 'single';
    this.quotationGridOptions.columnDefs = this.columnDefs;
    this.quotationGridOptions.rowData = [];

    this.itemGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };

    this.itemGridOptions.rowSelection = 'multiple';

    this.itemGridOptions.columnDefs = this.itemColumDefs;
    this.itemGridOptions.rowData = [];

    this.appService.getPurchaseOrderDeletedRow().subscribe(
      (deletedRow: ICellRendererParams) => {
        if (deletedRow instanceof Object) {
          let deleteData = this.quotationGridOptions.rowData.filter(
            x => x.itemId === deletedRow.data.itemId
          );
          try {
            this.quotationGridOptions.api.updateRowData({ remove: deleteData });
            let deleteIndex: number = this.findObjectIndex(this.quotationGridOptions.rowData, deleteData[0], 'itemId');
            if (deleteIndex !== -1) {
              this.quotationGridOptions.rowData.splice(deleteIndex, 1);
            }
          } catch (e) {

          }
        }
      }
    );

    // this.generateQuotationNo(this.pharmacyId);
    this.retrieveInitialValues();
    this.itemGridOptions.isRowSelectable = function (rowNode) {
      return rowNode.data ? rowNode.data.itemsModel.tax != null && rowNode.data.itemsModel.tax != undefined : false;
    };
  }

  quotationInformationForm: FormGroup;

  quotationInformationFormValidations = {
    quotationNo: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    quotationDt: new FormControl('', [Validators.required]),
    quotationExpiryDt: new FormControl('', [Validators.required]),
    quantity: new FormControl('', Validators.required),
    created: new FormControl('', Validators.required),
    reqBy: new FormControl('', Validators.required),
    remarks: new FormControl(''),
  };

  createdBy;
  gridApi;

  // itemParameter: string = "itemName";
  itemParameter = { name: "Item Name", value: "itemName" };
  searchPerameter = [{ name: 'Item Code', value: 'itemCode' },
  { name: 'Item Name', value: 'itemName' },
  { name: 'Description', value: 'description' },
  { name: 'Barcode', value: 'barcode' },]
  itemSearchTerm: string = "";
  selectedItem;
  quotationGridOptions: GridOptions;
  private getRowNodeId;

  allowAddItem: boolean
  checkedRow
  rowIndex
  onSelectionChanged(params) {
    //console.log(this.itemGridOptions.rowData)
    var selectedRow = this.checkedRow.data
    if (this.checkedRow.node.selected) {
      if (this.itemGridOptions.api.getSelectedRows().length > 1) {
        for (var i = 0; i < this.itemGridOptions.api.getSelectedRows().length; i++) {

          if ((selectedRow['itemName'].trim() == this.itemGridOptions.api.getSelectedRows()[i]['itemName'].trim()) && (selectedRow['supplierId'] == this.itemGridOptions.api.getSelectedRows()[i]['supplierId'])) {
            continue
          } else {

            // console.log(selectedRow)
            //console.log(this.itemGridOptions.api.getSelectedRows()[i])
            /*if ((selectedRow['itemName'].trim() == this.itemGridOptions.api.getSelectedRows()[i]['itemName'].trim()) && (selectedRow['supplierId'] != this.itemGridOptions.api.getSelectedRows()[i]['supplierId'])) {
              this.allowAddItem = true
              break;


            } */
            if ((selectedRow['itemName'].trim() != this.itemGridOptions.api.getSelectedRows()[i]['itemName'].trim()) && (selectedRow['supplierId'] == this.itemGridOptions.api.getSelectedRows()[i]['supplierId'])) {
              this.allowAddItem = true
              break;
            }
            else {

              this.allowAddItem = false
              this.checkedRow.node.setSelected(false)
              this.toasterService.warning("Cannot select different suppliers", "", {
                timeOut: 3000
              })

              break;

            }

          }
        }
      }
    }
  }

  onRowSelected(event) {
    // console.log(event)
    this.checkedRow = event
    this.rowIndex = event.rowIndex
  }
  onItemSelected() {

    this.selectedItem = this.itemGridOptions.api.getSelectedRows();
    //console.log(this.selectedItem)
    //console.log(this.quotationGridOptions.rowData)
    // if (this.selectedItem['autoQuotStatus'] == 'N') {
    //   this.toasterService.warning("Item Already Added to Grid", "", {
    //     timeOut: 5000
    //   })

    //   return;
    // }

    this.itemGridOptions.api.setRowData([]);
    $('#itemParams').value = '';
    this.itemParameter = { name: "Item Name", value: "itemName" };
    this.addRowsToPurchaseOrderGrid();
    (document.getElementById('searchTerm') as HTMLInputElement).value = '';
    $('#itemSearchModal').modal('hide');

  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  markAutoQuotationItemInActive(itemSelected, flag) {

    this.addPurchaseOrderService.markInactiveAutoQuotItem(itemSelected['itemId'], itemSelected['supplierId'], flag).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {

        }
      }
    }, error => {
      this.toasterService.error("Error Occured Plz Contact Admin", " ", {
        timeOut: 3000

      })
    })
  }

  @ViewChild('focusInput', { static: false }) focusInput: ElementRef;

  @HostListener('focusout', ['$event']) public onListenerTriggered(event: any): void {

    this.setFocusToInput();

  }

  setFocusToInput() {

    setTimeout(() => this.focusInput.nativeElement.focus(), 50);


    //   // this.focusInput.nativeElement.focus();

  }

  noSelection() {
    $('#searchTerm').value = '';
    $('#itemParams').value = '';
    this.itemParameter = { name: "Item Name", value: "itemName" };
    this.itemGridOptions.api.setRowData([]);
    (document.getElementById('searchTerm') as HTMLInputElement).value = '';
  }


  addRowsToPurchaseOrderGrid() {
    for (var i = 0; i < this.selectedItem.length; i++) {
      this.selectedSupplierName = this.selectedItem[i].supplierName;
      const addItem = JSON.parse(JSON.stringify(this.selectedItem[i]));
      this.quotationGridOptions.api.updateRowData({
        add: [addItem],
        addIndex: 1
      });
      this.quotationGridOptions.rowData = this.quotationGridOptions.rowData.concat(addItem);
      this.markAutoQuotationItemInActive(this.selectedItem[i], 'N');
    }

  }

  checkItemDisability() {
    if (this.selectedItem instanceof Object && this.quotationGridOptions.rowData.length > 0) {
      return this.quotationGridOptions.rowData.map(x => x.itemId).some(x => x == this.selectedItem['itemId']);
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

  suppressEnterBarCode(params) {
    let KEY_ENTER = 13;
    var event = params.event;
    var key = event.which;
    var suppress = key === KEY_ENTER;

    return false;
  }


  itemGridOptions: GridOptions;
  showItemGrid: boolean = false;
  itemColumDefs: ColDef[] = [
    {
      headerName: "",
      field: "",
      checkboxSelection: function (params) {
        // console.log(params.data)
        if (params.data.autoQuotStatus == 'Y') {
          return true
        } else {
          return false;
        }
      },
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
    { headerName: 'Bonus', field: 'bonus', sortable: true, resizable: true, filter: true, width: 100 },
    { headerName: 'Discount', field: 'discountPercentage', sortable: true, resizable: true, filter: true, width: 100 },

  ]

  /**
   * Item Grid Changes
   * End
   */

  columnDefs = [
    {
      headerName: "",
      field: "",
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40,
      checkboxSelection: true,
      cellStyle: { 'border': '1px solid #BDC3C7' }
      // cellRendererFramework: CheckBoxComponent
    },
    {
      headerName: 'QR/Barcode',
      field: 'barcode',
      sortable: true,
      resizable: true,
      filter: true,
      cellStyle: { 'border': '1px solid #BDC3C7' },
      singleClickEdit: true,
      suppressKeyboardEvent: this.suppressEnterBarCode.bind(this),
    },
    {
      headerName: 'Item Code',
      field: 'itemCode',
      sortable: true,
      resizable: true,
      filter: true,
      cellStyle: { 'border': '1px solid #BDC3C7' },
      singleClickEdit: true,
      suppressKeyboardEvent: this.suppressEnterItemCode.bind(this),
    },
    {
      headerName: 'Item Name',
      field: 'itemName',
      sortable: true,
      resizable: true,
      filter: true,
      cellStyle: { 'border': '1px solid #BDC3C7' },
      singleClickEdit: true,
      suppressKeyboardEvent: this.suppressEnterItemName.bind(this)
    },
    {
      headerName: 'Formulation',
      field: 'formulation',
      sortable: true,
      resizable: true,
      filter: true,
      cellStyle: { 'border': '1px solid #BDC3C7' }
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      cellStyle: { 'border': '1px solid #BDC3C7' },
      valueGetter: function (params) {
        // console.log(params)
        // console.log(Object.keys(params.data))
        if (Object.keys(params.data).length > 0) {
          //console.log(params.data.itemsModel.pack)
          if (params.data.itemsModel.pack > 1) {
            // console.log("============")
            let pack = params.data.itemsModel.pack
            let packSizeCal = parseInt((params.data.quantity / pack).toString());

            if (packSizeCal * pack == params.data.quantity) {
              return packSizeCal;
            } else if ((params.data.quantity - packSizeCal * pack) >= (pack / 2)) {
              return packSizeCal + 1;
            } else {
              return packSizeCal;
            }
          } else {
            return params.data.quantity
          }
        }
      }
    },
    {
      headerName: 'Pack',
      field: 'itemsModel.pack',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      cellStyle: { 'border': '1px solid #BDC3C7' }
    },

    {
      headerName: 'Bonus',
      field: 'bonus',
      sortable: true,
      resizable: true,
      filter: true,
      editable: true,
      cellStyle: { 'border': '1px solid #BDC3C7' }
    },
    {
      headerName: 'Supplier',
      field: 'supplierName',
      sortable: true,
      resizable: true,
      filter: true,
      cellStyle: { 'border': '1px solid #BDC3C7' }
    },
    {
      headerName: 'Manufacturer',
      field: 'manufacturerName',
      sortable: true,
      resizable: true,
      filter: true,
      cellStyle: { 'border': '1px solid #BDC3C7' }
    },
    {
      headerName: 'Description',
      field: 'itemDescription',
      sortable: true,
      resizable: true,
      filter: true,
      cellStyle: { 'border': '1px solid #BDC3C7' }
    },
    // {
    //   headerName: 'Pack',
    //   field: 'itemsModel.pack',
    //   sortable: true,
    //   resizable: true,
    //   filter: true,
    //   cellStyle: { 'border': '1px solid #BDC3C7' }
    // }
  ];

  HostListener(params) {
    this.gridApi = params.api;
  }


  employees: any[];
  selectedEmployee;

  selectedSearchTerms;
  itemSearchKey;
  suppressEnterItemCode(params) {
    let KEY_ENTER = 13;
    var event = params.event;
    var key = event.which;
    var suppress = key === KEY_ENTER;
    // this.isItemSearchEnabled = suppress;
    if (suppress) {
      this.selectedSearchTerms = "itemCode";
      if (params['event']['target']['value'] != '') {
        // this.stockGridOptions.api.setRowData([]);
        // this.stockRowData = [];
        this.itemSearchKey = params['event']['target']['value'];
        this.onSeachTermClick();
        document.getElementById('itemSearchModal').classList.add("show");
        document.getElementById('itemSearchModal').style.display = "block";
      }
    }
    return false;
  }

  suppressEnterItemName(params) {
    let KEY_ENTER = 13;
    var event = params.event;
    var key = event.which;
    var suppress = key === KEY_ENTER;
    // this.isItemSearchEnabled = suppress;
    // if (suppress) {

    //   this.selectedSearchTerms = "Item Name";
    //   if (params['event']['target']['value'] != '') {
    //     this.stockGridOptions.api.setRowData([]);
    //     this.stockRowData = [];
    //     this.itemSearchKey = params['event']['target']['value'];
    //     this.searchItemByCodeInStock();
    //     document.getElementById('itemSearchModal').classList.add("show");
    //     document.getElementById('itemSearchModal').style.display = "block";
    //   }
    // }
    return false;
  }


  // onAutoQuotCheck(event) {
  //   console.log(event)
  //   if (event.target.checked) {
  //     this.autoQuotCheck = true
  //     $('#itemAutoQuotSearchModal').modal('show');
  //     this.fetchAutoQuotItems()
  //   } else {
  //     this.autoQuotCheck = false
  //   }


  // }

  getAllEmployees() {
    this.addPurchaseOrderService.getallemployeesdata().subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.employees = res['result'];
            this.selectedEmployee = this.employees.filter(data => data.employeeId == localStorage.getItem('id'))[0];
            this.setValues();

          }
        }
      }
    )
  }

  findObjectIndex(rowArray: Object[], rowObject: Object, key: string): number {

    return rowArray.findIndex(x => x[key] === rowObject[key]);
  }

  //pharmacyId: number = 1;

  generateQuotationNo() {
    this.supplierQuotationsService.generateQuotationNo().subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.quotationInformationForm.patchValue({ quotationNo: res['result'] });
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

  ngOnInit() {
    this.quotationInformationForm = new FormGroup(this.quotationInformationFormValidations);
    this.quotationGridOptions.rowData = [{}];

  }

  setValues() {
    this.quotationInformationForm.get('description').setValue('auto quotation')
    let startDate = new Date()
    let expiry = startDate.setDate(startDate.getDate() + 7)
    this.quotationInformationForm.get('quotationExpiryDt').setValue(this.datePipe.transform(expiry, 'yyyy-MM-dd'))

  }

  // autoFetchQuotItemsArray: any[] = []
  // fetchAutoQuotItems() {
  //   if (this.autoQuotCheck) {
  //     this.showItemGrid = false;
  //     this.spinnerService.show()
  //     this.addPurchaseOrderService.getAutoQuotationItems(this.itemParameter, this.itemSearchTerm).subscribe(res => {
  //       if (res instanceof Object) {
  //         if (res['responseStatus']['code'] == 200) {

  //           this.autoFetchQuotItemsArray = res['result']
  //           console.log(this.quotationGridOptions.rowData)
  //           if (this.quotationGridOptions.rowData.length > 1) {
  //             for (var i = 1; i < this.quotationGridOptions.rowData.length; i++) {
  //               for (var k = 0; k < this.autoFetchQuotItemsArray.length; k++) {
  //                 if (this.quotationGridOptions.rowData[i]) {
  //                   if (this.autoFetchQuotItemsArray[k]['itemId'] == this.quotationGridOptions.rowData[i]['itemId'] &&
  //                     this.autoFetchQuotItemsArray[k]['supplierName'] == this.quotationGridOptions.rowData[i]['supplierName']) {
  //                     this.autoFetchQuotItemsArray.splice(k, 1)
  //                     break;
  //                   }
  //                 }
  //               }
  //             }
  //           }


  //           this.spinnerService.hide()
  //           this.itemAutoQuotGridOptions.rowData = this.autoFetchQuotItemsArray;

  //           this.showItemGrid = true;
  //           if (this.itemAutoQuotGridOptions.rowData.length === 0) {
  //             this.toasterService.warning('Search Criteria', 'No Data Found', {
  //               timeOut: 5000
  //             })
  //           }

  //         }
  //       }
  //     }, error => {
  //       this.spinnerService.hide()
  //     })
  //   }
  // }
  onSeachTermClick() {
    this.spinnerService.show();
    this.getitemsbyitemcodeoritemnameoritemdescForQuotation(this.itemParameter['value'], this.itemSearchTerm);
  }

  onCellClicked(event) {
    //console.log(event)
    if (event.colDef.field == "itemCode") {
      this.itemParameter = { name: "Item Code", value: "itemCode" };
    }
    else if (event.colDef.field == "itemName") {
      this.itemParameter = { name: "Item Name", value: "itemName" };
    }

  }

  onSeachTermClick2() {

    this.showItemGrid = false;
    this.addPurchaseOrderService.getitemsbyitemcodeoritemnameoritemdescForQuotation(this.selectedSearchTerms, this.itemSearchKey).subscribe(
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



  getitemsbyitemcodeoritemnameoritemdescForQuotation(itemCode: string, itemName: string) {
    this.showItemGrid = false;

    if (itemCode === 'itemCode' || itemCode === 'itemName') {
      this.addPurchaseOrderService.getAutoQuotationItems(itemCode, itemName).subscribe(
        itemReponse => {

          if (itemReponse instanceof Object) {
            if (itemReponse['responseStatus']['code'] === 200) {
              // console.log(itemReponse['result'])
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
      // if (itemName && itemName.length > 13) {
      //   var barcode = itemName.substring(3, 16)
      // } else {
      //   var barcode = itemName
      // }
      this.addPurchaseOrderService.getAutoQuotationItems(itemCode, itemName).subscribe(
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
        }, error => {
          this.spinnerService.hide()
        }
      );
    }
  }

  onSubmit() {

  }


  deleteQuotationItem() {

    const row = this.quotationGridOptions.api.getSelectedRows();

    if (row.length > 0) {
      const id = row[0].itemId;

      //  try {
      this.quotationGridOptions.api.updateRowData({ remove: row });

      let deleteIndex: number = this.findObjectIndex(this.quotationGridOptions.rowData, row[0], id);

      if (deleteIndex !== -1) {
        this.quotationGridOptions.rowData.splice(deleteIndex, 1);

      }

      this.markAutoQuotationItemInActive(row[0], 'Y')
      /*   this.addPurchaseOrderService.deletequotationItem(id).subscribe(
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
        ); */

    }
  }

  /* deleteRow() {
    const row = this.quotationGridOptions.api.getSelectedRows();
    try {
      this.quotationGridOptions.api.updateRowData({ remove: row });
      let deleteIndex: number = this.findObjectIndex(this.quotationGridOptions.rowData, row[0], 'itemId');
      if (deleteIndex !== -1) {
        this.quotationGridOptions.rowData.splice(deleteIndex, 1);
      }
    } catch (e) {

    }
  } */

  onRequestEmpSelected(event) {

    this.selectedEmployee = event
  }

  ngOnDestroy() {

    if (!this.submitClicked) {
      //console.log(this.quotationGridOptions);
      for (var i = 0; i < this.quotationGridOptions.rowData.length; i++) {

        if (this.quotationGridOptions.rowData[i]) {
          if (this.quotationGridOptions.rowData[i]['itemId']) {
            this.setAutoQuotationStatus.push(this.addPurchaseOrderService.markInactiveAutoQuotItem(this.quotationGridOptions.rowData[i]['itemId'], this.quotationGridOptions.rowData[i]['supplierId'], 'Y'));
          }
        }
      }


      forkJoin(this.setAutoQuotationStatus).subscribe(res => {

      })

    }
  }


  formatPayload(payload, data) {

    // payload['createdBy'] = { employeeId: this.selectedEmployee.employeeId };
    delete payload['quantity'];
    payload['createdId'] = this.createdBy.employeeId;     //check
    payload['createdUser'] = localStorage.getItem('id');
    // payload['createdUser'] = this.quotationInformationForm.get('created').value.firstName;  //check
    payload['requestedId'] = this.selectedEmployee.employeeId;
    payload['lastUpdateUser'] = localStorage.getItem('id')
    payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') }
    payload['requestedby'] = Number(this.selectedEmployee['employeeId'])
    payload['createdBy'] = Number(localStorage.getItem('id'))
    payload['createdId'] = localStorage.getItem('id');

    let quotationItemArray = [];
    let qtyArray = [];
    this.quotationGridOptions.api.forEachNode(node => {
     
      //   if (node['data']['quantity'] != null && node['data']['quantity'] != undefined && node['data']['quantity'] != '') {
      if (node['data']['itemSupplierId'] != null && node['data']['itemSupplierId'] != undefined) {
       
        if (node.data.itemsModel.pack > 1) {
          // console.log("============")
          let pack = node.data.itemsModel.pack
          let packSizeCal = parseInt((node.data.quantity / pack).toString());
  
          if (packSizeCal * pack == node.data.quantity) {
            node.data.quantity = packSizeCal;
          } else if ((node.data.quantity - packSizeCal * pack) >= (pack / 2)) {
            node.data.quantity = packSizeCal + 1;
          } else {
            node.data.quantity = packSizeCal;
          }
        } else {
  
        }
        console.log(node)
        quotationItemArray.push({
          "supplier": { 'supplierId': node['data']['supplierId'] },
          "item": { 'itemId': node['data']['itemId'] },

          "tax": { 'taxCategoryId': node['data']['itemsModel']['tax']['taxCategoryId'] },
          "discountPercentage": node['data']['discountPercentage'],
          "priority": node['data']['supplierPriority'],

          "quantity": node['data']['quantity'],
          "bonus": node['data']['bonus'] != null && node['data']['bonus'] != undefined && node['data']['bonus'] != '' ? node['data']['bonus'] : 0,
          "unitPurchasePrice": node['data']['unitRate'],
          "createdUser": localStorage.getItem('id'),
          "lastUpdateUser": localStorage.getItem('id'),

        });


      }
      // }
      /* else {
        quotationItemArray = [];

      } */



    })


    payload['quotationItems'] = quotationItemArray;
    return payload;
  }

  laterFormatPayload(payload, data) {

    // payload['createdBy'] = { employeeId: this.selectedEmployee.employeeId };
    delete payload['quantity'];
    payload['createdId'] = this.createdBy.employeeId;     //check
    payload['createdUser'] = localStorage.getItem('id');
    // payload['createdUser'] = this.quotationInformationForm.get('created').value.firstName;  //check
    payload['lastUpdateUser'] = localStorage.getItem('id')
    payload['requestedId'] = this.selectedEmployee.employeeId;
    payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
    payload['requestedby'] = Number(this.selectedEmployee['employeeId'])
    payload['createdBy'] = Number(localStorage.getItem('id'))
    payload['createdId'] = localStorage.getItem('id');
    let quotationItemArray = [];
    // this.quotationGridOptions.rowData.forEach(
    // dataRow => {
    /*    let quotationDataRow = JSON.parse(JSON.stringify(data));
       if (quotationDataRow['itemId'] !== undefined && quotationDataRow['itemName'] !== undefined) {
         quotationDataRow['supplier'] = { 'supplierId': quotationDataRow['supplierId'] };
         quotationDataRow['item'] = { 'itemId': quotationDataRow['itemId'] };
         // quotationDataRow['createdUser'] = this.quotationInformationForm.get('created').value.firstName;
         quotationDataRow['createdUser'] = localStorage.getItem('user');
         delete quotationDataRow['itemsModel'];
         delete quotationDataRow['supplierModel'];
         delete quotationDataRow['itemCode'];
         delete quotationDataRow['itemDescription'];
         delete quotationDataRow['itemId'];
         delete quotationDataRow['itemName'];
         delete quotationDataRow['itemSupplierId'];
         delete quotationDataRow['supplierId'];
         delete quotationDataRow['supplierName'];
         delete quotationDataRow['supplierPriority'];
         quotationItemArray.push(quotationDataRow);
       }
    */
    this.quotationGridOptions.api.forEachNode(node => {

      if (node['data']['itemSupplierId'] != null && node['data']['itemSupplierId'] != undefined) {
        if (node.data.itemsModel.pack > 1) {
          // console.log("============")
          let pack = node.data.itemsModel.pack
          let packSizeCal = parseInt((node.data.quantity / pack).toString());
  
          if (packSizeCal * pack == node.data.quantity) {
            node.data.quantity = packSizeCal;
          } else if ((node.data.quantity - packSizeCal * pack) >= (pack / 2)) {
            node.data.quantity = packSizeCal + 1;
          } else {
            node.data.quantity = packSizeCal;
          }
        } else {
  
        }
        
        quotationItemArray.push({
          "supplier": { 'supplierId': node['data']['supplierId'] },
          "item": { 'itemId': node['data']['itemId'] },

          "tax": { 'taxCategoryId': node['data']['itemsModel']['tax']['taxCategoryId'] },
          "discountPercentage": node['data']['discountPercentage'],
          "priority": node['data']['supplierPriority'],
          "quantity": node['data']['quantity'],
          "bonus": node['data']['bonus'] != null && node['data']['bonus'] != undefined && node['data']['bonus'] != '' ? node['data']['bonus'] : 0,
          "unitPurchasePrice": node['data']['unitRate'],
          "createdUser": localStorage.getItem('id'),
          "lastUpdateUser": localStorage.getItem('id')
        }
        );
      }


    })

    payload['quotationItems'] = quotationItemArray;

    return payload;
  }

  // thisDay;
  today: any;

  retrieveInitialValues() {
    this.itemParameter = { name: "Item Name", value: "itemName" };
    this.itemSearchTerm = "";
    this.createdBy = localStorage.user;
    this.selectedEmployee = undefined;
    this.selectedSupplier = undefined;
    this.selectedItem = undefined;
    this.selectedSupplierName = '';
    this.generateQuotationNo();
    // this.getActiveSuppliers('');
    this.getAllEmployees();

    this.showItemGrid = false;
    this.loadRowData([], this.itemGridOptions);
    this.showItemGrid = true;
    this.showGrid = false;
    this.loadRowData([{}], this.quotationGridOptions);
    this.showGrid = true;
    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

    setTimeout(() => {
      this.quotationInformationForm.patchValue({ quotationDt: this.today });
      this.quotationInformationForm.patchValue({ created: localStorage.user });
    }, 200);

    setTimeout(() => {
      this.getRowNodeId = function (data) {

        return data.symbol;
      };

      var rowNode = this.quotationGridOptions.api.getRowNode('0');

      rowNode.addEventListener(RowNode.EVENT_ROW_SELECTED, function () {
        $('#itemSearchModal').modal('show');
        rowNode.setSelected(false, true);

      });
    }, 200);

  }

  changeDate(event: any) {
    const date = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    const selectedDate = formatDate(event, 'yyyy-MM-dd', 'en-US');
  }

  setItemsGrid() {
    this.itemGridOptions.api.setRowData([]);
    $('#itemParams').value = '';
    (document.getElementById('searchTerm') as HTMLInputElement).value = '';
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

  setAutoQuotationStatus: any[] = []
  submitClicked: Boolean
  onQuotationSubmit(type) {
    this.submitClicked = true

    this.quotationInformationForm.get('description').setErrors({ 'incorrect': true });

    if (type === 'pending') {

      const data = this.quotationGridOptions.api.getSelectedRows()[0];

      let payload = this.formatPayload(this.quotationInformationForm.value, data);



      for (var i = 0; i < payload['quotationItems'].length; i++) {

        if (payload['quotationItems'][i]['quantity'] != null && payload['quotationItems'][i]['quantity'] != undefined &&
          payload['quotationItems'][i]['quantity'] == 0 && payload['quotationItems'][i]['quantity'] == "" || payload['quotationItems'][i]['quantity'] == null) {

          this.spinnerService.hide();
          this.toasterService.error('Please Enter The Qty', 'Error Occured', {
            timeOut: 5000
          });
          return;
        }
      }


      this.spinnerService.show();
      if (payload['quotationItems'] != null && payload['quotationItems'] != undefined && payload['quotationItems'] != '') {
        this.addPurchaseOrderService.approvalquotation(payload).subscribe(
          res => {
            if (res instanceof Object) {
              if (res['responseStatus']['code'] === 200) {
                this.spinnerService.hide();
                this.retrieveInitialValues();
                this.setItemsGrid();
                this.quotationInformationForm.reset();

                this.toasterService.success(res['message'], 'Success', {
                  timeOut: 3000
                });
              }
            }
          }, error => {
            this.spinnerService.hide()
            this.toasterService.error("Error occured plz contact admin", "", {
              timeOut: 3000
            });
          }
        );
      } else {
        this.toasterService.warning('Missing Quotation Items', 'Plz Fill Quotation Items', {
          timeOut: 5000
        });
        this.spinnerService.hide();
      }



    }
    if (type === 'later') {


      const data = this.quotationGridOptions.api.getSelectedRows()[0];
      let payload = this.laterFormatPayload(this.quotationInformationForm.value, data);

      for (var i = 0; i < payload['quotationItems'].length; i++) {


        if (payload['quotationItems'][i]['quantity'] != null && payload['quotationItems'][i]['quantity'] != undefined &&
          payload['quotationItems'][i]['quantity'] == 0 && payload['quotationItems'][i]['quantity'] == "" || payload['quotationItems'][i]['quantity'] == null) {

          this.spinnerService.hide();
          this.toasterService.error('Please Enter The Qty', 'Error Occured', {
            timeOut: 5000
          });
          return;
        }
      }


      this.spinnerService.show();
      if (payload['quotationItems'] != null && payload['quotationItems'] != undefined && payload['quotationItems'] != '') {

        this.addPurchaseOrderService.laterquotation(payload).subscribe(
          res => {
            if (res instanceof Object) {
              if (res['responseStatus']['code'] === 200) {
                this.retrieveInitialValues();
                this.spinnerService.hide();
                this.setItemsGrid();
                this.quotationInformationForm.reset();

                this.toasterService.success(res['message'], 'Success', {
                  timeOut: 3000
                });
              }
            }
          }, error => {
            this.spinnerService.hide()
            this.toasterService.error("Error occured plz contact admin", "", {
              timeOut: 3000
            });
          }
        );

      } else {
        this.toasterService.warning('Missing Quotation Items', 'Plz Fill Quotation Items', {
          timeOut: 5000
        });
        this.spinnerService.hide();
      }


    }



  }



  checkFormDisability() {
    if (this.quotationGridOptions.rowData instanceof Array) {

      /* for (var i = 0; i < this.quotationGridOptions.rowData.length; i++) {
       
         if (this.quotationGridOptions.rowData.length > 1) {
           const temp = this.quotationGridOptions.api.getSelectedRows()[0];
           if (temp) {
 
             if (Number(temp.quantity) > 0) {
            
               return false;
             }
           }
         } 

        if ((this.quotationGridOptions.rowData[i]['quantity'] != null && this.quotationGridOptions.rowData[i]['quantity'] != undefined && this.quotationGridOptions.rowData[i]['quantity'] != "") &&
          this.quotationGridOptions.rowData[i]['quantity'] >= 0) {
         
          return false;

        }
        else {
          return true;

        }
      } */

    }
    return (
      (this.quotationInformationForm.get('quotationNo').errors instanceof Object)
      || (this.quotationInformationForm.get('description').errors instanceof Object)
      || (this.quotationInformationForm.get('quotationDt').errors instanceof Object)
      || (this.quotationInformationForm.get('quotationExpiryDt').errors instanceof Object))
    //  || !(this.selectedEmployee instanceof Object)
    // || (this.quotationInformationForm.get('created').errors instanceof Object)
    // || this.quotationGridOptions.rowData.length === 1);

  }

  /*   getTotalQuantity() {
      if (this.quotationGridOptions.rowData instanceof Array) {
        if (this.quotationGridOptions.rowData.length > 1) {
          const temp = this.quotationGridOptions.rowData.length !=0;
          if (temp) {
  
            if (Number(temp.quantity) > 0) {
  
              return false;
            }
          }
        }
      }
      return true;
    }  */

  checkFormDisability2() {
    if (this.quotationGridOptions.rowData instanceof Array) {
      return (this.quotationGridOptions.rowData.length === 1);
    }
  }

  // layter submit code
  /*  later() {
     const data = this.quotationGridOptions.api.getSelectedRows()[0];
     if (data) {
       this.addPurchaseOrderService.laterquotation(this.formatPayload(this.quotationInformationForm.value, data)).subscribe(
         res => {
           if (res instanceof Object) {
             if (res['responseStatus']['code'] == 200) {
               this.retrieveInitialValues();
               this.setItemsGrid();
               this.quotationInformationForm.reset();
               this.toasterService.success(res['message'], 'Success', {
                 timeOut: 3000
               });
             }
           }
         }
       );
     }
   }  */

  item_supplier() {
    this.router.navigate(['/master/itemsuppliers']);
  }

  supplier_item() {
    this.router.navigate(['/master/itemsuppliers'], { state: { data: 'Supplier-Item' } });
  }

  onlyCharKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122) || (event.charCode == 32);
  }

  onMouseEnter() {
    //console.log(this.itemParameter)
    if (this.itemParameter['value'] == "itemName") {
      this.itemSearchTerm = undefined
    }
  }

  onEnter() {
    this.onSeachTermClick();
  }

}
