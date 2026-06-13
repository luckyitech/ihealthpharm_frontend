import { TestBed, async, inject } from '@angular/core/testing';

import { StockStockEntryGuard } from './stock-stock-entry.guard';

describe('StockStockEntryGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockStockEntryGuard]
    });
  });

  it('should ...', inject([StockStockEntryGuard], (guard: StockStockEntryGuard) => {
    expect(guard).toBeTruthy();
  }));
});
