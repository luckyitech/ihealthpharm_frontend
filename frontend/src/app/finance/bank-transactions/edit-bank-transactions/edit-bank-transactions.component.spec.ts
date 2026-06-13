import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBankTransactionsComponent } from './edit-bank-transactions.component';

describe('EditBankTransactionsComponent', () => {
  let component: EditBankTransactionsComponent;
  let fixture: ComponentFixture<EditBankTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBankTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBankTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
