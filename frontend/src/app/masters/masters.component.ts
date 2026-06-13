import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faCartPlus,
  faTruck,
  faAmbulance,
  faIndustry,
  faFirstAid,
  faUserNurse,
  faProcedures,
  faPills,
  faUser,
  faAsterisk,
  faNotesMedical,
  faLaptopMedical
} from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.scss']
})
export class MastersComponent implements OnInit {

  faCartPlus = faCartPlus;  
  faTruck = faTruck;
  faAmbulance = faAmbulance;
  faIndustry = faIndustry;
  faFirstAid = faFirstAid;
  faUserNurse = faUserNurse;
  faProcedures = faProcedures;
  faPills = faPills;
  faUser = faUser;
  faAsterisk = faAsterisk;
  faNotesMedical = faNotesMedical;
  faLaptopMedical = faLaptopMedical;

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
     
    })
  }

  navigateRoute(route: string) {
		
		this.router.navigate([`/stock/${route}`]);
		
	}

}
