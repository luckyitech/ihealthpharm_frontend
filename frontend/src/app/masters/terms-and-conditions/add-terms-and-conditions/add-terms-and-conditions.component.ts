import { TermsAndConditionsService } from './../shared/terms-and-conditions.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddTermsAndConditionsService } from './shared/add-terms-and-conditions.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-add-terms-and-conditions',
  templateUrl: './add-terms-and-conditions.component.html',
  styleUrls: ['./add-terms-and-conditions.component.scss'],
  providers: [AddTermsAndConditionsService,TermsAndConditionsService]
})
export class AddTermsAndConditionsComponent implements OnInit {

  constructor(private termsandconditionsservice:TermsAndConditionsService,
		private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) { }

	ngOnInit() {
		this.termsInformationForm = new FormGroup(this.companyTermsInformationFormValidations);
		
	}

     
	ngOnDestroy(): void {

	}

	/**
		* Form Changes
		* Start
	 */

	 companyTerms:any[]=[];

	 termsAndConditions: string = "";
	 termsInformationForm: FormGroup;
	 companyTermsInformationFormValidations = {
		 termsAndConditions: new FormControl('', [Validators.required]),
		 activeS:new FormControl('Y')
		 
	 };

	 
	onSubmit() {
	
		let payload = Object.assign({}, this.termsInformationForm.value);
		payload['lastUpdateUser'] = localStorage.getItem('id');
		payload['createdUser'] = localStorage.getItem('id');

		this.saveFormChanges(payload);
	
	}
	
	checkFormDisability() {
		return (this.termsInformationForm.get('termsAndConditions').errors instanceof Object)
		||  this.termsInformationForm.get('termsAndConditions').invalid
	} 

	

	/**
	 * Form Changes
	 * End
	 */

	/**
	 * Service Changes
	 * Start
	 */

	
	 getCompanyTermsData() {
		
		this.termsandconditionsservice.getRowDataFromServer().subscribe(
			gridRowDataResponse => {
				if (gridRowDataResponse instanceof Object) {
					if (gridRowDataResponse['responseStatus']['code'] === 200) {
						this.companyTerms = gridRowDataResponse['result'];
						
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



	
	saveFormChanges(termsInformationForm: Object) {
		this.termsInformationForm.get('termsAndConditions').setErrors({'incorrect': true});
		this.spinnerService.show();
		this.termsandconditionsservice.saveFormChanges(termsInformationForm).subscribe(
			saveFormResponse => {
				if (saveFormResponse instanceof Object) {
					if (saveFormResponse['responseStatus']['code'] === 200) {
						this.termsInformationForm.reset();

						//while refreshing the status need to be bydefault active
						this.termsInformationForm.controls.activeS.setValue('Y');
						
						this.toasterService.success(saveFormResponse['message'], 'Success', {
							timeOut: 3000
						});
						this.spinnerService.hide();
						this.getCompanyTermsData();
					
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
			}
			, error => {
				this.spinnerService.hide();
				this.toasterService.warning('Please contact administrator', 'Error Occurred', {
					timeOut: 3000
				  });
			  });
	}

}
