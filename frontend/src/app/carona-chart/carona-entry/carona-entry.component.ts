import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { GridOptions, ColDef } from 'ag-grid-community';
import { CaronaService } from '../carona.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-carona-entry',
  templateUrl: './carona-entry.component.html',
  styleUrls: ['./carona-entry.component.scss']
})
export class CaronaEntryComponent implements OnInit {

  constructor(private caronaService: CaronaService, private toasterService: ToastrService) {


    this.caronaGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.caronaGridOptions.rowSelection = 'single';
    this.getAllRowData();

  }

  ngOnInit() {
    $(document).ready(function () {
      $('.app').hide();
      $('#secondNav').hide();
      $('#firstNav').hide();
      $('#headrow').hide();
    })
  }


  caronaGridOptions: GridOptions;
  caronaItemArray: any[] = [];


  getAllRowData() {
    this.caronaService.getAllCaronaData().subscribe(res => {
      this.caronaItemArray = res['result'];
    })
  }

  columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "",
      checkboxSelection: true,
      sortable: true,
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40,
      hide: false
    },
    {
      headerName: 'Country', field: 'country', sortable: true, resizable: true, filter: true, width: 115, editable: true,
      valueGetter: function (params) {
        var country = params.data.country
        return country;
      }
    },
    {
      headerName: 'No Of Cases', field: 'numOfCases', sortable: true, resizable: true, filter: true, width: 220, editable: true,
      valueGetter: function (params) {
        var numOfCases = params.data.numOfCases;
        return numOfCases;
      }
    },
    {
      headerName: 'No Of Deaths', field: 'numOfDeaths', sortable: true, resizable: true, filter: true, width: 180, editable: true,
      valueGetter: function (params) {
        var numOfDeaths = params.data.numOfDeaths;
        return numOfDeaths;
      }
    },
    {
      headerName: 'No Of Recoveries', field: 'numOfRecoveries', sortable: true, resizable: true, filter: true, width: 200, editable: true,
      valueGetter: function (params) {
        var numOfRecoveries = params.data.numOfRecoveries
        return numOfRecoveries;
      }
    },
    {
      headerName: 'No Of Critical Cases', field: 'numOfCriticalCases', sortable: true, resizable: true, filter: true, width: 200, editable: true,
      valueGetter: function (params) {
        var numOfCriticalCases = params.data.numOfCriticalCases;
        return numOfCriticalCases;
      }
    },
    {
      headerName: 'No Of Non-Critical Cases', field: 'numOfNonCriticalCases', sortable: true, resizable: true, filter: true, width: 150, editable: true,
      valueGetter: function (params) {
        var numOfNonCriticalCases = params.data.numOfNonCriticalCases;
        return numOfNonCriticalCases;
      }
    },
    {
      headerName: '', field: 'save', width: 60,
      cellStyle: { color: 'white', backgroundColor: 'MediumSeaGreen' },
      valueGetter: function (params) {
        return params.data.save = 'Save'
      }, onCellClicked: this.cellClickedForSaving.bind(this)
    },
 /*    {
      headerName: '', field: 'reset', width: 60, cellStyle: { color: 'white', backgroundColor: '#00a3cc' },
      valueGetter: function (params) {
        return params.data.reset = 'Reset'
      }, onCellClicked: this.onClickedReset.bind(this)


    }, */
  ];

  cellClickedForSaving(params) {
       this.caronaService.updateCaronaData(params.data).subscribe(response => {
       this.getAllRowData();
       this.toasterService.success(response['message'], 'Success', {
        timeOut: 3000
      });
    })
  }

  onClickedReset(params) {

  }


  onSubmit() {
    var data = [];
    this.caronaGridOptions.api.forEachNode(function (node) {
      data.push(node.data);
    })
  }

  onCancel() {

  }
}
