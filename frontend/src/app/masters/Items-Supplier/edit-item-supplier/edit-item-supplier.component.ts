import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GridOptions, ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from './../../items/shared/item.service';
import { ItemsSupplierService } from './../shared/Items-Supplier.service';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
	selector: 'edit-item-supplier',
	templateUrl: 'edit-item-supplier.component.html',
	providers: [ItemsSupplierService]
})

export class EditItemSupplierComponent implements OnInit {

	constructor(private itemSuppliersService: ItemsSupplierService, private itemService: ItemService,
		private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
		this.itemSupplierGridOptions = <GridOptions>{
			context: {
				componentParent: this
			}
		};
		this.itemSupplierGridOptions.rowSelection = 'single';
		this.itemSupplierGridOptions.columnDefs = this.columnDefs;
		this.resetInitialValues();
		this.getAllItemsByLimit(1, 200);
		this.getAllSuppliers();

		this.itemSupplierGridOptions.getRowStyle = function (params) {
			if (params.node.rowIndex % 2 !== 0) {
				return { background: '#cccccc' }
			}
		}
	}

	object: any;
	edit: boolean = true;
	itemSupplierGridOptions: GridOptions;
	showGrid: boolean = false;
	flagItem: boolean = false;
	flagDistr: boolean = false;
	ngOnInit() {
		$(document).ready(function () {
			$("#radioSupplierItems").click(function () {
				$("#idItemSuppliers").hide();
				$("#idSupplierItem").show();
			});
			$("#radioItemSuppliers").click(function () {
				$("#idItemSuppliers").show();
				$("#idSupplierItem").hide();
			});
		});
		this.itemSupplierInformationForm = new FormGroup(this.itemSupplierInformationValidation);
	}

	barCodeScanned
	onScanAndEnter(barcode) {
		console.log(barcode)
		if (barcode) {
			this.itemSuppliersService.getItemsByBarcode(barcode).subscribe(res => {
				if (res instanceof Object) {
					if (res['responseStatus']['code'] == 200) {
						this.itemsArray = res['result'];

					}
				}
			}, error => {
				this.toasterService.error("Error Occured Plz Contact Admin", "", {
					timeOut: 3000
				})
			})
		}
	}

	itemSupplierInformationForm: FormGroup;
	itemSupplierInformationValidation = {
		unitRate: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
		discountPercentage: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
		validity: new FormControl('', [Validators.required]),
	}


	selectedAddItemSupplierItem: any;
	selectedAddItemSupplierSupplier: any;

