import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoQuotationComponent } from './auto-quotation.component';

describe('AutoQuotationComponent', () => {
  let component: AutoQuotationComponent;
  let fixture: ComponentFixture<AutoQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
