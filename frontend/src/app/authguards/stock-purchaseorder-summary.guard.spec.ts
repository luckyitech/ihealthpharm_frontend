import { TestBed, async, inject } from '@angular/core/testing';

import { StockPurchaseorderSummaryGuard } from './stock-purchaseorder-summary.guard';

describe('StockPurchaseorderSummaryGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockPurchaseorderSummaryGuard]
    });
  });

  it('should ...', inject([StockPurchaseorderSummaryGuard], (guard: StockPurchaseorderSummaryGuard) => {
    expect(guard).toBeTruthy();
  }));
});
