import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ItemService } from '../shared/item.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/core/app.service';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss'],
  providers: [ItemService]
})
export class UomComponent implements OnInit {

  itemUOMForm: FormGroup;


  constructor(private itemService: ItemService, private formBuilder: FormBuilder, private appService: AppService,
    private toasterService: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {

  }


  ngOnInit() {
    this.itemUOMForm = new FormGroup(this.itemSpecializationFormValidations);

  }


  itemSpecializationFormValidations = {
    measurementCode: new FormControl('', [Validators.required]),
    measurementDesc: new FormControl('', Validators.required),
    activeS: new FormControl('Y')
  };



  onSubmit() {

    let payload = Object.assign({}, this.itemUOMForm.value);
    payload['createdUser'] = localStorage.getItem('id');
    payload['lastUpdateUser'] = localStorage.getItem('id');
    this.saveFormChanges(payload);
  }

  checkFormDisability() {
    return (this.itemUOMForm.get('measurementCode').errors instanceof Object)
      || this.itemUOMForm.get('measurementCode').invalid
  }


  saveFormChanges(itemUOMForm: Object) {
    this.itemUOMForm.get('measurementCode').setErrors({ 'wrong': true })
    this.spinnerService.show();
    this.itemService.saveitemUOM(itemUOMForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.itemUOMForm.reset();
            this.spinnerService.hide();
            this.itemUOMForm.controls.activeS.setValue('Y');

            this.toasterService.success(saveFormResponse['message'], 'Success', {
              timeOut: 3000
            });
          }
          else {
            this.toasterService.error('Please contact administrator', 'Error Occurred', {
              timeOut: 3000
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

  get f() { return this.itemUOMForm.controls; }


}
