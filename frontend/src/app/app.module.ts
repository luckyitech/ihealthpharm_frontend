import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap';
import { SingleSelectDropDownComponent } from './core/single-select-drop-down/single-select-drop-down.component';
import { MultiSelectDropDownComponent } from './core/multi-select-drop-down/multi-select-drop-down.component';
import { ModifierRendererComponent } from './core/modifier.renderer.component';
import { SalesModule } from './sales/sales.module';
import { ReportsModule } from './reports/reports.module';
import { FinanceModule } from './finance/finance.module';
import { MastersModule } from './masters/masters.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptorAuthService } from './shared/http-interceptor-auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login/login.component';
import { StockComponent } from './stock/stock.component';
import { AppService } from './core/app.service';
import { StockModule } from './stock/stock.module';
import { CoreModule } from './core/core.module';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/SharedModule';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { Dashboard2Component } from './home/dashboard2/dashboard2.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UserIdleModule } from 'angular-user-idle';
import { CaronaChartComponent } from './carona-chart/carona-chart.component';
import { CaronaEntryComponent } from './carona-chart/carona-entry/carona-entry.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    StockComponent,
    ModifierRendererComponent,
    MultiSelectDropDownComponent,
    SingleSelectDropDownComponent,
    ChecklistComponent,
    NotificationsComponent,
    CaronaChartComponent,
    CaronaEntryComponent

  ],
  imports: [
    Ng4LoadingSpinnerModule.forRoot(),
    CommonModule,
    MastersModule,
    NgSelectModule,
    HttpClientModule,
    BrowserModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    FinanceModule,
    ReportsModule,
    SalesModule,
    HomeModule,
    AgGridModule.withComponents([]),
    ToastrModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    StockModule,
    BrowserAnimationsModule,
    SharedModule,
    ModalModule.forRoot(),
    UserIdleModule.forRoot({ idle: 1500, timeout: 300 })

  ],
  providers: [AppService, { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorAuthService, multi: true }, DatePipe],
  bootstrap: [AppComponent]

})
export class AppModule { }
