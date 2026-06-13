import { Component, OnInit } from '@angular/core';
import { FinanceChartService } from './finance-chart.servics';
import { EmployeeService } from 'src/app/masters/employee/shared/employee.service';

@Component({
  selector: 'finance-chart',
  templateUrl: './finance-chart.component.html',
  styleUrls: ['./finance-chart.component.scss'],
  providers: [FinanceChartService]
})
export class FinanceChartComponent implements OnInit {
  permissions: any[]=[];
 showPaymentsStatus=true;

  constructor(private financeService: FinanceChartService,private employeeService:EmployeeService) { 
    this.employeeService.getEmployeeAccessByEmployeeId(localStorage.getItem('id')).subscribe((employeeAccess) => {
      if (employeeAccess instanceof Object) {
        if (employeeAccess["responseStatus"]["code"] === 200) {
          if (employeeAccess["result"] instanceof Object) {
            this.permissions = employeeAccess["result"];
            if(this.permissions[71]['activeS'] === 'Y'){
               this.showPaymentsStatus=true;
            }else{
               this.showPaymentsStatus=false;
            }
          }
         }
      }
   });
    this.getPendingDetails();
    this.getPartiallyPaidDetails();
    this.getPaidDetails();
  }
  pending:any;
  partiallyPaid:any;
  paid:any;
  getPendingDetails(){
    this.financeService.pendingDetails().subscribe(res=>{
      if(res['responseStatus']['code'] == 200){
        if(res['result']!= null){
          this.pending = res['result'];
        }else 
        return '0';
      }
    },error=>{
      this.pending = '0';
    }
    )

  }
  getPartiallyPaidDetails(){
    this.financeService.partiallyPaidDetails().subscribe(
      res=>{
        if(res['responseStatus']['code']){
          if(res['result'] != null){
            this.partiallyPaid = res['result']
          }else{
            return this.partiallyPaid = '0'
          }
        }
      },error=>{
        return this.partiallyPaid = '0'
      }
    )
  }
  getPaidDetails(){
this.financeService.paidDetails().subscribe(
  res=>{
    if(res['responseStatus']['code'] == 200){
      if(res['result'] != null){
        this.paid = res['result']
      }else{
        this.paid = '0'
      }
    }
  },error=>{
    this.paid = '0'
  }
)
  }
  ngOnInit() {
  }

}
