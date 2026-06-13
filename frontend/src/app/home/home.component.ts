import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faChartPie
} from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';
import { HomeService } from './home.service';
import * as Highcharts from 'highcharts';
import { YEAR } from 'ngx-bootstrap/chronos/units/constants';
import { EmployeeService } from '../masters/employee/shared/employee.service';
import { AppService } from '../core/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeService]
})
export class HomeComponent implements OnInit {

  faChartPie = faChartPie;
  showSalesByPerson: boolean
  showSalesByDates: boolean
  showSalesByHour : boolean
  permissions: any;

  constructor(private router: Router, private homeService: HomeService, private appService: AppService,
    private employeeService: EmployeeService, private toasterService: ToastrService) {

    this.appService.getPermissions().subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];
        if (this.permissions instanceof Array) {

          if (this.permissions[86]['activeS'] === 'Y') {
            this.showSalesByDates = true
        
          }
          else {
            this.showSalesByDates = false
           
          }

          if (this.permissions[87]['activeS'] === 'Y') {
            this.showSalesByPerson = true
          } else {
            this.showSalesByPerson = false
          }

          if (this.permissions[97]['activeS'] === 'Y') {
            this.showSalesByHour = true
          } else {
            this.showSalesByHour = false
          }
        }
        else {
          this.showSalesByDates = false
          this.showSalesByPerson = false
          this.showSalesByHour = false
        }
      }
    });
  }


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

      $('.app').show();
      $('#secondNav').show();
      $('#firstNav').show();
      $('#headrow').show();
    })
  }

  navigateRoute(route: string) {

    this.router.navigate([`/stock/${route}`]);

  }

}
