import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-cancelled',
  templateUrl: './cancelled.component.html',
  styleUrls: ['./cancelled.component.scss']
})
export class CancelledComponent implements OnInit {

  columnDefs = [{
    headerName: 'Item',
    field: 'item',
    sortable: true,
    resizable: true,
    filter: true,
    checkboxSelection: true
  },
  {
    headerName: 'Description',
    field: 'description',
    sortable: true,
    resizable: true,
    filter: true
  }, ,
  {
    headerName: 'Formulation',
    field: 'formulation',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Batch No',
    field: 'batch',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Quantity',
    field: 'qty',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Expiry',
    field: 'expiry',
    sortable: true,
    resizable: true,
    filter: true
  },
  {
    headerName: 'Price',
    field: 'price',
    sortable: true,
    resizable: true,
    filter: true
  }
  ];

  rowData = [{
    item: 'R0000',
    description: 'Celica',
    formulation: 'CAP',
    batch: 'DL001',
    qty: '45',
    expiry: '3/10/2019',
    price: 34400
  },
  {
    item: 'R0001',
    description: 'Celica',
    formulation: 'CAP',
    batch: 'DL002',
    qty: '74',
    expiry: '7/10/2019',
    price: 36770
  },
  {
    item: 'R0002',
    description: 'Celica',
    formulation: 'CAP',
    batch: 'DL003',
    qty: '133',
    expiry: '10/4/2019',
    price: 22000
  },
  {
    item: 'R0002',
    description: 'Celica',
    formulation: 'CAP',
    batch: 'DL003',
    qty: '133',
    expiry: '10/4/2019',
    price: 22000
  },
  {
    item: 'R0002',
    description: 'Celica',
    formulation: 'CAP',
    batch: 'DL003',
    qty: '133',
    expiry: '10/4/2019',
    price: 22000
  }
  ];


  constructor() { }

  ngOnInit() { }

}
