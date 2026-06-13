import { async, ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< HEAD
=======
<<<<<<< HEAD:src/app/stock/receipts/receipts.component.spec.ts
import { ReceiptsComponent } from './receipts.component';

describe('ReceiptsComponent', () => {
  let component: ReceiptsComponent;
  let fixture: ComponentFixture<ReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptsComponent ]
=======
>>>>>>> 6a57614cba9da99d7dbfebc157aeb624cca9b598
import { FinanceComponent } from './finance.component';

describe('FinanceComponent', () => {
  let component: FinanceComponent;
  let fixture: ComponentFixture<FinanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceComponent ]
<<<<<<< HEAD
=======
>>>>>>> 6a57614cba9da99d7dbfebc157aeb624cca9b598:src/app/finance/finance.component.spec.ts
>>>>>>> 6a57614cba9da99d7dbfebc157aeb624cca9b598
    })
    .compileComponents();
  }));

  beforeEach(() => {
<<<<<<< HEAD
    fixture = TestBed.createComponent(FinanceComponent);
=======
<<<<<<< HEAD:src/app/stock/receipts/receipts.component.spec.ts
    fixture = TestBed.createComponent(ReceiptsComponent);
=======
    fixture = TestBed.createComponent(FinanceComponent);
>>>>>>> 6a57614cba9da99d7dbfebc157aeb624cca9b598:src/app/finance/finance.component.spec.ts
>>>>>>> 6a57614cba9da99d7dbfebc157aeb624cca9b598
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
