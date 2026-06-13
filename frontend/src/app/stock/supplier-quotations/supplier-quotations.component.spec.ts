import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierQuotationsComponent } from './supplier-quotations.component';

describe('SupplierQuotationsComponent', () => {
  let component: SupplierQuotationsComponent;
  let fixture: ComponentFixture<SupplierQuotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierQuotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
