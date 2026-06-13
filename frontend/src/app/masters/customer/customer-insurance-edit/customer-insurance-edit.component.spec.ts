import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInsuranceEditComponent } from './customer-insurance-edit.component';

describe('CustomerInsuranceEditComponent', () => {
  let component: CustomerInsuranceEditComponent;
  let fixture: ComponentFixture<CustomerInsuranceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerInsuranceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInsuranceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
