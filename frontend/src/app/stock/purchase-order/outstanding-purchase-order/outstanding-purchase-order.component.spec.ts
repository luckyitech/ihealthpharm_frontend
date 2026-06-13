import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingPurchaseOrderComponent } from './outstanding-purchase-order.component';

describe('OutstandingPurchaseOrderComponent', () => {
  let component: OutstandingPurchaseOrderComponent;
  let fixture: ComponentFixture<OutstandingPurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
