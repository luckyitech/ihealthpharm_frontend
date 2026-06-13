import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRejectedComponent } from './supplier-rejected.component';

describe('SupplierRejectedComponent', () => {
  let component: SupplierRejectedComponent;
  let fixture: ComponentFixture<SupplierRejectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierRejectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
