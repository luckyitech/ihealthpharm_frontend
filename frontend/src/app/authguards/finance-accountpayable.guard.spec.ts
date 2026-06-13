import { TestBed, async, inject } from '@angular/core/testing';

import { FinanceAccountpayableGuard } from './finance-accountpayable.guard';

describe('FinanceAccountpayableGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinanceAccountpayableGuard]
    });
  });

  it('should ...', inject([FinanceAccountpayableGuard], (guard: FinanceAccountpayableGuard) => {
    expect(guard).toBeTruthy();
  }));
});
