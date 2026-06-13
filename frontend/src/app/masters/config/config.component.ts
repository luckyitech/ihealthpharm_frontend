import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GridOptions, ColDef } from 'ag-grid-community';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationService } from './configuration.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  constructor(private configurationService: ConfigurationService, private toasterService: ToastrService,
    private spinnerService: Ng4LoadingSpinnerService) {
    this.discountsGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };

    this.configGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };

    this.discountsGridOptions.columnDefs = this.columnDefs;
    this.configGridOptions.columnDefs = this.configColumnDefs;

    this.discountsForm = new FormGroup(this.discountsFormValidations);
    this.configForm = new FormGroup(this.configFormValidations);

    this.configStatusForm = new FormGroup(this.configStatusFormValidations);
    this.getConfigurationStatus();
  }
  discountsForm: FormGroup;
  discounts: any = [];
  discountsGridOptions: GridOptions;
  columnDefs: ColDef[] = [
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
      headerName: 'Discount', field: 'discountValue', sortable: true, resizable: true, filter: true,
    },
    {
      headerName: 'Active', field: 'activeS', sortable: true, resizable: true, filter: true,
    }
  ]

  discountsFormValidations = {
    discountId: new FormControl(),
    discountValue: new FormControl('', Validators.required),
    activeS: new FormControl('Y'),

    creationTimeStamp: new FormControl(new Date()),
    createdUser: new FormControl(localStorage.getItem('id')),
    lastUpdateTimestamp: new FormControl(new Date()),
    lastUpdateUser: new FormControl(localStorage.getItem('id')),
    pharmacyId: new FormControl(localStorage.getItem('pharmacyId')),
  }

  ngOnInit() {
    this.getAllDiscounts();
    this.getConfigurations();
  }

  getAllDiscounts() {

    this.configurationService.getAllDiscounts().subscribe(discountsRes => {
      if (discountsRes['responseStatus']['code'] === 200) {
        this.discounts = discountsRes['result'];
        this.discountsGridOptions.api.updateRowData(this.discounts);
        this.discountsGridOptions.api.forEachNode(node => {
        })
      }
    });
  }

  onSubmit() {
    this.spinnerService.show();
    let payload = Object.assign({}, this.discountsForm.value);

    for (var i = 0; i < this.configs.length; i++) {
      if (this.configs[i]['configDesc'] == 'maxdiscount' && this.configs[i]['activeS'] == 'Y') {
        if (payload.discountValue > this.configs[i]['configValue']) {
          this.toasterService.error('', 'Enterd value is grate than actual markup value', {
            timeOut: 5000
          });
          this.spinnerService.hide();
          return;
        }
      }
    }

    for (var i = 0; i < this.discounts.length; i++) {
      if (this.discounts[i].discountValue == payload.discountValue) {
        this.toasterService.error('Please enter unique markup value', 'Duplicate Entry', {
          timeOut: 5000
        });
        this.spinnerService.hide();
        return;
      }
    }
    this.configurationService.saveDiscount(payload).subscribe(discountSaveRes => {
      if (discountSaveRes['responseStatus']['code'] === 200) {
        this.spinnerService.hide();
        this.toasterService.success(discountSaveRes['message'], '', {
          timeOut: 5000
        });
        this.resetDiscountsForm();
        this.getAllDiscounts();
      }
    },
      error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      });
  }

  resetDiscountsForm() {
    this.discountsForm.reset();
    this.discountsForm.patchValue({
      activeS: 'Y',
      maximumDiscount: 0,
      creationTimeStamp: (new Date()),
      createdUser: (localStorage.getItem('id')),
      lastUpdateTimestamp: (new Date()),
      lastUpdateUser: (localStorage.getItem('id')),
      pharmacyId: (localStorage.getItem('pharmacyId')),
    });
  }

  configForm: FormGroup;
  configs: any = [];
  configGridOptions: GridOptions;
  configColumnDefs: ColDef[] = [
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
      headerName: 'Configuration Desc', field: 'configDesc', sortable: true, resizable: true, filter: true,
      valueGetter: function (params) {
        if (params.data.configDesc == 'maxdiscount') {
          return 'Markup';
        }

        if (params.data.configDesc == 'margin') {
          return 'Margin';
        }
      }
    },
    {
      headerName: 'Configuration Value', field: 'configValue', sortable: true, resizable: true, filter: true,
    },
    {
      headerName: 'Active Status', field: 'activeS', sortable: true, resizable: true, filter: true,
    }
  ]

  configFormValidations = {
    configId: new FormControl(),
    configValue: new FormControl('', Validators.required),
    configDesc: new FormControl(''),
    activeS: new FormControl('Y'),
    creationTimeStamp: new FormControl(new Date()),
    createdUser: new FormControl(localStorage.getItem('id')),
    lastUpdateTimestamp: new FormControl(new Date()),
    lastUpdateUser: new FormControl(localStorage.getItem('id')),
    pharmacyId: new FormControl(localStorage.getItem('pharmacyId')),
  }

  onSubmitConfig() {
    this.spinnerService.show();
    let payload = Object.assign({}, this.configForm.value);
    for (var i = 0; i < this.configs.length; i++) {
      if (this.configs[i].configValue == payload.configValue && this.configs[i].configDesc == payload.configDesc) {
        this.toasterService.error('Please enter unique config value', 'Duplicate Entry', {
          timeOut: 5000
        });
        this.spinnerService.hide();
        return;
      }
    }
    this.configurationService.saveConfiguration(payload).subscribe(configSaveRes => {
      if (configSaveRes['responseStatus']['code'] === 200) {
        this.spinnerService.hide();
        this.toasterService.success(configSaveRes['message'], '', {
          timeOut: 5000
        });
        this.resetConfigForm();
        if (configSaveRes['result']['activeS'] == 'Y') {
          this.updateStockPrices();
        }
        this.getConfigurations();
      }
    },
      error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      });
  }

  getConfigurations() {

    this.configurationService.getAllConfigurations().subscribe(configRes => {
      if (configRes['responseStatus']['code'] === 200) {
        this.configs = configRes['result'];
        this.configGridOptions.api.updateRowData(this.configs);
        this.configGridOptions.api.forEachNode(node => {
  
        })
      }
    });
  }

  resetConfigForm() {
    this.configForm.reset();
    this.configForm.patchValue({
      activeS: 'Y',
      creationTimeStamp: (new Date()),
      createdUser: (localStorage.getItem('id')),
      lastUpdateTimestamp: (new Date()),
      lastUpdateUser: (localStorage.getItem('id')),
      pharmacyId: (localStorage.getItem('pharmacyId')),
    });
  }
  updateHide = false;
  saveHide = true;
  updateMarginHide = false;
  saveMarginHide = true;

  dataToSend: any;
  discountGrid() {
    const data = this.discountsGridOptions.api.getSelectedRows();
    this.dataToSend = data[0];
   
    this.discountsForm.patchValue({
      discountValue: this.dataToSend['discountValue'] != null && this.dataToSend['discountValue'] != undefined ? this.dataToSend['discountValue'] : null,
      activeS: this.dataToSend['activeS'] != null && this.dataToSend['activeS'] != undefined ? this.dataToSend['activeS'] : null,
    })
    this.updateHide = true;
    this.saveHide = false;
  }
  dataToSendMargin: any;
  marginGrid() {
    const data = this.configGridOptions.api.getSelectedRows();
    this.dataToSendMargin = data[0];
  
    this.configForm.patchValue({
      configValue: this.dataToSendMargin['configValue'] != null && this.dataToSendMargin['configValue'] != undefined ? this.dataToSendMargin['configValue'] : null,
      activeS: this.dataToSendMargin['activeS'] != null && this.dataToSendMargin['activeS'] != undefined ? this.dataToSendMargin['activeS'] : null,
      configDesc: this.dataToSendMargin['configDesc'] != null && this.dataToSendMargin['configDesc'] != undefined ? this.dataToSendMargin['configDesc'] : null,
    })
    this.updateMarginHide = true;
    this.saveMarginHide = false;
  }

  onDiscountUpdate() {
    this.spinnerService.show();
    let payload = Object.assign({}, this.discountsForm.value);
    payload['discountId'] = this.dataToSend['discountId'];
    for (var i = 0; i < this.configs.length; i++) {
      if (this.configs[i]['configDesc'] == 'maxdiscount' && this.configs[i]['activeS'] == 'Y') {
        if (payload.discountValue > this.configs[i]['configValue']) {
          this.toasterService.error('', 'Enterd value is grate than actual markup value', {
            timeOut: 5000
          });
          this.spinnerService.hide();
          return;
        }
      }
    }
    for (var i = 0; i < this.discounts.length; i++) {
      if (this.discounts[i].discountValue == payload.discountValue && this.discounts[i].activeS == payload.activeS) {
        this.toasterService.error('Please enter unique markup value', 'Duplicate Entry', {
          timeOut: 5000
        });
        this.spinnerService.hide();
        return;
      }
    }
  
    this.configurationService.updateDiscount(payload).subscribe(discountSaveRes => {
      if (discountSaveRes['responseStatus']['code'] === 200) {
      
        this.spinnerService.hide();
        this.toasterService.success(discountSaveRes['message'], '', {
          timeOut: 5000
        });
        this.spinnerService.hide();
        this.resetDiscountsForm();
        this.getAllDiscounts();
      }
    },
      error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      });
    this.updateHide = false;
    this.saveHide = true;
  }

  onMarginUpdate() {
   
    this.spinnerService.show();
    let payload = Object.assign({}, this.configForm.value);
    payload['configId'] = this.dataToSendMargin['configId'];
    payload['configDesc'] = this.dataToSendMargin['configDesc'];

    for (var i = 0; i < this.configs.length; i++) {
     
      if (this.configs[i].configValue == payload.configValue && this.configs[i].activeS == payload.activeS) {
        this.toasterService.error('Please enter unique config value', 'Duplicate Entry', {
          timeOut: 5000
        });
        this.spinnerService.hide();
        return;
      }
    }


    this.configurationService.updateConfiguration(payload).subscribe(configSaveRes => {
      if (configSaveRes['responseStatus']['code'] === 200) {
     
        this.spinnerService.hide();
        this.toasterService.success(configSaveRes['message'], '', {
          timeOut: 5000
        });
        this.resetConfigForm();
        if (configSaveRes['result']['activeS'] == 'Y') {
          this.updateStockPrices();
        }

        this.updateMarginHide = false;
        this.saveMarginHide = true;
        this.getConfigurations();
      }
    },
      error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
        this.updateMarginHide = false;
        this.saveMarginHide = true;
      });

  }


  updateStockPrices() {
    this.spinnerService.show();
    this.configurationService.updaeStockPrice().subscribe(stockUpdateResponse => {
     
      this.spinnerService.hide();
      this.toasterService.success('Stock Updated Successfully', '', {
        timeOut: 5000
      });
    }, error => {
      this.toasterService.error('Stock Not Updated', 'Error Occurred', {
        timeOut: 5000
      });
      this.spinnerService.hide();
    });
  }

  checkFormDisability() {
    return (this.configForm.get('configValue').errors instanceof Object)
      || (this.configForm.get('configValue').errors instanceof Object)
  }



  // configuration status code handler

  configStatusForm: FormGroup;
  configStatusFormValidations = {
    configStatusId: new FormControl(),
    configStatusValue: new FormControl('', Validators.required),
    creationTimeStamp: new FormControl(new Date()),
    createdUser: new FormControl(localStorage.getItem('id')),
    lastUpdateTimestamp: new FormControl(new Date()),
    lastUpdateUser: new FormControl(localStorage.getItem('id')),
    pharmacyId: new FormControl(localStorage.getItem('pharmacyId')),
  }

  saveConfigStatus() {
 
    if (this.configStatusForm.get('configStatusValue').errors instanceof Object) {
      this.toasterService.warning('Please Select Configuration Status', 'Select Status', {
        timeOut: 5000
      });
      return;
    }

    this.spinnerService.show();
    let payload = Object.assign({}, this.configStatusForm.value);
  
    if (payload.configStatusId == null || payload.configStatusId == undefined || payload.configStatusId == '') {
      this.configurationService.saveConfigurationStatus(payload).subscribe(response => {
        if (response['responseStatus']['code'] === 200) {

          if (response['result']['configStatusValue'] == 'activate') {
            this.toasterService.success('Configuration Activated Successfully', '', {
              timeOut: 5000
            });
            this.patchConfigurationStatusForm(response['result']);
            this.updateStockPrices();
          }
          else {
            this.patchConfigurationStatusForm(response['result']);
            this.toasterService.success('Configuration De-Activated Successfully', '', {
              timeOut: 5000
            });
          }

        }
        this.spinnerService.hide();
      }, error => {
        this.toasterService.error('Configuration Not Acetivated', 'Error Occurred', {
          timeOut: 5000
        });

        this.spinnerService.hide();
      })
    }
    else {
      this.configurationService.updateConfigurationStatus(payload).subscribe(response => {
        if (response['responseStatus']['code'] === 200) {

          if (response['result']['configStatusValue'] == 'activate') {
            this.toasterService.success('Configuration Activated Successfully', '', {
              timeOut: 5000
            });
            this.patchConfigurationStatusForm(response['result']);
            this.updateStockPrices();
          }
          else {
            this.patchConfigurationStatusForm(response['result']);
            this.toasterService.success('Configuration De-Activated Successfully', '', {
              timeOut: 5000
            });
            this.spinnerService.hide();
          }

        }

      }, error => {
        this.toasterService.error('Configuration Not Acetivated', 'Error Occurred', {
          timeOut: 5000
        });

        this.spinnerService.hide();
      })
    }
  }

  patchConfigurationStatusForm(obj) {
    this.configStatusForm.patchValue({
      configStatusId: obj['configStatusId'],
      configStatusValue: obj['configStatusValue'],
      creationTimeStamp: obj['creationTimeStamp'],
      createdUser: obj['createdUser'],
      lastUpdateTimestamp: new Date(),
      lastUpdateUser: localStorage.getItem('id'),
      pharmacyId: obj['pharmacyId'],
    });
  }

  getConfigurationStatus() {
    this.configurationService.getConfigurationStatus().subscribe(response => {
    
      if (response['responseStatus']['code'] === 200) {
       
        if (response['result'] != null && response['result'] != undefined) {

          this.patchConfigurationStatusForm(response['result']);
        }
      }
    });
  }
}
