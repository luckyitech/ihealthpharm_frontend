import { EditSupplier } from './../shared/editsupplier.model';
import { SupplierService } from './../../supplier/shared/supplier.service';
import { Supplier } from './../shared/supplier.model';
import { AppService } from 'src/app/core/app.service';
import { NumericEditor } from 'src/app/core/numeric-editor.component';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, ColDef } from 'ag-grid-community';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.scss'],
  providers: [SupplierService]
})

export class EditSupplierComponent implements OnInit {

  editSupplier: EditSupplier[] = [];
  supplier: Supplier[] = [];

  constructor(private supplierService: SupplierService, private toasterService: ToastrService,
    private appService: AppService, private spinnerService: Ng4LoadingSpinnerService) {
    this.getCountries();
    this.getreturnCreditType();
    this.supplierGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.supplierGridOptions.rowSelection = 'single';
    this.supplierGridOptions.columnDefs = this.columnDefs;
    this.getGridRowData();
    this.getPaymentTypes();

    this.supplierGridOptions.getRowStyle = function (params) {
      if (params.node.rowIndex % 2 !== 0) {
        return { background: '#cccccc' }
      }
    }
  }

  ngOnInit() {
    this.supplierInformationForm = new FormGroup(this.supplierInformationFormValidations);
    $(document).ready(function () {

      $("#common-grid-btn").click(function () {
        $("#common-grid").hide();
        $("#supplierGridSearch").hide();
      });
      $("#common-grid-btn").click(function () {
        $("#hospital-Information").show();
      });

      $(".mu-edit-save").click(function () {
        $("#common-grid").show();
        $("#supplierGridSearch").show();
      });

      $("#mu-adduser-cancel").click(function () {
        $("#common-grid").show();
        $("#supplierGridSearch").show();

      });
      $("#common-grid-btn").click(function () {
        $("#hospital-Information").css("display", "block");
      });
      $(".mu-edit-save").click(function () {
        $("#hospital-Information").css("display", "none");
      });
      $("#mu-adduser-cancel").click(function () {
        $("#hospital-Information").css("display", "none");
      });

    });
  }
  ngOnDestroy(): void {
    this.appService.clearInsertedRowData();
  }

  key;
  supplierGridOptions: GridOptions;
  showGrid: boolean = true;
  show: boolean = true;

  countries: any[] = [];
  selectedSupplier: Object = {};
  suppliers: any[] = [];
  returnCreditTypes: any[] = [];
  states: any[] = [];

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
    { headerName: 'Name', field: 'name', sortable: true, resizable: true, filter: true, },
    { headerName: 'TIN Number', field: 'license', sortable: true, resizable: true, filter: true, },
    { headerName: 'Email', field: 'emailId', sortable: true, resizable: true, filter: true, },
    { headerName: 'Phone', field: 'phoneNumber', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor },
    { headerName: 'Pin Code', field: 'zipCode', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor },
    { headerName: 'Address Line 1', field: 'addressLine1', sortable: true, resizable: true, filter: true, },
    { headerName: 'Address Line 2', field: 'addressLine2', sortable: true, resizable: true, filter: true, },
    { headerName: 'City', field: 'cityName', sortable: true, resizable: true, filter: true, },
    { headerName: 'Fax', field: 'fax', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor },
    { headerName: 'Contact Person First Name', field: 'contactPersonFirstName', sortable: true, resizable: true, filter: true, },
    { headerName: 'Contact Person Middle Name', field: 'contactPersonMiddleName', sortable: true, resizable: true, filter: true, },
    { headerName: 'Contact Person Last Name', field: 'contactPersonLastName', sortable: true, resizable: true, filter: true, },
    { headerName: 'Contact Person Email1', field: 'contactPersonEmailID', sortable: true, resizable: true, filter: true, },
    { headerName: 'Contact Person Email2', field: 'contactPersonEmailIdTwo', sortable: true, resizable: true, filter: true, },
    { headerName: 'Contact Person Email3', field: 'contactPersonEmailIdThree', sortable: true, resizable: true, filter: true, },
    { headerName: 'Contact Person Email4', field: 'contactPersonEmailIdFour', sortable: true, resizable: true, filter: true, },

