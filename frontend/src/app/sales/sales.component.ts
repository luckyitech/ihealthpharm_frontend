import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';
import * as $ from 'jquery';
import {
  faFileInvoiceDollar,
  faFileInvoice,
  faMoneyCheckAlt
} from '@fortawesome/free-solid-svg-icons';
import { UserIdleService } from 'angular-user-idle';


@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],

})
export class SalesComponent implements OnInit {

  faFileInvoiceDollar = faFileInvoiceDollar;
  faFileInvoice = faFileInvoice;
  faMoneyCheckAlt = faMoneyCheckAlt;

  constructor(private router: Router) {}

  ngOnInit() {
    
    $(document).ready(function () {
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
        $("#salesHomeChart").hide();
        $(".left-accordion-menu").show();
      });
      $(".salesClick").click(function () {
        $("#salesHomeChart").show();
      });
    });
  
    
  }

  navigateRoute(route: string) {
    this.router.navigate([`/stock/${route}`]);
  }

}