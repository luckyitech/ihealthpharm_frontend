import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankTransactionsComponent } from './add-bank-transactions.component';

describe('AddBankTransactionsComponent', () => {
  let component: AddBankTransactionsComponent;
  let fixture: ComponentFixture<AddBankTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBankTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
