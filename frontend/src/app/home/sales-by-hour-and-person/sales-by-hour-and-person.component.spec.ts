import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByHourAndPersonComponent } from './sales-by-hour-and-person.component';

describe('SalesByHourAndPersonComponent', () => {
  let component: SalesByHourAndPersonComponent;
  let fixture: ComponentFixture<SalesByHourAndPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesByHourAndPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesByHourAndPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
