import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { RequestNewQuotationComponent } from './request-new-quotation/request-new-quotation.component';
import { PendingRequestQuotationComponent } from './pending-request-quotation/pending-request-quotation.component';
import { OutstandingQuotationsComponent } from './outstanding-quotations/outstanding-quotations.component';
import { SupplierQuotationsComponent } from './supplier-quotations/supplier-quotations.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';
import { PendingRequestApprovalComponent } from './outstanding-quotations/pending-request-approval/pending-request-approval.component';
import { ApprovedComponent } from './outstanding-quotations/approved/approved.component';
import { RejectedComponent } from './outstanding-quotations/rejected/rejected.component';
import { CancelledComponent } from './outstanding-quotations/cancelled/cancelled.component';
import { CoreModule } from '../core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { NewStockComponent } from './new-stock/new-stock.component';
import { PurchaseReturnsComponent } from './purchase-returns/purchase-returns.component';
import { SupplierPendingComponent } from './supplier-quotations/supplier-pending/supplier-pending.component';
import { SupplierApprovedComponent } from './supplier-quotations/supplier-approved/supplier-approved.component';
import { SupplierRejectedComponent } from './supplier-quotations/supplier-rejected/supplier-rejected.component';
import { NewPurchaseOrderComponent } from './purchase-order/new-purchase-order/new-purchase-order.component';
import { PendingPurchaseOrderComponent } from './purchase-order/pending-purchase-order/pending-purchase-order.component';
import { OutstandingPurchaseOrderComponent } from './purchase-order/outstanding-purchase-order/outstanding-purchase-order.component';
import { OutstandingPendingComponent } from './purchase-order/outstanding-purchase-order/outstanding-pending/outstanding-pending.component';
import { OutstandingApprovedComponent } from './purchase-order/outstanding-purchase-order/outstanding-approved/outstanding-approved.component';
import { OutstandingRejectedComponent } from './purchase-order/outstanding-purchase-order/outstanding-rejected/outstanding-rejected.component';
import { OutstandingSentComponent } from './outstanding-quotations/outstanding-sent/outstanding-sent.component';
import { OutstandingPurchaseOrderSentComponent } from './purchase-order/outstanding-purchase-order/outstanding-purchase-order-sent/outstanding-purchase-order-sent.component';
import { StockAdjustmentComponent } from './stock-adjustment/stock-adjustment.component';
import { SharedModule } from '../shared/SharedModule';
import { BarchartComponent } from './barchart/barchart.component';
import { StockChartComponent } from './stock-chart/stock-chart.component';
import { ChartModule } from 'angular-highcharts';
import { EditstockComponent } from './editstock/editstock.component';
import { NewPurchaseInvoiceComponent } from './purchase-invoice/new-purchase-invoice/new-purchase-invoice.component';
import { PendingPurchaseInvoiceComponent } from './purchase-invoice/pending-purchase-invoice/pending-purchase-invoice.component';
import { OutstandingPurchaseInvoiceComponent } from './purchase-invoice/outstanding-purchase-invoice/outstanding-purchase-invoice.component';
import { OutstandingApprovedInvoiceComponent } from './purchase-invoice/outstanding-purchase-invoice/outstanding-approved-invoice/outstanding-approved-invoice.component';
import { OutstandingPendingInvoiceComponent } from './purchase-invoice/outstanding-purchase-invoice/outstanding-pending-invoice/outstanding-pending-invoice.component';
import { OutstandingRejectedInvoiceComponent } from './purchase-invoice/outstanding-purchase-invoice/outstanding-rejected-invoice/outstanding-rejected-invoice.component';
import { AutoQuotationComponent } from './auto-quotation/auto-quotation.component';



@NgModule({
  declarations: [
    RequestNewQuotationComponent,
    PendingRequestQuotationComponent,
    OutstandingQuotationsComponent,
    SupplierQuotationsComponent,
    PurchaseOrderComponent,
    PurchaseInvoiceComponent,
    PendingRequestApprovalComponent,
    ApprovedComponent,
    RejectedComponent,
    CancelledComponent,
    NewStockComponent,
    PurchaseReturnsComponent,
    SupplierPendingComponent,
    SupplierApprovedComponent,
    SupplierRejectedComponent,
    NewPurchaseOrderComponent,
    PendingPurchaseOrderComponent,
    OutstandingPurchaseOrderComponent,
    OutstandingPendingComponent,
    OutstandingApprovedComponent,
    OutstandingRejectedComponent,
    OutstandingSentComponent,
    OutstandingPurchaseOrderSentComponent,
    StockAdjustmentComponent,
    BarchartComponent,
    StockChartComponent,
    EditstockComponent,
    NewPurchaseInvoiceComponent,
    PendingPurchaseInvoiceComponent,
    OutstandingPurchaseInvoiceComponent,
    OutstandingApprovedInvoiceComponent,
    OutstandingPendingInvoiceComponent,
    OutstandingRejectedInvoiceComponent,
    AutoQuotationComponent
  ],
  imports: [
    ChartModule,
    CommonModule,
    NgSelectModule,
    HttpClientModule,
    BrowserModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    AgGridModule.withComponents([]),
    ToastrModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
  ],
  exports: [
    StockChartComponent
  ]
})
export class StockModule { }
