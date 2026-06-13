import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingPurchaseOrderSentComponent } from './outstanding-purchase-order-sent.component';

describe('OutstandingPurchaseOrderSentComponent', () => {
  let component: OutstandingPurchaseOrderSentComponent;
  let fixture: ComponentFixture<OutstandingPurchaseOrderSentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingPurchaseOrderSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingPurchaseOrderSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