	showItem: boolean = false;
	showSupplier: boolean = false;
	showUnmappedSuppliers: boolean = false;
	showUnMappedItems: boolean = false;
	selectedItemSupplier: Object = {};
	ItemSuppliers: any[] = [];
	SupplierItems: any[] = [];
	items: any[] = [];
	unMappedSuppliers: any[] = [];
	suppliers: any[] = [];
	unMappedItems: any[] = [];
	selectedItemName: string = 'Select';
	selectedSupplierName: string = 'Select';
	selectedUnMappedSupplierNames: string = 'Select';
	selectedUnMappedItemNames: string = 'Select';
	selectedPriority: any;
	itemSearchTerm: string = '';
	unMappedSupplierSearchTerm: string = '';
	supplierSearchTerm: string = '';
	ItemSearchTerm: string = '';
	tooltipRenderer = function (params) {
		if (params.value != null && params.value != undefined) {
			return '<span title="' + params.value + '">' + params.value + '</span>';
		}
		else {
			return '<span title="' + params.value + '">' + '' + '</span>';
		}
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
			width: 40
		},
		{ headerName: 'Manufacturer Name', field: 'manufacturerName', sortable: true, resizable: true, filter: true },
		{ headerName: 'Item Name', field: 'itemName', sortable: true, resizable: true, filter: true, width: 280, cellRenderer: this.tooltipRenderer, },
		{ headerName: 'Item Desc', field: 'itemDescription', sortable: true, resizable: true, filter: true },
		{ headerName: 'Formulation', field: 'formulation', sortable: true, resizable: true, filter: true },
		{ headerName: 'Unit Rate', field: 'unitRate', sortable: true, resizable: true, filter: true },
		{ headerName: 'Discount Percentage', field: 'discountPercentage', sortable: true, resizable: true, filter: true },
		{ headerName: 'Manufacturer License', field: 'manufacturerLicense', sortable: true, resizable: true, filter: true },
		{ headerName: 'Supplier Name', field: 'supplierName', sortable: true, resizable: true, filter: true },
		{ headerName: 'Status', field: 'Status', sortable: true, resizable: true, filter: true, width: 120 }
	];


	columnDefSupplierItemGrid: ColDef[] = [
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
		{ headerName: 'Supplier Name', field: 'supplierName', sortable: true, resizable: true, filter: true },
		{ headerName: 'Manufacturer Name', field: 'manufacturerName', resizable: true, sortable: true, filter: true },
		{ headerName: 'Item DESC', field: 'itemDescription', sortable: true, resizable: true, filter: true },
		{ headerName: 'Formulation', field: 'formulation', sortable: true, resizable: true, filter: true },
		{ headerName: 'Unit Rate', field: 'unitRate', sortable: true, resizable: true, filter: true },
		{ headerName: 'Discount Percentage', field: 'discountPercentage', resizable: true, sortable: true, filter: true },
		{ headerName: 'License', field: 'manufacturerLicense', resizable: true, sortable: true, filter: true },
		{ headerName: 'Item Name', field: 'itemName', sortable: true, resizable: true, filter: true, width: 280 },
		{ headerName: 'Status', field: 'Status', sortable: true, resizable: true, filter: true, width: 120 }
	];


	editGrid() {
		this.edit = false;
		if (this.type == 'Y') {
			this.onItemSupplierRowSelected(this.itemSupplierGridOptions.api.getSelectedRows()[0].itemSupplierId);
		}
		else {
			this.onSupplierItemRowSelected(this.itemSupplierGridOptions.api.getSelectedRows()[0].itemSupplierId)
		}
	}


	getAllItemsByLimit(start, end) {
		this.itemService.getItemsByLimit(start, end).subscribe(itemResponse => {
			if (itemResponse instanceof Object) {
				if (itemResponse['responseStatus']['code'] === 200) {
					this.itemsArray = itemResponse['result'];
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


	onItemSupplierRowSelected(itemSupplierId: string) {
		this.selectedItemSupplier = this.ItemSuppliers.find(itemsupplier => itemsupplier['itemSupplierId'] == itemSupplierId);

		this.selectedAddItemSupplierItem = this.selectedItemSupplier['itemName'];
		if (this.selectedItemSupplier != null && undefined) {
			this.selectedItem = this.items.find(itemSupplier => itemSupplier['itemId'] == this.selectedItemSupplier['itemId']);
			this.selectedSupplier = this.unMappedSuppliers.find(itemSupplier => itemSupplier['supplierId'] == this.selectedItemSupplier['supplierId'])
		}
		this.selectedAddItemSupplierSupplier = this.selectedItemSupplier['supplierName'];
		this.selectedPriority = this.selectedItemSupplier['supplierPriority']
		this.activeSID = this.selectedItemSupplier['activeS']
		this.unitRate = this.selectedItemSupplier['unitRate']
		this.validity = this.selectedItemSupplier['validity']
		this.discountPercentage = this.selectedItemSupplier['discountPercentage']
	}

	onSupplierItemRowSelected(itemSupplierId: string) {
		this.selectedItemSupplier = this.unMappedSuppliers.find(itemSupplier => itemSupplier['itemSupplierId'] == itemSupplierId);
		if (this.selectedItemSupplier != null) {
			this.selectedSupplier = this.unMappedSuppliers.find(itemSupplier => itemSupplier['supplierId'] == this.selectedItemSupplier['supplierId']);
			this.selectedItem = this.unMappedItems.find(itemsupplier => itemsupplier['itemId']) == this.selectedItemSupplier['itemId']
		}
		this.selectedAddItemSupplierSupplier = this.selectedItemSupplier['supplierName'];
		this.selectedAddItemSupplierItem = this.selectedItemSupplier['itemName'];
		this.selectedPriority = this.selectedItemSupplier['supplierPriority']
		this.activeSDI = this.selectedItemSupplier['activeS']
		this.unitRate = this.selectedItemSupplier['unitRate']
		this.validity = this.selectedItemSupplier['validity']
		this.discountPercentage = this.selectedItemSupplier['discountPercentage']
	}


	updateItemSupplier() {
		if (this.selectedAddItemSupplierItem) {
			if (this.type == 'Y') {
				this.object = {
					'itemSupplierId': this.selectedItemSupplier['itemSupplierId'],
					'itemsId': this.selectedItemSupplier['itemId'], 'suppliersId': this.selectedItemSupplier['supplierId'],
					'activeS': this.activeSID, 'supplierPriority': this.selectedPriority, 'validity': this.validity,
					'unitRate': this.unitRate, 'discountPercentage': this.discountPercentage, 'lastUpdateUser': localStorage.getItem('id'),
					'createdUser': localStorage.getItem('id')
				}
			}
			else {
				this.object = {
					'itemSupplierId': this.selectedItemSupplier['itemSupplierId'],
					'itemsId': this.selectedItemSupplier['itemId'], 'suppliersId': this.selectedItemSupplier['supplierId'],
					'activeS': this.activeSDI, 'supplierPriority': this.selectedPriority, 'validity': this.validity,
					'unitRate': this.unitRate, 'discountPercentage': this.discountPercentage, 'lastUpdateUser': localStorage.getItem('id'),
					'createdUser': localStorage.getItem('id')
				}
			}
			this.spinnerService.show();

			this.itemSuppliersService.updateItemSupplierData(this.object).subscribe(
				getItemSupplierDataResponse => {
					if (getItemSupplierDataResponse instanceof Object) {
						if (getItemSupplierDataResponse['responseStatus']['code'] === 200) {
							this.edit = true;
							this.spinnerService.hide();
							if (this.type == 'Y') {
								this.getItemSuppliersGrid(this.selectedItemSupplier['itemId']);
								this.resetInitialValues();
							}
							else {
								this.getSuppliersItemsGrid(this.selectedItemSupplier['supplierId']);
								this.resetInitialValues();
							}
							this.reset();
							this.toasterService.success(getItemSupplierDataResponse['message'], 'Updated', {
								timeOut: 3000
							})
							this.spinnerService.hide();
							this.edit = false;
						}

						this.selectedAddItemSupplierItem = undefined;
						this.selectedAddItemSupplierSupplier = undefined;
					}
				}, error => {
					this.spinnerService.hide();
					this.toasterService.warning('Please contact administrator', 'Error Occurred', {
						timeOut: 3000
					});
				}
			)
		}
	}
	getAllItemsBySearch(itemSearchTerm: string) {
		this.itemService.getAllItemDataByItemNameSearch(itemSearchTerm).subscribe(
			itemServiceResponse => {
				if (itemServiceResponse instanceof Object) {
					if (itemServiceResponse['responseStatus']['code'] === 200) {
						this.items = itemServiceResponse['result'];
					}
				}
			}
		);
	}

	getUnMappedSuppliersData(itemId: number, searchTerm: string) {
		this.itemSuppliersService.getUnMappedSuppliers(itemId, searchTerm).subscribe(
			unMappedSupplierData => {
				if (unMappedSupplierData instanceof Object) {
					if (unMappedSupplierData['responseStatus']['code'] === 200) {
						this.unMappedSuppliers = unMappedSupplierData['result'];
					}
				}
			}
		);
	}

	getUnMappedItemData(supplierId: number, searchTerm: string) {
		this.itemSuppliersService.getUnMappedItemData(supplierId, searchTerm).subscribe(
			unMappedSupplierData => {
				if (unMappedSupplierData instanceof Object) {
					if (unMappedSupplierData['responseStatus']['code'] === 200) {
						this.unMappedItems = unMappedSupplierData['result'];
					}
				}
			}
		);
	}

	getSuppliersData(searchTerm: string) {
		this.itemSuppliersService.getSuppliersData(searchTerm).subscribe(
			supplierServiceResponse => {
				if (supplierServiceResponse instanceof Object) {
					if (supplierServiceResponse['responseStatus']['code'] === 200) {
						this.suppliers = supplierServiceResponse['result'];
					}
				}
			}
		);
	}

	onItemSearchTermChanged(searchTerm: string) {
		this.itemSearchTerm = searchTerm;
		this.getAllItemsBySearch(this.itemSearchTerm);
	}

	selectedItem: Object = {};

	onItemSelected(item: any) {
		this.selectedItemName = item.itemName;
		this.selectedAddItemSupplierItem = item;
		this.getUnMappedSuppliersData(this.selectedAddItemSupplierItem.itemId, this.supplierSearchTerm);
		this.getItemSuppliersGrid(this.selectedAddItemSupplierItem.itemId);
		this.showItem = false;
		this.itemSupplierGridOptions.columnDefs = this.columnDefs;
		this.flagItem = true;
		this.flagDistr = false;
	}

	onSupplierSelected(Supplier: any) {

		this.selectedSupplierName = Supplier.name;
		this.selectedAddItemSupplierSupplier = Supplier;
		this.getUnMappedItemData(this.selectedAddItemSupplierSupplier.supplierId, this.supplierSearchTerm);
		this.getSuppliersItemsGrid(this.selectedAddItemSupplierSupplier.supplierId);
		this.showSupplier = false;
		this.itemSupplierGridOptions.columnDefs = this.columnDefSupplierItemGrid;
		this.flagItem = false;
		this.flagDistr = true;
	}

	onUnMappedSupplierSelected(unMappedSuppliers: any) {
		this.selectedUnMappedSupplierNames = unMappedSuppliers.name;
		this.selectedSupplier = unMappedSuppliers;
		this.showUnmappedSuppliers = false;
	}

	onSupplierItemSelected(unMappedItems: any) {
		this.selectedUnMappedItemNames = unMappedItems.itemName;
		this.selectedItem = unMappedItems;
		this.showUnMappedItems = false;
	}

	selectedSupplier: Object = {};
	onSupplierSearchTermChanged(searchTerm: string) {
		this.supplierSearchTerm = searchTerm;
		this.getSuppliersData(this.supplierSearchTerm);
	}

	selectedUnMappedSuppliers: any[] = [];

	onCheckedItems(selectedSuppliers: any[]) {
		this.selectedUnMappedSuppliers = selectedSuppliers;
		this.selectedUnMappedSupplierNames = this.selectedUnMappedSuppliers.map(x => x.name).join(",");
	}

	onUnMappedSupplierSearchChanged(searchTerm) {
		this.unMappedSupplierSearchTerm = searchTerm;
		this.getUnMappedSuppliersData(this.selectedItem['itemId'], this.supplierSearchTerm);
	}


	selectedUnMappedItems: any[] = [];

	onUnMappedCheckedItems(selectedUnMappedItems: any[]) {
		this.selectedUnMappedItems = selectedUnMappedItems;
		this.selectedUnMappedItemNames = this.selectedUnMappedItems.map(x => x.itemName).join(",")
	}

	onUnMappedItemSearchChanged(searchTerm) {
		this.ItemSearchTerm = searchTerm;
		this.getUnMappedItemData(this.selectedSupplier['supplierId'], this.supplierSearchTerm);
	}

	onUnMappedItemsSelected(item) {
	}

	priorityList = [1, 2, 3];

	type: string = 'Y';
	activeSID: string = 'Y';
	activeSDI: string = 'Y';
	unitRate: string = '';
	validity: string = '';
	discountPercentage: string;

	onTypeChanged($event) {
		if (this.type == 'N') {
			this.showGrid = false;
			this.getAllSuppliers();
			this.reset();

		} else if (this.type == 'Y') {
			this.showGrid = false;
			this.reset();
			this.getAllItemsByLimit(1, 200);
		}
	}

	reset() {
		this.showGrid = false;
		this.suppliersArray = [];
		this.itemsArray = [];
		this.unMappedItems = [];
		this.unMappedSuppliers = [];
		this.activeSID = 'Y';
		this.unitRate = '';
		this.validity = '';
		this.discountPercentage = undefined;
		this.activeSDI = 'Y';
		this.selectedAddItemSupplierItem = undefined;
		this.selectedAddItemSupplierSupplier = undefined;
		this.selectedAddItemSupplierSupplier = undefined;
		this.selectedAddItemSupplierItem = undefined;
		this.selectedPriority = undefined;
		this.itemSupplierInformationForm.reset();
		this.getAllItemsByLimit(1, 200);
		this.getAllSuppliers();
	}


	checkSaveDisability(): boolean {
		if (this.type === 'Y' && this.selectedItem instanceof Object && this.selectedSupplier) {
			return true;
		}
		else if (this.type === 'N' && this.selectedSupplier instanceof Object && this.selectedItem) {
			return true;
		}
	}

	onChangePriority(selectedPrior) {
		this.selectedPriority = selectedPrior;
	}

	selectedDate(selected) {
		this.validity = selected['target']['value'];
	}

	resetSearchTerm: boolean = false;

	resetInitialValues() {
		this.getAllItemsBySearch(this.itemSearchTerm);
		this.getSuppliersData(this.supplierSearchTerm);
		this.selectedSupplier = {};
		this.selectedItem = {};
		this.activeSID = 'Y';
		this.activeSDI = 'Y';
		this.unitRate = '';
		this.validity = '';
		this.discountPercentage = undefined;
		this.resetSearchTerm = !this.resetSearchTerm;
		this.selectedItemName = 'Select';
		this.selectedSupplierName = 'Select';
		this.selectedUnMappedSupplierNames = 'Select';
		this.selectedUnMappedItemNames = 'Select';
		this.showItem = false;
		this.showSupplier = false;
		this.showUnmappedSuppliers = false;
		this.showUnMappedItems = false;
		this.selectedPriority = undefined;

		this.selectedAddItemSupplierItem = undefined;
		this.selectedAddItemSupplierSupplier = undefined;
		this.suppliersArray = [];
		this.itemsArray = [];
		this.unMappedSuppliers = [];
		this.unMappedItems = [];
	}

	rowData = [];

	getItemSuppliersGrid(itemId: number) {
		this.showGrid = false;
		this.itemSuppliersService.getItemSupplierItemIdSearch(itemId).subscribe(
			gridDataResponse => {
				if (gridDataResponse instanceof Object) {
					if (gridDataResponse['responseStatus']['code'] === 200) {
						this.rowData = gridDataResponse['result'];
						for (let i = 0; i < this.rowData.length; i++) {
							if (this.rowData[i].activeS == 'Y') {
								this.rowData[i].Status = 'Active'
							}
							else if (this.rowData[i].activeS == 'N') {
								this.rowData[i].Status = 'DeActive'
							}
						}
						this.ItemSuppliers = this.rowData;
						this.showGrid = true;
					}
				}
			}
		)
	}


	getSuppliersItemsGrid(SupplierId: number) {
		this.spinnerService.show();
		this.showGrid = false;
		this.itemSuppliersService.getSupplierItemSupplierIdSearch(SupplierId).subscribe(
			gridDataResponse => {
				if (gridDataResponse instanceof Object) {
					if (gridDataResponse['responseStatus']['code'] === 200) {
						this.spinnerService.hide();
						this.rowData = gridDataResponse['result'];
						for (let i = 0; i < this.rowData.length; i++) {
							if (this.rowData[i].activeS == 'Y') {
								this.rowData[i].Status = 'Active'
							}
							else if (this.rowData[i].activeS == 'N') {
								this.rowData[i].Status = 'DeActive'
							}
						}
						this.unMappedSuppliers = this.rowData;
						this.showGrid = true;
					}
				}
			}
		)

	}

	getAllSuppliers() {
		this.itemService.getRowDataFromServerofSuppliers().subscribe(
			gridRowDataResponse => {
				if (gridRowDataResponse instanceof Object) {
					if (gridRowDataResponse['responseStatus']['code'] === 200) {
						this.suppliersArray = gridRowDataResponse['result'];
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


	itemsArray: any[] = [];
	suppliersArray: any[] = [];
	searchItem(searchKey) {
		if (searchKey['term'] != "") {
			this.itemSuppliersService.getItemByName(searchKey['term']).subscribe(SearchRes => {
				if (SearchRes['responseStatus']['code'] == 200) {
					this.itemsArray = SearchRes['result'];
				}
			});
		}
	}

	searchSupplier(searchKey) {
		if (searchKey['term'] != "") {
			this.itemSuppliersService.getSupplierByName(searchKey['term']).subscribe(SearchRes => {
				if (SearchRes['responseStatus']['code'] == 200) {
					this.suppliersArray = SearchRes['result']
				}
			});
		}
	}

	onMouseEnter() {
		this.barCodeScanned = undefined
	}
}