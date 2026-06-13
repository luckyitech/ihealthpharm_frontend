import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingPendingInvoiceComponent } from './outstanding-pending-invoice.component';

describe('OutstandingPendingInvoiceComponent', () => {
  let component: OutstandingPendingInvoiceComponent;
  let fixture: ComponentFixture<OutstandingPendingInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingPendingInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingPendingInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
