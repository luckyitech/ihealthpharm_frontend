import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRequestApprovalComponent } from './pending-request-approval.component';

describe('PendingRequestApprovalComponent', () => {
  let component: PendingRequestApprovalComponent;
  let fixture: ComponentFixture<PendingRequestApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingRequestApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRequestApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
