import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ItemsSupplierService } from './../shared/Items-Supplier.service';
import { ItemService } from './../../items/shared/item.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
	selector: 'add-item-supplier',
	templateUrl: 'add-item-supplier.component.html',
	providers: [ItemsSupplierService]
})


export class AddItemSupplierComponent implements OnInit {
	constructor(private itemSuppliersService: ItemsSupplierService, private itemService: ItemService,
		private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {

		this.itemSupplierGridOptions = <GridOptions>{
			context: {
				componentParent: this
			}
		};
		this.itemSupplierGridOptions.rowSelection = 'single';
		this.itemSupplierGridOptions.columnDefs = this.columnDefs;
		this.getAllItemsByLimit(1, 200);

		this.itemSupplierGridOptions.getRowStyle = function (params) {
			if (params.node.rowIndex % 2 !== 0) {
				return { background: '#cccccc' }
			}
		}
	}

	itemSupplierGridOptions: GridOptions;
	showGrid: boolean = false;
	flagItem: boolean = false;
	flagDistr: boolean = false;

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

	selectedAddItemSupplierItem: any;
	selectedAddItemSupplierSupplier: any;

	showItem: boolean = false;
	showSupplier: boolean = false;
	showUnmappedSuppliers: boolean = false;
	showUnMappedItems: boolean = false;

	itemSupplierInformationForm: FormGroup;
	itemSupplierInformationValidation = {
		//	unitRate: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){1,5}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{1,5})|(\+\([\d]{1,3}\)\s)([\d]{1,5})|(\([\d]{1,3}\)\s)([\d]{1,5})|(\([\d]{1,3}\))([\d]{1,5})|([\d]{1,3})([\d]{1,5})|(\([\d]{1,3}\)[-])([\d]{1,5})|([\d]{1,3}\s)([\d]{1,5})|([\d]{1,3}[-])([\d]{1,5})|(\+[\d]{1,3}\s)([\d]{1,5})|(\+[\d]{1,3})([\d]{1,5})|(\+[\d]{1,3}[-])([\d]{1,5})|([\d]{1,5})|(\s)+))$/)]),
		unitRate: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),

		discountPercentage: new FormControl('', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
		validity: new FormControl('', [Validators.required]),
	}

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
	searchKey: string;
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
		{ headerName: 'Manufacturer Name', field: 'manufacturerName', sortable: true, filter: true },
		{ headerName: 'Item Name', field: 'itemName', sortable: true, filter: true, width: 280, cellRenderer: this.tooltipRenderer },
		{ headerName: 'Item Desc', field: 'itemDescription', sortable: true, filter: true },
		{ headerName: 'Formulation', field: 'formulation', sortable: true, filter: true },
		{ headerName: 'Manufacturer License', field: 'manufacturerLicense', sortable: true, filter: true },
		{ headerName: 'Supplier Name', field: 'supplierName', sortable: true, filter: true },
		{ headerName: 'Unit Rate', field: 'unitRate', sortable: true, filter: true },
		{ headerName: 'Discount Percentage', field: 'discountPercentage', sortable: true, filter: true },
		{ headerName: 'Status', field: 'Status', sortable: true, filter: true, width: 120 }
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
		{ headerName: 'Supplier Name', field: 'supplierName', sortable: true, filter: true },
		{ headerName: 'Manufacturer Name', field: 'manufacturerName', sortable: true, filter: true },
		{ headerName: 'Item DESC', field: 'itemDescription', sortable: true, filter: true },
		{ headerName: 'License', field: 'manufacturerLicense', sortable: true, filter: true },
		{ headerName: 'Formulation', field: 'formulation', sortable: true, filter: true },
		{ headerName: 'Item Name', field: 'itemName', sortable: true, filter: true, width: 280 },
		{ headerName: 'Unit Rate', field: 'unitRate', sortable: true, filter: true },
		{ headerName: 'Discount Percentage', field: 'discountPercentage', sortable: true, filter: true },
		{ headerName: 'Status', field: 'Status', sortable: true, filter: true, width: 120 }
	];

	priorityList = [1, 2, 3];

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

