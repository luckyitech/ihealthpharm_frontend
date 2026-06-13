import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingPendingComponent } from './outstanding-pending.component';

describe('OutstandingPendingComponent', () => {
  let component: OutstandingPendingComponent;
  let fixture: ComponentFixture<OutstandingPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
