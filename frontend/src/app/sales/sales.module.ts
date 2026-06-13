import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './../app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { SalesComponent } from './sales.component';
import { SalesBillingComponent } from './sales-billing/sales-billing.component';
import { SalesReturnsComponent } from './sales-returns/sales-returns.component';
import { SalesHistoryComponent } from './sales-billing/sales-history/sales-history.component';
import { SalesChartComponent } from './sales-chart/sales-chart.component';

@NgModule({
  declarations: [SalesComponent, SalesBillingComponent,
    SalesReturnsComponent, SalesHistoryComponent, SalesChartComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    Ng4LoadingSpinnerModule.forRoot(),
    NgSelectModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class SalesModule { }
