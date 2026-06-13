import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulationInstructionsEditComponent } from './formulation-instructions-edit.component';

describe('FormulationInstructionsEditComponent', () => {
  let component: FormulationInstructionsEditComponent;
  let fixture: ComponentFixture<FormulationInstructionsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulationInstructionsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulationInstructionsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