	itemsArrays: any[] = [];
	getUnMappedItemData(supplierId: number, searchTerm: string) {
		this.itemSuppliersService.getUnMappedItemData(supplierId, searchTerm).subscribe(
			unMappedSupplierData => {
				if (unMappedSupplierData instanceof Object) {
					if (unMappedSupplierData['responseStatus']['code'] === 200) {
						this.itemsArrays = unMappedSupplierData['result'];
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
		this.spinnerService.show();
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

	type: string = 'Y';
	activeSID: string = 'Y';
	activeSDI: string = 'Y';
	unitRate: string = '';
	validity: string = '';
	discountPercentage: string = '';

	onTypeChanged($event) {
		if (this.type == 'N') {
			this.showGrid = false;
			this.reset();
			this.getAllSuppliers();
		} else if (this.type == 'Y') {
			this.showGrid = false;
			this.reset();
			this.getAllItemsByLimit(1, 300);
		}
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


	searchSupplier(searchKey) {
		if (searchKey['term'] != "") {
			this.itemSuppliersService.getSupplierByName(searchKey['term']).subscribe(SearchRes => {
				if (SearchRes['responseStatus']['code'] == 200) {
					this.suppliersArray = SearchRes['result'];
				}
			});
		}
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

	onSaveItemSupplier() {
		let object = {
			'itemsId': this.selectedAddItemSupplierItem['itemId'], 'suppliersId': this.selectedAddItemSupplierSupplier['supplierId'],
			'activeS': this.activeSID, 'supplierPriority': this.selectedPriority, 'validity': this.validity,
			'unitRate': this.unitRate, 'discountPercentage': this.discountPercentage, 'lastUpdateUser': localStorage.getItem('id'),
			'createdUser': localStorage.getItem('id')
		}

		this.itemSupplierInformationForm.get('unitRate').setErrors({ 'incorrect': true });
		this.spinnerService.show();
		this.itemSuppliersService.saveItemSuppliers(object).subscribe(
			savedItemSupplierResponse => {
				if (savedItemSupplierResponse['responseStatus']['code'] === 200) {
					if (this.flagItem) {
						this.getItemSuppliersGrid(this.selectedAddItemSupplierItem.itemId);
					}
					else if (this.flagDistr) {
						this.getSuppliersItemsGrid(this.selectedAddItemSupplierSupplier.supplierId);
					}
					this.selectedAddItemSupplierItem = undefined;
					this.selectedAddItemSupplierSupplier = undefined;
					this.reset();
					this.getAllItemsByLimit(1, 300);
					this.resetInitialValues();
					this.spinnerService.hide();
					this.toasterService.success(savedItemSupplierResponse['message'], 'Success', {
						timeOut: 3000
					})
				}
			}, error => {
				this.spinnerService.hide();
				this.toasterService.warning('Please contact administrator', 'Error Occurred', {
					timeOut: 3000
				});
			}
		)
	}


	checkSaveDisability(): boolean {
		if (this.itemSupplierInformationForm.get('unitRate').errors instanceof Object ||
			this.itemSupplierInformationForm.get('discountPercentage').errors instanceof Object ||
			this.itemSupplierInformationForm.get('validity').errors instanceof Object) {
			return false;
		}
		if (this.type === 'Y' && this.selectedItem instanceof Object && this.selectedSupplier) {
			return true;
		}
		else if (this.type === 'N' && this.selectedSupplier instanceof Object && this.selectedItem) {
			return true;
		}
	}


	selectedDate(selected) {
		this.validity = selected['target']['value'];
	}

	onChangePriority(selectedPrior) {
		this.selectedPriority = selectedPrior;
	}

	reset() {
		this.itemSupplierInformationForm.reset();
		this.showGrid = false;
		this.suppliersArray = [];
		this.itemsArray = [];
		this.unMappedItems = [];
		this.unMappedSuppliers = [];
		this.activeSID = 'Y';
		this.unitRate = '';
		this.validity = '';
		this.discountPercentage = '';
		this.activeSDI = 'Y';
		this.selectedAddItemSupplierItem = undefined;
		this.selectedAddItemSupplierSupplier = undefined;
		this.selectedAddItemSupplierSupplier = undefined;
		this.selectedAddItemSupplierItem = undefined;
		this.selectedPriority = undefined;
		this.getAllItemsByLimit(1, 300);
	}

	resetSearchTerm: boolean = false;

	resetInitialValues() {
		this.getAllItemsBySearch(this.itemSearchTerm);
		this.getSuppliersData(this.supplierSearchTerm);
		this.selectedSupplier = {};
		this.selectedItem = {};
		this.activeSID = 'Y';
		this.unitRate = '';
		this.validity = '';
		this.discountPercentage = '';
		this.activeSDI = 'Y';
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
		//latest
		this.suppliersArray = [];
		this.itemsArray = [];
		this.unMappedItems = [];
		this.unMappedSuppliers = [];
		this.itemSupplierInformationForm.reset();
		this.getAllItemsByLimit(1, 300);
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
						this.showGrid = true;
					}
				}
			}
		)
	}


	getSuppliersItemsGrid(SupplierId: number) {
		this.showGrid = false;
		this.itemSuppliersService.getSupplierItemSupplierIdSearch(SupplierId).subscribe(
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
						this.showGrid = true;
					}
				}
			}
		)
	}


	onMouseEnter() {
		this.barCodeScanned=undefined
	}

}