import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaronaEntryComponent } from './carona-entry.component';

describe('CaronaEntryComponent', () => {
  let component: CaronaEntryComponent;
  let fixture: ComponentFixture<CaronaEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaronaEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaronaEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
