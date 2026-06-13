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
import { DebitNoteComponent } from '../finance/debit-note/debit-note.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '../core/core.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
    declarations: [DebitNoteComponent],
    exports:[DebitNoteComponent],
    imports:[ CommonModule,
      NgSelectModule,
      HttpClientModule,
      BrowserModule,
      Ng4LoadingSpinnerModule.forRoot(),
      CoreModule,
      ReactiveFormsModule,
      FormsModule,
      AgGridModule.withComponents([]),
      ToastrModule.forRoot()],
    entryComponents:[DebitNoteComponent]
  })
  export class SharedModule { }