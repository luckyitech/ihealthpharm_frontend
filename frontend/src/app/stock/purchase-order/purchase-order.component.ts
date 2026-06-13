import {
  Component,
  OnInit
} from '@angular/core';
import * as $ from 'jquery';
import { AddPurchaseorderService } from './add-purchaseorder.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/core/app.service';
import { GridOptions, ICellRendererParams, ColDef } from 'ag-grid-community';
import { CheckBoxComponent } from 'src/app/core/check-box/check-box.component';
import { NumericEditor } from 'src/app/core/numeric-editor.component';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
  providers: [AddPurchaseorderService]
})
export class PurchaseOrderComponent implements OnInit {

  selectedTab = 'add';

  purchaseOrderInformationForm: FormGroup;
  suppliers: any[] = [];
  quotations: any[] = [];
  items: any[] = [];
  deliveries: any[] = [];

  constructor(private addPurchaseOrderService: AddPurchaseorderService, private toasterService: ToastrService, private appService: AppService) {

    this.purchaseOrderGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.purchaseOrderGridOptions.rowSelection = 'single';
    this.purchaseOrderGridOptions.columnDefs = this.columnDefs;
    this.purchaseOrderGridOptions.rowData = [];

    this.itemGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.itemGridOptions.rowSelection = 'single';
    this.itemGridOptions.columnDefs = this.itemColumDefs;
    this.itemGridOptions.rowData = [];

    this.pendingPurchaseOrderGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.pendingPurchaseOrderGridOptions.rowSelection = 'single';
    this.pendingPurchaseOrderGridOptions.columnDefs = this.pendingcolumnDefs;
    this.pendingPurchaseOrderGridOptions.rowData = [];
    this.getPendingPurchaseOrders(this.pharmacyId);


    this.appService.getPurchaseOrderDeletedRow().subscribe(
      (deletedRow: ICellRendererParams) => {
        if (deletedRow instanceof Object) {
          let deleteData = this.purchaseOrderGridOptions.rowData.filter(
            x => x.itemId === deletedRow.data.itemId
          );
          try {
            this.purchaseOrderGridOptions.api.updateRowData({ remove: deleteData });
            let deleteIndex: number = this.findObjectIndex(this.purchaseOrderGridOptions.rowData, deleteData[0], 'itemId');
            let deletedRowObj: Object = this.purchaseOrderGridOptions.rowData[deleteIndex];
            if (deletedRowObj.hasOwnProperty('purchaseOrderItemsId') && this.showForm == true) {
              this.deletePurchaseOrderItem(deletedRowObj['purchaseOrderItemsId']);
            }
            if (deleteIndex !== -1) {
              this.purchaseOrderGridOptions.rowData.splice(deleteIndex, 1);
            }
          } catch (e) {
          }
        }
      }
    );

    this.retrieveInitialValues();

    this.purchaseOrderGridOptions.onCellValueChanged = this.purchaseOrderGridModified.bind(this);
  }

  deletePurchaseOrderItem(purchaseOrderItemId: number) {
    this.addPurchaseOrderService.deletePurchaseOrderItem(purchaseOrderItemId)
  }

  showSupplier: boolean = false;
  resetSearchTerm: boolean = false;
  supplierSearchTerm: string = '';

  onSupplierSearchTermChanged(searchTerm: string) {
    this.supplierSearchTerm = searchTerm;
    this.getActiveSuppliers(this.supplierSearchTerm);
  }

  purchaseOrderGridModified(modifiedRowNode) {
    if (modifiedRowNode.oldValue != modifiedRowNode.newValue) {
      this.postCellEditOperations(modifiedRowNode);
    }
  }

  postCellEditOperations(modifiedRowNode: ICellRendererParams) {
    if (modifiedRowNode.colDef.field == 'bonus') {
      modifiedRowNode.data.bonus = parseInt(modifiedRowNode.data.bonus);
      let totalQuantity = parseInt(modifiedRowNode.data.bonus) + modifiedRowNode.data.quantity
      modifiedRowNode.data.totalQuantity = totalQuantity;
      let quantityAmount = modifiedRowNode.data['totalQuantity'] * modifiedRowNode.data['unitRate'];
      modifiedRowNode.data['discount'] = +(quantityAmount * +(((modifiedRowNode.data['discountPercentage']) / 100)).toFixed(2)).toFixed(2);
      modifiedRowNode.data['totalValue'] = ((quantityAmount - modifiedRowNode.data['discount']) * +(((100 + modifiedRowNode.data.itemsModel.tax.percentage) / 100).toFixed(2))).toFixed(2);
      modifiedRowNode.node.setData(modifiedRowNode.data);
    }
  }

