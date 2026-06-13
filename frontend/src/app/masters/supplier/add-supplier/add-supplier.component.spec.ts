import { async, ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD:src/app/masters/supplier/edit-supplier/edit-supplier.component.spec.ts
import { EditSupplierComponent } from './edit-supplier.component';

describe('EditSupplierComponent', () => {
  let component: EditSupplierComponent;
  let fixture: ComponentFixture<EditSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSupplierComponent ]
=======
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9
=======
<<<<<<< HEAD:src/app/stock/debit-credit-note/debit-credit-note.component.spec.ts
import { DebitCreditNoteComponent } from './debit-credit-note.component';

describe('DebitCreditNoteComponent', () => {
  let component: DebitCreditNoteComponent;
  let fixture: ComponentFixture<DebitCreditNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitCreditNoteComponent ]
=======
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9
import { AddSupplierComponent } from './add-supplier.component';

describe('AddSupplierComponent', () => {
  let component: AddSupplierComponent;
  let fixture: ComponentFixture<AddSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSupplierComponent ]
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9:src/app/masters/supplier/add-supplier/add-supplier.component.spec.ts
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9
=======
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9:src/app/masters/supplier/add-supplier/add-supplier.component.spec.ts
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9
    })
    .compileComponents();
  }));

  beforeEach(() => {
<<<<<<< HEAD
<<<<<<< HEAD
    fixture = TestBed.createComponent(AddSupplierComponent);
=======
<<<<<<< HEAD:src/app/masters/supplier/edit-supplier/edit-supplier.component.spec.ts
    fixture = TestBed.createComponent(EditSupplierComponent);
=======
    fixture = TestBed.createComponent(AddSupplierComponent);
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9:src/app/masters/supplier/add-supplier/add-supplier.component.spec.ts
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9
=======
<<<<<<< HEAD:src/app/stock/debit-credit-note/debit-credit-note.component.spec.ts
    fixture = TestBed.createComponent(DebitCreditNoteComponent);
=======
    fixture = TestBed.createComponent(AddSupplierComponent);
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9:src/app/masters/supplier/add-supplier/add-supplier.component.spec.ts
>>>>>>> 25b6c83727f7478fc6c2bee77c0ac8b2554223c9
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
