import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingRejectedComponent } from './outstanding-rejected.component';

describe('OutstandingRejectedComponent', () => {
  let component: OutstandingRejectedComponent;
  let fixture: ComponentFixture<OutstandingRejectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingRejectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
