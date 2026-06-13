import { Component, OnInit } from '@angular/core';
import { ItemService } from '../shared/item.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/core/app.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
	selector: 'app-specialization',
	templateUrl: './specialization.component.html',
	styleUrls: ['./specialization.component.scss'],
	providers: [ItemService]
})
export class SpecializationComponent implements OnInit {

	specializationForm: FormGroup;

	constructor(private itemService: ItemService, private formBuilder: FormBuilder, private appService: AppService,
		private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {

	}

	ngOnInit() {
		this.specializationForm = new FormGroup(this.specializationFormValidations);
	}

	specializationFormValidations = {
		specializationCode: new FormControl('', [Validators.required]),
		specializationName: new FormControl('', Validators.required),
		activeS: new FormControl('Y')
	}

	checkFormDisability() {
		return (this.specializationForm.get('specializationCode').errors instanceof Object)
			|| this.specializationForm.get('specializationCode').invalid
	}


	onSubmit() {
		let payload = Object.assign({}, this.specializationForm.value);
		payload['createdUser'] = localStorage.getItem('id');
		payload['lastUpdateUser'] = localStorage.getItem('id');
		this.saveFormChanges(payload);
	}

	saveFormChanges(specializationForm: Object) {
		this.specializationForm.get('specializationCode').setErrors({ 'wrong': true })
		this.spinnerService.show();
		this.itemService.saveSpecialization(specializationForm).subscribe(
			saveFormResponse => {
				if (saveFormResponse instanceof Object) {
					if (saveFormResponse['responseStatus']['code'] === 200) {
						this.specializationForm.reset();
						this.spinnerService.hide();
						this.specializationForm.controls.activeS.setValue('Y');

						this.toasterService.success(saveFormResponse['message'], 'Success', {
							timeOut: 3000
						});

					}
					else {
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

	get f() { return this.specializationForm.controls; }

}
