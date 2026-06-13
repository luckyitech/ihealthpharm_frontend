import { TestBed, async, inject } from '@angular/core/testing';

import { EditStockGuard } from './edit-stock.guard';

describe('EditStockGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditStockGuard]
    });
  });

  it('should ...', inject([EditStockGuard], (guard: EditStockGuard) => {
    expect(guard).toBeTruthy();
  }));
});
