import { TestBed, async, inject } from '@angular/core/testing';

import { StockPurchaseReturnEntryGuard } from './stock-purchase-return-entry.guard';

describe('StockPurchaseReturnEntryGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockPurchaseReturnEntryGuard]
    });
  });

  it('should ...', inject([StockPurchaseReturnEntryGuard], (guard: StockPurchaseReturnEntryGuard) => {
    expect(guard).toBeTruthy();
  }));
});
