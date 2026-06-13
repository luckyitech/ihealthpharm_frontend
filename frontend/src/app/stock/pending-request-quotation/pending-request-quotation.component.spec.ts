import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRequestQuotationComponent } from './pending-request-quotation.component';

describe('PendingRequestQuotationComponent', () => {
  let component: PendingRequestQuotationComponent;
  let fixture: ComponentFixture<PendingRequestQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingRequestQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRequestQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