  findObjectIndex(rowArray: Object[], rowObject: Object, key: string): number {
    return rowArray.findIndex(x => x[key] === rowObject[key]);
  }

  selectedItem: Object;

  onItemSelected() {
    this.selectedItem = JSON.parse(JSON.stringify(this.itemGridOptions.api.getSelectedRows()[0]));
  }

  retrieveQuotations() {
    this.addPurchaseOrderService.getallquotations().subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] == 200) {
            this.quotations = res['result'];
          }
        }
      }
    )
  }

  retrieveQuotationSuppliers() {

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

  retrieveInitialValues() {
    this.itemParameter = "";
    this.itemSearchTerm = "";
    this.selectedDelivery = undefined;
    this.selectedSupplier = undefined;
    this.selectedItem = undefined;
    this.selectedPurchaseOrder = undefined;
    this.selectedSupplierName = '';
    this.selectedDeliveryId = '';
    this.supplierSearchTerm = '';
    this.resetSearchTerm = !this.resetSearchTerm;
    this.retrieveQuotations();
    this.getActiveSuppliers(this.supplierSearchTerm);
    this.generatepurchaseno(this.pharamacyId);
    this.getalldeliverytypes();
    this.showGrid = false;
    this.loadRowData([], this.purchaseOrderGridOptions);
    this.showGrid = true;
    this.showItemGrid = false;
    this.loadRowData([], this.itemGridOptions);
    this.showItemGrid = true;
  }

  loadRowData(inputRowData: Object[], gridoptions: GridOptions) {
    try {
      gridoptions.rowData = inputRowData;
      gridoptions.api.setRowData(gridoptions.rowData);
    } catch (e) {
      gridoptions.rowData = inputRowData;
    }
  }

  onQuotationChange(event: Event) {
    let selectedQuotation = this.quotations.find(x => x.QUOTATION_ITEM_ID == event.target['value']);
    this.retrieveQuotationSuppliers();
  }

  selectedDelivery: Object;
  selectedDeliveryId: string = '';

  onDeliveryChange(event: Event) {
    this.selectedDelivery = this.deliveries.find(x => x.deliveryTypeId == event.target['value']);
    this.selectedDeliveryId = this.selectedDelivery['deliveryTypeId'];
  }

  selectedSupplierName: string = '';
  selectedSupplier: Object;

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

  ngOnInit() {
    $(document).ready(function () {

      $('.submit-for-approval, .submit-later').click(function (e) {
        e.preventDefault();
        $('.grid-area').show();
        $('.new-purchase-order').hide();
      });
      $('.edit-btn').click(function (e) {
        e.preventDefault();
        $('.new-purchase-order').show();
        $('.grid-area').hide();
      });

    });
    this.purchaseOrderInformationForm = new FormGroup(this.purchaseOrderInformationFormValidations);
  }

  ngOnDestroy(): void {

  }

  pharamacyId: number = 1;

  formatPurchaseOrderPayload(purchaseOrderInformationForm: Object) {
    let requestPayLoad = JSON.parse(JSON.stringify(purchaseOrderInformationForm));
    requestPayLoad['supplierModel'] = this.selectedSupplier;
    requestPayLoad['deliveryTypesModel'] = this.selectedDelivery;
    requestPayLoad['purchaseorderitems'] = this.purchaseOrderGridOptions.rowData;
    requestPayLoad['pharmacyModel'] = { pharmacyId: this.pharamacyId };
    return requestPayLoad;
  }

  onSubmitPurchaseOrder(submissionStatus: string) {
    this.saveFormChanges(this.purchaseOrderInformationForm.value, submissionStatus);
  }

  saveFormChanges(purchaseOrderInformationForm: Object, submissionStatus: string) {
    this.addPurchaseOrderService.saveFormChanges(this.formatPurchaseOrderPayload(purchaseOrderInformationForm), submissionStatus).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.purchaseOrderInformationForm.reset();
            this.retrieveInitialValues();
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
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

	/**
	 * Service Changes
	 * End
	 */


	/**
	 * Form Changes
	 * Start
	 */

  purchaseOrderInformationFormValidations = {
    medicalOrNonMedical: new FormControl('M', [Validators.required]),
    emergency: new FormControl(''),
    cash: new FormControl(''),
    purchaseOrderNo: new FormControl('', [Validators.required]),
    purchaseOrderDate: new FormControl('', [Validators.required]),
    deliveryTime: new FormControl('', [Validators.required]),
    quotationNumber: new FormControl(''),
    quotationDate: new FormControl(''),
    shippingAddress: new FormControl(''),
    paymentTime: new FormControl(''),
    advance: new FormControl(''),
    discountPercentage: new FormControl(''),
    poTerm: new FormControl('', [Validators.required]),
    balance: new FormControl(''),
    poValue: new FormControl(''),
    otherCharges: new FormControl(''),
    quantity: new FormControl('', [Validators.required]),
    disc: new FormControl(''),
    bonus: new FormControl(''),
    poAmount: new FormControl(''),
    discount: new FormControl(''),
    remarks: new FormControl(''),
  };

  emergencyValue: boolean = false;

  onEmergencyChange(event: Event) {
    if (event.target['checked']) {
      this.emergencyValue = true;
      this.purchaseOrderInformationForm.patchValue({ emergency: 'Y' })
    }
    else {
      this.emergencyValue = false;
      this.purchaseOrderInformationForm.patchValue({ emergency: 'N' })
    }
  }

  cashValue: boolean = false;

  onCashChange(event: Event) {
    if (event.target['checked']) {
      this.cashValue = true;
      this.purchaseOrderInformationForm.patchValue({ cash: 'Y' })
    }
    else {
      this.cashValue = false;
      this.purchaseOrderInformationForm.patchValue({ cash: 'N' })
    }
  }

  onSubmit() {

  }

  itemParameter: string = "";
  itemSearchTerm: string = "";

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

  checkFormDisability() {
    if (this.purchaseOrderGridOptions.rowData instanceof Array) {
      return ((this.purchaseOrderInformationForm.get('deliveryTime').errors instanceof Object)
        || (this.purchaseOrderInformationForm.get('purchaseOrderDate').errors instanceof Object)
        || (this.purchaseOrderInformationForm.get('poTerm').errors instanceof Object)
        || (this.purchaseOrderInformationForm.get('quantity').errors instanceof Object)
        || !(this.selectedDelivery instanceof Object)
        || !(this.selectedSupplier instanceof Object)
        || !(this.selectedItem instanceof Object))
        || this.purchaseOrderGridOptions.rowData.length === 0
    }
  }

	/**
	 * Grid Changes
	 * Start
	 */
  tooltipRenderer = function(params)
  {
    
    if(params.value != null && params.value != undefined)
    {
      return '<span title="' + params.value + '">'+params.value+'</span>';
    }
    else{
      return '<span title="' + params.value + '">'+''+'</span>';
    }
       
      
  }
  purchaseOrderGridOptions: GridOptions;
  showGrid: boolean = true;
  columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "",
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40,
      cellRendererFramework: CheckBoxComponent
    },
    { headerName: 'Item Code', field: 'itemsModel.itemCode', sortable: true, filter: true },
    { headerName: 'Item Desc', field: 'itemsModel.itemDescription', sortable: true, filter: true },
    { headerName: 'Qty', field: 'quantity', sortable: true, filter: true },
    {
      headerName: 'Bonus', field: 'bonus', cellEditorFramework: NumericEditor, editable: true, sortable: true, filter: true, cellStyle: (params) => {
        if (params.data[params.colDef.field + '_modified'] == 1) {
          return {
            'background-color': '#F2F3F4',
            "border": '2px solid #00FFFF !important'
          }
        } else {
          return {
            'background-color': '#F2F3F4'
          }
        }
      }
    },
    { headerName: 'Total Qty', field: 'totalQuantity', sortable: true, filter: true },
    { headerName: 'Unit Rate', field: 'unitRate', sortable: true, filter: true },
    { headerName: 'Total Value', field: 'totalValue', sortable: true, filter: true },
    { headerName: 'Disc %', field: 'discountPercentage', sortable: true, filter: true },
    { headerName: 'Disc Amt', field: 'discount', sortable: true, filter: true },
    { headerName: 'VAT %', field: 'itemsModel.tax.percentage', sortable: true, filter: true }
  ];

  purchaseOrderCalculations(addedItem: Object) {
    addedItem['totalQuantity'] = addedItem['quantity'];
    let quantityAmount = addedItem['totalQuantity'] * addedItem['unitRate'];
    addedItem['discount'] = (quantityAmount * +(((addedItem['discountPercentage']) / 100)).toFixed(2));
    addedItem['totalValue'] = +((quantityAmount - addedItem['discount']) * +(((100 + addedItem['itemsModel']['tax']['percentage']) / (100)).toFixed(2))).toFixed(2);
  }

  addRowsToPurchaseOrderGrid() {
    this.selectedItem['quantity'] = this.purchaseOrderInformationForm.get('quantity').value;
    this.purchaseOrderCalculations(this.selectedItem);
    let addItem = JSON.parse(JSON.stringify(this.selectedItem))
    this.purchaseOrderGridOptions.api.updateRowData({
      add: [addItem],
      addIndex: 0
    });
    this.purchaseOrderGridOptions.rowData = this.purchaseOrderGridOptions.rowData.concat([addItem]);
  }

  checkItemDisability() {
    if (this.selectedItem instanceof Object && this.purchaseOrderGridOptions.rowData.length > 0) {
      return this.purchaseOrderGridOptions.rowData.map(x => x.itemsModel.itemId).some(x => x == this.selectedItem['itemsModel']['itemId']);
    }
    else return false;
  }

  getTotalAmount() {
    if (this.purchaseOrderGridOptions.rowData.length > 0) {
      return this.purchaseOrderGridOptions.rowData
        .reduce((accumalator, currentValue) => (accumalator + parseInt(currentValue.totalValue)), 0)
    }
  }

  getTotalQuantity() {
    if (this.purchaseOrderGridOptions.rowData.length > 0) {
      return this.purchaseOrderGridOptions.rowData
        .reduce((accumalator, currentValue) => (accumalator + parseInt(currentValue.totalQuantity)), 0)
    }
  }

  checkQuantity() {
    if (typeof this.purchaseOrderInformationForm.get('quantity').value === 'number') {
      return true;
    }
    else return false;
  }

  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.purchaseOrderGridOptions.api.setQuickFilter($event.target.value);
    if (this.purchaseOrderGridOptions.api.getDisplayedRowCount() == 0) {
      this.purchaseOrderGridOptions.api.showNoRowsOverlay();
    } else {
      this.purchaseOrderGridOptions.api.hideOverlay();
    }
  }

	/**
	 * Grid Changes
	 * End
	 */

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
    { headerName: 'Item Code', field: 'itemsModel.itemCode', sortable: true, filter: true },
    { headerName: 'Item Name', field: 'itemsModel.itemName', sortable: true, filter: true,cellRenderer: this.tooltipRenderer, },
    { headerName: 'Item Description', field: 'itemsModel.itemDescription', sortable: true, filter: true },
  ]

	/**
	 * Item Grid Changes
	 * End
	 */

	/**
	 * Services Changes
	 * Start
	 */

  generatepurchaseno(pharmacyId: number) {
    this.addPurchaseOrderService.generatepurchaseno(pharmacyId).subscribe(
      generatepurchasenoResponse => {
        if (generatepurchasenoResponse instanceof Object) {
          if (generatepurchasenoResponse['responseStatus']['code'] === 200) {
            this.purchaseOrderInformationForm.patchValue({ purchaseOrderNo: generatepurchasenoResponse['result'] });
          }
        }
      }
    );
  }

  getalldeliverytypes() {
    this.addPurchaseOrderService.getalldeliverytypes().subscribe(
      getalldeliverytypesResponse => {
        if (getalldeliverytypesResponse instanceof Object) {
          if (getalldeliverytypesResponse['responseStatus']['code'] === 200) {
            this.deliveries = getalldeliverytypesResponse['result'];
          }
        }
      }
    );
  }

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

	/**
	 * Services Changes
	 * End
	 */

  pendingPurchaseOrderGridOptions: GridOptions;
  showPendingGrid: boolean = true;
  pharmacyId: number = 1;
  pendingcolumnDefs: ColDef[] = [
    { headerName: 'Purchase Order No', field: 'purchaseOrderNo', sortable: true, filter: true },
    { headerName: 'Po Term', field: 'poTerm', sortable: true, filter: true },
    { headerName: 'Status', field: 'purchaseOrderStatusModel.status', sortable: true, filter: true },
    { headerName: 'Delivery Type', field: 'deliveryTypesModel.type', sortable: true, filter: true },
    { headerName: 'Purchase Order Date', field: 'purchaseOrderDate', sortable: true, filter: true },
  ];

  onPendingQuickFilterChanged($event) {
    this.onPendingQuickFilterChanged["searchEvent"] = $event;
    this.pendingPurchaseOrderGridOptions.api.setQuickFilter($event.target.value);
    if (this.pendingPurchaseOrderGridOptions.api.getDisplayedRowCount() == 0) {
      this.pendingPurchaseOrderGridOptions.api.showNoRowsOverlay();
    } else {
      this.pendingPurchaseOrderGridOptions.api.hideOverlay();
    }
  }

  getPendingPurchaseOrders(pharmacyId: number) {
    this.showPendingGrid = false;
    this.addPurchaseOrderService.getPendingPurchaseQuotations(pharmacyId).subscribe(
      pendingPurchaseQuotationResponse => {
        if (pendingPurchaseQuotationResponse instanceof Object) {
          if (pendingPurchaseQuotationResponse['responseStatus']['code'] === 200) {
            this.pendingPurchaseOrderGridOptions.rowData = pendingPurchaseQuotationResponse['result'];
            this.showPendingGrid = true;
          }
        }
      }
    );
  }

  showForm: boolean = false;
  selectedPurchaseOrder: Object;
  onTabClick(selectedTab) {
    this.selectedTab = selectedTab;
    if (this.selectedTab == 'add') {
      this.showForm = false;
    }
    this.purchaseOrderInformationForm.reset();
    this.purchaseOrderInformationForm.patchValue({ medicalOrNonMedical: 'M' })
    this.retrieveInitialValues();
  }

  editGrid() {
    this.showForm = true;
    let selectedPurchaseOrder = JSON.parse(JSON.stringify(this.purchaseOrderGridOptions.api.getSelectedRows()[0]));
    this.selectedPurchaseOrder = selectedPurchaseOrder;
    this.purchaseOrderInformationForm.setValue({
      medicalOrNonMedical: selectedPurchaseOrder.medicalOrNonMedical,
      emergency: selectedPurchaseOrder.emergency,
      cash: selectedPurchaseOrder.cash,
      purchaseOrderNo: selectedPurchaseOrder.purchaseOrderNo,
      purchaseOrderDate: selectedPurchaseOrder.purchaseOrderDate,
      deliveryTime: selectedPurchaseOrder.deliveryTime,
      quotationNumber: selectedPurchaseOrder.quotationModel.quotationNo,
      quotationDate: selectedPurchaseOrder.quotationModel.quotationDt,
      shippingAddress: selectedPurchaseOrder.shippingAddress,
      advance: selectedPurchaseOrder.advance,
      discountPercentage: selectedPurchaseOrder.discountPercentage,
      poTerm: selectedPurchaseOrder.poTerm,
      balance: selectedPurchaseOrder.balance,
      poValue: selectedPurchaseOrder.poValue,
      paymentTime: selectedPurchaseOrder.paymentTime,
      otherCharges: selectedPurchaseOrder.otherCharges,
      quantity: selectedPurchaseOrder.quantity,
      disc: selectedPurchaseOrder.disc,
      bonus: selectedPurchaseOrder.bonus,
      poAmount: selectedPurchaseOrder.poAmount,
      discount: selectedPurchaseOrder.discount,
      remarks: selectedPurchaseOrder.remarks,
    });
    this.selectedDelivery = selectedPurchaseOrder.deliveryTypesModel.type;
    this.selectedDeliveryId = selectedPurchaseOrder.deliveryTypesModel.deliveryTypeId;
    this.showItemGrid = false;
    this.purchaseOrderGridOptions.rowData = selectedPurchaseOrder.purchaseorderitems;
    this.showItemGrid = true;
    this.onSupplierChange(selectedPurchaseOrder.supplierModel);

  }

  onUpdatePurchaseOrder() {
    this.saveFormChanges(this.purchaseOrderInformationForm.value, this.selectedPurchaseOrder['purchaseOrderStatusModel'].status);
  }

  onCancel() {
    this.showForm = false;
    this.retrieveInitialValues();
    this.purchaseOrderInformationForm.reset();
  }
  

}
