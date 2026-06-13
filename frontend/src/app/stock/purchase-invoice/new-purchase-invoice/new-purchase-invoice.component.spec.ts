import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPurchaseInvoiceComponent } from './new-purchase-invoice.component';

describe('NewPurchaseInvoiceComponent', () => {
  let component: NewPurchaseInvoiceComponent;
  let fixture: ComponentFixture<NewPurchaseInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPurchaseInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPurchaseInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
