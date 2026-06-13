import { ToastrService } from 'ngx-toastr';
import { ItemService } from './../shared/item.service';
import { Item } from './../shared/item.model';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})

export class ItemComponent implements OnInit {

  selectedTax;
  taxArray: any[] = [{ taxCategoryId: 4, categoryCode: "A", categoryValue: 14 }, { taxCategoryId: 2, categoryCode: "B", categoryValue: 0 },
  { taxCategoryId: 3, categoryCode: "E", categoryValue: 0 }];
  item: Item[] = [];
  items: any[] = [];
  itemForm: FormGroup;
  manufacturerlist = [];
  suppliersList = [];
  specializations = [];
  itemGroups = [];
  itemCategories = [];
  itemForms = [];
  itemGenericNames = [];
  totalItems: any[] = [];
  selectedUnMappedItems: any[] = [];
  selectedUnMappedItemNames: string = 'Select';
  unMappedItemSearchTerm: string = '';
  showUnMappedItems: boolean = false;
  unMappedItems: any[] = [];
  itemSearchTerm: string = '';

  latinCodes = [];
  scheduleCodes = [];
  storages = [
    { name: 'Adequate Temperature' },
    { name: 'Cold Storage' },
    { name: 'Sufficient Lighting' },
    { name: 'Humidity Control' }
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

  constructor(private itemService: ItemService,
    private formBuilder: FormBuilder,
    private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService,) {
    this.getAllItemGroupsData('M', this.groupCodeSearchTerm);
    this.getAllFormCodeData('M', this.formCodeSearchTerm);
    this.getAllItemCategories('M', this.itemCategorySearchTerm);
    this.getScheduleCodes();
    this.getLatinCodes();
    this.getAllManufacturersByLimit(0, 200);
    this.getAllItemsByLimit(1, 300);
    this.getAllTaxCategories();
  }

  itemGroupId: number = 0;
  groupCodeSearchTerm: string = 'All';
  genericCodeSearchTerm: string = 'All';
  formCodeSearchTerm: string = 'All';
  itemCategorySearchTerm: string = 'All';
  specializationSearchTerm: string = 'All';
  issueCodeSearchTerm: string = 'All';
  manufacturerSearchTerm: string = 'All';
  purchaseSearchTerm: string = 'All';

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
  selectedAlertMessage: any;
  selectedStorage: any;

  taxValue: any;

  getAllTaxCategories() {
    this.itemService.getAllActiveSTaxes().subscribe(taxRes => {
      if (taxRes instanceof Object) {
        if (taxRes['responseStatus']['code'] === 200) {
          this.taxArray = taxRes['result']
          this.taxValue = taxRes['result'][0];
          // console.log(this.taxValue)
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

  ngOnInit() {
    this.buildForm();
    this.getItemCategories();
    this.getSpecializations();
    this.getIssueUOMS();
    this.getPurchaseUOMS();
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
      scheduleCode: null,
      latinCode: null,
      storageCode: null,
      alertMsg: null
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
      itemName: ['', Validators.required],
      itemDescription: ['', [Validators.required]],
      itemCode: [''],
      medicalOrNonMedical: ['M'],
      itemGroup: ['', Validators.required],
      itemGenericName: [''],
      itemForm: ['', Validators.required],
      itemCategory: [''],
      manufacturer: ['', Validators.required],
      specification: [''],
      specialization: [''],
      temperature: [''],
      itemUsage: [''],
      activeS: ['Y'],
      purchaseUnitMeasurementId: ['', Validators.required],
      drugDose: [''],
      issueUnitOfMeasurementId: ['', Validators.required],
      rackNumber: [''],
      shelfNumber: [''],
      reOrderLevel: new FormControl('', Validators.pattern(/^[0-9]*$/)),
      reOrderQuantity: new FormControl('', Validators.pattern(/^[0-9]*$/)),
      alertMsg: [''],
      storageCode: [''],
      tax: new FormControl('', Validators.required),
      pack: new FormControl('', Validators.required),
      barcode: new FormControl(''),
    });
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
      purchaseUOMS => {
        if (purchaseUOMS instanceof Object) {
          if (purchaseUOMS['responseStatus']['code'] === 200) {
            this.issueUOMS = purchaseUOMS['result'];
          }
        }
      }
    );
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
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          });
      })
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
      var na = this.specializations.find(spec => spec.specializationCode == 'Na');
      this.singleSelectValuesPayload.specialization = na;
    },
      err => {
      });
  }

  reset() {
    this.itemForm.reset();
    this.selectedGroupCode = undefined;
    this.selectedFormCode = undefined;
    this.selectedCategory = undefined;
    this.selectedSpecialization = undefined;
    this.selectedManufacturer = undefined;
    this.selectedGenericCode = undefined;
    this.selectedPurchaseUom = undefined;
    this.selectedIssueUom = undefined;
    this.selectedAlternateDrugs = undefined;
    this.selectedAlertMessage = undefined;
    this.selectedLatinCode = undefined;
    this.selectedStorage = undefined;
    this.selectedScheduleCode = undefined;

  }

  formatPayload() {
    //console.log(this.selectedTax)
    let payload = Object.assign({}, this.itemForm.value);
    payload['groupCode'] = this.selectedGroupCode;
    payload['itemGenericName'] = this.selectedGenericCode;
    payload['itemForm'] = this.selectedFormCode != null && this.selectedFormCode != undefined ? this.selectedFormCode : null;
    payload['itemCategory'] = this.selectedCategory != null && this.selectedCategory ? this.selectedCategory : null;
    payload['specialization'] = this.selectedSpecialization != null && this.selectedSpecialization != undefined ? this.selectedSpecialization : null;
    payload['manufacturer'] = this.selectedManufacturer != null && this.selectedManufacturer != undefined ? this.selectedManufacturer : null;
    payload['purchaseUnitMeasurementId'] = this.selectedPurchaseUom;
    payload['issueUnitOfMeasurementId'] = this.selectedIssueUom;
    payload['scheduleCode'] = (this.selectedScheduleCode != null && this.selectedScheduleCode != undefined) ? this.selectedScheduleCode : { scheduleCategoryCodeId: 4 };
    payload['latinCode'] = (this.selectedLatinCode != null && this.selectedLatinCode != undefined) ? this.selectedLatinCode : { latinShortCodeId: 119 };
    payload['storage'] = (this.selectedStorage != null && this.selectedStorage != undefined) ? this.selectedStorage['name'] : null;
    payload['alertMessage'] = this.selectedAlertMessage != null && this.selectedAlertMessage != undefined ? this.selectedAlertMessage['alertMessage'] : null;
    payload['pharmacy'] = { "pharmacyId": 1 };
    payload['createdUser'] = localStorage.getItem('id');
    payload['lastUpdateUser'] = localStorage.getItem('id');

    if (this.itemForm.get('barcode').value) {
      let scannedCode = this.itemForm.get('barcode').value.replace(/\s/g, "")
      /*if (scannedCode.length > 13) {
        payload['barcode'] = scannedCode.substring(3, 16)
      } else {
        payload['barcode'] = scannedCode
      }*/

      payload['barcode'] = scannedCode
    }

    if (this.selectedTax['categoryCode'] == 'A') {
      payload['tax'] = { 'taxCategoryId': this.taxValue['taxCategoryId'] };
    }

    this.itemForm.get('itemName').setErrors({ 'incorrect': true });

    return payload;
  }

  onSubmit() {
    /*console.log(this.itemForm.get('medicalOrNonMedical').value)
    if (this.itemForm.get('medicalOrNonMedical').value === 'M') {
      if (!this.itemForm.get('barcode').value) {
        this.toasterService.warning("Please provide barcode", "", {
          timeOut: 5000
        })

        return;
      }
    }*/


    this.showGenericMsg = false;
    this.genericNotAvailableMsg = undefined

    this.spinnerService.show();
    this.itemService.saveItem(this.formatPayload()).subscribe((res: any) => {
      if (res['responseStatus']['code'] === 200) {
        this.spinnerService.hide();
        // console.log(res['result'])
        let result = res['result'];
        if (this.selectedAlternateDrugs != null && this.selectedAlternateDrugs != undefined && this.selectedAlternateDrugs.length >= 1) {
          this.itemService.saveAlternativeItems({ 'itemAlternativeModels': this.selectedAlternateDrugs, 'item': result }).subscribe(
            alternativeItemRes => {
              if (alternativeItemRes['responseStatus']['code'] === 200) {
                this.toasterService.success(alternativeItemRes['message'], 'Success', {
                  timeOut: 3000
                });
              }
            }, error => {
              this.spinnerService.hide();
              this.toasterService.error('alternative item not saved', 'Faild', {
                timeOut: 5000
              });
            }
          );
        }

        this.validateItemResponse(res);
        this.buildForm();
        this.clearSearchTerms();
        this.selectedAlertMessage = undefined;
        this.selectedLatinCode = undefined;
        this.selectedStorage = undefined;
        this.selectedScheduleCode = undefined;
        this.selectedGenericCode = undefined;
        this.selectedPurchaseUom = undefined;
        this.selectedIssueUom = undefined;
        this.selectedGroupCode = undefined;
        this.selectedFormCode = undefined;
        this.selectedCategory = undefined;
        this.selectedSpecialization = undefined;
        this.selectedManufacturer = undefined;
        this.selectedAlternateDrugs = undefined;
        this.selectedTax = undefined;
      }
    },
      err => { }
    );
  }

  validateItemResponse(response: any) {
    if (response['responseStatus']['code'] === 200) {
      this.reset();
      this.itemForm.reset();
      let na = this.specializations.find(spec => spec.specializationCode == 'NA');
      this.singleSelectValuesPayload.specialization = na;
      this.toasterService.success(response['message'], 'Success', {
        timeOut: 3000
      });

    } else {
      this.toasterService.error(response['responseStatus']['message'], 'Error Occurred', {
        timeOut: 5000
      });
    }
  }

  selectedGroupItem: any = {};
  showGroupCode: boolean = false;
  showGenericCode: boolean = false;
  showFormCode: boolean = false;
  showManufacturer: boolean = false;
  showItemCategory: boolean = false;
  showSpecialization: boolean = false;
  showPurchaseUOM: boolean = false;
  showIssueUOM: boolean = false;
  showScheduleCode: boolean = false;
  showLatinCode: boolean = false;
  showAlertMsg: boolean = false;
  showStorageDesc: boolean = false;

  singleSelectValuesPayload = {
    itemGroup: undefined,
    specialization: undefined,
    itemGenericName: undefined,
    itemForm: undefined,
    manufacturer: undefined,
    itemCategory: undefined,
    purchaseUnitMeasurementId: undefined,
    issueUnitOfMeasurementId: undefined,
    scheduleCode: undefined,
    latinCode: undefined,
    storageCode: undefined,
    alertMsg: undefined
  };

  onGroupCodeChanged(selectedGroupCode: any) {

    this.showGroupCode = false;
    //this.itemForm.patchValue({ itemGroup: selectedGroupCode['groupCode'], itemGenericName: '' });
    this.singleSelectValuesPayload.itemGroup = selectedGroupCode;

    this.getAllItemGenericNamesdata(this.itemForm.get('medicalOrNonMedical').value, this.groupCodeSearchTerm, selectedGroupCode.itemGroupId)
    this.singleSelectValuesPayload.itemGenericName = selectedGroupCode;
    this.itemGroupId = selectedGroupCode.itemGroupId;
    this.selectedGenericCode = undefined;
  }

  onGenericCodeChanged(item: any) {
    this.showGenericCode = false;
    this.singleSelectValuesPayload.itemGenericName = item;
  }


  onPurchaseUOMChanged(item: any) {
    this.showPurchaseUOM = false;
    this.singleSelectValuesPayload.purchaseUnitMeasurementId = item;
  }

  onIssueUOMChanged(item: any) {
    this.showIssueUOM = false;
    this.singleSelectValuesPayload.issueUnitOfMeasurementId = item;
    //this.itemForm.patchValue({ 'issueUnitOfMeasurementId': item['measurementDesc'] })
  }


  onItemCategoryChanged(item: any) {
    this.showItemCategory = false;
    this.singleSelectValuesPayload.itemCategory = item;
    //this.itemForm.patchValue({ 'itemCategory': item['categoryDescription'] });
  }

  onFormCodeChanged(itemForm) {

    this.showFormCode = false;
    this.singleSelectValuesPayload.itemForm = itemForm;
    // this.itemForm.patchValue({ 'itemForm': itemForm['formCode'] });
  }

  onManufacturerChanged(item) {
    this.showManufacturer = false;
    this.singleSelectValuesPayload.manufacturer = item;
    // this.itemForm.patchValue({ 'manufacturer': item['name'] });
  }

  onScheduleCodeChanged(item) {
    this.showScheduleCode = false;
    this.singleSelectValuesPayload.scheduleCode = item;
    //this.itemForm.patchValue({ 'scheduleCode': item['scheduleCategoryDesc'] });
  }

  onLatinCodeChanged(item) {
    this.showLatinCode = false;
    this.singleSelectValuesPayload.latinCode = item;
    //this.itemForm.patchValue({ 'latinCode': item['latinShortCodeDesc'] });
  }

  onAlertMessageChanged(item) {
    this.showAlertMsg = false;
    this.singleSelectValuesPayload.alertMsg = item;
    //this.itemForm.patchValue({ 'alertMessage': item['name'] });
  }

  onStorageChanged(item) {
    this.showStorageDesc = false;
    this.singleSelectValuesPayload.storageCode = item;
    //this.itemForm.patchValue({ 'storage': item['name'] })
  }


  resetSearchTerm: boolean = false;

  onItemTypeChanged(event: Event) {
    this.resetSearchTerm = !this.resetSearchTerm;
    this.itemForm.patchValue({
      medicalOrNonMedical: event.target['value'],
      itemGroup: '',
      itemGenericName: '',
      itemForm: '',
      itemCategory: ''
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

  //this is the search for dropddown but no need becoz ngselect provides default searching
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
    this.spinnerService.show()
    this.itemService.getAllItemGenericNamesdata(medicalOrNonMedical, genericCodeSearchTerm, selectedGroupCodeId).subscribe(
      itemResponse => {
        if (itemResponse instanceof Object) {
          if (itemResponse['responseStatus']['code'] === 200) {
            this.spinnerService.hide()
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
      }, error => {
        this.spinnerService.hide()
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

  onCheckedItems(selectedItems: any[]) {
    //no need i thindk
    this.selectedUnMappedItems = selectedItems;
    this.selectedUnMappedItemNames = this.selectedUnMappedItems.map(x => x.name).join(",");
  }
  onUnMappedItemsSelected(item) {
  }

  onUnMappedCheckedItems(selectedUnMappedItems: any[]) {
    this.selectedAlternateDrugs = selectedUnMappedItems;
    //	this.selectedUnMappedItems = selectedUnMappedItems;
    this.selectedUnMappedItemNames = this.selectedAlternateDrugs.map(x => x.itemName).join(",")

  }

  onUnMappedItemSearchChanged(searchTerm) {
    this.unMappedItemSearchTerm = searchTerm;
    this.getUnMappedItemData(this.itemSearchTerm);
  }

  getUnMappedItemData(searchTerm: string) {
    this.itemService.getAllItemDataByItemNameSearch(searchTerm).subscribe(
      unMappedItemsData => {
        if (unMappedItemsData instanceof Object) {
          if (unMappedItemsData['responseStatus']['code'] === 200) {
            this.unMappedItems = unMappedItemsData['result'];
          }
        }
      }
    );
  }

  getAllItems() {
    this.itemService.getItems().subscribe(itemResponse => {
      if (itemResponse instanceof Object) {
        if (itemResponse['responseStatus']['code'] === 200) {
          this.unMappedItems = itemResponse['result'];
        }
      }
    })
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

  alternativeItemSearch(event) {
    this.spinnerService.show();
    this.itemService.getItemsByItemName(event['target']['value']).subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.unMappedItems = res['result'];
        this.spinnerService.hide();
      }
    },
      error => {
        this.unMappedItems = [];
        this.spinnerService.hide();
        this.toasterService.error("Please contact administrator",
          "Error Occurred",
          {
            timeOut: 5000
          });
      })
  }
}
