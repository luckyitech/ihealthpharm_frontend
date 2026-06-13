import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MembershipService } from '../shared/membership.service';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, ColDef } from 'ag-grid-community';
import * as $ from 'jquery';
import { EndDateValidator } from 'src/app/core/DOB Validator/endDate-validator';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-edit-memberships',
  templateUrl: './edit-memberships.component.html',
  styleUrls: ['./edit-memberships.component.scss'],
  providers: [MembershipService]
})

export class EditMembershipsComponent implements OnInit {

  constructor(private membershipService: MembershipService,
    private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.membershipGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.membershipGridOptions.rowSelection = 'single';
    this.membershipGridOptions.columnDefs = this.columnDefs;

    this.getMembershipData();

    this.membershipGridOptions.getRowStyle = function (params) {
			if (params.node.rowIndex % 2 !== 0) {
			  return { background: '#cccccc' }
			}
		  }
  }

  ngOnInit() {
    this.membershipInformationForm = new FormGroup(this.membershipInformationFormValidations);
    $(document).ready(function () {
      $("#common-grid-btn").click(function () {
        $("#common-grid").hide();
        $("#editMembershipGrid").hide();
      });
      $("#common-grid-btn").click(function () {
        $("#membership-Information").show();
      });
      $(".mu-adduser-saved").click(function () {
        $("#common-grid").show();
        $("#editMembershipGrid").show();
      });

      $("#mu-adduser-cancel").click(function () {
        $("#common-grid").show();
        $("#editMembershipGrid").show();
      });
      $("#common-grid-btn").click(function () {
        $("#membership-Information").css("display", "block");
      });
      $(".mu-adduser-saved").click(function () {
        $("#membership-Information").css("display", "none");
      });
      $("#mu-adduser-cancel").click(function () {
        $("#membership-Information").css("display", "none");
      });

    });
  }

  ngOnDestroy(): void {
  }

	/**
	 * Grid Changes
	 * Start
	 */

  key;
  membershipGridOptions: GridOptions;
  showGrid: boolean = true;

  resetGrid() {
    this.getMembershipData()
  }

