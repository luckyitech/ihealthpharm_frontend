import { async, ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< HEAD
<<<<<<< HEAD:src/app/stock/new-stock/new-stock.component.spec.ts
=======
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9
import { NewStockComponent } from './new-stock.component';

describe('NewStockComponent', () => {
  let component: NewStockComponent;
  let fixture: ComponentFixture<NewStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewStockComponent ]
<<<<<<< HEAD
=======
import { PurchaseReturnsComponent } from './purchase-returns.component';

describe('PurchaseReturnsComponent', () => {
  let component: PurchaseReturnsComponent;
  let fixture: ComponentFixture<PurchaseReturnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseReturnsComponent ]
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9:src/app/stock/purchase-returns/purchase-returns.component.spec.ts
=======
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9
    })
    .compileComponents();
  }));

  beforeEach(() => {
<<<<<<< HEAD
<<<<<<< HEAD:src/app/stock/new-stock/new-stock.component.spec.ts
    fixture = TestBed.createComponent(NewStockComponent);
=======
    fixture = TestBed.createComponent(PurchaseReturnsComponent);
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9:src/app/stock/purchase-returns/purchase-returns.component.spec.ts
=======
    fixture = TestBed.createComponent(NewStockComponent);
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
