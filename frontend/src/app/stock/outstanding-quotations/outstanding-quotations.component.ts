import {
  Component,
  OnInit
} from '@angular/core';
import * as $ from 'jquery';
import { ApprovedComponent } from './approved/approved.component';
import { SupplierQuotationsService } from "../supplier-quotations/supplier-quotations.service";

@Component({
  selector: 'app-outstanding-quotations',
  templateUrl: './outstanding-quotations.component.html',
  styleUrls: ['./outstanding-quotations.component.scss'],
  providers: [ApprovedComponent, SupplierQuotationsService]
})
export class OutstandingQuotationsComponent implements OnInit {

  constructor(private approve: ApprovedComponent, private supplier: SupplierQuotationsService) {

 
  }

  tab = "pending";
  
  ngOnInit() {
    $(document).ready(function () {

      $('.submit-for-approval, .submit-later, .return-btn').click(function (e) {
        e.preventDefault();
        $('.grid-area').show();
        $('.quotation-details').hide();
        $('.view-details').hide();
      });
      $('.edit-btn').click(function (e) {
        e.preventDefault();
        $('.quotation-details').show();
        $('.grid-area').hide();
        $('.view-details').hide();
      });
      $('.view-btn').click(function (e) {
        e.preventDefault();
        $('.quotation-details').hide();
        $('.grid-area').hide();
        $('.view-details').show();
      });

    });
   }

}
