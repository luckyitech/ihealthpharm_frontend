import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedPayablesComponent } from './approved-payables.component';

describe('ApprovedPayablesComponent', () => {
  let component: ApprovedPayablesComponent;
  let fixture: ComponentFixture<ApprovedPayablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedPayablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedPayablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
