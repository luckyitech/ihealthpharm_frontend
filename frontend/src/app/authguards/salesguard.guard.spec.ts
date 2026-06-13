import { TestBed, async, inject } from '@angular/core/testing';

import { SalesguardGuard } from './salesguard.guard';

describe('SalesguardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalesguardGuard]
    });
  });

  it('should ...', inject([SalesguardGuard], (guard: SalesguardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
