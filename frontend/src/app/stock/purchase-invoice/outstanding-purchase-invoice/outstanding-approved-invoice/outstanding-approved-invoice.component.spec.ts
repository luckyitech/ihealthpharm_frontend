import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingApprovedInvoiceComponent } from './outstanding-approved-invoice.component';

describe('OutstandingApprovedInvoiceComponent', () => {
  let component: OutstandingApprovedInvoiceComponent;
  let fixture: ComponentFixture<OutstandingApprovedInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingApprovedInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingApprovedInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
