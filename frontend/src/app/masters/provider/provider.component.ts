import {
  Component,
  OnInit
} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit {

  constructor() {}

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