    { headerName: 'Contact Person Phone', field: 'contactPersonPhoneNumber', sortable: true, resizable: true, filter: true, cellEditorFramework: NumericEditor },
    { headerName: 'Website URL', field: 'website', sortable: true, resizable: true, filter: true, },
    { headerName: 'Country', field: 'country.countryName', sortable: true, resizable: true, filter: true, },
    { headerName: 'State', field: 'state.provinceName', sortable: true, resizable: true, filter: true, },
    { headerName: 'Status', field: 'Status', sortable: true, resizable: true, filter: true, },
    { headerName: 'Payment Terms', field: 'paymentTerms', sortable: true, resizable: true, filter: true, },
    { headerName: 'Payment Credit Net Days', field: 'paymentCreditNetDays', resizable: true, sortable: true, filter: true, },
    { headerName: 'Return Credit Type', field: 'returnCreditTypeId.type', resizable: true, sortable: true, filter: true, },
    { headerName: 'Late Payment Interest', field: 'latePaymentInterest', resizable: true, sortable: true, filter: true, },
    { headerName: 'DL No', field: 'dlNo', sortable: true, filter: true, resizable: true, cellEditorFramework: NumericEditor },
    { headerName: 'CST No', field: 'cstNo', sortable: true, filter: true, resizable: true, cellEditorFramework: NumericEditor },
    { headerName: 'Allow Phone Orders', field: 'allowPhoneOrders', sortable: true, resizable: true, filter: true, },
    { headerName: 'Accept Expiry Returns', field: 'acceptExpireReturns', sortable: true, resizable: true, filter: true, },
    { headerName: 'Allow Online Orders', field: 'allowOnlineOrders', resizable: true, sortable: true, filter: true, },
    { headerName: 'Accept Damaged Returns', field: 'acceptDamagedReturns', resizable: true, sortable: true, filter: true, },
    { headerName: 'Allow Manual Orders', field: 'allowManualOrders', resizable: true, sortable: true, filter: true, },
    { headerName: 'Accept Good Returns', field: 'acceptGoodReturns', resizable: true, sortable: true, filter: true, },
    { headerName: 'Supplier Also Manufacturer', field: 'supplierAlsoManufacturer', resizable: true, sortable: true, filter: true, },
    { headerName: 'Supplies Medical Non MedicalBoth', field: 'suppliesMedicalNonMedicalBoth', resizable: true, sortable: true, filter: true, }
  ];


  rowSelection(params: any) {
    if (!params.node.selected) {
      let resetData = this.appService.getInsertedRowData()
        .find(dataRow => dataRow.supplierId === params.data.supplierId);
      params.node.setData(JSON.parse(JSON.stringify(resetData)));
    }
  }
  resetGrid() {
    this.getGridRowData();
  }
  reset() {
    this.supplierInformationForm.reset();
    this.supplierInformationForm.controls.activeS.setValue('Y');
    this.show = true;
  }



  rowData = [];
  selectedCoutry: any;
  stateSelected: any;
  returnCreditTypeSelected: any;
	/**
    * Grid Changes
    * End
    */

  supplierInformationForm: FormGroup;
  supplierInformationFormValidations = {
    supplierId: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    license: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    emailId: new FormControl('', [Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    addressLine1: new FormControl('', [Validators.required]),
    country: new FormControl([], [Validators.required]),
    state: new FormControl('', [Validators.required]),
    addressLine2: new FormControl(''),
    fax: new FormControl('', [Validators.pattern(/^\+?[0-9]+$/)]),
    cityName: new FormControl(''),
    zipCode: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    website: new FormControl('', [Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+(.com)|(.co)|(.in)|(.org)|(.ke)+$/)]),
    contactPersonFirstName: new FormControl('', [Validators.required]),
    contactPersonMiddleName: new FormControl(''),
    contactPersonLastName: new FormControl('', [Validators.required]),
    contactPersonEmailID: new FormControl('', [ Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    contactPersonEmailIdTwo:new FormControl('', [ Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    contactPersonEmailIdThree:new FormControl('', [ Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    contactPersonEmailIdFour:new FormControl('', [ Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    contactPersonPhoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
    paymentTerms: new FormControl(''),
    paymentCreditNetDays: new FormControl(''),
    paymentType: new FormControl(''),
    latePaymentInterest: new FormControl(''),
    dlNo: new FormControl(''),
    cstNo: new FormControl(''),
    allowOnlineOrders: new FormControl('Y'),
    allowManualOrders: new FormControl('Y'),
    allowPhoneOrders: new FormControl('Y'),
    acceptExpireReturns: new FormControl('Y'),
    acceptDamagedReturns: new FormControl('Y'),
    acceptGoodReturns: new FormControl('Y'),
    supplierAlsoManufacturer: new FormControl('Y'),
    suppliesMedicalNonMedicalBoth: new FormControl('B'),
    returnCreditTypeId: new FormControl('', [Validators.required]),
    activeS: new FormControl('Y'),
    accountNumber: new FormControl('', Validators.pattern(/^[0-9]*$/)),
    bankName: new FormControl(''),
    ifscCode: new FormControl('', Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)),

    micrCode: new FormControl('', Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/))
  };

  editGrid() {
    this.onsupplierSelected(this.supplierGridOptions.api.getSelectedRows()[0].supplierId);
    this.show = false;
  }

  selectedPaymentType: Object = undefined;
  paymentTypes: any[] = [];
  getPaymentTypes() {
    this.supplierService.getallpaymenttypes().subscribe(
      getallpaymenttypesResponse => {
        if (getallpaymenttypesResponse['responseStatus']['code'] === 200) {
          this.paymentTypes = getallpaymenttypesResponse['result'];
        }
      }
    );
  }

  onsupplierSelected(supplierId: string) {
    this.selectedSupplier = this.suppliers.find(supplier => supplier['supplierId'] == supplierId);
    this.supplierService.getProvinces(this.selectedSupplier['country']).subscribe(
      getProvincesResponse => {
        if (getProvincesResponse instanceof Object) {
          if (getProvincesResponse['responseStatus']['code'] === 200) {
            this.states = getProvincesResponse['result'];
            let supplierFormValues: Object = {
              supplierId: this.selectedSupplier['supplierId'],
              name: this.selectedSupplier['name'],
              license: this.selectedSupplier['license'],
              phoneNumber: this.selectedSupplier['phoneNumber'],
              emailId: this.selectedSupplier['emailId'],
              addressLine1: this.selectedSupplier['addressLine1'],
              country: this.selectedSupplier['country'],
              state: this.selectedSupplier['state'],
              addressLine2: this.selectedSupplier['addressLine2'],
              fax: this.selectedSupplier['fax'],
              cityName: this.selectedSupplier['cityName'],
              zipCode: this.selectedSupplier['zipCode'],
              website: this.selectedSupplier['website'],
              contactPersonFirstName: this.selectedSupplier['contactPersonFirstName'],
              contactPersonMiddleName: this.selectedSupplier['contactPersonMiddleName'],
              contactPersonLastName: this.selectedSupplier['contactPersonLastName'],
              contactPersonEmailID: this.selectedSupplier['contactPersonEmailID'],
              contactPersonEmailIdTwo: this.selectedSupplier['contactPersonEmailIdTwo'],
              contactPersonEmailIdThree: this.selectedSupplier['contactPersonEmailIdThree'],
              contactPersonEmailIdFour: this.selectedSupplier['contactPersonEmailIdFour'],
              contactPersonPhoneNumber: this.selectedSupplier['contactPersonPhoneNumber'],
              paymentTerms: this.selectedSupplier['paymentTerms'],
              paymentCreditNetDays: this.selectedSupplier['paymentCreditNetDays'],
              paymentType: this.selectedSupplier['paymentType'],
              latePaymentInterest: this.selectedSupplier['latePaymentInterest'],
              dlNo: this.selectedSupplier['dlNo'],
              cstNo: this.selectedSupplier['cstNo'],
              allowOnlineOrders: this.selectedSupplier['allowOnlineOrders'],
              allowManualOrders: this.selectedSupplier['allowManualOrders'],
              allowPhoneOrders: this.selectedSupplier['allowPhoneOrders'],
              acceptExpireReturns: this.selectedSupplier['acceptExpireReturns'],
              acceptDamagedReturns: this.selectedSupplier['acceptDamagedReturns'],
              acceptGoodReturns: this.selectedSupplier['acceptGoodReturns'],
              returnCreditTypeId: this.selectedSupplier['returnCreditTypeId'],
              supplierAlsoManufacturer: this.selectedSupplier['supplierAlsoManufacturer'],
              suppliesMedicalNonMedicalBoth: this.selectedSupplier['suppliesMedicalNonMedicalBoth'],
              activeS: this.selectedSupplier['activeS'],
              accountNumber: this.selectedSupplier['accountNumber'],
              ifscCode: this.selectedSupplier['ifscCode'],
              micrCode: this.selectedSupplier['micrCode'],
              bankName: this.selectedSupplier['bankName']
            }
            this.selectedCoutry = this.selectedSupplier['country'];
            this.getProvinces(this.selectedCoutry);
            this.stateSelected = this.selectedSupplier['state'];
            this.returnCreditTypeSelected = this.selectedSupplier['returnCreditTypeId']
            this.supplierInformationForm.setValue(supplierFormValues);
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
  onSubmit() {
    let payload = Object.assign({}, this.supplierInformationForm.value);
    payload['country'] = this.selectedCoutry;
    payload['state'] = this.stateSelected;
    payload['returnCreditTypeId'] = this.returnCreditTypeSelected;
    payload['lastUpdateUser'] = localStorage.getItem('id');
    payload['createdUser'] = localStorage.getItem('id');
    this.updateFormChanges(payload);
  }

  onCountrySelected(event: Event) {
    this.getProvinces(this.selectedCoutry);
  }

  onStateSelected(event) {
  }

  checkFormDisability() {
    return (this.supplierInformationForm.get('name').errors instanceof Object)
      || (this.supplierInformationForm.get('license').errors instanceof Object)
      || (this.supplierInformationForm.get('addressLine1').errors instanceof Object)
      || (this.supplierInformationForm.get('contactPersonFirstName').errors instanceof Object)
      || (this.supplierInformationForm.get('contactPersonLastName').errors instanceof Object)
      || (this.supplierInformationForm.get('phoneNumber').errors instanceof Object)
      || this.supplierInformationForm.get('emailId').invalid
      || this.supplierInformationForm.get('phoneNumber').invalid
      || this.supplierInformationForm.get('website').invalid
      || (this.supplierInformationForm.get('zipCode').errors instanceof Object)
      || this.supplierInformationForm.get('zipCode').invalid
      || this.supplierInformationForm.get('contactPersonEmailID').invalid
      || this.supplierInformationForm.get('contactPersonEmailIdTwo').invalid
      || this.supplierInformationForm.get('contactPersonEmailIdThree').invalid
      || this.supplierInformationForm.get('contactPersonEmailIdFour').invalid
      || this.supplierInformationForm.get('contactPersonPhoneNumber').invalid
  }

	/**
	 * Form Changes
	 * End
	 */
  getGridRowData() {
    this.showGrid = true;
    this.supplierService.getRowDataFromServer().subscribe(
      gridRowDataResponse => {
        if (gridRowDataResponse instanceof Object) {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.rowData = gridRowDataResponse['result'];
            this.suppliers = this.rowData;
            for (let i = 0; i < this.suppliers.length; i++) {
              if (this.suppliers[i].activeS == 'Y') {
                this.suppliers[i].Status = 'Active'
              }
              else if (this.suppliers[i].activeS == 'N') {
                this.suppliers[i].Status = 'DeActive'
              }
            }
            this.show = true;

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

  getreturnCreditType() {
    this.supplierService.getReturnCreditType().subscribe(
      getReturnCreditTypeResponse => {
        if (getReturnCreditTypeResponse instanceof Object) {
          if (getReturnCreditTypeResponse['responseStatus']['code'] === 200) {
            this.returnCreditTypes = getReturnCreditTypeResponse['result'];
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

  getCountries() {
    this.supplierService.getCountries().subscribe(
      getReturnCreditTypeResponse => {
        if (getReturnCreditTypeResponse instanceof Object) {
          if (getReturnCreditTypeResponse['responseStatus']['code'] === 200) {
            this.countries = getReturnCreditTypeResponse['result'];
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


  getProvinces(country: Object) {
    this.supplierService.getProvinces(country).subscribe(
      getProvincesResponse => {
        if (getProvincesResponse instanceof Object) {
          if (getProvincesResponse['responseStatus']['code'] === 200) {
            this.states = getProvincesResponse['result'];
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



  updateFormChanges(supplierInformationForm: Object) {
    this.showGrid = true;
    this.supplierInformationForm.get('addressLine1').setErrors({ 'incorrect': true })
    this.spinnerService.show();
    this.supplierService.updateRowData(supplierInformationForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.supplierInformationForm.reset();
            this.spinnerService.hide();
            this.getGridRowData();
            this.showGrid = true;
            this.key = null;
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
            this.selectedCoutry = undefined;
            this.stateSelected = undefined;
            this.returnCreditTypeSelected = undefined;
            this.reset();
          } else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 5000
            });
            this.spinnerService.hide();
          }
        } else {
          this.toasterService.error('Please contact administrator', 'Error Occurred', {
            timeOut: 5000
          });
          this.spinnerService.hide();
        }
      }, error => {
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      }
    );
  }

  search() {
    if (this.key != null && this.key != undefined && this.key != '') {
      this.supplierService.searchSupplierByName(this.key).subscribe(supplierRes => {
        if (supplierRes["responseStatus"]["code"] === 200) {
          this.rowData = supplierRes['result'];
          if (this.rowData.length == 0) {
            this.toasterService.warning("No Data Found With Search Criteria", "No Data To Show", {
              timeOut: 3000
            })
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
    else {
      this.getGridRowData();
    }
  }
}
