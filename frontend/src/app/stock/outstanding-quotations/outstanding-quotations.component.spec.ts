import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingQuotationsComponent } from './outstanding-quotations.component';

describe('OutstandingQuotationsComponent', () => {
  let component: OutstandingQuotationsComponent;
  let fixture: ComponentFixture<OutstandingQuotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingQuotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
