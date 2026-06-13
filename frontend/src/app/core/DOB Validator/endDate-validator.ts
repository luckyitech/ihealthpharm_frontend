import { AbstractControl,Validator } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';

export function EndDateValidator(control: AbstractControl) {
    var datePipe = new DatePipe('en-US');
    
 if (control.value == new Date().toISOString().substr(0, 10) || control.value < new Date().toISOString().substr(0, 10)) {


  return { invalidDob: true };
  
}

 return null;
 }