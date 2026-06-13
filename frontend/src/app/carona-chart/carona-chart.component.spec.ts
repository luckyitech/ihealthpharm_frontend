import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaronaChartComponent } from './carona-chart.component';

describe('CaronaChartComponent', () => {
  let component: CaronaChartComponent;
  let fixture: ComponentFixture<CaronaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaronaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaronaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
