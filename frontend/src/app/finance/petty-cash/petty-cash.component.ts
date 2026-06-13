import { Component, OnInit } from '@angular/core';
import { PettyCashService } from './shared/petty-cash.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-petty-cash',
  templateUrl: './petty-cash.component.html',
  styleUrls: ['./petty-cash.component.scss'],
  providers: [PettyCashService]

})
export class PettyCashComponent implements OnInit {

  constructor(){

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
