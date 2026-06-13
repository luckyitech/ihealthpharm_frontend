import { Component, OnInit, Provider } from '@angular/core';
import { ProviderService } from '../shared/provider.service';
import { ToastrService } from 'ngx-toastr';
import { AddProvider } from './shared/add-provider.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/core/app.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
	selector: 'app-add-provider',
	templateUrl: './add-provider.component.html',
	styleUrls: ['./add-provider.component.scss'],
	providers: [ProviderService]
})

export class AddProviderComponent implements OnInit {

	addProvider: AddProvider[] = [];
	provider: Provider[] = [];

	constructor(private providerService: ProviderService, private toasterService: ToastrService, private appService: AppService, private spinnerService: Ng4LoadingSpinnerService) {
		this.getCountries();
		this.getProviderLookup();
		this.getHospitals();
	}

	ngOnInit() {
		this.providerInformationForm = new FormGroup(this.providerInformationFormValidations);
	}

	ngOnDestroy(): void {
	}

	countries: any[] = [];
	providerLookups: any[] = [];
	states: any[] = [];
	selectedState: any;
	selectedCountry: any;
	selectedHospital: any;
	selectedProviders: any;
	hospitals: any[] = [];
	genders = [
		{ name: 'Male' },
		{ name: 'Female' }
	];

	selectedGender: any;

	getCountries() {
		this.providerService.getCountries().subscribe(
			getCountriesResponse => {
				if (getCountriesResponse instanceof Object) {
					if (getCountriesResponse['responseStatus']['code'] === 200) {
						this.countries = getCountriesResponse['result'];
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

	getProviderLookup() {
		this.providerService.getProviderTypeLookup().subscribe(
			getProviderTypeLookupResponse => {
				if (getProviderTypeLookupResponse instanceof Object) {
					if (getProviderTypeLookupResponse['responseStatus']['code'] === 200) {
						this.providerLookups = getProviderTypeLookupResponse['result'];
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


	getHospitals() {
		this.providerService.getHospitals().subscribe(
			getHospitalResponse => {
				if (getHospitalResponse instanceof Object) {
					if (getHospitalResponse['responseStatus']['code'] === 200) {
						this.hospitals = getHospitalResponse['result'];
					} else {
						this.toasterService.error('Please contact administrator', 'Error Occurred', {
							timeOut: 5000
						});
					}
				} else {
					this.toasterService.error('Please contact Administrator', 'Error Occurred', {
						timeOut: 5000
					})
				}
			}
		)
	}

	getProvinces(country: Object) {
		this.providerService.getProvinces(country).subscribe(
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


	reset() {
		this.providerInformationForm.reset();
		this.selectedState = undefined;
		this.selectedCountry = undefined;
		this.selectedGender = undefined;
		this.selectedHospital = undefined;
		this.selectedProviders = undefined;
	}

	saveFormChanges(providerInformationForm: Object) {
		this.providerInformationForm.get('firstName').setErrors({ 'wrong': true });
		this.spinnerService.show();
		this.providerService.saveFormChanges(providerInformationForm).subscribe(
			saveFormResponse => {
				if (saveFormResponse instanceof Object) {
					if (saveFormResponse['responseStatus']['code'] === 200) {
						this.providerInformationForm.reset();
						this.spinnerService.hide();
						this.providerInformationForm.controls.activeS.setValue('Y');

						this.providerInformationForm.patchValue({
							'country': '',
							'state': '',
							'providerLookupTypeModel': '',
							'genderCode': '',
							'hospitalId': ''
						});
						this.toasterService.success(saveFormResponse['message'], 'Success', {
							timeOut: 3000
						});
						this.states = undefined;
						this.selectedState = undefined;
						this.selectedCountry = undefined;
						this.selectedGender = undefined;
						this.selectedHospital = undefined;
						this.selectedProviders = undefined;
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

	/**
	 * Service Changes
	 * End
	 */


	/**
	 * Form Changes
	 * Start
	 */

	providerInformationForm: FormGroup;
	providerInformationFormValidations = {
		firstName: new FormControl('', [Validators.required]),
		lastName: new FormControl('', [Validators.required]),
		middleName: new FormControl(''),
		phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
		emailId: new FormControl('', [Validators.required, Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)]),
		addressLine1: new FormControl('', [Validators.required]),
		country: new FormControl([], [Validators.required]),
		state: new FormControl('', [Validators.required]),
		addressLine2: new FormControl(''),
		cityName: new FormControl(''),
		credit: new FormControl(''),
		licenseNumber: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
		deaNumber: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
		genderCode: new FormControl('', [Validators.required]),
		speciality: new FormControl(''),
		zipCode: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
		providerLookupTypeModel: new FormControl('', [Validators.required]),
		activeS: new FormControl('Y'),
		hospitalId: new FormControl('')
	};

	onSubmit() {
		let payload = Object.assign({}, this.providerInformationForm.value);
		payload['country'] = this.selectedCountry;
		payload['state'] = this.selectedState;
		payload['lastUpdateUser'] = localStorage.getItem('id');
		payload['createdUser'] = localStorage.getItem('id');
		payload['providerLookupTypeModel'] = this.selectedProviders;
		payload['hospitalId'] = this.selectedHospital;
		if (this.selectedGender instanceof Object) {
			payload['genderCode'] = this.selectedGender['name'] == 'Male' ? 'M' : 'F';
		}

		this.providerLookups.find(x => x.providerTypeLookupId == this.providerInformationForm.value['providerLookupTypeModel'])
		this.saveFormChanges(payload);
	}

	onCountrySelected(event: Event) {
		this.getProvinces(this.selectedCountry);
	}

	checkFormDisability() {
		return (this.providerInformationForm.get('firstName').errors instanceof Object)
			|| (this.providerInformationForm.get('lastName').errors instanceof Object)
			|| (this.providerInformationForm.get('licenseNumber').errors instanceof Object)
			|| (this.providerInformationForm.get('addressLine1').errors instanceof Object)
			|| (this.providerInformationForm.get('phoneNumber').errors instanceof Object)
			|| this.providerInformationForm.get('emailId').invalid
			|| this.providerInformationForm.get('phoneNumber').invalid
			|| this.providerInformationForm.get('licenseNumber').invalid
			|| this.providerInformationForm.get('speciality').invalid
			|| (this.providerInformationForm.get('zipCode').errors instanceof Object)
			|| this.providerInformationForm.get('zipCode').invalid
	}
}