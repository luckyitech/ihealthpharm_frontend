import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByPersonComponent } from './sales-by-person.component';

describe('SalesByPersonComponent', () => {
  let component: SalesByPersonComponent;
  let fixture: ComponentFixture<SalesByPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesByPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesByPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
