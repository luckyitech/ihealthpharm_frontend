import { NgModule } from '@angular/core';
import { CheckBoxComponent } from './check-box/check-box.component';
import { DateRenderer } from './date.renderer.component';
import { NumericEditor } from './numeric-editor.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { HighchartsChartComponent } from 'highcharts-angular';
import { ChartModule } from 'angular-highcharts';

@NgModule({
  declarations: [
    CheckBoxComponent,
    DateRenderer,
    NumericEditor,
    HighchartsChartComponent
  ],
  imports: [
    ChartModule,
    BrowserModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgGridModule.withComponents([CheckBoxComponent, DateRenderer, NumericEditor]),
  ],
  exports: [
    CheckBoxComponent,
    DateRenderer,
    NumericEditor,
    HighchartsChartComponent
  ],
  providers: [],
})
export class CoreModule { }
