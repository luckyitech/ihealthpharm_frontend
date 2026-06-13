import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPettyCashComponent } from './edit-petty-cash.component';

describe('EditPettyCashComponent', () => {
  let component: EditPettyCashComponent;
  let fixture: ComponentFixture<EditPettyCashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPettyCashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPettyCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
