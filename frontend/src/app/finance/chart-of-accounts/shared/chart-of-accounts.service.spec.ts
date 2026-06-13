import { TestBed } from '@angular/core/testing';

import { ChartOfAccountsService } from './chart-of-accounts.service';

describe('ChartOfAccountsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChartOfAccountsService = TestBed.get(ChartOfAccountsService);
    expect(service).toBeTruthy();
  });
});
