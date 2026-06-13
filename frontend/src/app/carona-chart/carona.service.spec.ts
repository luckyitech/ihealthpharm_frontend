import { TestBed } from '@angular/core/testing';

import { CaronaService } from './carona.service';

describe('CaronaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CaronaService = TestBed.get(CaronaService);
    expect(service).toBeTruthy();
  });
});
