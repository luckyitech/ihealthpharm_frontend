import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulationInstructionsComponent } from './formulation-instructions.component';

describe('FormulationInstructionsComponent', () => {
  let component: FormulationInstructionsComponent;
  let fixture: ComponentFixture<FormulationInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulationInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulationInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
