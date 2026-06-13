import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChartOfAccountComponent } from './add-chart-of-account.component';

describe('AddChartOfAccountComponent', () => {
  let component: AddChartOfAccountComponent;
  let fixture: ComponentFixture<AddChartOfAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChartOfAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChartOfAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
