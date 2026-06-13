import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ItemService } from '../shared/item.service';
import { AppService } from 'src/app/core/app.service';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.scss']
})

export class ItemCategoryComponent implements OnInit {

  itemCategoryForm: FormGroup;
  medicalOrNonMedicalArray = ['M', 'N'];

  constructor(private itemService: ItemService, private formBuilder: FormBuilder, private appService: AppService,
    private spinnerService: Ng4LoadingSpinnerService, private toasterService: ToastrService) { }

  rowSelection(params: any) {
    if (!params.node.selected) {
      let resetData = this.appService.getInsertedRowData()
        .find(dataRow => dataRow.providerId === params.data.providerId);
      params.node.setData(JSON.parse(JSON.stringify(resetData)));
    }
  }

  ngOnInit() {
    this.itemCategoryForm = new FormGroup(this.itemCategoryInformationFormValidations);
  }


  itemCategoryInformationFormValidations = {
    categoryCode: new FormControl('', [Validators.required]),
    medicalOrNonMedical: new FormControl('M', [Validators.required]),
    categoryDescription: new FormControl('', Validators.required),
    activeS: new FormControl('Y'),
    marginPercentage: new FormControl('', Validators.pattern("^[0-9]*$"))
  };

  onSubmit() {
    let payload = Object.assign({}, this.itemCategoryForm.value);
    payload['createdUser'] = localStorage.getItem('id');
    payload['lastUpdateUser'] = localStorage.getItem('id');
    this.saveFormChanges(payload);
  }

  saveFormChanges(itemCategoryForm: Object) {
    this.itemCategoryForm.get('categoryDescription').setErrors({ 'incorrect': true })
    this.spinnerService.show();
    this.itemService.saveItemCategory(itemCategoryForm).subscribe(
      saveFormResponse => {
        if (saveFormResponse instanceof Object) {
          if (saveFormResponse['responseStatus']['code'] === 200) {
            this.itemCategoryForm.reset();
            this.spinnerService.hide();
            this.itemCategoryForm.controls.activeS.setValue('Y');
            this.itemCategoryForm.controls.medicalOrNonMedical.setValue('M');
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

  checkFormDisability() {
    return (this.itemCategoryForm.get('categoryDescription').errors instanceof Object)
      || this.itemCategoryForm.get('categoryDescription').invalid
      || this.itemCategoryForm.get('marginPercentage').errors instanceof Object
      || this.itemCategoryForm.get('marginPercentage').invalid
      || this.itemCategoryForm.get('categoryCode').errors instanceof Object
      || this.itemCategoryForm.get('categoryCode').invalid
  }

  get f() { return this.itemCategoryForm.controls; }

}
