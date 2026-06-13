import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPayablesComponent } from './pending-payables.component';

describe('PendingPayablesComponent', () => {
  let component: PendingPayablesComponent;
  let fixture: ComponentFixture<PendingPayablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingPayablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingPayablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
