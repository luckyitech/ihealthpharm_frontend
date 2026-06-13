import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from './notification.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  createNote=false;
  constructor(private notificationService:NotificationService, private toasterService: ToastrService) { }

  ngOnInit() {
    this.addNotificationInformationForm = new FormGroup(this.addNotificationFormValidation)
  }
  createNotification(){
    this.createNote = true;
  }
  addNotificationInformationForm: FormGroup;
  addNotificationFormValidation={
    email: new FormControl('',[Validators.required,Validators.email, Validators.pattern(/^[a-z_\-0-9\.\*\#\$\!\~\%\^\&\-\+\?\|]+@+[a-z\-0-9]+(.com)$/i)]),
    date: new FormControl('',Validators.required),
    title: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required)
  }
  onSave(){
    let payload = Object.assign({},this.addNotificationInformationForm.value);
    this.notificationService.saveNotification(payload).subscribe(
      res=>{
       if(res instanceof Object){
         if(res['responseStatus']['code']===200){
          this.addNotificationInformationForm.reset();
          this.toasterService.success(res['message'],'success',{
            timeOut: 3000
          })
         }
       }
      }
    )
  }
  cancelAdd(){
    this.addNotificationInformationForm.reset();
  }
  checkFormDisability(){
    return (this.addNotificationInformationForm.get('email').invalid)
    || (this.addNotificationInformationForm.get('date').errors instanceof Object)
    || (this.addNotificationInformationForm.get('title').errors instanceof Object)
    || (this.addNotificationInformationForm.get('description').errors instanceof Object)
  }
}
