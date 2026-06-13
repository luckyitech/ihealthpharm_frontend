import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingApprovedComponent } from './outstanding-approved.component';

describe('OutstandingApprovedComponent', () => {
  let component: OutstandingApprovedComponent;
  let fixture: ComponentFixture<OutstandingApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
