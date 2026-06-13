import { Component, OnInit } from '@angular/core';
import {
  faEnvelopeOpenText, faExternalLinkAlt, faEdit, faSignOutAlt, faShippingFast, faShoppingBasket, faFileInvoice,
  faStream, faUndo, faCashRegister
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { EmployeeService } from '../masters/employee/shared/employee.service';
import { UserIdleService } from 'angular-user-idle';
import { AppService } from '../core/app.service';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  
})
export class StockComponent implements OnInit {

  faEnvelopeOpenText = faEnvelopeOpenText;
  faExternalLinkAlt = faExternalLinkAlt;
  faEdit = faEdit;
  faSignOutAlt = faSignOutAlt;
  faShippingFast = faShippingFast;
  faShoppingBasket = faShoppingBasket;
  faFileInvoice = faFileInvoice;
  faStream = faStream;
  faUndo = faUndo;
  faCashRegister = faCashRegister;
  employeeObj;
  showStockTake=false;
  permissions: any;
  constructor(private router: Router,private appService:AppService) {

    /*this.employeeService.getEmployeePharmacyroleByEmployeeId(localStorage.getItem('id')).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] == 200) {
          this.employeeObj = res['result']
          if (res['result']['pharmacyRolesModel']['roleId'] == 1) {
           this.showStockTake=true;
          }
          else{
            this.showStockTake=false
          }
        }
      }
    })*/
     this.appService.getPermissions().subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];
        if (this.permissions instanceof Array) {
          if(this.permissions[72]!=undefined){
            if (this.permissions[72]['activeS'] === 'Y') {
              this.showStockTake=true;
            }
            else {
           this.showStockTake=false;
            }
          }else{
            this.showStockTake=false;
          } 
        }
      }
    });
  }

  suppliers: any;
 
  ngOnInit() {
    $(document).ready(function () {
      $('.left-menu ul li').click(function () {
        $('.left-menu ul li').removeClass('active');
        $('.no-childern').removeClass('active');
        $(this).addClass('active');
      });
      $('.no-childern').click(function () {
        $('.no-childern').removeClass('active');
        $('.left-menu ul li').removeClass('active');
        $(this).addClass('active');
      });

     /*  $(".left-accordion-menu").click(function () {
        $("#chartsId").hide();
        $(".left-accordion-menu").show();
      });
      $(".stockClick").click(function () {
        $("#chartsId").show();
      }); */
      
    });
   
  
  }

  navigateRoute(route: string) {

    this.router.navigate([`/stock/${route}`]);

  }

}
