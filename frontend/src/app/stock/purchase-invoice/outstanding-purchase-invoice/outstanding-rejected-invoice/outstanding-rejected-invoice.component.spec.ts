import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingRejectedInvoiceComponent } from './outstanding-rejected-invoice.component';

describe('OutstandingRejectedInvoiceComponent', () => {
  let component: OutstandingRejectedInvoiceComponent;
  let fixture: ComponentFixture<OutstandingRejectedInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingRejectedInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingRejectedInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
