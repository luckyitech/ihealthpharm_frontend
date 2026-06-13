import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'angular-highcharts';
import { CoreModule } from 'src/app/core/core.module';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { SalesByPersonComponent } from './sales-by-person/sales-by-person.component';
import { SalesByHourAndPersonComponent } from './sales-by-hour-and-person/sales-by-hour-and-person.component';
 

@NgModule({
  declarations: [ 
  Dashboard2Component, SalesByPersonComponent, SalesByHourAndPersonComponent ],
  
  imports: [
    Ng4LoadingSpinnerModule.forRoot(),
    CommonModule,
    ChartModule,
    CoreModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
     ]
})
export class HomeModule { }
