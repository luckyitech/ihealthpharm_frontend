import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSingleEditComponent } from './customer-single-edit.component';

describe('CustomerSingleEditComponent', () => {
  let component: CustomerSingleEditComponent;
  let fixture: ComponentFixture<CustomerSingleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSingleEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSingleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
