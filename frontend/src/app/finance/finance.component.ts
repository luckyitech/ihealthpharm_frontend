import { Component, OnInit } from '@angular/core';
import {
  faBookOpen,
  faStickyNote,
  faMoneyBillAlt,
  faReceipt
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import * as $ from 'jquery';
@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {

  faBookOpen = faBookOpen;
  faStickyNote = faStickyNote;
  faMoneyBillAlt = faMoneyBillAlt;
  faReceipt = faReceipt;

  constructor(private router: Router) {}

  ngOnInit() {
    $(document).ready(function(){
      $('.left-menu ul li').click(function () {
        $('.left-menu ul li').removeClass('active');
        $('.no-childern').removeClass('active');
        $(this).addClass('active');
      }); 
      $('.no-childern').click(function () {
        $('.no-childern').removeClass('active');
        $('.left-menu ul li').removeClass('active');
        $(this).addClass('active');
      }); 
      $(".left-accordion-menu").click(function () {
        $(".financeChart").hide();
        $(".left-accordion-menu").show();
      });
      $(".financeClick").click(function () {
        $(".financeChart").show();
      });
    })
  }
   
	navigateRoute(route: string) {
		
		this.router.navigate([`/finance/${route}`]);
		
	}

}
