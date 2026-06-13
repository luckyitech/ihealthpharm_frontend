import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSingleComponent } from './customer-single.component';

describe('CustomerSingleComponent', () => {
  let component: CustomerSingleComponent;
  let fixture: ComponentFixture<CustomerSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
