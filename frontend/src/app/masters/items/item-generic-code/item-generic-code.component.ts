import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from '../shared/item.service';
import { AppService } from 'src/app/core/app.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-item-generic-code',
  templateUrl: './item-generic-code.component.html',
  styleUrls: ['./item-generic-code.component.scss'],
  providers: [ItemService]
})

export class ItemGenericCodeComponent implements OnInit {

  itemGenericForm: FormGroup;
  itemGroupList = [];
  itemGroups = [];
  groupCode;
  resetSearchTerm: boolean = false;
  medicalOrNonMedicalArray = ['M', 'N'];
  selectedGroupCode: any;

  constructor(private itemService: ItemService, private formBuilder: FormBuilder,
    private toasterService: ToastrService, private appService: AppService, private spinnerService: Ng4LoadingSpinnerService) {
    this.getAllItemGroupsData('M', this.groupCodeSearchTerm);
  }
  groupCodeSearchTerm: string = 'All';
  showGroupCode: boolean = false;

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.itemGenericForm = this.formBuilder.group({
      itemGroupId: [''],
      genericCode: ['', Validators.required],
      genericName: ['', Validators.required],
      medicalOrNonMedical: ['M'],
      activeS: ['Y']
    });
    this.showGroupCode = false;
  }

  onSubmit() {
    let payload = Object.assign({}, this.itemGenericForm.value);
    payload['itemGroupId'] = this.selectedGroupCode;
    payload['createdUser']=localStorage.getItem('id');
    payload['lastUpdateUser']=localStorage.getItem('id');
    this.saveFormChanges(payload);
  }

  reset(){
    this.itemGenericForm.reset();
    this.selectedGroupCode=undefined; 
  }


  saveFormChanges(itemGenericForm: Object) {
    this.itemGenericForm.get('genericName').setErrors({'incorrect':true})
    this.spinnerService.show();
    this.itemService.saveItemGenericaNames(itemGenericForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.spinnerService.hide();
            this.itemGenericForm.reset();
            this.itemGenericForm.controls.activeS.setValue('Y');
            this.itemGenericForm.controls.medicalOrNonMedical.setValue('M');
            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
            this.selectedGroupCode = undefined;
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
      },error=>{
        this.spinnerService.hide();
        this.toasterService.error('Please contact administrator', 'Error Occurred', {
          timeOut: 5000
        });
      }
    );
  }

  get f() { return this.itemGenericForm.controls; }

  checkFormDisability() {
    return (this.itemGenericForm.get('genericName').errors instanceof Object)
      || (this.itemGenericForm.get('genericCode').errors instanceof Object)
      || this.itemGenericForm.get('genericCode').invalid
  }

  getAllItemGroupsData(medicalOrNonMedical: string, groupCodeSearchTerm: string) {
    this.itemService.getAllItemGroupsData(medicalOrNonMedical, groupCodeSearchTerm).subscribe(
      itemResponse => {
        if (itemResponse instanceof Object) {
          if (itemResponse['responseStatus']['code'] === 200) {
            this.itemGroups = itemResponse['result'];
          }
        }
      }
    );
  }

  onGroupCodeSearchTermChanged(groupCodeSearchTerm: string) {
    this.groupCodeSearchTerm = groupCodeSearchTerm;
    this.getAllItemGroupsData(this.itemGenericForm.get('medicalOrNonMedical').value, this.groupCodeSearchTerm);
  }

  onGroupCodeChanged(item: any) {
    this.showGroupCode = false;
    this.groupCode = item;
    this.itemGenericForm.patchValue({ 'itemGroupId': item['groupCode'] });
  }

  onItemTypeChanged(event) {
    this.itemGenericForm.patchValue({ 'itemGroupId': '' });
    this.getAllItemGroupsData(event.target.value, this.groupCodeSearchTerm);
  }

}
