import { PayablesComponent } from './payables/payables.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './../app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceComponent } from './finance.component';
import { CreditNoteComponent } from './credit-note/credit-note.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { SharedModule } from '../shared/SharedModule';
import { FinanceChartComponent } from './finance-chart/finance-chart.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { AddChartOfAccountComponent } from './chart-of-accounts/add-chart-of-account/add-chart-of-account.component';
import { EditChartOfAccountComponent } from './chart-of-accounts/edit-chart-of-account/edit-chart-of-account.component';
import { TillBalanceComponent } from './till-balance/till-balance.component';
import { BankTransactionsComponent } from './bank-transactions/bank-transactions.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { PettyCashComponent } from './petty-cash/petty-cash.component';
import { ApprovedPayablesComponent } from './payables/approved-payables/approved-payables.component';
import { PendingPayablesComponent } from './payables/pending-payables/pending-payables.component';
import { ChequeApprovedPayablesComponent } from './payables/cheque-approved-payables/cheque-approved-payables.component';
import { AddBankTransactionsComponent } from './bank-transactions/add-bank-transactions/add-bank-transactions.component';
import { EditBankTransactionsComponent } from './bank-transactions/edit-bank-transactions/edit-bank-transactions.component';
import { AddPettyCashComponent } from './petty-cash/add-petty-cash/add-petty-cash.component';
import { EditPettyCashComponent } from './petty-cash/edit-petty-cash/edit-petty-cash.component';
import { ExpensesHistoryComponent } from './expenses/expenses-history/expenses-history.component';
import { CreditNoteHistoryComponent } from './credit-note/credit-note-history/credit-note-history.component';
import { MainCreditNoteComponent } from './credit-note/main-credit-note/main-credit-note.component';
import { TwoDecimalDirective } from './two-decimal.directive';

@NgModule({
  declarations: [FinanceComponent, CreditNoteComponent, PendingPayablesComponent, ReceiptsComponent, FinanceChartComponent,
    BankTransactionsComponent, ChartOfAccountsComponent, AddChartOfAccountComponent, ExpensesComponent,
    EditChartOfAccountComponent, TillBalanceComponent, PettyCashComponent, PayablesComponent, ApprovedPayablesComponent, 
    ChequeApprovedPayablesComponent, AddBankTransactionsComponent, EditBankTransactionsComponent, AddPettyCashComponent,ExpensesHistoryComponent, 
    EditPettyCashComponent, CreditNoteHistoryComponent, MainCreditNoteComponent, TwoDecimalDirective,
   ],

  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    NgSelectModule,
    Ng4LoadingSpinnerModule.forRoot(),
    ToastrModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ]
})
export class FinanceModule { }
