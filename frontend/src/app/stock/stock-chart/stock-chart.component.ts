import { Component, OnInit } from '@angular/core';
import { StockService } from '../stock.service';
import { reduce } from 'rxjs/operators'; 
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts'; 
import { EmployeeService } from 'src/app/masters/employee/shared/employee.service';

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss'],
  providers: [StockService] 
})
export class StockChartComponent implements OnInit {

  highcharts = Highcharts;
  chartOptions2  = {
    chart: {
      plotBorderWidth: null,
      plotShadow: false,
      width:519
    },
    title: {
      text: '<b>Top 5 Supplier\'s Revenue</b>'
    },
    subtitle:{
      text: '(in 000\'s)' 
   },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y:.1f}</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y:.1f}  ',
        }
      }
    },

    series: [{
      type: 'pie',
      name: 'Suppliers',
      data: [],
      }]

  };
  charts = {
    chart: {
      type: 'column',
      width:519
    },
    title: {
      text: '<b>Top 10 Supplier\'s of Margin Percentage</b>'
    },

    xAxis : {
      type: 'category',
      labels: {
         rotation: -45,
         style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
         }
      }
   },
   yAxis : {
      min: 0,
      title: {
         text: 'Profit (%)'
      }
   },
   
    tooltip: {
      pointFormat: ' Current Margin: <b>{point.y:.1f} %</b>'
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'Suppliers',
        color: "#48D1CC",
        axisYType: "secondary",
        data: [],
        
        dataLabels: {
          enabled: true,
          rotation: -90,
          align: 'right',
          format: '{point.y:.1f}', // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',

          }
        },
        shadow: {
          color: '#E8E8E8',
          width: 10,
          offsetX: 0,
          offsetY: 0
        }
      }
    ]
  }; 
  showSuppliersMarginPerChart=true;
  showSuppliersRevenueChart=true;
  permissions: any[]=[];
  constructor(private router: Router , private stockService: StockService, 
    private drugSupplierCount: StockService,private employeeService:EmployeeService ) {
      this.employeeService.getEmployeeAccessByEmployeeId(localStorage.getItem('id')).subscribe((employeeAccess) => {
        if (employeeAccess instanceof Object) {
          if (employeeAccess["responseStatus"]["code"] === 200) {
            if (employeeAccess["result"] instanceof Object) {
              this.permissions = employeeAccess["result"];
              if(this.permissions[68]['activeS'] === 'Y'){
                 this.showSuppliersMarginPerChart=true;
              }else{
                 this.showSuppliersMarginPerChart=false;
              }
              if(this.permissions[69]['activeS'] === 'Y'){
                this.showSuppliersRevenueChart=true;
             }else{
                this.showSuppliersRevenueChart=false;
             }
            }
           }
        }
     });
     this.getBar();
     this.getPie(); 
   }
  getBar() {
    this.stockService.getProfitOfSuppliers().subscribe(
      res => {
        this.charts = {
          chart: {
            type: 'column',
            width:519
          },
          title: {
            text: '<b>Top 10 Supplier\'s of Margin Percentage</b>'
          },

          /*  xAxis: {
            type: 'category',
            labels: {
              rotation: -45,
              style: {
                fontSize: '10px',
                fontFamily: 'Verdana, sans-serif',

              }
            }
          },
          yAxis: {
            min: 0,

            title: {
              text: 'Profit (%)'
            }
          },  */
         
          xAxis : {
            type: 'category',
            labels: {
               rotation: -45,
               style: {
                  fontSize: '13px',
                  fontFamily: 'Verdana, sans-serif'
               }
            }
         },
         yAxis : {
            min: 0,
            title: {
               text: 'Profit (%)'
            }
         },
         
          tooltip: {
            pointFormat: ' Current Margin: <b>{point.y:.1f} %</b>'
          },
          credits: {
            enabled: false
          },
          series: [
            {
              name: 'Suppliers',
              color: "#48D1CC",
              axisYType: "secondary",
              data: res['result'],
              dataLabels: {
                enabled: true,
                rotation: -90,
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                  fontSize: '13px',
                  fontFamily: 'Verdana, sans-serif',

                }
              },
              shadow: {
                color: '#E8E8E8',
                width: 10,
                offsetX: 0,
                offsetY: 0
              }
            }
          ]
        };
        // this.showbarchart = true;
      }
    )

  } 

   getPie() {
   this.stockService.getSupplierRevenue().subscribe(
      res => {

        this.chartOptions2 = {
          chart: {
            plotBorderWidth: null,
            plotShadow: false,
            width:519
          },
          title: {
            text: '<b>Top 5 Supplier\'s Revenue</b>'
          },
          subtitle:{
            text: '(in 000\'s)' 
         },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.y:.1f}</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.y:.1f}  ',
              }
            }
          },

          series: [{
            type: 'pie',
            name: 'Suppliers',
            data: res['result'],
            }]

        };
        // this.showpiechart = true;
      }
    )
  }   

 
  ngOnInit() {
  }

}
