import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesService } from '../sales.service';
import { EmployeeService } from 'src/app/masters/employee/shared/employee.service';

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss'],
  providers: [SalesService]
})

export class SalesChartComponent implements OnInit {

  permissions: any[]=[];
  showTodaysSalesChart=true;
  constructor(private router: Router, private salesService: SalesService,private employeeService:EmployeeService) { 
    this.employeeService.getEmployeeAccessByEmployeeId(localStorage.getItem('id')).subscribe((employeeAccess) => {
      if (employeeAccess instanceof Object) {
        if (employeeAccess["responseStatus"]["code"] === 200) {
          if (employeeAccess["result"] instanceof Object) {
            this.permissions = employeeAccess["result"];
            if(this.permissions[70]['activeS'] === 'Y'){
               this.showTodaysSalesChart=true;
            }else{
               this.showTodaysSalesChart=false;
            }
          }
         }
      }
   });
    this.getTodayDetails();
    this.getCashCount(); this.getCashAmount();
    this.getCreditCount(); this.getCreditAmount();
    this.getUpiCount(); this.getUpiAmount();
    this.getCreditCardCount(); this.getCreditCardAmount();
    this.getChequeCount(); 
    this.getChequeAmount();this.getCreditNoteAmount();
    this.getCreditNoteCount();this.getCreditNoteIssuedCount();
    this.getCreditNoteIssuedAmount();this.getSalesReturnCount();
    this.getSalesReturnAmount()
  }
  todaySales: any;
  yesterday: any;
  cashCount: any;
  creditNoteCount: any;
  creditCount: any;
  upiCount: any;
  creditCardCount: any;
  chequeCount: any;
  cashAmount: any;
  creditAmount:any;
  upiAmount: any;
  creditNoteAmount:any;
  creditNoteIssuedCount:any
  salesReturnCreditNoteCount:any
  salesReturnCreditNoteAmount:any
  creditNoteIssuedAmount:any
  creditCardAMount:any;
  chequeAmount: any;
  showTop = false;
  showDown = false;
  getTodayDetails() {
    this.salesService.todayDetails().subscribe(
      res => {
        if (res['responseStatus']['code'] == 200) {
          if(res['result'] != null){
            this.todaySales = res['result'] ? res['result'] : 0;
            this.getYesturdayDiff();
          }else
          return this.todaySales = '0';         
        }
      },error=>{
        this.todaySales='0'
      }
    )
  }

  getCashCount() {
    this.salesService.cashCount().subscribe(
      res => {
       if (res['responseStatus']['code'] == 200) {
          if (res['result'] != null) {
            this.cashCount = res['result'];
          } else
            return this.cashCount = '0';
          }
      },error=>{
        this.cashCount='0'
      }
    )
  }

  getCreditCount() {
    this.salesService.creditCount().subscribe(
      res => {
       if (res['responseStatus']['code'] === 200) {
          if (res['result'] != null) {
            this.creditCount = res['result'];
          } else
            return this.creditCount = '0';
          } 
      },error=>{
        this.creditCount='0'
      }
    )
  }
  
  getUpiCount(){
    this.salesService.upiCount().subscribe(
      res=>{ 
        if(res['responseStatus']['code'] === 200){
          if (res['result'] != null) {
            this.upiCount = res['result'];
           }else
          return this.upiCount = '0';
        }       
      },error=>{
        this.creditCount='0'}
    )
  }
  getCreditCardCount(){
    this.salesService.creditCardCount().subscribe(
      res=>{
      if(res['responseStatus']['code'] === 200){
        if(res['result'] != null){
          this.creditCardCount = res['result'];
        }else
        return this.creditCardCount = '0';
      }
      },error=>{
        this.creditCardCount = '0';
      }
    )
}
  getChequeCount(){
    this.salesService.chequeCount().subscribe(
      res=>{
        if(res['responseStatus']['code'] === 200){
          if(res['result'] != null){
            this.chequeCount = res['result'];
          }else
          return this.chequeCount = '0';
        }
      },error=>{
        this.chequeCount = '0';
      }
    )
  }

