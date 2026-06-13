import { TestBed, async, inject } from '@angular/core/testing';

import { StockGuard } from './stock.guard';

describe('StockGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockGuard]
    });
  });

  it('should ...', inject([StockGuard], (guard: StockGuard) => {
    expect(guard).toBeTruthy();
  }));
});
