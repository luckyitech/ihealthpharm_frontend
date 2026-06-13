import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestNewQuotationComponent } from './request-new-quotation.component';

describe('RequestNewQuotationComponent', () => {
  let component: RequestNewQuotationComponent;
  let fixture: ComponentFixture<RequestNewQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestNewQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestNewQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
