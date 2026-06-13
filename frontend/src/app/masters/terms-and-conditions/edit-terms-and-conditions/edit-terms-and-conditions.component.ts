import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { TermsAndConditionsService } from '../shared/terms-and-conditions.service';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, ColDef } from 'ag-grid-community';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EditTermsAndConditionsService } from './shared/edit-terms-and-conditions.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
	selector: 'app-edit-terms-and-conditions',
	templateUrl: './edit-terms-and-conditions.component.html',
	styleUrls: ['./edit-terms-and-conditions.component.scss'],
	providers: [EditTermsAndConditionsService, TermsAndConditionsService]
})
export class EditTermsAndConditionsComponent implements OnInit {

	constructor(private termsAndConditionsService: TermsAndConditionsService,
		private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
		this.companyTermsGridOptions = <GridOptions>{
			context: {
				componentParent: this
			}
		};
		this.companyTermsGridOptions.rowSelection = 'single';
		this.companyTermsGridOptions.columnDefs = this.columnDefs;
		this.getCompanyTermsData();

		this.companyTermsGridOptions.getRowStyle = function (params) {
			if (params.node.rowIndex % 2 !== 0) {
				return { background: '#cccccc' }
			}
		}
	}

	ngOnInit() {
		this.termsInformationForm = new FormGroup(this.companyTermsInformationFormValidations);
		$(document).ready(function () {

			$("#common-grid-btn").click(function () {
				$("#common-grid").hide();
				$("#termsGrid").hide();
			});
			$("#common-grid-btn").click(function () {
				$("#hospital-Information").show();
			});
			$("#mu-adduser-save").click(function () {
				$("#common-grid").show();
				$("#termsGrid").show();
			});
			$(".mu-adduser-cancels").click(function () {
				$("#common-grid").show();
				$("#termsGrid").show();
			});
			$("#common-grid-btn").click(function () {
				$("#hospital-Information").css("display", "block");
			});
			$("#mu-adduser-save").click(function () {
				$("#hospital-Information").css("display", "none");
			});
			$(".mu-adduser-cancels").click(function () {
				$("#hospital-Information").css("display", "none");
			});
		});
	}

	companyTermsGridOptions: GridOptions;
	showGrid: boolean = true;


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
		{ headerName: 'CompanyTerms and Regulations', field: 'termsAndConditions', sortable: true, resizable: true, filter: true },
		{ headerName: 'Status', field: 'Status', sortable: true, resizable: true, filter: true }
	];


	editGrid() {
		this.onCompanyTermsSelected(this.companyTermsGridOptions.api.getSelectedRows()[0].companyTermsId);
	}


	onQuickFilterChanged($event) {
		this.onQuickFilterChanged["searchEvent"] = $event;
		this.companyTermsGridOptions.api.setQuickFilter($event.target.value);
		if (this.companyTermsGridOptions.api.getDisplayedRowCount() == 0) {
			this.companyTermsGridOptions.api.showNoRowsOverlay();
		} else {
			this.companyTermsGridOptions.api.hideOverlay();
		}
	}

	/**
	 * Grid Changes
	 * End
	 */

	/**
	 * Form Changes
	 * Start
	 */


	showForm: boolean = false;
	companyTerms: any[] = [];
	termsAndConditions: string = "";
	selectedCompanyTerms: Object = {};
	termsInformationForm: FormGroup;

	companyTermsInformationFormValidations = {
		companyTermsId: new FormControl(''),
		termsAndConditions: new FormControl('', [Validators.required]),
		activeS: new FormControl('Y')
	};

	onSubmit() {
		let payload = Object.assign({}, this.termsInformationForm.value);
		payload['lastUpdateUser'] = localStorage.getItem('id');
		payload['createdUser'] = localStorage.getItem('id');
		payload['companyTermsId'] = this.selectedCompanyTerms['companyTermsId'];
		this.updateCompanyTerms(payload);
	}

	onCompanyTermsSelected(companyTermsId: string) {
		this.selectedCompanyTerms = this.companyTerms.find(company => company['companyTermsId'] === companyTermsId);
		this.termsAndConditionsService.getRowDataFromServer().subscribe(
			gridRowDataResponse => {
				if (gridRowDataResponse instanceof Object) {
					if (gridRowDataResponse['responseStatus']['code'] === 200) {
						this.companyTerms = gridRowDataResponse['result'];
						let companyFormValues: Object = {
							companyTermsId: this.selectedCompanyTerms['companyTermsId'],
							termsAndConditions: this.selectedCompanyTerms['termsAndConditions'],
							activeS: this.selectedCompanyTerms['activeS']
						}
						this.termsInformationForm.setValue(companyFormValues);
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

	checkFormDisability() {
		return (this.termsInformationForm.get('termsAndConditions').errors instanceof Object)
			|| this.termsInformationForm.get('termsAndConditions').invalid
	}

	rowData = [];

	getCompanyTermsData() {
		this.showGrid = true;
		this.termsAndConditionsService.getRowDataFromServer().subscribe(
			getCompanyDataDataResponse => {
				if (getCompanyDataDataResponse instanceof Object) {
					if (getCompanyDataDataResponse['responseStatus']['code'] === 200) {
						this.rowData = getCompanyDataDataResponse['result'];
						this.companyTerms = this.rowData;

						for (let i = 0; i < this.companyTerms.length; i++) {
							if (this.companyTerms[i].activeS == 'Y') {
								this.companyTerms[i].Status = 'Active'
							}

							else if (this.companyTerms[i].activeS == 'N') {
								this.companyTerms[i].Status = 'DeActive'
							}
						}
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

	reset() {
		this.termsInformationForm.reset();
		this.termsInformationForm.controls.activeS.setValue('Y');
	}

	updateCompanyTerms(termsInformationForm: Object) {
		this.termsInformationForm.get('termsAndConditions').setErrors({ 'incorrect': true });
		this.spinnerService.show();
		this.termsAndConditionsService.updateCompanyTerms(termsInformationForm).subscribe(
			updateCompanyTermsResponse => {
				if (updateCompanyTermsResponse instanceof Object) {
					if (updateCompanyTermsResponse['responseStatus']['code'] === 200) {
						this.termsInformationForm.reset();
						this.toasterService.success(updateCompanyTermsResponse['message'], 'Success', {
							timeOut: 3000
						});
						this.spinnerService.hide();
						this.showGrid = true;
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
			}, error => {
				this.spinnerService.hide();
				this.toasterService.warning('Please contact administrator', 'Error Occurred', {
					timeOut: 3000
				});
			}
		);
	}


}