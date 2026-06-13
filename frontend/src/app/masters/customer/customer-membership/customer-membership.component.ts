import { CustomerService } from './../shared/customer.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MembershipService } from '../../membership/shared/membership.service';
import { EndDateValidator } from 'src/app/core/DOB Validator/endDate-validator';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
	selector: 'app-customer-membership',
	templateUrl: './customer-membership.component.html',
	styleUrls: ['./customer-membership.component.scss'],
	providers: [CustomerService, MembershipService]
})

export class CustomerMembershipComponent implements OnInit {

	constructor(private customerService: CustomerService, private membershipService: MembershipService, private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService
	) {
		this.getMembershipsData();
		this.getCustomersData();
	}

	ngOnInit() {
		this.customerMembershipInformationForm = new FormGroup(this.customerMembershipInformationFormValidations);
	}

	ngOnDestroy(): void {

	}
	customerName: any;
	customer: any[] = [];
	membershipCardNumber: string;
	memberships: any[] = [];
	customers: any[] = [];
	selectedCustomer: Object;
	selectedMembership: any;
	selectedMemberships: any;

	customerMembershipInformationForm: FormGroup;
	customerMembershipInformationFormValidations = {
		membershipCardName: new FormControl('', [Validators.required]),
		customerName: new FormControl('', [Validators.required]),
		membershipCardNumber: new FormControl('', [Validators.required]),
		membershipStartDate: new FormControl(''),
		activeS: new FormControl('Y'),
		membershipEndDate: new FormControl('', [EndDateValidator]),
		membershipDurationInMonths: new FormControl(''),
		membershipCreditAmount: new FormControl('', [Validators.pattern(/(\+(?:[0-9] ?){2,5}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{2,5})|(\+\([\d]{1,3}\)\s)([\d]{2,5})|(\([\d]{1,3}\)\s)([\d]{2,5})|(\([\d]{1,3}\))([\d]{2,5})|([\d]{1,3})([\d]{2,5})|(\([\d]{1,3}\)[-])([\d]{2,5})|([\d]{1,3}\s)([\d]{2,5})|([\d]{1,3}[-])([\d]{2,5})|(\+[\d]{1,3}\s)([\d]{2,5})|(\+[\d]{1,3})([\d]{2,5})|(\+[\d]{1,3}[-])([\d]{2,5})|([\d]{2,5})|(\s)+))$/)]),
		membershipModel: new FormControl('', Validators.required),
		membershipCreditDays: new FormControl('', Validators.pattern(/^[0-9]*$/)),
		membershipDiscountPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
		membershipBonusPercentage: new FormControl('', Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
	};

	getCustomersData() {
		this.customerService.getRowDataFromServerToMapMembership().subscribe(
			getCustomerResponse => {


				if (getCustomerResponse instanceof Object) {
					if (getCustomerResponse['responseStatus']['code'] === 200) {
						this.customer = getCustomerResponse['result'];
					}
					else {
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

	onCustomerNameKeyUp(event) {
		let searchTerm = event['target']['value'];
		this.customerService.getCustomerBySearch(searchTerm).subscribe((res) => {
			this.customer = res['result']
		});
	}

	generateMembershipCardNumber() {
		if ((this.selectedCustomer != null && this.selectedCustomer != undefined) &&
			(this.selectedMembership != null && this.selectedMembership != undefined)) {
			let membershipCardNumber = 'DOC' + this.selectedMembership +
				this.selectedCustomer['customerId'];
			this.customerMembershipInformationForm.get('membershipCardNumber').setValue(membershipCardNumber);
		}
	}

	selectedCustMembership: any;
	onMembershipSelected(event: Event) {
		this.selectedCustMembership = event;
		this.customerMembershipInformationForm.patchValue({
			customerMembershipId: this.selectedMembership['customerMembershipId'],
			membershipCardName: this.selectedMembership['membershipCardName'],
			membershipStartDate: this.selectedMembership['membershipStartDate'],
			membershipEndDate: this.selectedMembership['membershipEndDate'],
			membershipDurationInMonths: this.selectedMembership['membershipDurationInMonths'],
			membershipDiscountPercentage: this.selectedMembership['membershipDiscountPercentage'],
			membershipBonusPercentage: this.selectedMembership['membershipBonusPercentage'],
			membershipCreditAmount: this.selectedMembership['membershipCreditAmount'],
			membershipCreditDays: this.selectedMembership['membershipCreditDays']
		});
	}

	reset() {
		this.customerMembershipInformationForm.reset();
		this.selectedMembership = undefined;
		this.selectedCustomer = undefined;
	}

	onCustomerMemberShipSubmit() {
		let payload = Object.assign({}, this.customerMembershipInformationForm.value);
		payload['customerName'] = this.selectedCustomer['customerName'];
		payload['customerModel'] = this.selectedCustomer;
		payload['membershipModel'] = this.selectedCustMembership;
		payload['pharmacyModel'] = { 'pharmacyId': localStorage.getItem('pharmacyId') };
		payload['lastUpdateUser'] = localStorage.getItem('id');
		payload['createdUser'] = localStorage.getItem('id');

		this.saveCustomerMembershipFormChanges(payload);
	}

	saveCustomerMembershipFormChanges(customerMembershipInformationForm: Object) {
		this.customerMembershipInformationForm.get('membershipCardName').setErrors({ 'incorrect': true });
		this.spinnerService.show();
		this.customerService.saveCustomerMembership(customerMembershipInformationForm).subscribe(
			saveFormResponse => {
				if (saveFormResponse instanceof Object) {
					if (saveFormResponse['responseStatus']['code'] === 200) {
						this.customerMembershipInformationForm.reset();
						this.spinnerService.hide();
						this.toasterService.success(saveFormResponse['message'], 'Success', {
							timeOut: 3000
						});
						this.customerMembershipInformationForm.get('activeS').setValue('Y');
						this.getMembershipsData();
						this.selectedMembership = undefined;
						this.getCustomersData();
						this.selectedCustomer = undefined;
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
	checkCustomerMemberShipFormDisability() {
		return (this.customerMembershipInformationForm.get('membershipCardName').errors instanceof Object)
			|| (this.customerMembershipInformationForm.get('membershipCardNumber').errors instanceof Object)
			|| (this.customerMembershipInformationForm.get('membershipBonusPercentage').invalid)
			|| (this.customerMembershipInformationForm.get('membershipDiscountPercentage').invalid)
			|| (this.customerMembershipInformationForm.get('membershipCreditDays').invalid)
			|| (this.customerMembershipInformationForm.get('membershipCreditAmount').invalid)
	}

	getMembershipsData() {
		this.membershipService.getRowDataFromServerToMapCustomers().subscribe(
			getmembershipResponse => {
				if (getmembershipResponse instanceof Object) {
					if (getmembershipResponse['responseStatus']['code'] === 200) {
						this.memberships = getmembershipResponse['result'];
					}
					else {
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
	diff_months(dt2, dt1) {
		let d1 = new Date(dt1);
		let d2 = new Date(dt2);
		var diff = (d2.getTime() - d1.getTime()) / 1000;
		diff /= (60 * 60 * 24 * 7 * 4);
		return Math.abs(Math.round(diff));
	}

	modelChanged(event) {
		this.customerMembershipInformationForm.get('membershipDurationInMonths').setValue(0);
	}

	selectedStartDate(event: Event) {
		if (this.customerMembershipInformationForm.get('membershipStartDate').value &&
			this.customerMembershipInformationForm.get('membershipEndDate').value) {
			let months = this.diff_months(this.customerMembershipInformationForm.get('membershipStartDate').value,
				this.customerMembershipInformationForm.get('membershipEndDate').value);
			this.customerMembershipInformationForm.get('membershipDurationInMonths').setValue(months);
		}
	}


	/**
	 * Form Changes
	 * End
	 */
}