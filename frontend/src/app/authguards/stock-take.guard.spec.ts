import { TestBed, async, inject } from '@angular/core/testing';

import { StockTakeGuard } from './stock-take.guard';

describe('StockTakeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockTakeGuard]
    });
  });

  it('should ...', inject([StockTakeGuard], (guard: StockTakeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
