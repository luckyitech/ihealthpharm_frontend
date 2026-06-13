import { HospitalService } from './../shared/hospital.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
	selector: 'app-add-hospital',
	templateUrl: './add-hospital.component.html',
	styleUrls: ['./add-hospital.component.scss'],
	providers: [HospitalService]
})

export class AddHospitalComponent implements OnInit {

	constructor(private hospitalService: HospitalService,
		private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
		this.getCountries();
		this.getHospitalData();
	}

	ngOnInit() {
		this.hospitalInformationForm = new FormGroup(this.hospitalInformationFormValidations);
	}

	ngOnDestroy(): void {

	}

	/**
		* Form Changes
		* Start
	 */

	countries: any[] = [];
	states: any[] = [];
	hospitals: any[] = [];
	selectedCountry: any;
	selectedState: any;


	checkHospitalName() {
		if (this.hospitals instanceof Array && typeof this.hospitalName === 'string') {
			return this.hospitals.map(x => x.hospitalName)
				.some((name: string) => name.trim().toLowerCase() === this.hospitalName.trim().toLowerCase());
		}
	}

	retrieveHospitalData() {
		return this.hospitals.filter((hospital: any) => hospital.hospitalName.startsWith(this.hospitalName));
	}

	hospitalName: string = "";
	hospitalInformationForm: FormGroup;
	hospitalInformationFormValidations = {
		hospitalName: new FormControl('', [Validators.required]),
		license: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 \'\-]+$/)]),
		phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/(\+(?:[0-9] ?){6,14}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+))$/)]),
		emailId: new FormControl('', [Validators.email, Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)]),
		addressLine1: new FormControl('', [Validators.required]),
		country: new FormControl([], [Validators.required]),
		state: new FormControl('', [Validators.required]),
		addressLine2: new FormControl(''),
		fax: new FormControl('', [Validators.pattern(/^\+?[0-9]+$/)]),
		cityName: new FormControl('', [Validators.required]),
		zipCode: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
		helpLine: new FormControl('', [Validators.pattern(/^((\+\([\d]{1,3}\)[-])([\d]{4,12})|(\+\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\)\s)([\d]{4,12})|(\([\d]{1,3}\))([\d]{4,12})|([\d]{1,3})([\d]{4,12})|(\([\d]{1,3}\)[-])([\d]{4,12})|([\d]{1,3}\s)([\d]{4,12})|([\d]{1,3}[-])([\d]{4,12})|(\+[\d]{1,3}\s)([\d]{4,12})|(\+[\d]{1,3})([\d]{4,12})|(\+[\d]{1,3}[-])([\d]{4,12})|([\d]{7,12})|(\s)+)$/)]),
		website: new FormControl('', [Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+(.com)|(.co)|(.in)|(.org)|(.ke)+$/)]),
		activeS: new FormControl('Y')
	};

	onSubmit() {
		let payload = Object.assign({}, this.hospitalInformationForm.value);
		payload['lastUpdatedUserId'] = localStorage.getItem('id');
		payload['createdUserId'] = localStorage.getItem('id');
		payload['country'] = this.selectedCountry;
		payload['state'] = this.selectedState;
		this.saveFormChanges(payload);
	}

	onCountrySelected(event: Event) {
		this.getProvinces(this.selectedCountry);
	}

	onStateSelected(event) {
	}

	checkFormDisability() {
		return (this.hospitalInformationForm.get('hospitalName').errors instanceof Object)
			|| (this.hospitalInformationForm.get('cityName').errors instanceof Object)
			|| (this.hospitalInformationForm.get('license').errors instanceof Object)
			|| (this.hospitalInformationForm.get('addressLine1').errors instanceof Object)
			|| (this.hospitalInformationForm.get('phoneNumber').errors instanceof Object)
			|| this.hospitalInformationForm.get('emailId').invalid
			|| this.hospitalInformationForm.get('phoneNumber').invalid
			|| this.hospitalInformationForm.get('helpLine').invalid
			|| this.hospitalInformationForm.get('website').invalid
			|| (this.hospitalInformationForm.get('zipCode').errors instanceof Object)
			|| this.hospitalInformationForm.get('zipCode').invalid
	}

	/**
	 * Form Changes
	 * End
	 */

	/**
	 * Service Changes
	 * Start
	 */

	getHospitalData() {
		this.hospitalService.getRowDataFromServer().subscribe(
			gridRowDataResponse => {
				if (gridRowDataResponse instanceof Object) {
					if (gridRowDataResponse['responseStatus']['code'] === 200) {
						this.hospitals = gridRowDataResponse['result'];
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
		this.hospitalService.getCountries().subscribe(
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
		this.hospitalService.getProvinces(country).subscribe(
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
		this.hospitalInformationForm.reset();
		this.hospitalName = '';
		this.selectedState = undefined;
		this.selectedCountry = undefined;
	}

	saveFormChanges(hospitalInformationForm: Object) {
		this.hospitalInformationForm.get('cityName').setErrors({ 'incorrect': true });
		this.spinnerService.show();
		this.hospitalService.saveFormChanges(hospitalInformationForm).subscribe(
			saveFormResponse => {
				if (saveFormResponse instanceof Object) {
					if (saveFormResponse['responseStatus']['code'] === 200) {
						this.spinnerService.hide();
						this.hospitalInformationForm.reset();
						this.hospitalInformationForm.controls.activeS.setValue('Y');
						this.hospitalInformationForm.patchValue({
							'country': '',
							'state': ''
						});
						this.toasterService.success(saveFormResponse['message'], 'Success', {
							timeOut: 3000
						});

						this.hospitalName = '';
						this.selectedState = undefined;
						this.selectedCountry = undefined;
						this.states = undefined;
						this.getHospitalData();
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
}
