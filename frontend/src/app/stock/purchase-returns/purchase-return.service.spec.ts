import { TestBed } from '@angular/core/testing';

import { PurchaseReturnService } from './purchase-return.service';

describe('PurchaseReturnServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurchaseReturnService = TestBed.get(PurchaseReturnService);
    expect(service).toBeTruthy();
  });
});
