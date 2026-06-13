import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingPurchaseInvoiceComponent } from './outstanding-purchase-invoice.component';

describe('OutstandingPurchaseInvoiceComponent', () => {
  let component: OutstandingPurchaseInvoiceComponent;
  let fixture: ComponentFixture<OutstandingPurchaseInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingPurchaseInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingPurchaseInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
