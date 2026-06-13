import { MembershipService } from './../shared/membership.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EndDateValidator } from 'src/app/core/DOB Validator/endDate-validator';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
	selector: 'app-add-memberships',
	templateUrl: './add-memberships.component.html',
	styleUrls: ['./add-memberships.component.scss'],
	providers: [MembershipService]
})

export class AddMembershipsComponent implements OnInit {

	constructor(private membershipService: MembershipService,
		private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
	}

	ngOnInit() {
		this.membershipInformationForm = new FormGroup(this.membershipInformationFormValidations);
	}


	memberships: any[] = [];
	membershipInformationForm: FormGroup;
	membershipInformationFormValidations = {
		membershipCardName: new FormControl('', [Validators.required]),
		membershipStartDate: new FormControl('', [Validators.required]),
		membershipEndDate: new FormControl('', [Validators.required, EndDateValidator]),
		membershipDurationInMonths: new FormControl(''),
		membershipCreditAmount: new FormControl('', [Validators.pattern(/(\+(?:[0-9] ?){2,5}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{2,5})|(\+\([\d]{1,3}\)\s)([\d]{2,5})|(\([\d]{1,3}\)\s)([\d]{2,5})|(\([\d]{1,3}\))([\d]{2,5})|([\d]{1,3})([\d]{2,5})|(\([\d]{1,3}\)[-])([\d]{2,5})|([\d]{1,3}\s)([\d]{2,5})|([\d]{1,3}[-])([\d]{2,5})|(\+[\d]{1,3}\s)([\d]{2,5})|(\+[\d]{1,3})([\d]{2,5})|(\+[\d]{1,3}[-])([\d]{2,5})|([\d]{2,5})|(\s)+))$/)]),
		membershipCreditDays: new FormControl('', Validators.pattern(/^[0-9]*$/)),
		membershipDiscountPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
		membershipBonusPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
		activeS: new FormControl('Y'),
		offers: new FormControl()
	};


	onSubmit() {
		let payload = Object.assign({}, this.membershipInformationForm.value);
		payload['lastUpdateUser'] = localStorage.getItem('id');
		payload['createdUser'] = localStorage.getItem('id');
		payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
		this.saveFormChanges(payload);
	}



	checkFormDisability() {
		return (this.membershipInformationForm.get('membershipCardName').errors instanceof Object)
			|| (this.membershipInformationForm.get('membershipStartDate').errors instanceof Object)
			|| (this.membershipInformationForm.get('membershipEndDate').errors instanceof Object)
	}
	/**
		 * Form Changes
		 * End
		 */

	/**
	 * Service Changes
	 * Start
	 */

	saveFormChanges(membershipInformationForm: Object) {
		this.membershipInformationForm.get('membershipCardName').setErrors({ 'incorrect': true })
		this.spinnerService.show();
		this.membershipService.saveFormChanges(membershipInformationForm).subscribe(
			saveFormResponse => {
				if (saveFormResponse instanceof Object) {
					if (saveFormResponse['responseStatus']['code'] === 200) {
						this.membershipInformationForm.reset();
						this.membershipInformationForm.controls.activeS.setValue('Y');
						this.spinnerService.hide();
						this.toasterService.success(saveFormResponse['message'], 'Success', {
							timeOut: 3000
						});

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
				this.toasterService.warning('Please contact administrator', 'Error Occurred', {
					timeOut: 3000
				});
			});
	}



	diff_months(dt2, dt1) {
		let d1 = new Date(dt1);
		let d2 = new Date(dt2);
		var diff = (d2.getTime() - d1.getTime()) / 1000;
		diff /= (60 * 60 * 24 * 7 * 4);
		return Math.abs(Math.round(diff));
	}

	modelChanged(event) {
		this.membershipInformationForm.get('membershipDurationInMonths').setValue(0);
	}

	selectedStartDate(event: Event) {
		if (this.membershipInformationForm.get('membershipStartDate').value &&
			this.membershipInformationForm.get('membershipEndDate').value) {
			let months = this.diff_months(this.membershipInformationForm.get('membershipStartDate').value,
				this.membershipInformationForm.get('membershipEndDate').value);
			this.membershipInformationForm.get('membershipDurationInMonths').setValue(months);
		}
	}
}