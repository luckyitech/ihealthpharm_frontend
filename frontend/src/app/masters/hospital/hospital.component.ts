import {
  Component,
  OnInit
} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.scss']
})
export class HospitalComponent implements OnInit {

  constructor() {}

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
