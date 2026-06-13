import { TestBed, async, inject } from '@angular/core/testing';

import { FinanceAccountreceivablesGuard } from './finance-accountreceivables.guard';

describe('FinanceAccountreceivablesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinanceAccountreceivablesGuard]
    });
  });

  it('should ...', inject([FinanceAccountreceivablesGuard], (guard: FinanceAccountreceivablesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
