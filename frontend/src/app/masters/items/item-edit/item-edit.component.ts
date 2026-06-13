import { Item } from './../shared/item.model';
import { GridOptions, ColDef, IGetRowsParams, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from './../shared/item.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.scss']
})

export class ItemEditComponent implements OnInit {

  selectedTax;
  taxArray: any[] = [{ taxCategoryId: 4, categoryCode: "A", categoryValue: 14 }, { taxCategoryId: 2, categoryCode: "B", categoryValue: 0 },
  { taxCategoryId: 3, categoryCode: "E", categoryValue: 0 }];
  item: Item[] = [];
  items: any[] = [];
  paginationSize = 50;
  cacheOverflowSize;
  maxConcurrentDatasourceRequests;
  infiniteInitialRowCount;

  itemsSearchKeyArray = [
    { name: 'Item Code' },
    { name: 'Item Name' },
    { name: 'Item Description' },
    { name: 'Item Generic Name' }
  ];
  selectedItem = { name: 'Item Name' }
  searchKey = null;
  itemForm: FormGroup;
  rowCount: number = 0;
  manufacturerlist = [];
  specializations = [];
  itemGroups = [];
  itemCategories = [];
  itemForms = [];
  itemGenericNames = [];
  totalItems: any[] = [];
  searchCriteria;

  constructor(private itemService: ItemService,
    private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService,
    private toasterService: ToastrService) {
    this.itemService.getItemsCountBySearch("", "").subscribe(data => {
      if (data['responseStatus']['code'] === 200) {
        this.rowCount = data['result'];
      }
    });
    this.itemGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };

    this.itemGridOptions.rowSelection = 'single';
    this.itemGridOptions.columnDefs = this.columnDefs;
    this.getAllItemGroupsData('M', this.groupCodeSearchTerm);
    this.getAllFormCodeData('M', this.formCodeSearchTerm);
    this.getAllItemCategories('M', this.itemCategorySearchTerm);
    this.getScheduleCodes();
    this.getLatinCodes();
    this.cacheOverflowSize = 2;
    this.maxConcurrentDatasourceRequests = 2;
    this.infiniteInitialRowCount = 2;
    this.itemGridOptions.cacheBlockSize = 50;
    this.itemGridOptions.rowModelType = 'infinite';
    this.getAllManufacturersByLimit(0, 200);
    this.getAllItemsByLimit(1, 300);

