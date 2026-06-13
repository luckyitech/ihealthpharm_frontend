import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../shared/customer.service';
import { InsuranceService } from '../../insurance/shared/insurance.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { EndDateValidator } from 'src/app/core/DOB Validator/endDate-validator';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
	selector: 'app-customer-insurance',
	templateUrl: './customer-insurance.component.html',
	styleUrls: ['./customer-insurance.component.scss'],
	providers: [CustomerService, InsuranceService]
})

export class CustomerInsuranceComponent implements OnInit {

	recentCustomer: Object;
	constructor(private customerService: CustomerService,private insuranceService: InsuranceService, private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService
	) {
		this.getPoliciesData();
		this.getCustomersData();
	}

	ngOnInit() {
		this.customerInsuranceInformationForm = new FormGroup(this.customerInsuranceInformationFormValidations);
	}

	ngOnDestroy(): void {

	}

	policies: any[] = [];
	customers: any[] = [];
	customer: any[] = [];
	selectedCustomer: Object ;
	policySelected: any;

	customerInsuranceInformationForm: FormGroup;
	customerInsuranceInformationFormValidations = {
		policyCode: new FormControl('', [Validators.required]),
		customerPolicyNumber: new FormControl('', [Validators.required]),
		customerName: new FormControl(''),
		policyStartDate: new FormControl(''),
		policyEndDate: new FormControl('', [Validators.required,EndDateValidator]),
		medicinesNotCovered: new FormControl(''),
		policyDurationInMonths: new FormControl(''),
		activeS: new FormControl('Y'),
		contributionPercentage: new FormControl('',Validators.pattern(/^[1-9]?[0-9]{1}(\.[0-9][0-9]?)?$|^100$/)),
		policyAmountLimit:new FormControl('', [Validators.pattern(/(\+(?:[0-9] ?){2,5}[0-9])|(^((\+\([\d]{1,3}\)[-])([\d]{2,5})|(\+\([\d]{1,3}\)\s)([\d]{2,5})|(\([\d]{1,3}\)\s)([\d]{2,5})|(\([\d]{1,3}\))([\d]{2,5})|([\d]{1,3})([\d]{2,5})|(\([\d]{1,3}\)[-])([\d]{2,5})|([\d]{1,3}\s)([\d]{2,5})|([\d]{1,3}[-])([\d]{2,5})|(\+[\d]{1,3}\s)([\d]{2,5})|(\+[\d]{1,3})([\d]{2,5})|(\+[\d]{1,3}[-])([\d]{2,5})|([\d]{2,5})|(\s)+))$/)])
	};




	/**
    * Grid Changes
    * End
    */
   insurancePolicyUniqueId:any;

	onInsuranceSelected(event:Event) {
	   this.insurancePolicyUniqueId= event;	
		this.customerInsuranceInformationForm.patchValue({
			policyCode:this.policySelected['policyCode'],
			policyAmountLimit:this.policySelected['policyAmountLimit'],
			policyEndDate:this.policySelected['policyEndDate'],
			policyStartDate:this.policySelected['policyStartDate'],
			medicinesNotCovered:this.policySelected['medicinesNotCovered'],
			policyDurationInMonths:this.policySelected['policyDurationInMonths'],
			contributionPercentage:this.policySelected['contributionPercentage']
		});
	}

	onCustomerInsuranceSelected(insurancePolicyId: string) {
	}


	reset() {
		this.customerInsuranceInformationForm.reset();
		this.selectedCustomer = undefined;
		this.policySelected = undefined;
	}

	
	/**
	 * Service Changes
	 * End
	 */


	/**
	 * Form Changes
	 * Start
	 */
	diff_months(dt2, dt1) {
		let d1 = new Date(dt1);
		let d2 = new Date(dt2);
		var diff = (d2.getTime() - d1.getTime()) / 1000;
		diff /= (60 * 60 * 24 * 7 * 4);
		return Math.abs(Math.round(diff));

	}

	modelChanged(event){
		this.customerInsuranceInformationForm.get('policyDurationInMonths').setValue(0);
	}

	selectedStartDate(event: Event) {	
		if (this.customerInsuranceInformationForm.get('policyStartDate').value &&
			this.customerInsuranceInformationForm.get('policyEndDate').value) {
			let months = this.diff_months(this.customerInsuranceInformationForm.get('policyStartDate').value,
				this.customerInsuranceInformationForm.get('policyEndDate').value);
			this.customerInsuranceInformationForm.get('policyDurationInMonths').setValue(months);
		}
	}

		getPoliciesData() {
			this.insuranceService.getRowDataFromServerToMapCustomer().subscribe(
				getInsuranceResponse => {
					if (getInsuranceResponse instanceof Object) {
						if (getInsuranceResponse['responseStatus']['code'] === 200) {
							this.policies = getInsuranceResponse['result'];
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
	
    
	onCustomerInsuranceSubmit() {
		let payload = Object.assign({}, this.customerInsuranceInformationForm.value);	
		payload['customerName'] = this.selectedCustomer['customerName'];
		payload['customerModel']=this.selectedCustomer;
		payload['insuranceModel'] = this.insurancePolicyUniqueId;
		payload['lastUpdateUser'] = localStorage.getItem('id');
		payload['createdUser'] = localStorage.getItem('id');
		payload['pharmacyModel']={ 'pharmacyId': localStorage.getItem('pharmacyId') };
		this.saveCustomerInsuranceInformationFormChanges(payload);
	}

	saveCustomerInsuranceInformationFormChanges(customerInsuranceInformationForm: Object) {
		this.customerInsuranceInformationForm.get('policyCode').setErrors({ 'incorrect': true });
		this.spinnerService.show();
		this.customerService.saveCustomerInsurance(customerInsuranceInformationForm).subscribe(
			saveFormResponse => {
				if (saveFormResponse instanceof Object) {
					if (saveFormResponse['responseStatus']['code'] === 200) {
						this.customerInsuranceInformationForm.reset();
						this.spinnerService.hide();
						this.toasterService.success(saveFormResponse['message'], 'Success', {
							timeOut: 3000
						});
						this.customerInsuranceInformationForm.get('activeS').setValue('Y');
						this.getCustomersData();
						this.getPoliciesData();
						this.policySelected = undefined;
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
			},error=>{
				this.spinnerService.hide();
				this.toasterService.error('Please contact administrator', 'Error Occurred', {
					timeOut: 5000
				});
			}
		);
	}
	 checkCustomerInsuranceFormDisability() {
		return (this.customerInsuranceInformationForm.get('policyCode').errors instanceof Object)	
		|| (this.customerInsuranceInformationForm.get('customerPolicyNumber').errors instanceof Object)
	} 

	/**
	 * Form Changes
	 * End
	 */
}