import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-outstanding-purchase-order',
  templateUrl: './outstanding-purchase-order.component.html',
  styleUrls: ['./outstanding-purchase-order.component.scss']
})
export class OutstandingPurchaseOrderComponent implements OnInit {
  tab = "pending";
  constructor() { }

  ngOnInit() {
    $(document).ready(function () {

      $('.submit-for-approval, .submit-later, .return-btn').click(function (e) {
        e.preventDefault();
        $('.grid-area').show();
        $('.po-details').hide();
        $('.view-details').hide();
      });
      $('.edit-btn').click(function (e) {
        e.preventDefault();
        $('.po-details').show();
        $('.grid-area').hide();
        $('.view-details').hide();
      });
      $('.view-btn').click(function (e) {
        e.preventDefault();
        $('.po-details').hide();
        $('.grid-area').hide();
        $('.view-details').show();
      });

    });
  }
}
