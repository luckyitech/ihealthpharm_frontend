import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeApprovedPayablesComponent } from './cheque-approved-payables.component';

describe('ChequeApprovedPayablesComponent', () => {
  let component: ChequeApprovedPayablesComponent;
  let fixture: ComponentFixture<ChequeApprovedPayablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeApprovedPayablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeApprovedPayablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
