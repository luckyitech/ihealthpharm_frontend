import { TestBed } from '@angular/core/testing';

import { PettyCashService } from './petty-cash.service';

describe('PettyCashService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PettyCashService = TestBed.get(PettyCashService);
    expect(service).toBeTruthy();
  });
});
