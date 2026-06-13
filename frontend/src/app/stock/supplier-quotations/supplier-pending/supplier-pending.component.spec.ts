import { async, ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< HEAD
<<<<<<< HEAD:src/app/stock/supplier-quotations/supplier-pending/supplier-pending.component.spec.ts
=======
>>>>>>> 43c0235207c2d6a36e10f72b3d8840b9e27deccb
import { SupplierPendingComponent } from './supplier-pending.component';

describe('SupplierPendingComponent', () => {
  let component: SupplierPendingComponent;
  let fixture: ComponentFixture<SupplierPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierPendingComponent ]
<<<<<<< HEAD
=======
import { SupplierApprovedComponent } from './supplier-approved.component';

describe('SupplierApprovedComponent', () => {
  let component: SupplierApprovedComponent;
  let fixture: ComponentFixture<SupplierApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierApprovedComponent ]
>>>>>>> 43c0235207c2d6a36e10f72b3d8840b9e27deccb:src/app/stock/supplier-quotations/supplier-approved/supplier-approved.component.spec.ts
=======
>>>>>>> 43c0235207c2d6a36e10f72b3d8840b9e27deccb
    })
    .compileComponents();
  }));

  beforeEach(() => {
<<<<<<< HEAD
<<<<<<< HEAD:src/app/stock/supplier-quotations/supplier-pending/supplier-pending.component.spec.ts
    fixture = TestBed.createComponent(SupplierPendingComponent);
=======
    fixture = TestBed.createComponent(SupplierApprovedComponent);
>>>>>>> 43c0235207c2d6a36e10f72b3d8840b9e27deccb:src/app/stock/supplier-quotations/supplier-approved/supplier-approved.component.spec.ts
=======
    fixture = TestBed.createComponent(SupplierPendingComponent);
>>>>>>> 43c0235207c2d6a36e10f72b3d8840b9e27deccb
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
