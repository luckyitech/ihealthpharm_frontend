import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CaronaService } from './carona.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';


@Component({
   selector: 'app-carona-chart',
   templateUrl: './carona-chart.component.html',
   styleUrls: ['./carona-chart.component.scss'],
   providers: [CaronaService]
})
export class CaronaChartComponent implements OnInit {
   highcharts = Highcharts;
   chartOptions2 = {
      chart: {
         type: 'pie',
         options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
         }
      },
      title: {
         text: '<b>Status Of All Affected Countries</b>'
      },
      tooltip: {
         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
         pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
               enabled: true,
               format: '<b>{point.name}%</b>: {point.percentage:.1f}%',
            }
         }
      },
      series: [{
         type: 'pie',
         name: 'count',
         data: [],
         color: ['#FF0000','#2f7ed8', '#0d233a', '#910000'],
      }]
   };
   chartOptions3 = {
      chart: {
         type: 'bar',
         scrollablePlotArea: {
            minHeight: 3000,
            scrollPositionY: 1,

         },
      },

      title: {
         text: '<b>All Countries Affected By CORONA VIRUS</b>'
      },

      xAxis: {
         categories: [],
         title: {
            text: null
         },
         min: 0,

      },
      scrollbar: {
         enabled: true
      },
      yAxis: {
         /*  min: 0,
          labels: {
             overflow: 'justify'
          } */
      },
      tooltip: {
         valueSuffix: ' members'
      },
      plotOptions: {
         bar: {
            dataLabels: {
               enabled: true
            }
         },
         series: {
            stacking: 'normal'
         }
      },
      credits: {
         enabled: false
      },

      series: [
         {
            name: 'Total Cases',
            data: [],
            color: '#ffc107'
         },
         {
            name: 'Deaths',
            data: [],
            color: 'rgb(67, 67, 72)'
         },
         {
            name: 'Recoveries',
            data: [],
            color: 'rgb(247, 163, 92)'
         },
         {
            name: 'Critical',
            data: [],
            color: 'rgb(124, 181, 236)'
         },
         {
            name: 'Non Critical',
            data: [],
            color: 'rgb(144, 237, 125)'
         },

      ]
   };


   constructor(private route: Router, private caronaService: CaronaService) {
      this.getBarChart();
      this.getStatusOfPieChart();
      /*  Highcharts.setOptions({
          color: ['#FF0000','#2f7ed8', '#0d233a', '#910000'],
      }); */
   }

   getStatusOfPieChart() {
      
      this.caronaService.GetStatusForPie().subscribe(res => {
         this.chartOptions2 = {
            chart: {
               type: 'pie',
               options3d: {
                  enabled: true,
                  alpha: 45,
                  beta: 0
               }
            },
            title: {
               text: '<b>Status Of All Affected Countries</b>'
            },
            tooltip: {
               pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
               pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  depth: 35,
                  dataLabels: {
                     enabled: true,
                     format: '<b>{point.name}%</b>: {point.percentage:.1f}%',
                  }
               }
            },
            series: [{
               type: 'pie',
               name: 'count',
               data: res['result'],
               color: ['#FF0000','#2f7ed8', '#0d233a', '#910000'],
               
            }]
         };
      })
   }

   caronaData: any;
   numberOfCases = [];
   numberOfDeaths = [];
   numOfRecoveries = [];
   numOfCriticalCases = [];
   numOfNonCriticalCases = [];
   countries = [];
   getBarChart() {
      this.caronaService.getCaronaLimitedData().subscribe(res => {
         this.caronaData = res['result'];

         for (var i = 0; i < this.caronaData.length; i++) {
            this.countries.push(this.caronaData[i]['country'])
            this.numberOfCases.push(this.caronaData[i]['numOfCases']);
            this.numberOfDeaths.push(this.caronaData[i]['numOfDeaths']);
            this.numOfRecoveries.push(this.caronaData[i]['numOfRecoveries']);
            this.numOfCriticalCases.push(this.caronaData[i]['numOfCriticalCases']);
            this.numOfNonCriticalCases.push(this.caronaData[i]['numOfNonCriticalCases']);
         }
         this.chartOptions3 = {
            chart: {
               type: 'bar',
               scrollablePlotArea: {
                  minHeight: 3000,
                  scrollPositionY: 1,
               },

            },
            title: {
               text: '<b>All Countries Affected By CORONA VIRUS</b>'
            },

            xAxis: {
               categories: this.countries,
               title: {
                  text: null
               },
               min: 0,

            },
            scrollbar: {
               "enabled": true
            },
            yAxis: {
               /*  min: 0,
                labels: {
                   overflow: 'justify'
                } */
            },
            tooltip: {
               valueSuffix: ' members'
            },
            plotOptions: {
               bar: {
                  dataLabels: {
                     enabled: true,
                  }

               },

               series: {
                  stacking: 'normal'
               }
            },
            credits: {
               enabled: false
            },

            series: [
               {
                  name: 'Total Cases',
                  data: this.numberOfCases,
                  color: '#ffc107'
               },
               {
                  name: 'Deaths',
                  data: this.numberOfDeaths,
                  color: 'rgb(67, 67, 72)'
               },
               {
                  name: 'Recoveries',
                  data: this.numOfRecoveries,
                  color: 'rgb(247, 163, 92)'
               },
               {
                  name: 'Critical',
                  data: this.numOfCriticalCases,
                  color: 'rgb(124, 181, 236)'
               },
               {
                  name: 'Non Critical',
                  data: this.numOfNonCriticalCases,
                  color: 'rgb(144, 237, 125)'
               },

            ]
         };
      })
   }
   ngOnInit() {
      $(document).ready(function () {
         $('.app').hide();
         $('#secondNav').hide();
         $('#firstNav').hide();
         $('#headrow').hide();
      });
   }
}
