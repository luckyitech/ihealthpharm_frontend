import { StockService } from './../new-stock/stock.service';
import { EndDateValidator } from 'src/app/core/DOB Validator/endDate-validator';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, ColDef, IGetRowsParams } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AppService } from 'src/app/core/app.service';

@Component({
  selector: 'app-editstock',
  templateUrl: './editstock.component.html',
  styleUrls: ['./editstock.component.scss']
})

export class EditstockComponent implements OnInit {

  discounts = [0];
  selectedDiscount = undefined;
  maxDiscount = undefined;
  globalMargin = undefined;
  editable = true;
  disableUpdateButton: boolean
  constructor(private stockService: StockService, private toasterService: ToastrService,
    private datePipe: DatePipe, private spinnerService: Ng4LoadingSpinnerService, private appService: AppService) {

    this.getAllDiscounts();
    this.getConfigurationStatus();
    this.getMargin();
    this.getMaxDiscount();
    this.getAllTaxCategories();
    this.stockGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.stockGridOptions.rowSelection = 'single';
    this.stockGridOptions.columnDefs = this.saleColumDefs;
    this.stockGridOptions.rowModelType = 'infinite'
    this.stockGridOptions.cacheBlockSize = 50;
    this.stockForm = new FormGroup(this.stockFormValidations);

    this.getAllSuppliersByLimit(1, 100);
    this.getAllItemsByLimit(1, 100);


    this.stockGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }



  }

  ngOnInit() {
    $(document).ready(function () {
      $("#searchKey").focus()

      $("#common-grid-itembutton").click(function () {
        $("#item-grid").hide();
        $("#search").hide();
      });
      $("#common-grid-itembutton").click(function () {
        $("#item-Information").show();
      });

      $(".saved-item").click(function () {
        $("#item-grid").show();
        $("#search").show();
      });

      $("#cancelled-edit").click(function () {
        $("#item-grid").show();
        $("#search").show();
      });
      $("#common-grid-itembutton").click(function () {
        $("#item-Information").css("display", "block");
      });
      $(".saved-item").click(function () {
        $("#item-Information").css("display", "none");
      });
      $("#cancelled-edit").click(function () {
        $("#item-Information").css("display", "none");
      });
    });


  }


  scanCodeStringOne
  scanCodeStringTwo
  indexSpecial
  barCodeValue
  barCodeScanned
  onEnter() {
    let barcode = this.stockForm.get('barcode').value

    if (barcode) {
      if (barcode.length > 13) {
        this.barCodeScanned = barcode.replace(/\s/g, "");

        this.barCodeScanned = barcode.replace(/[^a-zA-Z0-9]/g, '?');
        this.QRCodeCalculation(this.barCodeScanned)
      }
    }
  }
  QRCodeCalculation(barCodeScanned) {


    //console.log(barCodeScanned)
    this.indexSpecial = barCodeScanned.indexOf("?")


    this.scanCodeStringOne = barCodeScanned.substring(0, this.indexSpecial).trim()
    this.scanCodeStringTwo = barCodeScanned.substring(this.indexSpecial + 1, barCodeScanned.length).trim()

    //console.log(this.scanCodeStringOne)
    //console.log(this.scanCodeStringTwo)


    //console.log(this.indexSpecial)
    //console.log(barCodeScanned.substring(0, 3))

    this.barCodeValue = barCodeScanned.substring(3, 16)
    //console.log(barCodeScanned.substring(3, 16))

    //setting batchNo,expiry from first string
    console.log(this.scanCodeStringOne.substring(16, 18))
    if (this.scanCodeStringOne.substring(16, 18) == 10) {
      //console.log(this.scanCodeStringOne.substring(18, this.scanCodeStringOne.length))
      this.stockForm.get('batchNo').setValue(this.scanCodeStringOne.substring(18, this.scanCodeStringOne.length))

    } else if (this.scanCodeStringOne.substring(16, 18) == 17) {

      let date = "20" + this.scanCodeStringOne.substring(18, 20) + "-" + this.scanCodeStringOne.substring(20, 22) + "-" + this.scanCodeStringOne.substring(22, 24)
      //console.log(date)
      //console.log(this.datePipe.transform(date, 'dd-MM-yyyy'))
      this.stockForm.get('expiryDt').setValue(date)
    }

    //console.log(this.scanCodeStringOne.substring(24, 26))
    if (this.scanCodeStringOne.substring(24, 26) == 10) {
      this.stockForm.get('batchNo').setValue(this.scanCodeStringOne.substring(24, this.scanCodeStringOne.length))
    }

    //setting batch no expiry from second string

    //console.log(this.scanCodeStringTwo.substring(0, 2))
    if (this.scanCodeStringTwo.substring(0, 2) == 10) {
      this.stockForm.get('batchNo').setValue(this.scanCodeStringTwo.substring(2, this.scanCodeStringTwo.length))
    } else if (this.scanCodeStringTwo.substring(0, 2) == 17) {

      let date = "20" + this.scanCodeStringTwo.substring(2, 4) + "-" + this.scanCodeStringTwo.substring(4, 6) + "-" + this.scanCodeStringTwo.substring(6, 8)
      //console.log(date)
      //console.log(this.datePipe.transform(date, 'dd-MM-yyyy'))
      this.stockForm.get('expiryDt').setValue(date)
    }


    //console.log(this.scanCodeStringTwo.substring(8, 10))
    if (this.scanCodeStringTwo.substring(8, 10) == 10) {
      this.stockForm.get('batchNo').setValue(this.scanCodeStringTwo.substring(10, this.scanCodeStringTwo.length))
    }
  }

  searchKey;
  stockSearchCodeArray: any[] = ["Item Name", "Item Code", "Description", "Generic Name", "Batch Number", "Barcode"];
  selectedStockSearchCode = "Item Name";

  rowCount = 0;
  pageNumber = 0;
  cacheOverflowSize = 2;
  maxConcurrentDatasourceRequests = 2;
  paginationSize = 50;
  // grid option
  stockGridOptions: GridOptions;
  tooltipRenderer = function (params) {
    if (params.value != null && params.value != undefined) {
      return '<span title="' + params.value + '">' + params.value + '</span>';
    }
    else {
      return '<span title="' + params.value + '">' + '' + '</span>';
    }
  }

  saleColumDefs: ColDef[] = [{
    headerName: 'Item Code',
    field: 'item.itemCode',
    sortable: true,
    resizable: true,
    filter: true,
    checkboxSelection: true
  },
  {
    headerName: 'Product Name',
    field: 'item.itemName',
    sortable: true,
    resizable: true,
    filter: true,
    cellRenderer: this.tooltipRenderer,
  },
  {
    headerName: 'Formulation',
    field: 'item.itemForm.form',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Tax',
    field: 'taxCategoryModel.categoryCode',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Batch No',
    field: 'batchNo',
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
    headerName: 'Expiry',
    field: 'expiryDt',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Price',
    field: 'unitPurchaseRate',
    sortable: true,
    resizable: true,
    filter: true
  }
  ];

  rowData: any[] = [];

  taxArray: any[];

  prevPack = 0;
  prevPP = 0;
  prevSP = 0;
  prevMRP = 0;
  selectedTax;
  pdiscAmt: number = 0;
  sdiscAmt: number = 0;
  items: any[] = [];
  selectedItem: any;

  suppliers: any[] = [];
  selectedSupplier: any;

  status: any[] = ["Approved", "Not Approved"];
  selectedStatus: any = "Not Approved";

  entryTypes: any[] = ["Sales Update", "Invoice Addition", "Purchase Return", "Sales Return", "New Stock Addition", "Stock Adjustment"];
  selectedEntryType: any;

  itemSelected: any;

  stockForm: FormGroup;
  stockFormValidations = {
    stockId: new FormControl(),
    stockNumber: new FormControl(),
    item: new FormControl(null, Validators.required),
    pharmacy: new FormControl({ pharmacyId: localStorage.getItem('pharmacyId') }),
    supplier: new FormControl(null, Validators.required),
    quantity: new FormControl(null, Validators.required),
    //  unitSaleRate: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]\d*(\.\d+)?$/)]),
    unitSaleRate: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)]),
    bonus: new FormControl(''),
    spVat: new FormControl(),
    mrp: new FormControl('', Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)),
    margin: new FormControl(),
    marginAmount: new FormControl(),
    remarks: new FormControl(),
    saleDiscountAmount: new FormControl(),
    saleDiscountPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
    auditId: new FormControl(),
    batchNo: new FormControl(null, Validators.required),
    expiryDt: new FormControl(null, [Validators.required, EndDateValidator]),
    manufactureDt: new FormControl(),
    purchaseDiscountAmount: new FormControl(),
    purchaseDiscountPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
    // unitPurchaseRate: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]\d*(\.\d+)?$/)]),
    unitPurchaseRate: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)]),

    rack: new FormControl('', Validators.required),
    //pack: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)]),
    pack: new FormControl(null, [Validators.required]),
    shelf: new FormControl('', Validators.required),
    barcode: new FormControl(),
    vat: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    status: new FormControl(),
    stockDt: new FormControl('', Validators.required),
    invoiceNo: new FormControl(),
    entryType: new FormControl('', Validators.required),
    storage: new FormControl(),
    taxCategoryModel: new FormControl(null, Validators.required),
    createdUser: new FormControl(localStorage.getItem('id')),
    lastUpdateUser: new FormControl(localStorage.getItem('id'))
  }

  editGrid() {
    let selectedStockItem = this.stockGridOptions.api.getSelectedRows()[0];
    this.prevPack = selectedStockItem['pack'] != null && selectedStockItem['pack'] != undefined ? selectedStockItem['pack'] : 0;
    this.prevPP = selectedStockItem['unitPurchaseRate'] != null && selectedStockItem['unitPurchaseRate'] != undefined ? selectedStockItem['unitPurchaseRate'] * this.prevPack : 0,
      this.prevSP = selectedStockItem['unitSaleRate'] != null && selectedStockItem['unitSaleRate'] != undefined ? selectedStockItem['unitSaleRate'] * this.prevPack : 0;
    this.prevMRP = selectedStockItem['mrp'] != null && selectedStockItem['mrp'] != undefined ? selectedStockItem['mrp'] * this.prevPack : 0,

      this.stockForm.patchValue({
        stockId: selectedStockItem['stockId'] != null && selectedStockItem['stockId'] != undefined ? selectedStockItem['stockId'] : null,
        stockNumber: selectedStockItem['stockNumber'] != null && selectedStockItem['stockNumber'] != undefined ? selectedStockItem['stockNumber'] : null,

        item: selectedStockItem['item'] != null && selectedStockItem['item'] != undefined ? selectedStockItem['item'] : null,

        pharmacy: selectedStockItem['pharmacy'] != null && selectedStockItem['pharmacy'] != undefined ? selectedStockItem['pharmacy'] : null,
        supplier: selectedStockItem['supplier'] != null && selectedStockItem['supplier'] != undefined ? selectedStockItem['supplier'] : null,
        quantity: selectedStockItem['quantity'] != null && selectedStockItem['quantity'] != undefined ? selectedStockItem['quantity'] : null,
        unitSaleRate: selectedStockItem['unitSaleRate'] != null && selectedStockItem['unitSaleRate'] != undefined ? selectedStockItem['unitSaleRate'] : null,
        spVat: selectedStockItem['spVat'] != null && selectedStockItem['spVat'] != undefined ? selectedStockItem['spVat'] : null,
        mrp: selectedStockItem['mrp'] != null && selectedStockItem['mrp'] != undefined ? selectedStockItem['mrp'] : null,
        margin: selectedStockItem['margin'] != null && selectedStockItem['margin'] != undefined ? selectedStockItem['margin'] : null,
        marginAmount: selectedStockItem['marginAmount'] != null && selectedStockItem['marginAmount'] != undefined ? selectedStockItem['marginAmount'] : null,
        remarks: selectedStockItem['remarks'] != null && selectedStockItem['remarks'] != undefined ? selectedStockItem['remarks'] : null,
        saleDiscountAmount: selectedStockItem['saleDiscountAmount'] != null && selectedStockItem['saleDiscountAmount'] != undefined ? selectedStockItem['saleDiscountAmount'] : null,
        saleDiscountPercentage: selectedStockItem['saleDiscountPercentage'] != null && selectedStockItem['saleDiscountPercentage'] != undefined ? selectedStockItem['saleDiscountPercentage'] : null,
        auditId: selectedStockItem['auditId'] != null && selectedStockItem['auditId'] != undefined ? selectedStockItem['auditId'] : null,
        batchNo: selectedStockItem['batchNo'] != null && selectedStockItem['batchNo'] != undefined ? selectedStockItem['batchNo'] : null,
        expiryDt: selectedStockItem['expiryDt'] != null && selectedStockItem['expiryDt'] != undefined ? selectedStockItem['expiryDt'] : null,
        manufactureDt: selectedStockItem['manufactureDt'] != null && selectedStockItem['manufactureDt'] != undefined ? selectedStockItem['manufactureDt'] : null,
        purchaseDiscountAmount: selectedStockItem['purchaseDiscountAmount'] != null && selectedStockItem['purchaseDiscountAmount'] != undefined ? selectedStockItem['purchaseDiscountAmount'] : null,
        purchaseDiscountPercentage: selectedStockItem['purchaseDiscountPercentage'] != null && selectedStockItem['purchaseDiscountPercentage'] != undefined ? selectedStockItem['purchaseDiscountPercentage'] : null,
        unitPurchaseRate: selectedStockItem['unitPurchaseRate'] != null && selectedStockItem['unitPurchaseRate'] != undefined ? selectedStockItem['unitPurchaseRate'].toFixed(2) : null,
        rack: selectedStockItem['rack'] != null && selectedStockItem['rack'] != undefined ? selectedStockItem['rack'] : null,
        pack: selectedStockItem['pack'] != null && selectedStockItem['pack'] != undefined ? selectedStockItem['pack'] : null,
        shelf: selectedStockItem['shelf'] != null && selectedStockItem['shelf'] != undefined ? selectedStockItem['shelf'] : null,
        barcode: selectedStockItem['barcode'] != null && selectedStockItem['barcode'] != undefined ? selectedStockItem['barcode'] : null,
        vat: selectedStockItem['vat'] != null && selectedStockItem['vat'] != undefined ? selectedStockItem['vat'] : null,
        status: selectedStockItem['status'] != null && selectedStockItem['status'] != undefined ? selectedStockItem['status'] : null,
        stockDt: selectedStockItem['stockDt'] != null && selectedStockItem['stockDt'] != undefined ? selectedStockItem['stockDt'] : null,
        invoiceNo: selectedStockItem['invoiceNo'] != null && selectedStockItem['invoiceNo'] != undefined ? selectedStockItem['invoiceNo'] : null,
        entryType: selectedStockItem['entryType'] != null && selectedStockItem['entryType'] != undefined ? selectedStockItem['entryType'] : null,
        bonus: selectedStockItem['bonus'] != null && selectedStockItem['bonus'] != undefined ? selectedStockItem['bonus'] : null,
        storage: selectedStockItem['storage'] != null && selectedStockItem['storage'] != undefined ? selectedStockItem['storage'] : null,
        taxCategoryModel: selectedStockItem['taxCategoryModel'] != null && selectedStockItem['taxCategoryModel'] != undefined ? selectedStockItem['taxCategoryModel'] : null,
      });
    this.selectedStatus = selectedStockItem['status'] != null && selectedStockItem['status'] != undefined ? selectedStockItem['status'] : null;
    this.marginPercentageCalculation();

    this.appService.getPermissions().subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];
        if (this.permissions instanceof Array) {
          //console.log(this.permissions[121])
          if (this.permissions[121] && this.permissions[121]['activeS'] === 'Y') {

            this.disableUpdateButton = false
          } else {

            this.toasterService.warning("Sorry!! You don't have access to update the stock", "", {
              timeOut: 3000
            })
            this.disableUpdateButton = true
          }
        }
      }
    });
  }
  datasource = {
    getRows: (params: IGetRowsParams) => {
      this.spinnerService.show();
      this.stockService.getStockDataByItemAndPharmacyId(this.searchKey, this.selectedStockSearchCode, localStorage.getItem('pharmacyId'),
        this.pageNumber, 50).subscribe(data => {
          params.successCallback(data['result'], this.rowCount)
          this.spinnerService.hide();
          if (data['responseStatus']['code'] === 200) {
            if (data['result']['length'] > 0) {
              this.pageNumber++;
            }
            else {
              this.stockGridOptions.api.setRowData([]);
              this.toasterService.warning('Data Not Found With Search Criteria', 'No Data To Show', {
                timeOut: 3000
              });
            }
          }
        }, error => {
          this.spinnerService.hide();
        });
    }

  }

  onEnterSearch() {
    this.searchStock()
  }

  searchStock() {
    this.rowCount = 0;
    this.pageNumber = 0;
    this.getStockCountBySearch();
  }

  getStockCountBySearch() {
    this.stockService.getStockDataByItemAndPharmacyIdCount(this.searchKey, this.selectedStockSearchCode, localStorage.getItem('pharmacyId')).subscribe(data => {
      if (data['responseStatus']['code'] === 200) {
        this.spinnerService.show();
        this.rowCount = data['result'];

        this.stockGridOptions.api.setDatasource(this.datasource);
        this.spinnerService.hide();
      }
    })
  }

  checkSaveDisability() {
    return (this.stockForm.get('unitPurchaseRate').errors instanceof Object) ||
      (this.stockForm.get('vat').errors instanceof Object) ||
      (this.stockForm.get('unitSaleRate').errors instanceof Object) ||
      (this.stockForm.get('rack').errors instanceof Object) ||
      (this.stockForm.get('shelf').errors instanceof Object) ||
      this.stockForm.get('quantity').errors ||
      this.stockForm.get('unitSaleRate').errors ||
      this.stockForm.get('unitPurchaseRate').errors ||
      //this.stockForm.get('expiryDt').errors ||
      this.stockForm.get('vat').errors ||
      this.stockForm.get('batchNo').errors ||
      this.stockForm.get('item').errors ||
      this.stockForm.get('supplier').errors ||
      this.stockForm.get('stockDt').errors ||
      this.stockForm.get('taxCategoryModel').errors ||
      this.stockForm.get('entryType').errors ||
      this.disableUpdateButton
  }


  setVat() {

    if (this.selectedTax != null && this.selectedTax != undefined) {
      this.stockForm.get('vat').setValue(this.selectedTax['categoryValue']);
    }
    this.marginPercentageCalculation()
  }

  setSPVAT() {
    if (!this.stockForm.get('unitSaleRate').errors && !this.stockForm.get('taxCategoryModel').errors) {
      this.stockForm.get('spVat').setValue(this.stockForm.get('unitSaleRate').value * (1 + this.selectedTax['categoryValue'] / 100))
    }
  }

  setPP() {
    this.prevPP = this.stockForm.get('unitPurchaseRate').value
  }

  unitPurchansePriceCalc() {
    // if (!this.stockForm.get('pack').errors && !this.stockForm.get('unitPurchaseRate').errors) {

    this.stockForm.get('unitPurchaseRate').setValue(((this.prevPP / this.stockForm.get('pack').value)).toFixed(2));

    if (!this.editable) {
      // this.stockForm.get('unitSaleRate').setValue(
      //   ((this.prevPP * (1 + ((this.selectedItem['itemCategory'] ?
      //     this.selectedItem['itemCategory']['marginPercentage'] ?
      //       this.selectedItem['itemCategory']['marginPercentage'] : this.globalMargin ? this.globalMargin : 0 : this.globalMargin ? this.globalMargin : 0)) / 100) * (1 + (this.maxDiscount / 100))) / this.stockForm.get('pack').value).toFixed(2));

      // this.stockForm.get('mrp').setValue(this.stockForm.get('unitSaleRate').value);

      this.salesAndMrpCalc();
    }
    this.marginPercentageCalculation()
    //}
  }

  setSP() {
    this.prevSP = this.stockForm.get('unitSaleRate').value
  }
  unitSalePriceCalc() {
    this.stockForm.get('unitSaleRate').setValue(((this.prevSP / this.stockForm.get('pack').value)).toFixed(2));
  }

  setMRP() {
    this.prevMRP = this.stockForm.get('mrp').value
  }
  unitMRPCalc() {
    this.stockForm.get('mrp').setValue(((this.prevMRP / this.stockForm.get('pack').value)).toFixed(2));
  }
  setUnitMRPCalc() {
    this.stockForm.get('mrp').setValue(((this.prevSP / this.stockForm.get('pack').value)).toFixed(2));
  }


  onCalculations(event) {
    var sp = isNaN(this.stockForm.get('unitSaleRate').value) ? 0 : this.stockForm.get('unitSaleRate').value;
    var sd = isNaN(this.stockForm.get('saleDiscountPercentage').value) ? 0 : this.stockForm.get('saleDiscountPercentage').value;
    this.sdiscAmt = sp * (sd / 100);
    this.stockForm.patchValue({
      'saleDiscountAmount': this.sdiscAmt.toFixed(2)
    })
    this.marginPercentageCalculation()
  }

  valueCalculator(event) {
    var pp = isNaN(this.stockForm.get('unitPurchaseRate').value) ? 0 : this.stockForm.get('unitPurchaseRate').value;
    var pd = isNaN(this.stockForm.get('purchaseDiscountPercentage').value) ? 0 : this.stockForm.get('purchaseDiscountPercentage').value;

    this.pdiscAmt = pp * (pd / 100);
    this.stockForm.patchValue({
      'purchaseDiscountAmount': this.pdiscAmt.toFixed(2)
    })
    this.salesAndMrpCalc();
    this.marginPercentageCalculation();
  }

  searchByItemCode(searchKey) {
    if (searchKey['term'] != "") {
      this.stockService.itemSearchByItemCode(searchKey['term']).subscribe(itemRes => {
        if (itemRes['responseStatus']['code'] == 200) {
          this.items = itemRes['result'];
        }
        else {
          this.toasterService.error("Search Not Working", "Error", {
            timeOut: 5000
          });
        }
      })
    }
    else {
      this.getAllItemsByLimit(1, 100)
    }
  }

  getAllSuppliersByLimit(start, end) {
    this.stockService.getItemsByLimit(start, end).subscribe(supplierResponse => {
      if (supplierResponse instanceof Object) {
        if (supplierResponse['responseStatus']['code'] === 200) {
          this.suppliers = supplierResponse['result'];
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

  getAllItemsByLimit(start, end) {
    this.stockService.getLimitedItems(start, end).subscribe(itemResponse => {
      if (itemResponse instanceof Object) {
        if (itemResponse['responseStatus']['code'] === 200) {
          this.items = itemResponse['result'];
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

  searchBySupplierName(searchKey) {
    if (searchKey['term'] != "") {
      this.stockService.getSuppliersByName(searchKey['term']).subscribe(supplierRes => {
        if (supplierRes['responseStatus']['code'] == 200) {
          this.suppliers = supplierRes['result'];
        }
        else {
          this.toasterService.error("Search Not Working", "Error", {
            timeOut: 5000
          });
        }
      })
    }
    else {
      this.getAllSuppliersByLimit(1, 100);
    }
  }

  OnItemSelected(event) {
    this.itemSelected = event
    this.stockForm.patchValue({
      storage: this.itemSelected['storage']
    })
  }

  permissions: any[] = []
  onSubmit() {

    // this.marginPercentageCalculation();
    let itemMargin = this.selectedItem ? this.selectedItem['itemCategory'] ? this.selectedItem['itemCategory']['marginPercentage'] ? this.selectedItem['itemCategory']['marginPercentage'] : 0 : 0 : 0;

    if (this.stockForm.get('margin').value < 0) {
      this.toasterService.warning(this.selectedItem['itemName'] + " Margin Percentage is less than zero", "Margin Warning", { timeOut: 5000 })
      return;
    }
    this.spinnerService.show();
    this.stockService.updateStockRecord(this.stockForm.value).subscribe(stockRes => {
      if (stockRes['responseStatus']['code'] == 200) {
        this.spinnerService.hide();
        this.reset();
        this.searchStock();
        this.toasterService.success(stockRes['message'], "Success", {
          timeOut: 3000
        });

      }

    }
      , error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      });

  }

  reset() {
    this.stockForm.reset();

    this.selectedItem = undefined;
    this.selectedStatus = undefined;
    this.selectedSupplier = undefined;
    this.selectedStatus = "Not Approved";
    this.sdiscAmt = 0;
    this.pdiscAmt = 0;
  }

  getMaxDiscount() {
    this.stockService.getMaxDiscount().subscribe(res => {
      this.maxDiscount = res['result'];

    });
  }

  getAllDiscounts() {
    this.stockService.getAllDiscounts().subscribe(res => {
      var array = [0]

      for (var i = 0; i < res['result']['length']; i++) {
        array.push(res['result'][i]['discountValue']);

      }
      this.discounts = array;
    });
  }

  marginPercentageCalculation() {


    var p = this.stockForm.get('unitPurchaseRate').value * (1 - ((this.stockForm.get('purchaseDiscountPercentage').value ? this.stockForm.get('purchaseDiscountPercentage').value : 0) / 100)) *
      (1 + ((this.selectedTax ? this.selectedTax['categoryValue'] : 0) / 100));

    var s = this.stockForm.get('unitSaleRate').value * (1 - (Number(this.selectedDiscount ? this.selectedDiscount : 0) / 100)) *
      (1 + ((this.selectedTax ? this.selectedTax['categoryValue'] : 0) / 100));

    var mgrPer = p > 0 ? ((s - p) / p) * 100 : 0;

    if (!this.editable) {
      this.stockForm.get('margin').setValue((this.selectedItem['itemCategory'] != null && this.selectedItem['itemCategory'] != undefined ?
        this.selectedItem['itemCategory']['marginPercentage'] ?
          this.selectedItem['itemCategory']['marginPercentage'] : this.globalMargin ? this.globalMargin : 0 : this.globalMargin ? this.globalMargin : 0));
    }
    else {
      this.stockForm.get('margin').setValue(mgrPer);
    }


  }

  getMargin() {
    this.stockService.getMargin().subscribe(res => {

      this.globalMargin = res['result'];

    });
  }

  getConfigurationStatus() {
    this.stockService.getConfigurationStatus().subscribe(response => {

      if (response['responseStatus']['code'] === 200) {

        if (response['result'] != null && response['result'] != undefined) {
          if (response['result']['configStatusValue'] == 'activate') {
            this.editable = false;

          }

        }
      }
    });
  }

  salesAndMrpCalc() {
    var itemMargin = (this.selectedItem['itemCategory'] ?
      this.selectedItem['itemCategory']['marginPercentage'] ?
        this.selectedItem['itemCategory']['marginPercentage'] : this.globalMargin ? this.globalMargin : 0 : this.globalMargin ? this.globalMargin : 0)
    // var discPer = params.data.saleDiscountPercentage ? Number(params.data.saleDiscountPercentage) : Number(this.maxDiscount);
    var discPer = this.maxDiscount ? Number(this.maxDiscount) : 0;


    var puchasePrice = this.prevPP;
    var purchaseDiscPer = this.stockForm.get('purchaseDiscountPercentage').value;
    var purchasePriceAfterDisc = (puchasePrice * (100 - purchaseDiscPer) / 100);
    var salesdiscPer = (this.stockForm.get('saleDiscountPercentage').value != "" && this.stockForm.get('saleDiscountPercentage').value != undefined
      && this.stockForm.get('saleDiscountPercentage').value != null) ? this.stockForm.get('saleDiscountPercentage').value : 0;

    var salesDiscountPrice = (puchasePrice - purchasePriceAfterDisc * (100 - salesdiscPer) / 100) - (puchasePrice - purchasePriceAfterDisc);
    var marginPer = itemMargin ? itemMargin : 0;
    var markupPer = this.maxDiscount ? this.maxDiscount : 0;
    var marginPrice = purchasePriceAfterDisc * ((100 + marginPer) / 100)
    var markupPrice = puchasePrice * ((100 + markupPer) / 100)
    var marginPulseMarkupPrice = marginPrice + (markupPrice - puchasePrice);
    var finalSalesPrice = ((marginPulseMarkupPrice - salesDiscountPrice) / this.stockForm.get('pack').value).toFixed(2);

    this.stockForm.get('unitSaleRate').setValue(finalSalesPrice);

    this.stockForm.get('mrp').setValue(finalSalesPrice);
  }


  getAllTaxCategories() {
    this.stockService.getAllActiveSTaxes().subscribe(taxRes => {
      if (taxRes instanceof Object) {
        if (taxRes['responseStatus']['code'] === 200) {
          this.taxArray = taxRes['result'];
        }
      }
    })
  }


  onMouseEnter() {
    this.stockForm.get('barcode').setValue('');
  }

  onMouseEnterInSearch() {
    if (this.selectedStockSearchCode == "Barcode") {
      this.searchKey = undefined
    }
  }
}
