import { TestBed, async, inject } from '@angular/core/testing';

import { StockQuotationSubmissionGuard } from './stock-quotation-submission.guard';

describe('StockQuotationSubmissionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockQuotationSubmissionGuard]
    });
  });

  it('should ...', inject([StockQuotationSubmissionGuard], (guard: StockQuotationSubmissionGuard) => {
    expect(guard).toBeTruthy();
  }));
});
