import { isNumeric } from 'rxjs/util/isNumeric';
import { DatePipe } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NumericEditor } from 'src/app/core/numeric-editor.component';
import { ToastrService } from 'ngx-toastr';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import { AddpurchaseorderinvoiceService } from '../purchase-invoice/addpurchaseorderinvoice.service';
import { isNumber } from 'util';
import * as $ from 'jquery';

@Component({
  selector: 'app-stock-adjustment',
  templateUrl: './stock-adjustment.component.html',
  styleUrls: ['./stock-adjustment.component.scss'],
  providers: [AddpurchaseorderinvoiceService]
})

export class StockAdjustmentComponent implements OnInit {

  constructor(
    private invoiceStockService: AddpurchaseorderinvoiceService, private toasterService: ToastrService,
    private spinnerService: Ng4LoadingSpinnerService, private datePipe: DatePipe) {
    this.itemGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.itemGridOptions.rowSelection = 'single';

    this.stockGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.stockGridOptions.rowSelection = 'single';
    this.getAllItemsForStockGrid()

    this.stockGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }

  }

  ngOnInit() {
    $(document).ready(function () {
      $("#itemNameSearch").focus()
    });
    this.stockSearchForm = new FormGroup(this.stockFormValidations);
  }

  selectedItem: any;
  paginationSize = 20;
  searchKey;
  stockAdjustForm: FormGroup;
  itemsDropdown: any;

  getAllItemsForStockGrid() {
    this.spinnerService.show();
    this.invoiceStockService.getStockItemsByLimit().subscribe(itemResponse => {
      if (itemResponse instanceof Object) {
        if (itemResponse['responseStatus']['code'] === 200) {
          this.spinnerService.hide();
          this.stockItemArray = itemResponse['result'];
        }
      }
    },
      error => {
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          });
      })
  }

  onEnterSearch(){
    this.searchByBarcode()
  }

  scannedBarcode
  searchByBarcode(){
    //console.log(this.scannedBarcode)
    if(this.scannedBarcode){
      this.invoiceStockService.searchStockAdjustRecordsByBarcode(this.scannedBarcode).subscribe(
        gridRowDataResponse => {
          if (gridRowDataResponse instanceof Object) {
            if (gridRowDataResponse['responseStatus']['code'] === 200) {
              this.stockItemArray = gridRowDataResponse['result'];
              if (this.stockItemArray.length == 0) {
                this.toasterService.warning('No Data Found With Search Criteria', 'No Data To Show', {
                  timeOut: 3000
                }
                );
              }
            } else {
              this.toasterService.error('Please contact administrator', 'Error Occurred', {
                timeOut: 5000
              });
            }
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
          }
        }
      );
    }
  }
  searchItemName() {
    this.rackKey = undefined;
    this.shelfKey = undefined;
    if (this.searchKey != null && this.searchKey != undefined) {
      this.invoiceStockService.searchStockAdjustRecords(this.searchKey).subscribe(
        gridRowDataResponse => {
          if (gridRowDataResponse instanceof Object) {
            if (gridRowDataResponse['responseStatus']['code'] === 200) {
              this.stockItemArray = gridRowDataResponse['result'];
              if (this.stockItemArray.length == 0) {
                this.toasterService.warning('No Data Found With Search Criteria', 'No Data To Show', {
                  timeOut: 3000
                }
                );
              }
            } else {
              this.toasterService.error('Please contact administrator', 'Error Occurred', {
                timeOut: 5000
              });
            }
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
          }
        }
      );
    } else {
      this.getAllItemsForStockGrid();
    }
  }

  searchItem(searchKey) {
    if (this.searchCriteria == 'Item Name') {
      if (searchKey['term'] != "") {
        this.invoiceStockService.getItemByName(searchKey['term']).subscribe(SearchRes => {
          if (SearchRes['responseStatus']['code'] == 200) {
            this.itemsDropdown = SearchRes['result']
          }
        });
      }
    }
  }

  tooltipRenderer = function (params) {
    if (params.value != null && params.value != undefined) {
      return '<span title="' + params.value + '">' + params.value + '</span>';
    }
    else {
      return '<span title="' + params.value + '">' + '' + '</span>';
    }
  }

  cellClickedForSaving(params) {
    var stockId = params.data.stockId;
    var previousQty = params.data.previousQty;
    var quantity = Number(params.data.adjustedStock);
    var lastUpdateUser = localStorage.getItem('id');

    var oldQty = previousQty;
    var adjustedStock = params.data.adjustedStock;
    var remarks = params.data.remarks;

    if ((quantity == 0 && (remarks != null && remarks != undefined && remarks != '')) || quantity > 0) {

      this.invoiceStockService.saveStockDataBasedOnQty(stockId, previousQty, quantity, lastUpdateUser).subscribe(res => {
        if (res['responseStatus']['code'] === 200) {
          // if (res['result'] != 0) {

          params.data.quantity = quantity;
          params.data.previousQty = quantity;
          params.data.adjustedStock = undefined;
          previousQty = undefined;
          this.stockGridOptions.api.refreshCells(params);

          let stockAdjustModel = {
            'adjustedStock': adjustedStock,
            'physicalStock': oldQty,
            'pharmacy': { 'pharmacyId': localStorage.getItem('pharmacyId') },
            'stock': stockId,
            'date': this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            'lastUpdateUser': lastUpdateUser,
            'entryType': 'Stock Take',
            'remarks': remarks
          }

          this.invoiceStockService.saveStockTakeDataForReport(stockAdjustModel).subscribe(res => {

          })

          this.toasterService.success(res['message'], "Success", {
            timeOut: 3000
          });


          /*   } else {
              if (res['result'] == 0) {
                this.toasterService.warning('Some one has changed the Qty', 'Not Updated', {
                  timeOut: 5000
                });
              }
            } */
        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
        }
      })
    } else {
      this.toasterService.warning('Please Enter Some Value', 'Zero is Adjustable Quantity Along With Remarks', {
        timeOut: 5000
      })
    }
  }

  resettedQtyRecord;
  rowsToBeUpdated: any = [];

  onClickedReset(params) {
    params.data.quantity = 0;
    params.data.remarks = undefined
    this.invoiceStockService.getStockAdjustedRecordsByStockId(params.data.stockId).subscribe(
      gridRowDataResponse => {
        if (gridRowDataResponse instanceof Object) {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.rowsToBeUpdated = gridRowDataResponse['result'];

            this.spinnerService.hide();
            params.data.quantity = this.rowsToBeUpdated[0]['quantity'];
            params.data.previousQty = params.data.quantity;
            params.data.adjustedStock = 0;
            this.stockGridOptions.api.refreshCells(params);
          } else {
            this.spinnerService.hide()
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
          }
        } else {
          this.spinnerService.hide()
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
        }
      }
    );

  }



  columnDefs: ColDef[] = [
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
      hide: true
    },
    { headerName: 'Invoice No', field: 'invoiceNo', sortable: true, resizable: true, filter: true, width: 115 },
    { headerName: 'Item Name', field: 'itemName', sortable: true, resizable: true, filter: true, cellRenderer: this.tooltipRenderer, pinned: 'left', width: 220 },
    { headerName: 'Batch No', field: 'batchNo', sortable: true, resizable: true, filter: true, width: 110 },
    { headerName: 'Expiry Date', field: 'expiryDt', sortable: true, resizable: true, filter: true, width: 100 },
    { headerName: 'Rack', field: 'rack', sortable: true, resizable: true, filter: true, width: 65 },
    { headerName: 'Shelf', field: 'shelf', sortable: true, resizable: true, filter: true, width: 65 },
    { headerName: 'Qty', field: 'quantity', sortable: true, resizable: true, filter: true, width: 70, },
    {
      headerName: 'Adj Stock', field: 'adjustedStock', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor,
      valueGetter: function (params) {
        var recievedAdjustedStock = isNaN(params.data.adjustedStock) ? 0 : params.data.adjustedStock;
        params.data.adjustedStock = recievedAdjustedStock;
        return recievedAdjustedStock;

      },
      editable: true, width: 90
    },

    { headerName: 'Remarks', field: 'remarks', sortable: true, resizable: true, filter: true, width: 180, editable: true },
    {
      headerName: '', field: 'save', width: 60,
      cellStyle: { color: 'white', backgroundColor: 'MediumSeaGreen' },
      valueGetter: function (params) {
        return params.data.save = 'Save'
      }, onCellClicked: this.cellClickedForSaving.bind(this)
    },
    {
      headerName: '', field: 'reset', width: 60, cellStyle: { color: 'white', backgroundColor: '#00a3cc' },
      valueGetter: function (params) {
        return params.data.reset = 'Reset'
      }, onCellClicked: this.onClickedReset.bind(this)


    },
    {
      headerName: 'Adjustable Stock', field: 'adjustedStock', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor,
      valueGetter: function (params) {
        var recievedPhysicalStock = isNaN(params.data.adjustedStock) ? 0 : params.data.adjustedStock;
        params.data.adjustedStock = recievedPhysicalStock;
        return recievedPhysicalStock;
      },
      editable: true, hide: true
    }
  ];

  itemGridOptions: GridOptions;
  stockGridOptions: GridOptions;
  showGrid: boolean = false;
  rowData = [];
  searchCriteria;
  search: string = '';
  stockItemArray: any[] = [];
  rackKey;
  shelfKey;

  stockSearchForm: FormGroup;
  stockFormValidations = {
    rackNo: new FormControl('', Validators.required),
    shelfNo: new FormControl('', Validators.required)
  }

  checkFormDisability() {
    return (this.stockSearchForm.get('rackNo').errors instanceof Object)
      || (this.stockSearchForm.get('shelfNo').errors instanceof Object)
  }

  searchStockWithRackAndShelf() {
    this.searchKey = undefined;
    if (this.rackKey != null && this.rackKey != undefined && this.shelfKey != null && this.shelfKey != undefined) {

      if (Number(this.rackKey) && Number(this.shelfKey)) {
        this.invoiceStockService.searchStockAdjustRecordsByRackAndShelfByIntegers(this.rackKey, this.shelfKey).subscribe(
          gridRowDataResponse => {
            if (gridRowDataResponse instanceof Object) {
              if (gridRowDataResponse['responseStatus']['code'] === 200) {
                this.stockItemArray = gridRowDataResponse['result'];
                if (this.stockItemArray.length == 0) {
                  this.toasterService.warning('No Data Found With Search Criteria', 'No Data To Show', {
                    timeOut: 3000
                  }
                  );
                }
              } else {
                this.toasterService.error('Please contact administrator', 'Error Occurred', {
                  timeOut: 5000
                });
              }
            } else {
              this.toasterService.error('Please contact administrator', 'Error Occurred', {
                timeOut: 5000
              });
            }
          }
        );

      } else {
        this.invoiceStockService.searchStockAdjustRecordsByRackAndShelf(this.rackKey, this.shelfKey).subscribe(
          gridRowDataResponse => {
            if (gridRowDataResponse instanceof Object) {
              if (gridRowDataResponse['responseStatus']['code'] === 200) {
                this.stockItemArray = gridRowDataResponse['result'];
                if (this.stockItemArray.length == 0) {
                  this.toasterService.warning('No Data Found With Search Criteria', 'No Data To Show', {
                    timeOut: 3000
                  }
                  );
                }
              } else {
                this.toasterService.error('Please contact administrator', 'Error Occurred', {
                  timeOut: 5000
                });
              }
            } else {
              this.toasterService.error('Please contact administrator', 'Error Occurred', {
                timeOut: 5000
              });
            }
          }
        );
      }
    }
  }


  onMouseEnter(){
    this.scannedBarcode=undefined
  }
}
