import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  constructor() { }
 selectedTab='app-cust-add';

  ngOnInit() {
    $(document).ready(function () {

      $('.btn-primary, .btn-secondary').click(function (e) {
        e.preventDefault();
        $(this).parents('.add-screen').hide();
        $(this).parents('.add-screen').prev('.edit-screen').show();
      });
      $('.edit-btn').click(function (e) {
        e.preventDefault();
        $(this).parents('.edit-screen').hide();
        $(this).parents('.edit-screen').next('.add-screen').show();
      });

      $(".nav-pills .nav-link").on("click", function () {
        $(".tab-content .nav-tabs .nav-link:first-child").trigger("click");
      });

    });
  }
  changeTab(value)
  {
    this.selectedTab = value;
  }
}