    this.itemGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }
  }

  itemGroupId: number = 0;

  ngOnInit() {
    this.buildForm();
    this.getItemCategories();
    this.getSpecializations();
    this.getIssueUOMS();
    this.getPurchaseUOMS();
    this.getAllTaxCategories();
    $(document).ready(function () {
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

  buildForm() {
    this.singleSelectValuesPayload = {
      itemGroup: null,
      specialization: null,
      itemGenericName: null,
      itemForm: null,
      manufacturer: null,
      itemCategory: null,
      purchaseUnitMeasurementId: null,
      issueUnitOfMeasurementId: null,
      alternativeItemId: null,
      scheduleCode: null,
      latinCode: null,
      alertMessage: null,
      storage: null
    };

    this.showGroupCode = false;
    this.showGenericCode = false;
    this.showFormCode = false;
    this.showManufacturer = false;
    this.showItemCategory = false;
    this.showSpecialization = false;
    this.showPurchaseUOM = false;
    this.showIssueUOM = false;

    this.itemForm = this.formBuilder.group({
      itemId: [''],
      itemName: ['', Validators.required],
      itemDescription: ['', [Validators.required]],
      itemCode: [''],
      medicalOrNonMedical: ['M'],
      itemGroup: ['', [Validators.required]],
      itemGenericName: [''],
      itemForm: ['', Validators.required],
      itemCategory: ['',],
      manufacturer: ['', Validators.required],
      specification: [''],
      specialization: [''],
      temperature: [''],
      itemUsage: [''],
      activeS: ['Y'],
      purchaseUnitMeasurementId: ['', [Validators.required]],
      drugDose: [''],
      issueUnitOfMeasurementId: ['', [Validators.required]],
      rackNumber: [''],
      shelfNumber: [''],
      reOrderLevel: new FormControl('', Validators.pattern(/^[0-9]*$/)),
      reOrderQuantity: new FormControl('', Validators.pattern(/^[0-9]*$/)),
      alertMessage: [''],
      storage: [''],
      tax: new FormControl('', Validators.required),
      pack: new FormControl('', Validators.required),
      barcode: new FormControl(''),
    });
  }


  unMappedItems: any[] = [];

  selectedGroupCode: any;
  selectedFormCode: any;
  selectedCategory: any;
  selectedSpecialization: any;
  selectedManufacturer: any;
  selectedGenericCode: any;
  selectedPurchaseUom: any;
  selectedIssueUom: any;
  selectedAlternateDrugs: any[] = [];
  selectedScheduleCode: any;
  selectedLatinCode: any;
  alertMessage: any;
  storage: any;


  getItemCategories() {
    this.itemService.getItemCategoriesMapWithItems().subscribe((res: any) => {
      if (res instanceof Object) {
        if (res.responseStatus.code === 200) {
          this.itemCategories = res.result;
        }
      }
    },
      err => {
      });
  }

  public getSpecializations() {
    this.itemService.getSpecializations().subscribe((res: any) => {
      this.specializations = res.result;
    },
      err => {
      });
  }

  public getItemGenericaNames() {
    this.itemService.getItemGenericaNames().subscribe((res: any) => {
      this.itemGenericNames = res.result;
    },
      err => {
      });
  }

  getAllManufacturersByLimit(start, end) {
    this.itemService.getManufacturersByLimit(start, end).subscribe(itemResponse => {
      if (itemResponse instanceof Object) {
        if (itemResponse['responseStatus']['code'] === 200) {
          this.manufacturerlist = itemResponse['result'];
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

  manufacturerSearch(event) {
    this.itemService.getManufacturersByNameSearch(event['term']).subscribe(response => {
      if (response instanceof Object) {
        if (response['responseStatus']['code'] === 200) {
          this.manufacturerlist = response['result'];
        }
      }
    })
  }

  clearSearchTerms() {
    this.itemGroupId = 0;
    this.groupCodeSearchTerm = 'All';
    this.genericCodeSearchTerm = 'All';
    this.formCodeSearchTerm = 'All';
    this.itemCategorySearchTerm = 'All';
    this.specializationSearchTerm = 'All';
    this.issueCodeSearchTerm = 'All';
    this.manufacturerSearchTerm = 'All';
    this.purchaseSearchTerm = 'All';
  }

  validateItemResponse(response: any) {
    if (response['responseStatus']['code'] === 200) {
      this.itemForm.reset();
      this.toasterService.success('message', 'Success', {
        timeOut: 3000
      })
    } else {
      this.toasterService.error(response['responseStatus']['message'], 'Error Occurred', {
        timeOut: 5000
      });
    }
  }

  groupCodeSearchTerm: string = 'All';
  genericCodeSearchTerm: string = 'All';
  formCodeSearchTerm: string = 'All';
  itemCategorySearchTerm: string = 'All';
  specializationSearchTerm: string = 'All';
  issueCodeSearchTerm: string = 'All';
  manufacturerSearchTerm: string = 'All';
  purchaseSearchTerm: string = 'All';

  selectedGroupItem: any = {};
  showGroupCode: boolean = false;
  showGenericCode: boolean = false;
  showFormCode: boolean = false;
  showManufacturer: boolean = false;
  showItemCategory: boolean = false;
  showSpecialization: boolean = false;
  showPurchaseUOM: boolean = false;
  showIssueUOM: boolean = false;
  showItemAlternate: boolean = false;

  showScheduleCode: boolean = false;
  showLatinCode: boolean = false;
  showAlertMsg: boolean = false;
  showStorageDesc: boolean = false;

  singleSelectValuesPayload = {
    itemGroup: null,
    specialization: null,
    itemGenericName: null,
    itemForm: null,
    manufacturer: null,
    itemCategory: null,
    purchaseUnitMeasurementId: null,
    issueUnitOfMeasurementId: null,
    alternativeItemId: null,
    scheduleCode: null,
    latinCode: null,
    alertMessage: null,
    storage: null
  };



  onGroupCodeChanged(item: any) {
    //console.log(item)
    this.showGroupCode = false;
    //this.itemForm.patchValue({ itemGroup: item['groupCode'], itemGenericName: '' });
    this.singleSelectValuesPayload.itemGroup = item;
    this.getAllItemGenericNamesdata(this.itemForm.get('medicalOrNonMedical').value, this.groupCodeSearchTerm, item.itemGroupId)
    this.singleSelectValuesPayload.itemGenericName = item;
    this.itemGroupId = item.itemGroupId;
  }

  onGenericCodeChanged(item: any) {
    this.showGenericCode = false;
    this.singleSelectValuesPayload.itemGenericName = item;
    //this.itemForm.patchValue({ 'itemGenericName': item });
  }

  onUnMappedCheckedItems(item: any) {
    this.showItemAlternate = false;
    this.singleSelectValuesPayload.alternativeItemId = item;
    this.itemForm.patchValue({ 'alternativeItemId': item['itemName'] })
  }

  onItemCategoryChanged(item: any) {
    this.showItemCategory = false;
    this.singleSelectValuesPayload.itemCategory = item;
    this.itemForm.patchValue({ 'itemCategory': item['categoryCode'] });
  }

  changedFormCode: any;
  onFormCodeChanged(itemForm) {
    this.changedFormCode = itemForm;
    this.showFormCode = false;
    this.singleSelectValuesPayload.itemForm = itemForm;
    this.itemForm.patchValue({ 'itemForm': itemForm['formCode'] });
  }

  onManufacturerChanged(item) {
    if (item != undefined && item != null && item != '') {
      this.showManufacturer = false;
      this.singleSelectValuesPayload.manufacturer = item;
      this.itemForm.patchValue({ 'manufacturer': item['name'] });
    }
    else {
      this.showManufacturer = false;
      this.singleSelectValuesPayload.manufacturer = null;
      this.itemForm.patchValue({ 'manufacturer': null });
    }
  }

  onItemTypeChanged(event: Event) {
    this.itemForm.patchValue({
      medicalOrNonMedical: event.target['value'],
      itemGroup: '',
      itemGenericName: '',
      itemForm: '',
      itemCategory: '',
      purchaseUnitMeasurementId: '',
      issueUnitOfMeasurementId: '',
      name: ''
    });
    this.clearSearchTerms();
    this.getAllItemGroupsData(event.target['value'], this.groupCodeSearchTerm);
    this.getAllFormCodeData(event.target['value'], this.formCodeSearchTerm);
    this.getAllItemCategories(event.target['value'], this.itemCategorySearchTerm);
    this.getItemCategories();
  }

  onSpecilizationChanged(item) {
    this.showSpecialization = false;
    this.singleSelectValuesPayload.specialization = item;
    this.itemForm.patchValue({ 'specialization': item['specializationName'] });
  }

  checkFormDisability() {
    return (this.itemForm.get('itemName').errors instanceof Object)
      || (this.itemForm.get('manufacturer').errors instanceof Object)
      || (this.itemForm.get('tax').errors instanceof Object)
      || (this.itemForm.get('pack').errors instanceof Object)
      || (this.itemForm.get('itemDescription').errors instanceof Object)
      || (this.itemForm.get('itemGroup').errors instanceof Object)
      // || (this.itemForm.get('itemGenericName').errors instanceof Object)
      || (this.itemForm.get('purchaseUnitMeasurementId').errors instanceof Object)
      || (this.itemForm.get('issueUnitOfMeasurementId').errors instanceof Object)
      || (this.itemForm.get('itemForm').errors instanceof Object)
  }

  onMedicalSelected(event) {
    //console.log(event)
    if (event.target.checked) {
      this.getAllItemGroupsData('M', this.groupCodeSearchTerm);
    }
  }
  onNonMedicalSelected(event) {
    //console.log(event)
    if (event.target.checked) {
      this.getAllItemGroupsData('N', this.groupCodeSearchTerm);
    }
  }

  getAllItemGroupsData(medicalOrNonMedical: string, groupCodeSearchTerm: string) {
    this.itemService.getAllItemGroupsData(medicalOrNonMedical, groupCodeSearchTerm).subscribe(
      itemResponse => {
        if (itemResponse instanceof Object) {
          if (itemResponse['responseStatus']['code'] === 200) {
            this.itemGroups = itemResponse['result'];
          }
        }
      }
    );
  }


  getAllFormCodeData(medicalOrNonMedical: string, formCodeSearchTerm: string) {
    this.itemService.getItemFormsBySearch(medicalOrNonMedical, formCodeSearchTerm).subscribe(
      itemResponse => {
        if (itemResponse instanceof Object) {
          if (itemResponse['responseStatus']['code'] === 200) {
            this.itemForms = itemResponse['result'];
          }
        }
      }
    )
  }

  getAllSpecializationsData(specializationSearchTerm: string) {
    this.itemService.getSpecializationBySearch(specializationSearchTerm).subscribe(
      itemResponse => {
        if (itemResponse instanceof Object) {
          if (itemResponse['responseStatus']['code'] === 200) {
            this.specializations = itemResponse['result'];
          }
        }
      }
    )
  }


  getAllPurchaseUnits(purchaseSearchTerm: string) {
    this.itemService.getAllPurchaseUOMBBySearch(purchaseSearchTerm).subscribe(
      itemResponse => {
        if (itemResponse instanceof Object) {
          if (itemResponse['responseStatus']['code'] === 200) {
            this.purchaseUOMS = itemResponse['result'];
          }
        }
      }
    )
  }


  getAllIssueUnits(issueCodeSearchTerm: string) {
    this.itemService.getAllIssueUOMBBySearch(issueCodeSearchTerm).subscribe(
      itemResponse => {
        if (itemResponse instanceof Object) {
          if (itemResponse['responseStatus']['code'] === 200) {
            this.issueUOMS = itemResponse['result'];
          }
        }
      }
    )
  }

  getAllManufacturers(manufacturerSearchTerm: string) {
    this.itemService.getAllManufacturersBySearch(manufacturerSearchTerm).subscribe(
      itemResponse => {
        if (itemResponse instanceof Object) {
          if (itemResponse['responseStatus']['code'] === 200) {
            this.manufacturerlist = itemResponse['result'];
          }
        }
      }
    )

  }

  getAllItemCategories(medicalOrNonMedical: string, itemCategorySearchTerm: string) {
    this.itemService.getAllItemCategoriesBySearch(medicalOrNonMedical, itemCategorySearchTerm).subscribe(
      itemResponse => {
        if (itemResponse instanceof Object) {
          if (itemResponse['responseStatus']['code'] === 200) {
            this.itemCategories = itemResponse['result'];
          }
        }
      }
    )
  }

  genericNotAvailableMsg
  showGenericMsg: boolean
  getAllItemGenericNamesdata(medicalOrNonMedical: string, genericCodeSearchTerm: string, selectedGroupCodeId: number) {
    this.itemService.getAllItemGenericNamesdata(medicalOrNonMedical, genericCodeSearchTerm, selectedGroupCodeId).subscribe(
      itemResponse => {
        if (itemResponse instanceof Object) {
          if (itemResponse['responseStatus']['code'] === 200) {
            if (!itemResponse['result'] || !itemResponse['result'].length) {
              this.showGenericMsg = true
              this.genericNotAvailableMsg = "Generics data not available for the item group selected";
            } else {
              this.showGenericMsg = false
              this.genericNotAvailableMsg = undefined
            }
            this.itemGenericNames = itemResponse['result'];
          }
        }
      }
    );
  }

  onGenericCodeSearchTermChanged(genericCodeSearchTerm: string) {
    this.genericCodeSearchTerm = genericCodeSearchTerm;
    this.getAllItemGenericNamesdata(this.itemForm.get('medicalOrNonMedical').value, this.genericCodeSearchTerm, this.itemGroupId);
  }

  onGroupCodeSearchTermChanged(groupCodeSearchTerm: string) {
    this.groupCodeSearchTerm = groupCodeSearchTerm;
    this.getAllItemGroupsData(this.itemForm.get('medicalOrNonMedical').value, this.groupCodeSearchTerm);
  }

  onFormCodeSearchTermChanged(formCodeSearchTerm: string) {
    this.formCodeSearchTerm = formCodeSearchTerm;
    this.getAllFormCodeData(this.itemForm.get('medicalOrNonMedical').value, this.formCodeSearchTerm)
  }

  onSpecializationCodeSearchTermChanged(specializationSearchTerm: string) {
    this.specializationSearchTerm = specializationSearchTerm;
    this.getAllSpecializationsData(this.specializationSearchTerm);
  }

  onItemCategorySearchTermChanged(itemCategorySearchTerm: string) {
    this.itemCategorySearchTerm = itemCategorySearchTerm;
    this.getAllItemCategories(this.itemForm.get('medicalOrNonMedical').value, this.itemCategorySearchTerm);
  }

  onManufacturerCodeSearchTermChanged(manufacturerSearchTerm: string) {
    this.manufacturerSearchTerm = manufacturerSearchTerm;
    this.getAllManufacturers(this.manufacturerSearchTerm);
  }

  onPurchaseUOMCodeSearchTermChanged(purchaseSearchTerm: string) {
    this.purchaseSearchTerm = purchaseSearchTerm;
    this.getAllPurchaseUnits(this.purchaseSearchTerm);
  }

  onIssueUOMCodeSearchTermChanged(issueCodeSearchTerm: string) {
    this.issueCodeSearchTerm = issueCodeSearchTerm;
    this.getAllIssueUnits(this.issueCodeSearchTerm);
  }


  purchaseUOMS: any[] = [];
  issueUOMS: any[] = [];

  getPurchaseUOMS() {
    this.itemService.getPurchaseUOMS().subscribe(
      purchaseUOMS => {
        if (purchaseUOMS instanceof Object) {
          if (purchaseUOMS['responseStatus']['code'] === 200) {
            this.purchaseUOMS = purchaseUOMS['result'];
          }
        }
      }
    );
  }

  getIssueUOMS() {
    this.itemService.getIssueUOMS().subscribe(
      issueUOMS => {
        if (issueUOMS instanceof Object) {
          if (issueUOMS['responseStatus']['code'] === 200) {
            this.issueUOMS = issueUOMS['result'];
          }
        }
      }
    );
  }

  getAllItems() {
    this.itemService.getLimitedItems().subscribe(itemResponse => {
      if (itemResponse instanceof Object) {
        if (itemResponse['responseStatus']['code'] === 200) {
          this.unMappedItems = itemResponse['result'];
          this.spinnerService.hide();
        }
      }

    },
      error => {
        this.rowData = [];
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          });
      })
  }

  getAllItemsByLimit(start, end) {
    this.itemService.getItemsByLimit(start, end).subscribe(itemResponse => {
      if (itemResponse instanceof Object) {
        if (itemResponse['responseStatus']['code'] === 200) {
          this.unMappedItems = itemResponse['result'];
          this.spinnerService.hide();
        }
      }

    },
      error => {
        this.rowData = [];
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          });
      })
  }

  itemGroup: any[];
  itemGenericName: any;
  purchaseUnitMeasurementId: any;
  selectedIssueUoms: any;
  issueUnitOfMeasurementId: any;

  reset() {
    this.itemForm.reset();
    this.itemForm.controls.activeS.setValue('Y');
    this.itemForm.controls.medicalOrNonMedical.setValue('M');
    this.selectedGroupCode = undefined;
    this.selectedFormCode = undefined;
    this.selectedCategory = undefined;
    this.selectedSpecialization = undefined;
    this.selectedManufacturer = undefined;
    this.selectedGenericCode = undefined;
    this.selectedPurchaseUom = undefined;
    this.selectedIssueUom = undefined;
    this.selectedAlternateDrugs = undefined;
    this.alertMessage = undefined;
    this.selectedLatinCode = undefined;
    this.storage = undefined;
    this.selectedScheduleCode = undefined;
    this.itemGroup = undefined;
  }

  itemObjectVales = {};

  retrievedArray: any;

  editGrid() {
    let selectedItem = this.itemGridOptions.api.getSelectedRows()[0];

    this.itemService.getItemBasedOnItemId(selectedItem['itemId']).subscribe(
      res => {
        if (res['responseStatus']['code'] === 200) {
          this.retrievedArray = res['result'];
          this.itemObjectVales = {
            itemId: this.retrievedArray['itemId'] != null && this.retrievedArray['itemId'] != undefined ? this.retrievedArray['itemId'] : null,
            itemName: this.retrievedArray['itemName'] != null && this.retrievedArray['itemName'] != undefined ? this.retrievedArray['itemName'] : null,
            itemDescription: this.retrievedArray['itemDescription'] != null && this.retrievedArray['itemDescription'] != undefined ? this.retrievedArray['itemDescription'] : null,
            itemCode: this.retrievedArray['itemCode'] != null && this.retrievedArray['itemCode'] != undefined ? this.retrievedArray['itemCode'] : null,
            medicalOrNonMedical: this.retrievedArray['medicalOrNonMedical'] != null && this.retrievedArray['medicalOrNonMedical'] != undefined ? this.retrievedArray['medicalOrNonMedical'] : null,
            itemGroup: this.retrievedArray['itemGroup'] != null && this.retrievedArray['itemGroup'] != undefined ? this.retrievedArray['itemGroup'] : null,
            itemGenericName: this.retrievedArray['itemGenericName'] != null && this.retrievedArray['itemGenericName'] != undefined ? this.retrievedArray['itemGenericName'] : null,
            itemForm: this.retrievedArray['itemForm'] != null && this.retrievedArray['itemForm'].formCode != undefined ? this.retrievedArray['itemForm']['formCode'] : null,
            itemCategory: this.retrievedArray['itemCategory'] != null && this.retrievedArray['itemCategory'].categoryDescription != undefined ? this.retrievedArray['itemCategory']['categoryDescription'] : null,
            manufacturer: this.retrievedArray['manufacturer'] != null && this.retrievedArray['manufacturer'] != undefined ? this.retrievedArray['manufacturer']['name'] : null,
            specification: this.retrievedArray['specification'] != null && this.retrievedArray['specification'] != undefined ? this.retrievedArray['specification'] : null,
            specialization: this.retrievedArray['specialization'] != null && this.retrievedArray['specialization']['specializationName'] != undefined ? this.retrievedArray['specialization']['specializationName'] : null,
            temperature: this.retrievedArray['temperature'] != null && this.retrievedArray['temperature'] != undefined ? this.retrievedArray['temperature'] : null,
            itemUsage: this.retrievedArray['itemUsage'] != null && this.retrievedArray['itemUsage'] != undefined ? this.retrievedArray['itemUsage'] : null,
            activeS: this.retrievedArray['activeS'] != null && this.retrievedArray['activeS'] != undefined ? this.retrievedArray['activeS'] : null,
            drugDose: this.retrievedArray['drugDose'] != null && this.retrievedArray['drugDose'] != undefined ? this.retrievedArray['drugDose'] : null,
            purchaseUnitMeasurementId: this.retrievedArray['purchaseUnitMeasurementId'],
            issueUnitOfMeasurementId: this.retrievedArray['issueUnitOfMeasurementId'],
            tax: this.retrievedArray['tax'] != null && this.retrievedArray['tax'] != undefined ? this.retrievedArray['tax']['categoryCode'] : null,
            rackNumber: this.retrievedArray['rackNumber'] != null && this.retrievedArray['rackNumber'] != undefined ? this.retrievedArray['rackNumber'] : null,
            shelfNumber: this.retrievedArray['shelfNumber'] != null && this.retrievedArray['shelfNumber'] != undefined ? this.retrievedArray['shelfNumber'] : null,
            reOrderLevel: this.retrievedArray['reOrderLevel'] != null && this.retrievedArray['reOrderLevel'] != undefined ? this.retrievedArray['reOrderLevel'] : null,
            reOrderQuantity: this.retrievedArray['reOrderQuantity'] != null && this.retrievedArray['reOrderQuantity'] != undefined ? this.retrievedArray['reOrderQuantity'] : null,
            alertMessage: this.retrievedArray['alertMessage'],
            storage: this.retrievedArray['storage'],
            pack: this.retrievedArray['pack'],
            barcode: this.retrievedArray['barcode']
          }
          this.itemForm.setValue(this.itemObjectVales);

          this.itemGroup = this.retrievedArray['itemGroup'] != null && this.retrievedArray['itemGroup'] != undefined ? this.retrievedArray['itemGroup'] : undefined;
          this.selectedFormCode = this.retrievedArray['itemForm'] != null && this.retrievedArray['itemForm'] != undefined ? this.retrievedArray['itemForm'] : undefined;
          this.selectedCategory = this.retrievedArray['itemCategory'] != null && this.retrievedArray['itemCategory'] != undefined ? this.retrievedArray['itemCategory'] : undefined;
          this.selectedSpecialization = this.retrievedArray['specialization'] != null && this.retrievedArray['specialization'] != undefined ? this.retrievedArray['specialization'] : undefined;
          this.selectedManufacturer = this.retrievedArray['manufacturer'] != null && this.retrievedArray['manufacturer'] != undefined ? this.retrievedArray['manufacturer'] : undefined;
          this.itemGenericName = this.retrievedArray['itemGenericName'] != null && this.retrievedArray['itemGenericName'] != undefined ? this.retrievedArray['itemGenericName'] : undefined;
          this.purchaseUnitMeasurementId = this.retrievedArray['purchaseUnitMeasurementId'];
          this.issueUnitOfMeasurementId = this.retrievedArray['issueUnitOfMeasurementId'];
          this.selectedTax = this.retrievedArray['tax'] != null && this.retrievedArray['tax'] != undefined ? this.retrievedArray['tax'] : null;;
          this.selectedLatinCode = this.retrievedArray['latinCode'] != null && this.retrievedArray['latinCode'] != undefined ? this.retrievedArray['latinCode']['latinShortCode'] ? this.retrievedArray['latinCode']['latinShortCode'] : '' + ' : ' + this.retrievedArray['latinCode']['latinShortCodeDesc'] ? this.retrievedArray['latinCode']['latinShortCodeDesc'] : '' : null;
          this.selectedScheduleCode = this.retrievedArray['scheduleCode'] != null && this.retrievedArray['scheduleCode'] != undefined ? this.retrievedArray['scheduleCode']['scheduleCategoryCode'] ? this.retrievedArray['scheduleCode']['scheduleCategoryCode'] : '' + ':' + this.retrievedArray['scheduleCode']['scheduleCategoryDesc'] ? this.retrievedArray['scheduleCode']['scheduleCategoryDesc'] : '' : null;
          this.alertMessage = this.retrievedArray['alertMessage'];
          this.storage = this.retrievedArray['storage'];

          this.onGroupCodeChanged(this.itemGroup)

        }
      }
    )


    this.itemService.getAlternativeItemsBasedonItem(selectedItem).subscribe(res => {
      this.selectedAlternateDrugs = [];
      if (res['responseStatus']['code'] === 200) {
        if (res['result'] != null && res['result']['length'] > 0) {
          this.spinnerService.show();

          this.itemService.getItemsByItemName(selectedItem['itemName']).subscribe(res => {
            if (res['responseStatus']['code'] === 200) {
              this.unMappedItems = [];
              this.unMappedItems = res['result'];

              this.spinnerService.hide();
            }
          },
            error => {
              this.spinnerService.hide();
              this.unMappedItems = [];
              this.toasterService.error("Please contact administrator",
                "Error Occurred",
                {
                  timeOut: 5000
                });
            })

          this.selectedAlternateDrugs = res['result'];

          this.spinnerService.hide();
        }
      }
    });
  }
  taxValue: any;

  getAllTaxCategories() {
    this.itemService.getAllActiveSTaxes().subscribe(taxRes => {
      if (taxRes instanceof Object) {
        if (taxRes['responseStatus']['code'] === 200) {
          this.taxValue = taxRes['result'][0];
        }
      }
    })
  }

  onIssuUomChanged: any;
  onIssueUOMChanged(item: any) {
    this.onIssuUomChanged = item;
    this.showIssueUOM = false;
    this.singleSelectValuesPayload.issueUnitOfMeasurementId = item;
    this.itemForm.patchValue({ 'issueUnitOfMeasurementId': item['measurementDesc'] })
  }

  onpurchaseUomChanged: any;
  onPurchaseUOMChanged(item: any) {
    this.onpurchaseUomChanged = item;
    this.showPurchaseUOM = false;
    this.singleSelectValuesPayload.purchaseUnitMeasurementId = item;
    this.itemForm.patchValue({ 'purchaseUnitMeasurementId': item['measurementDesc'] })
  }

  changedAlert: any;
  changedStorage: any;
  onAlertChanged(event) {
    this.changedAlert = event['alertMessage']
  }

  onStorageChanged(event) {
    this.changedStorage = event['name']
  }

  formatPayload() {
    let payload = Object.assign({}, this.itemForm.value);
    payload['itemGenericName'] = this.itemGenericName != null && this.itemGenericName != undefined ? this.itemGenericName : null;
    payload['itemForm'] = this.changedFormCode != null && this.changedFormCode != undefined ? this.changedFormCode : this.retrievedArray['itemForm'];
    payload['itemGroup'] = this.itemGroup != null && this.itemGroup != undefined ? this.itemGroup : null;
    payload['itemCategory'] = this.selectedCategory != null && this.selectedCategory ? this.selectedCategory : null;
    payload['specialization'] = this.selectedSpecialization != null && this.selectedSpecialization != undefined ? this.selectedSpecialization : null;
    payload['manufacturer'] = this.selectedManufacturer != null && this.selectedManufacturer != undefined ? this.selectedManufacturer : null;
    payload['purchaseUnitMeasurementId'] = this.onpurchaseUomChanged != null && this.onpurchaseUomChanged != undefined ? this.onpurchaseUomChanged : { 'unitMeasurementId': this.purchaseUnitMeasurementId['unitMeasurementId'] };
    payload['issueUnitOfMeasurementId'] = this.onIssuUomChanged != null && this.onIssuUomChanged != undefined ? this.onIssuUomChanged : { 'unitMeasurementId': this.issueUnitOfMeasurementId['unitMeasurementId'] };
    payload['alternativeItemId'] = this.selectedAlternateDrugs != null && this.selectedAlternateDrugs != undefined ? this.selectedAlternateDrugs : null;
    payload['scheduleCode'] = this.changedScheduleCode != null && this.changedScheduleCode != undefined ? this.changedScheduleCode : this.retrievedArray['scheduleCode'];
    payload['latinCode'] = this.changedLatinCode != null && this.changedLatinCode != undefined ? this.changedLatinCode : this.retrievedArray['latinCode'];
    payload['storage'] = this.changedStorage != null && this.changedStorage != undefined ? this.changedStorage : this.retrievedArray['storage'];
    payload['alertMessage'] = this.changedAlert != null && this.changedAlert != undefined ? this.changedAlert : this.retrievedArray['alertMessage'];
    payload['pharmacy'] = { "pharmacyId": 1 };
    payload['createdUser'] = localStorage.getItem('id');
    payload['lastUpdateUser'] = localStorage.getItem('id');
    if (this.selectedTax['categoryCode'] == 'A') {
      payload['tax'] = { 'taxCategoryId': this.taxValue['taxCategoryId'] };
    }

    if (this.itemForm.get('barcode').value) {
      let scannedCode = this.itemForm.get('barcode').value.replace(/\s/g, "")
      /*if (scannedCode.length > 13) {
        payload['barcode'] = scannedCode.substring(3, 16)
      } else {
        payload['barcode'] = scannedCode
      }*/

      payload['barcode'] = scannedCode
    }

    return payload;
  }



  onSubmit() {

    /*if (this.itemForm.get('medicalOrNonMedical').value === 'M') {
      if (!this.itemForm.get('barcode').value) {
        this.toasterService.warning("Please provide barcode", "", {
          timeOut: 5000
        })

        return;
      }
    }*/
   
    this.showGenericMsg = false;
    this.genericNotAvailableMsg = undefined
    this.itemForm.get('itemDescription').setErrors({ 'incorrect': true });
    this.spinnerService.show();
    this.itemService.updateItem(this.formatPayload()).subscribe((saveUpdateRes: any) => {
      if (saveUpdateRes['responseStatus']['code'] === 200) {
        if (saveUpdateRes['responseStatus']['code'] === 200) {
          if (this.selectedAlternateDrugs.length <= 0) {
            this.searchItems();
          }
          this.spinnerService.hide();
          this.toasterService.success(saveUpdateRes['message'], 'Success', {
            timeOut: 3000
          });
        }
        let result = saveUpdateRes['result'];
        if (this.selectedAlternateDrugs.length >= 1) {
          this.itemService.updateItemAlternativeBasedOnItem({ 'itemAlternativeModels': this.selectedAlternateDrugs, 'item': result }).subscribe(
            alternativeItemRes => {
              if (alternativeItemRes['responseStatus']['code'] === 200) {
                this.searchItems();
                this.toasterService.success(alternativeItemRes['message'], 'Success', {
                  timeOut: 3000
                });
                this.buildForm();
                this.clearSearchTerms();
                this.selectedTax = undefined;
              }
            }
          );
        }
        if (this.selectedAlternateDrugs.length <= 0) {
          this.buildForm();
          this.clearSearchTerms();
        }
      }
    }, error => {
      this.spinnerService.hide();
      this.toasterService.error('Item can`t be Deactivated', 'Failed', {
        timeOut: 5000
      });
    }

    );
  }

  /**
   * Grid Changes
   * Start
   */
  itemGridOptions: GridOptions;
  showGrid: boolean = true;

  latinCodes = [];
  scheduleCodes = [];
  storages = [
    { name: 'Adequate Temperature' },
    { name: 'Cold Storage' },
    { name: 'Sufficient Lighting' },
    { name: 'humidity Control' }
  ];

  Alert = [
    { alertMessage: 'Banned' },
    { alertMessage: 'Out Of Stock' },
    { alertMessage: 'Low Item Stock' },
    { alertMessage: 'Expired Stock' },
    { alertMessage: 'Temp Stock' },
    { alertMessage: 'Alternate Medicine' },
    { alertMessage: 'Side Effects' }
  ];

  onScheduleCodeChanged(item) {
    this.changedScheduleCode = item;
    this.showScheduleCode = false;
    this.singleSelectValuesPayload.scheduleCode = item;
    this.itemForm.patchValue({ 'scheduleCode': item['scheduleCategoryDesc'] });
  }

  changedLatinCode: any;
  changedScheduleCode: any;

  onLatinCodeChanged(item) {
    this.changedLatinCode = item;
    this.showLatinCode = false;
    this.singleSelectValuesPayload.latinCode = item;
    // this.itemForm.patchValue({ 'latinCode': item['latinShortCodeDesc'] });
  }

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
      width: 40,
    },
    { headerName: 'Medical or Non Medical', field: 'medicalOrNonMedical', sortable: true, resizable: true, filter: true, },
    { headerName: 'Item Code', field: 'itemCode', sortable: true, resizable: true, filter: true, },
    { headerName: 'Item Name', field: 'itemName', sortable: true, resizable: true, filter: true, cellRenderer: this.tooltipRenderer, },
    { headerName: 'Description', field: 'itemDescription', sortable: true, resizable: true, filter: true, },
    { headerName: 'Dosage', field: 'drugDose', sortable: true, resizable: true, filter: true }
  ];

  onClickItemGroupName(event: Event) {
    this.searchCriteria = event['target']['value'];
  }

  onQuickChanged(event: Event) {
    let searchTerm = event['target']['value'];
    if (this.searchCriteria == 'Item Name') {
      this.itemService.getAllItemDataByItemNameSearch(searchTerm).subscribe(gridRowDataResponse => {
        if (gridRowDataResponse['responseStatus']['code'] === 200) {
          this.totalItems = gridRowDataResponse['result'];
          for (let i = 0; i < this.totalItems.length; i++) {
            if (this.totalItems[i].activeS == 'Y') {
              this.totalItems[i].Status = 'Active'
            }
            else if (this.totalItems[i].activeS == 'N') {
              this.totalItems[i].Status = 'DeActive'
            }
          }
          this.showGrid = true;

          if (this.itemGridOptions.api.getDisplayedRowCount() == 0) {
            this.itemGridOptions.api.showNoRowsOverlay();
          } else {
            this.itemGridOptions.api.hideOverlay();
          }
        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
        }
      }
      )
    } else if (this.searchCriteria == "ItemDescription") {
      this.itemService.getAllItemDescDataByItemDesc(searchTerm).subscribe(
        gridRowDataResponse => {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.totalItems = gridRowDataResponse['result'];
            for (let i = 0; i < this.totalItems.length; i++) {
              if (this.totalItems[i].activeS == 'Y') {
                this.totalItems[i].Status = 'Active'
              }
              else if (this.totalItems[i].activeS == 'N') {
                this.totalItems[i].Status = 'DeActive'
              }
            }
            this.showGrid = true;

          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
          }
        }
      )
    } else if (this.searchCriteria == "GroupCode") {
      this.itemService.getAllItemsByGroupCodeSearch(searchTerm).subscribe(
        gridRowDataResponse => {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.totalItems = gridRowDataResponse['result'];
            for (let i = 0; i < this.totalItems.length; i++) {
              if (this.totalItems[i].activeS == 'Y') {
                this.totalItems[i].Status = 'Active'
              }
              else if (this.totalItems[i].activeS == 'N') {
                this.totalItems[i].Status = 'DeActive'
              }
            }
            this.showGrid = true;
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
          }
        }
      )
    } else if (this.searchCriteria == "GenericName") {
      this.itemService.getAllItemsByGenericNameSearch(searchTerm).subscribe(
        gridRowDataResponse => {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.totalItems = gridRowDataResponse['result'];
            for (let i = 0; i < this.totalItems.length; i++) {
              if (this.totalItems[i].activeS == 'Y') {
                this.totalItems[i].Status = 'Active'
              }
              else if (this.totalItems[i].activeS == 'N') {
                this.totalItems[i].Status = 'DeActive'
              }
            }
            this.showGrid = true;
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
          }
        }
      )
    }
  }

  rowData = [];
  getGridRowData() {
    this.showGrid = true;
    this.itemService.getItems().subscribe(
      gridRowDataResponse => {
        if (gridRowDataResponse instanceof Object) {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridRowDataResponse['result'];
            this.totalItems = this.rowData;
            for (let i = 0; i < this.totalItems.length; i++) {
              if (this.totalItems[i].activeS == 'Y') {
                this.totalItems[i].Status = 'Active'
              }
              else if (this.totalItems[i].activeS == 'N') {
                this.totalItems[i].Status = 'DeActive'
              }
            }
            this.showGrid = true;
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

  getLatinCodes() {
    this.itemService.getLatinCodes().subscribe(
      getLatinCodeResponse => {
        if (getLatinCodeResponse instanceof Object) {
          if (getLatinCodeResponse['responseStatus']['code'] === 200) {
            this.latinCodes = getLatinCodeResponse['result'];
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

  getScheduleCodes() {
    this.itemService.getScheduleCodes().subscribe(
      getScheduleCodeResponse => {
        if (getScheduleCodeResponse instanceof Object) {
          if (getScheduleCodeResponse['responseStatus']['code'] === 200) {
            this.scheduleCodes = getScheduleCodeResponse['result'];
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
  searchItems() {
    this.pageNumber = 0;
    this.itemService.getItemsCountBySearch(this.searchKey, this.selectedItem['name']).subscribe(data => {
      if (data['responseStatus']['code'] === 200) {
        this.rowCount = data['result'];
        this.itemGridOptions.api.setDatasource(this.datasource);
      }
    });
  }

  alternativeItemSearch(event) {
    this.spinnerService.show();
    this.itemService.getItemsByItemName(event['target']['value']).subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.unMappedItems = res['result']
        this.spinnerService.hide();
      }
    },
      error => {
        this.spinnerService.hide();
        this.unMappedItems = [];
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          });
      })
  }


  pageNumber = 0;
  datasource = {
    getRows: (params: IGetRowsParams) => {
      this.spinnerService.show();
      if (this.selectedItem['name'] != undefined && this.searchKey != null) {
        this.itemService.getItemsbySearchKeyAndCode(this.searchKey, this.selectedItem['name'], this.pageNumber, 50).subscribe(data => {
          params.successCallback(data['result'], this.rowCount)
          if (data['responseStatus']['code'] === 200) {
            if (data['result'].length > 0) {
              this.pageNumber++;
              this.spinnerService.hide();
            }
            else {
              this.spinnerService.hide();
              this.toasterService.error("Please contact administrator",
                "Error Occurred",
                {
                  timeOut: 5000
                });
            }
          }
        },
          error => {
            this.spinnerService.hide();
            this.rowData = [];
            this.toasterService.error("Please contact administrator",
              "Error Occurred",
              {
                timeOut: 5000
              });
          });
      }
      else {
        this.itemService.getItemsByLimit(this.pageNumber, 50).subscribe(data => {
          params.successCallback(data['result'], this.rowCount)
          if (data['responseStatus']['code'] === 200) {
            if (data['result'].length > 0) {
              this.pageNumber++;
              this.spinnerService.hide();
            }
            else {
              this.spinnerService.hide();
              this.toasterService.error("Please contact administrator",
                "Error Occurred",
                {
                  timeOut: 5000
                });
            }
          }
        },
          error => {
            this.spinnerService.hide();
            this.rowData = [];
            this.toasterService.error("Please contact administrator",
              "Error Occurred",
              {
                timeOut: 5000
              });
          });
      }
    }
  }
  onGridReady(params) {
  }

  onPaginationChanged(params) {
  }

}
