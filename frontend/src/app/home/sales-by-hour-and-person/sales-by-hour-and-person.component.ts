import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HomeService } from '../home.service';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Chart } from 'chart.js';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sales-by-hour-and-person',
  templateUrl: './sales-by-hour-and-person.component.html',
  styleUrls: ['./sales-by-hour-and-person.component.scss']
})
export class SalesByHourAndPersonComponent implements OnInit {

  constructor(private datePipe: DatePipe, private homeService: HomeService, private router: Router,
    private spinnerService: Ng4LoadingSpinnerService, private toasterService: ToastrService) { }

  ngOnInit() {
    this.hourChartInformationForm = new FormGroup(this.hourChartInformationFormValidations)
    this.getEmployeeNamesData()
    this.periodCal()

  }
  hourChartInformationForm: FormGroup

  hourChartInformationFormValidations = {
    fromTime: new FormControl('', [Validators.required]),
    toTime: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    date: new FormControl()
  }
  time: any
  hours: any
  selectedEmployeeName = [];
  selectedChartEmployee = [];
  timeArray = [];
  onEmployeeSelected(event) {
    this.selectedChartEmployee = [];
    for (var i = 0; i < event.length; i++) {
      this.selectedChartEmployee.push(event[i])
    };
  }
  fromTimes: any
  toTimes: any
  onToSelected() {
    this.timeArray = []
    this.fromTimes = Number(this.hourChartInformationForm.get('fromTime').value.substring(0, 2))
    this.toTimes = Number(this.hourChartInformationForm.get('toTime').value.substring(0, 2))
    let temp = this.toTimes - this.fromTimes;
    for (var i = 0; i <= temp; i++) {
      if (this.fromTimes <= this.toTimes) {
        this.fromTimes++;
        this.timeArray.push(this.fromTimes - 1);
      }
    }
  }
  dateValue: any

  charts: boolean
  chartArray = [];
  chartData = [];
  lineChartGenerate: boolean
  onGenerateChart() {

    this.chartArray = [];
    this.chartData = [];
    this.spinnerService.show()
    let fromTime = Number(this.hourChartInformationForm.get('fromTime').value.substring(0, 2))
    let temp = 0;
    if (this.hourChartInformationForm.get('date').value != undefined && this.hourChartInformationForm.get('date').value != null) {

      this.dateValue = this.hourChartInformationForm.get('date').value

    }
    else {
      this.dateValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    }
    for (var e = 0; e < this.selectedChartEmployee.length; e++) {
      temp++;
      let id = String(this.selectedChartEmployee[e]['employeeId']);
      let empName = id.concat(":", this.selectedChartEmployee[e]['firstName'], " ", this.selectedChartEmployee[e]['lastName']);
      this.homeService.getChartSalesByEmplyee(this.selectedChartEmployee[e]['employeeId'], empName, this.dateValue,
        fromTime, this.toTimes, this.timeArray).subscribe(res => {
          if (res instanceof Object) {
            if (res['responseStatus']['code'] === 200) {
              this.spinnerService.hide()
              this.chartData.push(res['result'][0]);
              if (temp == this.selectedChartEmployee.length) {

                this.chart(this.chartData, this.timeArray);
                this.lineChartGenerate = true
              }
            }
          }
        });
    }



  }

  public myChart: Chart
  arr = [];
  color = ['#3B97B2', '#FF00FF', '#000', '#67BC42', '#0E7671', '#FF4500', '#BC36FE', 'rgba(7,34,62,.5)', '#17a2b8', '#FF56DE', '#fd7e14', '#6c757d']
  chart(chartId, timeArr) {

    this.arr = [];
    let temp = 0;
    for (var i = 0; i < chartId.length; i++) {
      let label = chartId[i]['label'];
      let data: [] = chartId[i]['data']
      temp++;
      this.arr.push(
        {
          "label": label,
          "data": data,
          "lineTension": 0.3,
          "borderColor": this.color[i],
          "borderWidth": 2,
          "backgroundColor": 'transparent'
        }
      );
  
    }

    if (temp == chartId.length) {
      $("#lineChart").show();
      if (this.myChart) {
        this.myChart.destroy();
      }

      this.myChart = new Chart('lineChart', {
        type: 'line',

        data:
        {
          labels: timeArr,
          datasets: this.arr

        },
        options: {

          legend: {
            labels: {
              /*  fontColor: "white", */
            },
            /* label: {
              align: 'start'
            } */
          },
          scales: {
            yAxes: [{
              ticks: {
                display: true,
                beginAtZero: true,
                /*    fontColor: "white" */
              },
              scaleLabel: {
                display: true,
                labelString: 'Sales in (Thousands)'
              }
            }],
            xAxes: [{
              ticks: {
                display: true,
                /*   fontColor: "white" */
              },
              scaleLabel: {
                display: true,
                labelString: 'Hours'
              }

            }]
          }
        }
      });


    } /* else {
      $("#lineChart").hide();
      this.toasterService.warning('Search Criteria', 'No Data Found', {
        timeOut: 5000
      })
    } */
  }

  periodCal() {
    this.time = []
    for (var i = 0; i <= 9; i++) {
      this.hours = i
      this.time.push('0' + this.hours + ":00")
    }
    for (var i = 10; i <= 23; i++) {
      this.hours = i
      this.time.push(this.hours + ":00")
    }
  }

  empNames = []
  resultMonths = []
  getEmployeeNamesData() {
    this.homeService.getEmployeeNames().subscribe(res => {
      this.empNames = res['result'];
    })
  }

  onCancel() {

    this.selectedEmployeeName = [];
    this.hourChartInformationForm.reset();
    this.lineChartGenerate = false
    this.checkFormDisability();
    $("#lineChart").hide();
  }

  checkFormDisability() {
    return (this.hourChartInformationForm.get('firstName').errors instanceof Object)
      || (this.hourChartInformationForm.get('fromTime').errors instanceof Object)
      || (this.hourChartInformationForm.get('toTime').errors instanceof Object)
  }
}