  reset() {
    this.membershipInformationForm.reset();
    this.membershipInformationForm.controls.activeS.setValue('Y');
  }

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
    { headerName: 'Mem Card Name', field: 'membershipCardName', sortable: true, resizable: true,filter: true },
    { headerName: 'Status', field: 'Status', sortable: true,resizable: true, filter: true },
    { headerName: 'Start Date', field: 'membershipStartDate', sortable: true,resizable: true, filter: true },
    { headerName: 'End Date', field: 'membershipEndDate', sortable: true,resizable: true, filter: true },
    { headerName: 'Duration', field: 'membershipDurationInMonths', sortable: true,resizable: true, filter: true },
    { headerName: 'Bonus %', field: 'membershipBonusPercentage', sortable: true,resizable: true, filter: true },
    { headerName: 'Discount %', field: 'membershipDiscountPercentage', sortable: true,resizable: true, filter: true },
    { headerName: 'Credit Amount', field: 'membershipCreditAmount', sortable: true,resizable: true, filter: true },
    { headerName: 'Credit days', field: 'membershipCreditDays', sortable: true,resizable: true, filter: true },
    { headerName: 'Offers', field: 'offers', sortable: true,resizable: true, filter: true }
  ];

  editGrid() {
    this.onMembershipSelected(this.membershipGridOptions.api.getSelectedRows()[0].membershipCardId);
  }

  onQuickFilterChanged($event) {
    this.onQuickFilterChanged["searchEvent"] = $event;
    this.membershipGridOptions.api.setQuickFilter($event.target.value);
    if (this.membershipGridOptions.api.getDisplayedRowCount() == 0) {
      this.membershipGridOptions.api.showNoRowsOverlay();
    } else {
      this.membershipGridOptions.api.hideOverlay();
    }
  }

	/**
	 * Grid Changes
	 * End
	 */

	/**
	 *
	 * Form Changes
	 * Start
	 */


  showForm: boolean = false;
  memberships: any[] = [];

  name: string = "";

  selectedMembership: Object = {};
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


  onMembershipSelected(membershipCardId: string) {
    this.selectedMembership = this.memberships.find(company => company['membershipCardId'] === membershipCardId);
    this.membershipService.getRowDataFromServer().subscribe(
      gridRowDataResponse => {
        if (gridRowDataResponse instanceof Object) {
          if (gridRowDataResponse['responseStatus']['code'] === 200) {
            this.memberships = gridRowDataResponse['result'];
            let membershipFormValues: Object = {
              membershipCardName: this.selectedMembership['membershipCardName'],
              membershipStartDate: this.selectedMembership['membershipStartDate'],
              membershipEndDate: this.selectedMembership['membershipEndDate'],
              membershipDurationInMonths: this.selectedMembership['membershipDurationInMonths'],
              membershipCreditAmount: this.selectedMembership['membershipCreditAmount'],
              membershipCreditDays: this.selectedMembership['membershipCreditDays'],
              membershipDiscountPercentage: this.selectedMembership['membershipDiscountPercentage'],
              membershipBonusPercentage: this.selectedMembership['membershipBonusPercentage'],
              offers: this.selectedMembership['offers'],
              activeS: this.selectedMembership['activeS']
            }
            this.membershipInformationForm.setValue(membershipFormValues);
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
    let payload = Object.assign({}, this.membershipInformationForm.value);
    payload['lastUpdateUser'] = localStorage.getItem('id');
		payload['createdUser'] = localStorage.getItem('id');
    payload['membershipCardId'] = this.selectedMembership['membershipCardId'];
    this.updateMembershipData(payload);
  }

  checkFormDisability() {
    return (this.membershipInformationForm.get('membershipCardName').errors instanceof Object)
      || (this.membershipInformationForm.get('membershipStartDate').errors instanceof Object)
      || (this.membershipInformationForm.get('membershipEndDate').errors instanceof Object)
  }

  rowData = [];

  getMembershipData() {
    this.showGrid = true;
    this.membershipService.getRowDataFromServer().subscribe(
      getMembershipDataResponse => {
        if (getMembershipDataResponse instanceof Object) {
          if (getMembershipDataResponse['responseStatus']['code'] === 200) {
            this.rowData = getMembershipDataResponse['result'];
            this.memberships = this.rowData;
       
            for (let i = 0; i < this.memberships.length; i++) {
              if (this.memberships[i].activeS == 'Y') {
                this.memberships[i].Status = 'Active'
              }
              else if (this.memberships[i].activeS == 'N') {
                this.memberships[i].Status = 'DeActive'
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



  updateMembershipData(membershipInformationForm: Object) {
    this.membershipInformationForm.get('membershipCardName').setErrors({ 'incorrect': true })
    this.spinnerService.show();
    this.membershipService.updateRowData(membershipInformationForm).subscribe(
      updateMembershipResponse => {
      
        if (updateMembershipResponse instanceof Object) {
          if (updateMembershipResponse['responseStatus']['code'] === 200) {
            this.membershipInformationForm.reset();
            this.membershipInformationForm.controls.activeS.setValue('Y');
            this.spinnerService.hide();
            this.toasterService.success(updateMembershipResponse['message'], 'Success', {
              timeOut: 3000
            });
            this.showGrid = true;
            this.key=null;
            this.getMembershipData();
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

  diff_months(dt2, dt1) {
    let d1 = new Date(dt1);
    let d2 = new Date(dt2);
    var diff = (d2.getTime() - d1.getTime()) / 1000;  
    diff /= (60 * 60 * 24 * 7 * 4);
    return Math.abs(Math.round(diff));
  }

  modelChanged(event){
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

  search() {  
    if (this.key != null && this.key != undefined && this.key != '') {
      this.membershipService.getMembershipDataBySearch(this.key).subscribe(insuranceRes => {
        if (insuranceRes["responseStatus"]["code"] === 200) {
          this.rowData = insuranceRes['result'];
          if(this.rowData.length == 0){
            this.toasterService.warning("No Data Found With Search Criteria","No Data To Show",
            {
              timeOut: 3000
            });
          }

        }
      },
        error => {
          this.rowData = [];
          this.toasterService.error("Please contact administrator","Error Occurred",
            {
              timeOut: 5000
            });
        })
    }
    else {
      this.getMembershipData();
    }
  }

}