  getCreditNoteCount(){
    this.salesService.creditNoteCount().subscribe(
      res=>{
        if(res['responseStatus']['code'] === 200){
          if(res['result'] != null){
            this.creditNoteCount = res['result'];
          }else
          return this.creditNoteCount = '0';
        }
      },error=>{
        this.creditNoteCount = '0';
      }
    )
  }

  getCreditNoteIssuedCount(){
    this.salesService.creditNoteIssuedCount().subscribe(
      res=>{
        if(res['responseStatus']['code'] === 200){
          if(res['result'] != null){
            this.creditNoteIssuedCount = res['result'];
          }else
          return this.creditNoteIssuedCount = '0';
        }
      },error=>{
        this.creditNoteIssuedCount = '0';
      }
    )
  }

  getSalesReturnCount(){
    this.salesService.salesReturnCount().subscribe(
      res=>{
        if(res['responseStatus']['code'] === 200){
          if(res['result'] != null){
            this.salesReturnCreditNoteCount = res['result'];
          }else
          return this.salesReturnCreditNoteCount = '0';
        }
      },error=>{
        this.salesReturnCreditNoteCount = '0';
      }
    )
  }

  getYesturdayDiff() {
    this.salesService.yesturdayDetails().subscribe(
      res => {
      if (res['responseStatus']['code'] == 200) {
          if (res['result'] != null) {
            if (res['result'] > this.todaySales) {
              this.yesterday = res['result'] - this.todaySales;
              this.showDown = true;
            }
            else if (res['result'] < this.todaySales) {
              this.yesterday = this.todaySales - res['result'];
              this.showTop = true;
            }
          } else
            return this.yesterday = '0';
        }
        
      },error=>{
       this.yesterday = '0';
      }
    )

  }
  getCashAmount(){
    this.salesService.cashAmount().subscribe(
      res=>{
        if(res['result'] != null){
          this.cashAmount = res['result'];
        }else
        return this.cashAmount = '0';
      },error=>{
        this.cashAmount = '0';
      }
    )
  }
  getCreditAmount(){
    this.salesService.creditAmount().subscribe(
      res=>{
        if(res['result'] != null){
          this.creditAmount = res['result'];
        }else
        return this.creditAmount = '0'
      },error=>{
        this.creditAmount = '0'
      }
    )
  }
  getCreditNoteAmount(){
    this.salesService.creditNoteAmount().subscribe(
      res=>{
        if(res['result'] != null){
          this.creditNoteAmount = res['result'];
        }else
        return this.creditNoteAmount = '0'
      },error=>{
        this.creditNoteAmount = '0'
      }
    )
  }
  getUpiAmount(){
    this.salesService.upiAmount().subscribe(
      res=>{
        if(res['result'] != null){
          this.upiAmount = res['result']
        }else
        return this.upiAmount = '0'
      },error=>{
        this.upiAmount = '0'
      }
    )
  }
  getCreditCardAmount(){
    this.salesService.creditCardAmount().subscribe(
      res=>{
        if(res['result'] != null){
          this.creditCardAMount = res['result']
        }else
        return this.creditCardAMount = '0'
      },error=>{
        this.creditCardAMount = '0'
      }
    )
  }
  getChequeAmount(){
    this.salesService.chequeAmount().subscribe(
      res=>{
        if(res['result'] != null){
          this.chequeAmount = res['result']
        }else
       return this.chequeAmount = '0'
      },error=>{
        this.chequeAmount = '0'
      }
    )
  }

  getCreditNoteIssuedAmount(){
    this.salesService.creditNoteIssuedAmount().subscribe(
      res=>{
        if(res['result'] != null){
          this.creditNoteIssuedAmount = res['result']
        }else
       return this.creditNoteIssuedAmount = '0'
      },error=>{
        this.creditNoteIssuedAmount = '0'
      }
    )
  }


  getSalesReturnAmount(){
    this.salesService.salesReturnAmount().subscribe(
      res=>{
        if(res['result'] != null){
          this.salesReturnCreditNoteAmount = res['result']
        }else
       return this.salesReturnCreditNoteAmount = '0'
      },error=>{
        this.salesReturnCreditNoteAmount = '0'
      }
    )
  }
  ngOnInit() {
  }

}
