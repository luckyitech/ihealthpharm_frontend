import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { TransactionService } from './shared/transaction.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

@Component({
  selector: 'app-bank-transactions',
  templateUrl: './bank-transactions.component.html',
  styleUrls: ['./bank-transactions.component.scss'],
  providers: [TransactionService]
})
export class BankTransactionsComponent implements OnInit {
  
  constructor(private transactionService: TransactionService, private datePipe: DatePipe, private toasterService: ToastrService) {
   
  }
  
  selectedTab='add';
  ngOnInit() {
    $(document).ready(function () {

      $('#pills-edit .btn-primary, #pills-edit .btn-secondary').click(function (e) {
        e.preventDefault();
        $('.add-screen').hide();
        $('.edit-screen').show();
      });
      $('.edit-btn').click(function (e) {
        e.preventDefault();
        $('.edit-screen').hide();
        $('.add-screen').show();
      });

    });

  }
}
