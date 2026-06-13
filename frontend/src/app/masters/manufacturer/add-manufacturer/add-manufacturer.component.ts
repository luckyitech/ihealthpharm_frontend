import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ManufacturerService } from '../shared/manufacturer.service';
import { ToastrService } from 'ngx-toastr';
import { AddManufacturerService } from './shared/add-manufacturer.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
	selector: 'app-add-manufacturer',
	templateUrl: './add-manufacturer.component.html',
	styleUrls: ['./add-manufacturer.component.scss'],
	providers: [AddManufacturerService, ManufacturerService]
})

export class AddManufacturerComponent implements OnInit {

	constructor(private manufacturerService: ManufacturerService,
		private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
		this.getCountries();
	}

	ngOnInit() {
		this.manufacturerInformationForm = new FormGroup(this.manufacturerInformationFormValidations);
	}

	countries: any[] = [];
	states: any[] = [];
	manufacturers: any[] = [];
	selectedState: any;
	selectedCountry: any;

	manufacturerInformationForm: FormGroup;

	manufacturerInformationFormValidations = {
		name: new FormControl('', [Validators.required]),
		licence: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
		phoneNumber: new FormControl('', [Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
		emailId: new FormControl('', [Validators.email, Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)]),
		addressLine1: new FormControl(''),
		countryId: new FormControl(''),
		provinceId: new FormControl(''),
		addressLine2: new FormControl(''),
		fax: new FormControl('', [Validators.pattern(/^\+?[0-9]+$/)]),
		cityName: new FormControl(''),
		activeS: new FormControl('Y'),
		zipCode: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9]+$/)]),
		contactPersonFirstName: new FormControl(''),
		contactPersonMiddleName: new FormControl(''),
		contactPersonLastName: new FormControl(''),
		contactPersonEmail: new FormControl('', Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)),
		contactPersonPhoneNumber: new FormControl('', Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)),
		website: new FormControl('', [Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+(.com)|(.co)|(.in)|(.org)|(.ke)+$/)])
	};


	onSubmit() {
		let payload = Object.assign({}, this.manufacturerInformationForm.value);
		payload['countryId'] = this.selectedCountry;
		payload['provinceId'] = this.selectedState;
		payload['lastUpdateUser'] = localStorage.getItem('id');
		payload['createdUser'] = localStorage.getItem('id');

		this.saveFormChanges(payload);
	}

	onCountrySelected(event: Event) {
		this.getProvinces(this.selectedCountry);
	}

	checkFormDisability() {
		return (this.manufacturerInformationForm.get('name').errors instanceof Object)

		/*|| (this.manufacturerInformationForm.get('contactPersonLastName').errors instanceof Object)
		|| (this.manufacturerInformationForm.get('addressLine1').errors instanceof Object)
		|| (this.manufacturerInformationForm.get('phoneNumber').errors instanceof Object)
		|| (this.manufacturerInformationForm.get('contactPersonPhoneNumber').errors instanceof Object)
		|| this.manufacturerInformationForm.get('emailId').invalid
		|| this.manufacturerInformationForm.get('phoneNumber').invalid
		|| this.manufacturerInformationForm.get('website').invalid
		|| this.manufacturerInformationForm.get('contactPersonEmail').invalid
		|| (this.manufacturerInformationForm.get('zipCode').errors instanceof Object)
		|| this.manufacturerInformationForm.get('zipCode').invalid
		|| this.manufacturerInformationForm.get('contactPersonPhoneNumber').invalid */
	}

	/**
		 * Form Changes
		 * End
		 */

	/**
	 * Service Changes
	 * Start
	 */

	getCountries() {
		this.manufacturerService.getCountries().subscribe(
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

	getProvinces(country: Object) {
		this.manufacturerService.getProvinces(country).subscribe(
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
		this.manufacturerInformationForm.reset();
		this.selectedState = undefined;
		this.selectedCountry = undefined;
	}

	saveFormChanges(manufacturerInformationForm: Object) {
		this.manufacturerInformationForm.get('name').setErrors({ 'incorrect': true })
		this.spinnerService.show();
		this.manufacturerService.saveFormChanges(manufacturerInformationForm).subscribe(
			saveFormResponse => {
				if (saveFormResponse instanceof Object) {
					if (saveFormResponse['responseStatus']['code'] === 200) {
						this.manufacturerInformationForm.reset();
						this.spinnerService.hide();
						this.manufacturerInformationForm.controls.activeS.setValue('Y');
						this.toasterService.success(saveFormResponse['message'], 'Success', {
							timeOut: 3000
						});
						this.states = undefined;
						this.selectedState = undefined;
						this.selectedCountry = undefined;
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
}