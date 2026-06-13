import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AppService } from 'src/app/core/app.service';

@Component({
  selector: 'app-payables',
  templateUrl: './payables.component.html',
  styleUrls: ['./payables.component.scss']
})
export class PayablesComponent implements OnInit {

  permissions: any;
  chequeApproval:boolean
  approvedCheques:boolean

  constructor(private appService:AppService) { 
    this.appService.getPermissions().subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.permissions = res['result'];
        if (this.permissions instanceof Array) {

          if (this.permissions[100]['activeS'] === 'Y'||this.permissions[101]['activeS'] === 'Y') {
            this.chequeApproval = true
        
          }
          else {
            this.chequeApproval = false
           
          }

          if (this.permissions[102]['activeS'] === 'Y') {
            this.approvedCheques = true
        
          }
          else {
            this.approvedCheques = false
           
          }

        }
        else {
          this.chequeApproval = false
          this.approvedCheques = false
          
        }
      }
    });
  }

  selectedTab = 'add';

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