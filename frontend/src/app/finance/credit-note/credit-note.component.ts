import { EmployeeService } from './../../masters/employee/shared/employee.service';
import { Component, OnInit } from '@angular/core';
import { CreditNoteService } from './shared/credit-note.service';
import { SupplierService } from 'src/app/masters/supplier/shared/supplier.service';
import { CustomerService } from 'src/app/masters/customer/shared/customer.service';


@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss'],
  providers: [CreditNoteService, SupplierService, CustomerService, EmployeeService]
})

export class CreditNoteComponent implements OnInit {

  constructor() {
    }

    ngOnInit() {}
    
    selectedTab = 'add';

}