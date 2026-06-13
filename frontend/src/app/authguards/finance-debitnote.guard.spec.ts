import { TestBed, async, inject } from '@angular/core/testing';

import { FinanceDebitnoteGuard } from './finance-debitnote.guard';

describe('FinanceDebitnoteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinanceDebitnoteGuard]
    });
  });

  it('should ...', inject([FinanceDebitnoteGuard], (guard: FinanceDebitnoteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
