import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMembershipComponent } from './customer-membership.component';

describe('CustomerMembershipComponent', () => {
  let component: CustomerMembershipComponent;
  let fixture: ComponentFixture<CustomerMembershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerMembershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
