export class SalesModel {
  billId: Number;
  previousBillCode: string;
  stockId: Number;
  itemCode: string;
  itemName: string;
  drugDose: string;
  batchNo: string;
  formulation: string;
  supplier: Number;
  shelf: string;
  rackNo: string;
  pack: string;
  storage: String;
  quantity: Number;
  bonus: Number;
  manufacturerDate: Date;
  expiryDate: Date;
  purchasePrice: Number;
  markupPercenage: Number;
  mrp: Number;
  saleWithVAT: Number;
  salesPrice: Number;

  salesDiscount: Number;
  marginPercentage: Number;
  VAT: Number;
  tax: Object;
  itemtotalAmount: Number;
  fquantity: Number;
  pnl: Number;
}
