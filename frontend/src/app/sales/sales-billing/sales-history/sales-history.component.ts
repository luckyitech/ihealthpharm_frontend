import { GridOptions, ColDef } from 'ag-grid-community';
import { SalesBillingService } from './../sales-billing.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.component.html',
  styleUrls: ['./sales-history.component.scss']
})
export class SalesHistoryComponent implements OnInit {

  constructor(private salesService: SalesBillingService, private datePipe: DatePipe) {
    this.getAllSales();

    this.saleEditGridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.saleEditGridOptions.rowSelection = 'single';
    this.saleEditGridOptions.columnDefs = this.saleEditColumDefs;

    this.saleEditGridOptions.getRowStyle = function (params) {
			if (params.node.rowIndex % 2 !== 0) {
				return { background: '#cccccc' }
			}
		}
  }

  ngOnInit() {

  }
  tab = "history"
  saleEditGridOptions: GridOptions;
  saleEditColumDefs: ColDef[] = [
    {
      headerName: "#",
      field: "",
      checkboxSelection: true,
      sortable: true,
      lockPosition: true,
      lockVisible: true,
      pinned: "left",
      lockPinned: true,
      width: 40, cellStyle: { 'border': '1px solid #BDC3C7' }
    },
    { headerName: 'Bill Id', field: 'billId', sortable: true, filter: true, editable: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Bill Code', field: 'billCode', sortable: true, filter: true, editable: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Bill Date', field: 'billDate', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' },
  valueGetter:this.dateFormatter.bind(this)},
    { headerName: 'Customer Name', field: 'customerModel.customerName', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Total Products', field: 'totalProducts', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Total Quantity', field: 'totalQty', sortable: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' }, },
    { headerName: 'Discount%', field: 'effectiveOverallDiscount', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'VAT%', field: 'effectiveVat', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Margin%', field: 'effectiveMargin', sortable: true, filter: true, editable: true, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Sales Discount%', field: 'effectiveSalesDisc', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Total Amount', field: 'totalAmount', sortable: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Paid Amount', field: 'paidAmount', sortable: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Payment Status', field: 'paymentStatus', sortable: true, filter: true, cellStyle: { 'border': '1px solid #BDC3C7' } },
    { headerName: 'Balence Amount', field: 'balanceAmount', sortable: true, filter: true, resizable: true, width: 100, cellStyle: { 'border': '1px solid #BDC3C7' } },

  ];

  startDate;
  endDate;
  paymentStatusArr: any[] = ["Paid", "Partially Paid", "Pending"];
  paymentStatus;
  searchCodeArr: any[] = ["Bill Number", "Customer Name"];
  searchCode;
  searchCodeValue;
  dateFormatter(params)
  {
    return params.data.billDate;
  }
  getAllSales() {
    this.salesService.getAllSales().subscribe(salesRes => {
      if (salesRes['responseStatus']['code'] == 200) {

        this.saleEditGridOptions.api.updateRowData({ add: salesRes['result'] })
      }
    });
  }

  getSalesBySearch() {
    let formData = new FormData();





    formData.append("status", this.paymentStatus);
    formData.append("code", this.searchCode);
    formData.append("codeValue", this.searchCodeValue);
    formData.append("startDate", this.startDate);
    formData.append("endDate", this.endDate);
    //this.saleEditGridOptions.api.getSelectedRows();
    this.salesService.getSalesBySearchkeys(formData).subscribe(salesRes => {
      if (salesRes['responseStatus']['code'] == 200) {

        this.saleEditGridOptions.api.setRowData([])
        this.saleEditGridOptions.api.updateRowData({ add: salesRes['result'] })
      }
    });
  }
  getSelectedSalesRecord() {

    this.salesService.getSalesIemsByStockId({ billId: this.saleEditGridOptions.api.getSelectedRows()[0]['billId'] }).subscribe(res => {

    });
  }
}
