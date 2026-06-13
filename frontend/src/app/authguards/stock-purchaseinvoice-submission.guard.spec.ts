import { TestBed, async, inject } from '@angular/core/testing';

import { StockPurchaseinvoiceSubmissionGuard } from './stock-purchaseinvoice-submission.guard';

describe('StockPurchaseinvoiceSubmissionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockPurchaseinvoiceSubmissionGuard]
    });
  });

  it('should ...', inject([StockPurchaseinvoiceSubmissionGuard], (guard: StockPurchaseinvoiceSubmissionGuard) => {
    expect(guard).toBeTruthy();
  }));
});
