import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ItemService } from '../shared/item.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/core/app.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-item-groups',
  templateUrl: './item-groups.component.html',
  styleUrls: ['./item-groups.component.scss'],
  providers: [ItemService]
})

export class ItemGroupsComponent implements OnInit {

  itemGroupForm: FormGroup;

  medicalOrNonMedicalArray = ['M', 'N'];

  constructor(private itemService: ItemService, private formBuilder: FormBuilder, private appService: AppService,
    private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.itemGroupForm = this.formBuilder.group({
      groupCode: ['', Validators.required],
      groupName: ['', Validators.required],
      medicalOrNonMedical: ['M'],
      groupDescription: ['', Validators.required],
      activeS: ['Y'],
      createdUser:new FormControl(localStorage.getItem('id')),
      lastUpdateUser:new FormControl(localStorage.getItem('id'))
    });
  }

  checkFormDisability() {
    return (this.itemGroupForm.get('groupCode').errors instanceof Object)
      || this.itemGroupForm.get('groupName').invalid
      || this.itemGroupForm.get('groupDescription').invalid
  }


  onSubmit() {
    if (this.itemGroupForm.valid) {
      this.itemGroupForm.get('groupName').setErrors({ 'wrong': true });
      this.spinnerService.show();
      this.itemService.saveItemGroup(this.itemGroupForm.value).subscribe((res: any) => {
        this.spinnerService.hide();
        this.toasterService.success(res['message'], 'Success', {
          timeOut: 3000
        });
        this.itemGroupForm.reset();
        this.itemGroupForm.controls.activeS.setValue('Y');
        this.itemGroupForm.controls.medicalOrNonMedical.setValue('M');
      },
        err => {
          this.spinnerService.hide();
        });
    } else {
      this.toasterService.error(
        'Please fill the mandatory fields', 'Error', {
        timeOut: 5000
      });
    }
  }

  get f() { return this.itemGroupForm.controls; }

}
