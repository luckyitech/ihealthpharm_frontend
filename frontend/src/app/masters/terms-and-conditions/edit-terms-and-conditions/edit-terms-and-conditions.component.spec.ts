import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTermsAndConditionsComponent } from './edit-terms-and-conditions.component';

describe('EditTermsAndConditionsComponent', () => {
  let component: EditTermsAndConditionsComponent;
  let fixture: ComponentFixture<EditTermsAndConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTermsAndConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTermsAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
