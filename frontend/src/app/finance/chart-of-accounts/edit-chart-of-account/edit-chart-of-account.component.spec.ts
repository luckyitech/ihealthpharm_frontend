import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChartOfAccountComponent } from './edit-chart-of-account.component';

describe('EditChartOfAccountComponent', () => {
  let component: EditChartOfAccountComponent;
  let fixture: ComponentFixture<EditChartOfAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditChartOfAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChartOfAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
