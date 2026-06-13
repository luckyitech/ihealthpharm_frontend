import { StockModel } from './stock.model';
import { ToastrService } from 'ngx-toastr';
import { StockService } from './stock.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import { EndDateValidator } from 'src/app/core/DOB Validator/endDate-validator';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-new-stock',
  templateUrl: './new-stock.component.html',
  styleUrls: ['./new-stock.component.scss']
})

export class NewStockComponent implements OnInit {
  discounts = [0];
  selectedDiscount = undefined;
  maxDiscount = undefined;
  globalMargin = undefined;
  editable = true;
  constructor(private stockService: StockService, private toasterService: ToastrService,
    private spinnerService: Ng4LoadingSpinnerService) {

    this.getAllDiscounts();
    this.getConfigurationStatus();
    this.getMargin();
    this.getMaxDiscount();
    // this.getLimitedItemsData();
    this.getAllSuppliersByLimit(1, 100);
    this.getAllItemsByLimit(1, 100);
    this.getAllTaxCategories();
    //this.getSuppliers();
    this.stockGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.stockGridOptions.rowSelection = 'single';
    this.stockGridOptions.columnDefs = this.saleColumDefs;
    this.stockForm = new FormGroup(this.stockFormValidations);
  }

  ngOnInit() {
    this.getIOSNumber();
  }
  rowData: any[] = [];

  taxArray: any[]; /* = [{ taxCategoryId: 4, categoryCode: "A", categoryValue: 14 }, { taxCategoryId: 2, categoryCode: "B", categoryValue: 0 },
  { taxCategoryId: 3, categoryCode: "E", categoryValue: 0 }];
 */
  prevPack = 1;
  prevPP = 0;
  prevSP = 0;
  prevMRP = 0;
  selectedTax;
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
    headerName: 'Item Name',
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
  private gridApi;
  private gridColumnApi;

  showGrid: boolean = false;
  items: any[] = [];
  selectedItem: any;

  suppliers: any[] = [];
  selectedSupplier: any;

  status: any[] = ["Approved", "Not Approved"];
  selectedStatus: any = "Not Approved";

  entryTypes: any[] = ["Sales Update", "Invoice Addition", "Purchase Return", "Sales Return", "New Stock Addition", "Stock Adjustment"];
  selectedEntryType: any;

