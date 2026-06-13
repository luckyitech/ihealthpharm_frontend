import { TestBed } from '@angular/core/testing';

import { SalesBillingService } from './sales-billing.service';

describe('SalesBillingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesBillingService = TestBed.get(SalesBillingService);
    expect(service).toBeTruthy();
  });
});
