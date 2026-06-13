import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import * as Highcharts from 'highcharts';

@Component({
   selector: 'app-sales-by-person',
   templateUrl: './sales-by-person.component.html',
   styleUrls: ['./sales-by-person.component.scss']
})
export class SalesByPersonComponent implements OnInit {

   Highcharts = Highcharts;
   chartOptions;
   constructor(private homeService: HomeService) {
      this.getSalesByPersonsData();
   }

   ngOnInit() {
   }
   sales = []
   getSalesByPersonsData() {
      this.homeService.getSalesByPersons().subscribe(res => {
      
         if (res instanceof Object) {
            if (res['responseStatus']['code'] === 200) {
               this.sales = res['result'];
            
               this.chartOptions = {
                  chart: {
                     type: 'column',
                     width: '450',

                  },
                  /*  plotOptions : {
                    pie: {
                       allowPointSelect: true,
                       cursor: 'pointer',
                 
                       dataLabels: {
                          enabled: false           
                       },
                 
                       showInLegend: true
                    }
                 },  */
                  style: {
                     marginLeft: '50px'
                  },
                  title: {
                     text: 'Sales Performance In Last 12 Months'
                  },

                  xAxis: {
                     type: 'category',
                     labels: {
                        rotation: -45,
                        style: {
                           fontSize: '13px',
                           fontFamily: 'Verdana, sans-serif'
                        }
                     }
                  },
                  yAxis: {
                     min: 0,
                     title: {
                        text: 'Sales in (Thousands)'
                     }
                  },

                  tooltip: {
                     /*  pointFormat: '<b>Sales in '+ new Date().getFullYear()+': {point.y:f} thousands</b>' */
                     pointFormat: '<b>Sales: {point.y:.1f} thousands</b>'
                  },
                  credits: {
                     enabled: false
                  },
             
                 colors: ['#3B97B2','#3B97B2', '#67BC42', '#FF56DE', '#0E7671 ', '#BC36FE', '#000','rgba(7,34,62,.5)','#17a2b8','#fd7e14','#6c757d' ],
                  series: [
                     {
                        name: 'Sales By Persons',
                        data: res['result'],
                        colorByPoint: true,
                        dataLabels: {
                           enabled: true,
                           rotation: -90,
                            
                           align: 'right',
                           format: '{point.y:.1f}', // one decimal
                           y: 10, // 10 pixels down from the top

                           style: {
                              fontSize: '10px',
                              fontFamily: 'Verdana, sans-serif',
                           }
                        },

                     }
                  ],

               };
            }
         }
      })
   }

}
