import { Component, OnInit } from '@angular/core';
import { ChartOfAccountsService } from './shared/chart-of-accounts.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.scss'],
  providers:[ChartOfAccountsService]
})
export class ChartOfAccountsComponent implements OnInit {

  constructor() { 
    
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
