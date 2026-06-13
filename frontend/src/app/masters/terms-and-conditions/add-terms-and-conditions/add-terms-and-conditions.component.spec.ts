import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTermsAndConditionsComponent } from './add-terms-and-conditions.component';

describe('AddTermsAndConditionsComponent', () => {
  let component: AddTermsAndConditionsComponent;
  let fixture: ComponentFixture<AddTermsAndConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTermsAndConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTermsAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