  stockForm: FormGroup;
  stockFormValidations = {
    stockId: new FormControl(),
    stockNumber: new FormControl(),
    item: new FormControl(null, Validators.required),
    pharmacy: new FormControl({ pharmacyId: localStorage.getItem('pharmacyId') }),
    supplier: new FormControl(null, Validators.required),
    quantity: new FormControl(null, Validators.required),
    unitSaleRate: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)]),
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
    unitPurchaseRate: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+(.[0-9]{0,2})?$/)]),
    rack: new FormControl('', Validators.required),
    pack: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)]),
    shelf: new FormControl('', Validators.required),
    barcode: new FormControl(),
    vat: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    status: new FormControl(),
    stockDt: new FormControl('', Validators.required),
    invoiceNo: new FormControl(),
    entryType: new FormControl('', Validators.required),
    itemName: new FormControl(),
    storage: new FormControl(),
    taxCategoryModel: new FormControl(null, Validators.required),
    createdUser: new FormControl(localStorage.getItem('id')),
    lastUpdateUser: new FormControl(localStorage.getItem('id')),
    bonus: new FormControl('')
  }

  itemSelected: any;

  OnItemSelected(event) {
    this.itemSelected = event
    this.stockForm.patchValue({
      storage: this.itemSelected['storage']
    })
  }


  onReset() {
    this.stockGridOptions.api.setRowData([]);
    this.stockForm.reset();
    this.stockForm.patchValue(
      {
        pharmacy: { pharmacyId: localStorage.getItem('pharmacyId') },
        createdUser: localStorage.getItem('id'),
        lastUpdateUser: localStorage.getItem('id'),
      });
    this.getIOSNumber();
    this.selectedStatus = "Not Approved";
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


    if (this.indexSpecial > 0) {
      this.scanCodeStringOne = barCodeScanned.substring(0, this.indexSpecial).trim()
      this.scanCodeStringTwo = barCodeScanned.substring(this.indexSpecial + 1, barCodeScanned.length).trim()
      this.scanCodeStringTwo = this.scanCodeStringTwo.replace('?', '');
    }
    else {
      this.scanCodeStringOne = barCodeScanned
    }

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
      this.stockForm.get('batchNo').setValue(this.scanCodeStringOne.substring(26, this.scanCodeStringOne.length))
    }

    //setting batch no expiry from second string

    //console.log(this.scanCodeStringTwo.substring(0, 2))
    if (this.scanCodeStringTwo) {
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
  }

  onSubmit() {
    // this.marginPercentageCalculation();
    let stocks = [];
    this.stockGridOptions.api.forEachNode(function (node) {
      stocks.push(node['data']);
    });
    this.stockForm.get('unitPurchaseRate').setErrors({ 'incorrect': true });
    this.spinnerService.show();
    this.stockService.saveMultipleStockRecords(stocks).subscribe(stockRes => {
      if (stockRes['responseStatus']['code'] == 200) {
        this.spinnerService.hide();
        this.onReset();
        this.toasterService.success(stockRes['message'], "Success", {
          timeOut: 3000
        });
      }
    }, error => {
      this.spinnerService.hide();
      this.toasterService.error('Please contact administrator', 'Error Occurred', {
        timeOut: 5000
      });
    }
    );
  }

  onGridReady(params) {
    params.api.setRowData([]);
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
      this.getAllItemsByLimit(1, 100);
    }
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

  pdiscAmt: number = 0;
  sdiscAmt: number = 0;
  valueCalculator(event) {
    var pp = isNaN(this.stockForm.get('unitPurchaseRate').value) ? 0 : this.stockForm.get('unitPurchaseRate').value;
    var pd = isNaN(this.stockForm.get('purchaseDiscountPercentage').value) ? 0 : this.stockForm.get('purchaseDiscountPercentage').value;

    this.pdiscAmt = pp * (pd / 100);
    this.stockForm.patchValue({
      'purchaseDiscountAmount': this.pdiscAmt.toFixed(2)
    })
    this.salesAndMrpCalc();
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

  addToGrid() {

    let itemMargin = this.selectedItem ? this.selectedItem['itemCategory'] ? this.selectedItem['itemCategory']['marginPercentage'] ? this.selectedItem['itemCategory']['marginPercentage'] : 0 : 0 : 0;

    if (this.stockForm.get('margin').value < 0) {
      this.toasterService.warning(this.selectedItem['itemName'] + " Margin Percentage is less than zero", "Margin Warning", { timeOut: 5000 })
      return;
    }
    this.showGrid = true;
    let stock = new StockModel();
    this.createRow();
    try {
      this.stockGridOptions.api.updateRowData({ add: [this.stockForm.value] });
    }
    catch (error) {
      this.stockGridOptions.rowData = [this.stockForm.value]
    }
    this.stockForm.reset();
    this.getIOSNumber();
    this.selectedStatus = "Not Approved";

  }
  getIOSNumber() {
    this.stockService.getIOSNumber().subscribe(IOSNumber => {
      if (IOSNumber['responseStatus']['code'] == 200) {
        this.stockForm.get('stockNumber').setValue(IOSNumber['result']);
      }
    });
  }

  createRow() {
    this.stockForm.get('item').setValue(this.selectedItem);
    this.stockForm.get('supplier').setValue(this.selectedSupplier);
    this.stockForm.get('status').setValue(this.selectedStatus);
  }

  pathchForm() {

    this.stockForm.patchValue({
      stockId: null,
      item: null,
      pharmacy: { pharmacyId: localStorage.getItem('pharmacyId') },
      supplier: null,
      quantity: null,
      unitSaleRate: null,
      mrp: null,
      margin: null,
      marginAmount: null,
      remarks: null,
      saleDiscountAmount: null,
      saleDiscountPercentage: null,
      auditId: null,
      batchNo: null,
      expiryDt: null,
      manufactureDt: null,
      purchaseDiscountAmount: null,
      purchaseDiscountPercentage: null,
      unitPurchaseRate: null,
      rack: null,
      pack: null,
      shelf: null,
      barcode: null,
      vat: null,
      status: null,
      stockDt: null,
      invoiceNo: null,
      entryType: null,
    })

    this.selectedItem = undefined;
    this.selectedStatus = undefined;
    this.selectedSupplier = undefined;
  }
  reset() {
    this.stockForm.reset();

    this.selectedItem = undefined;
    this.selectedStatus = undefined;
    this.selectedSupplier = undefined;
    this.getIOSNumber();
    this.showGrid = false;
    this.selectedStatus = "Not Approved";
    this.sdiscAmt = 0;
    this.pdiscAmt = 0;


  }

  checkAddToGriddisablility() {
    return (this.stockForm.get('unitPurchaseRate').errors instanceof Object) ||
      (this.stockForm.get('vat').errors instanceof Object) ||
      (this.stockForm.get('unitSaleRate').errors instanceof Object) ||
      (this.stockForm.get('rack').errors instanceof Object) ||
      (this.stockForm.get('shelf').errors instanceof Object) ||
      this.stockForm.get('quantity').errors ||
      this.stockForm.get('unitSaleRate').errors ||
      this.stockForm.get('unitPurchaseRate').errors ||
      this.stockForm.get('expiryDt').errors ||
      this.stockForm.get('vat').errors ||
      this.stockForm.get('batchNo').errors ||
      this.stockForm.get('item').errors ||
      this.stockForm.get('supplier').errors ||
      this.stockForm.get('stockDt').errors ||
      this.stockForm.get('taxCategoryModel').errors ||
      this.stockForm.get('entryType').errors
  }

  checkSaveDisability() {
    try {
      return this.stockGridOptions['rowData']['length'] < 0;
    }
    catch (error) {
      return true;
    }

  }

  setVat() {

    if (this.selectedTax != null && this.selectedTax != undefined) {
      this.stockForm.get('vat').setValue(this.selectedTax['categoryValue']);
    }
    this.marginPercentageCalculation()
  }

  setSPVAT() {
    if (!this.stockForm.get('unitSaleRate').errors && !this.stockForm.get('taxCategoryModel').errors) {
      this.stockForm.get('spVat').setValue(this.stockForm.get('unitSaleRate').value * (1 + this.selectedTax ? this.selectedTax['categoryValue'] : 0 / 100))
    }
  }

  setPP() {
    this.prevPP = this.stockForm.get('unitPurchaseRate').value
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

  unitPurchansePriceCalc() {
    // if (!this.stockForm.get('pack').errors && !this.stockForm.get('unitPurchaseRate').errors) {

    this.stockForm.get('unitPurchaseRate').setValue(((this.prevPP / this.stockForm.get('pack').value)).toFixed(2));

    if (!this.editable) {
      this.salesAndMrpCalc();
    }
    this.marginPercentageCalculation()
    //}
  }

  setSP() {
    this.prevSP = this.stockForm.get('unitSaleRate').value
  }
  unitSalePriceCalc() {
    //if (!this.stockForm.get('pack').errors && !this.stockForm.get('unitSaleRate').errors) {
    this.stockForm.get('unitSaleRate').setValue(((this.prevSP / this.stockForm.get('pack').value)).toFixed(2));
    // }
  }

  setMRP() {
    this.prevMRP = this.stockForm.get('mrp').value
  }
  unitMRPCalc() {
    // if (!this.stockForm.get('pack').errors && !this.stockForm.get('mrp').errors) {
    this.stockForm.get('mrp').setValue(((this.prevMRP / this.stockForm.get('pack').value)).toFixed(2));
    // }

  }

  changePrevPack() {
    if (this.prevPack != this.stockForm.get('pack').value && this.prevPack != 1) {
      this.prevPack = this.stockForm.get('pack').value;
    }
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
}
