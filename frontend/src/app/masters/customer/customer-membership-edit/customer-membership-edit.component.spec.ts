import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMembershipEditComponent } from './customer-membership-edit.component';

describe('CustomerMembershipEditComponent', () => {
  let component: CustomerMembershipEditComponent;
  let fixture: ComponentFixture<CustomerMembershipEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerMembershipEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMembershipEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
