import { Component, OnInit } from '@angular/core';
import {
  faChartPie
} from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';
import { HomeService } from '../home.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss']
})
export class Dashboard2Component implements OnInit {
  faChartPie = faChartPie;
  Highcharts = Highcharts;
  chartOptions;
  constructor(private homeService: HomeService, private toasterService: ToastrService, private datePipe: DatePipe,
    private spinnerService: Ng4LoadingSpinnerService) {
    this.getEmployeeNamesData();
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
    this.chartInformationForm = new FormGroup(this.chartInformationFormValidations)
    this.periodCal()

  }
  periodData: any
  months: any
  chartInformationForm: FormGroup;
  chartInformationFormValidations = {
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    period: new FormControl()
  }

  periodCal() {
    this.periodData = []
    this.periodData = [
      { "period": "1 week" }, { "period": "2 weeks" }, { "period": "3 weeks" }, { "period": "1 month" }]
    for (var i = 2; i <= 12; i++) {
      this.months = i
      this.periodData.push(this.months + ' ' + "months")
    }
  }
  selectedPeriod: any;
  selectPeriod: any
  actualStartDate: any
  onPeriodSelected(event) {
    this.selectedPeriod = event
    this.selectPeriod = this.selectedPeriod
    let endDate: any = this.chartInformationForm.get('endDate').value;
    this.endDates = endDate
    this.actualStartDate = new Date(new Date(this.endDates));
    if (this.selectPeriod['period']) {
      if (this.selectPeriod['period'] === '1 week') {
        this.actualStartDate.setDate(this.actualStartDate.getDate() - 7)
      }
      else if (this.selectPeriod['period'] === '2 weeks') {
        this.actualStartDate.setDate(this.actualStartDate.getDate() - 14)
      }
      else if (this.selectPeriod['period'] === '3 weeks') {
        this.actualStartDate.setDate(this.actualStartDate.getDate() - 21)
      }
      else {
        this.actualStartDate.setMonth(this.actualStartDate.getMonth() - 1)
      }
    }
    else {
      if (this.selectPeriod === '2 months') {
        this.actualStartDate.setMonth(this.actualStartDate.getMonth() - 2)
      }
      else if (this.selectPeriod === '3 months') {
        this.actualStartDate.setMonth(this.actualStartDate.getMonth() - 3)
      }
      else if (this.selectPeriod === '4 months') {
        this.actualStartDate.setMonth(this.actualStartDate.getMonth() - 4)
      }
      else if (this.selectPeriod === '5 months') {
        this.actualStartDate.setMonth(this.actualStartDate.getMonth() - 5)
      }
      else if (this.selectPeriod === '6 months') {
        this.actualStartDate.setMonth(this.actualStartDate.getMonth() - 6)
      }
      else if (this.selectPeriod === '7 months') {
        this.actualStartDate.setMonth(this.actualStartDate.getMonth() - 7)
      }
      else if (this.selectPeriod === '8 months') {
        this.actualStartDate.setMonth(this.actualStartDate.getMonth() - 8)
      }
      else if (this.selectPeriod === '9 months') {
        this.actualStartDate.setMonth(this.actualStartDate.getMonth() - 9)
      }
      else if (this.selectPeriod === '10 months') {
        this.actualStartDate.setMonth(this.actualStartDate.getMonth() - 10)
      }
      else if (this.selectPeriod === '11 months') {
        this.actualStartDate.setMonth(this.actualStartDate.getMonth() - 11)
      }
      else if (this.selectPeriod === '12 months') {
        this.actualStartDate.setMonth(this.actualStartDate.getMonth() - 12)
      }

    }
    var startDate = this.datePipe.transform(this.actualStartDate.toLocaleDateString(), 'yyyy-MM-dd');
    this.chartInformationForm.patchValue({
      'startDate': startDate
    })

  }
  endDates: any
  empNames = []
  resultMonths = []
  getEmployeeNamesData() {
    this.homeService.getEmployeeNames().subscribe(res => {
      this.empNames = res['result'];
    })
  }


  selectedEmployeeName: any;
  employeeId: any;
  startDate: string = '';
  endDate: string = '';
  onEmployeeSelected(event) {
    this.selectedEmployeeName = event['firstName']
    this.employeeId = event['employeeId'];
  }
  onSelectedStartDate(event) {
    this.startDate = event['target']['value'];
  }
  onSelectedEndDate(event) {
    this.endDate = event['target']['value'];
  }

  salesList: any;
  onGenerateChart() {
    //this.chartInformationForm.get('firstName').setErrors({ 'incorrect': true })
    this.spinnerService.show();
    this.homeService.getSalesByNameInDuration(this.startDate, this.chartInformationForm.get('endDate').value, this.employeeId).subscribe(res => {

      if (res instanceof Object) {
        if (res['responseStatus']['code'] === 200) {
          this.spinnerService.hide();
          this.salesList = res['result'];
          $("#chart").show();
          this.chartOptions = {
            chart: {
              type: 'column',
              width: '450',

            },
            style: {
              marginLeft: '50px'
            },
            title: {
              text: 'Sales By ' + this.selectedEmployeeName
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
              pointFormat: '<b>Sales: {point.y:f} thousands</b>'
            },
            credits: {
              enabled: false
            },
            series: [
              {
                name: 'Monthly sales',
                data: res['result'],
                dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
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
          if (this.salesList.length === 0) {
            this.spinnerService.hide();
            $("#chart").hide();
            this.toasterService.warning('Search Criteria', 'No Data Found', {
              timeOut: 5000
            })
          }
        }
      }
    })
  }
  onCancel() {
    $("#chart").hide();
    this.selectedEmployeeName = '';
    this.chartInformationForm.reset();
    this.chartInformationForm.patchValue({
      'endDate': this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    })
  }
  checkFormDisability() {
    return (this.chartInformationForm.get('firstName').errors instanceof Object)
      || this.chartInformationForm.get('startDate').errors instanceof Object
      || this.chartInformationForm.get('endDate').errors instanceof Object
  }

}
