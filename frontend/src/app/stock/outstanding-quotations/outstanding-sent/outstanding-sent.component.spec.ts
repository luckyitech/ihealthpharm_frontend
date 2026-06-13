import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingSentComponent } from './outstanding-sent.component';

describe('OutstandingSentComponent', () => {
  let component: OutstandingSentComponent;
  let fixture: ComponentFixture<OutstandingSentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
