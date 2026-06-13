import { TestBed, async, inject } from '@angular/core/testing';

import { FinanceCreditnoteGuard } from './finance-creditnote.guard';

describe('FinanceCreditnoteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinanceCreditnoteGuard]
    });
  });

  it('should ...', inject([FinanceCreditnoteGuard], (guard: FinanceCreditnoteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
