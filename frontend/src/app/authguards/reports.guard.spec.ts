import { TestBed, async, inject } from '@angular/core/testing';

import { ReportsGuard } from './reports.guard';

describe('ReportsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportsGuard]
    });
  });

  it('should ...', inject([ReportsGuard], (guard: ReportsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
