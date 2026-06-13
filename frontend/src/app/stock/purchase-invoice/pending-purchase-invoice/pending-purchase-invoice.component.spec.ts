import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPurchaseInvoiceComponent } from './pending-purchase-invoice.component';

describe('PendingPurchaseInvoiceComponent', () => {
  let component: PendingPurchaseInvoiceComponent;
  let fixture: ComponentFixture<PendingPurchaseInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingPurchaseInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingPurchaseInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
