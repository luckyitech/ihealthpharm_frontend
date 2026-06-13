import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TillBalanceComponent } from './till-balance.component';

describe('TillBalanceComponent', () => {
  let component: TillBalanceComponent;
  let fixture: ComponentFixture<TillBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TillBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TillBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
