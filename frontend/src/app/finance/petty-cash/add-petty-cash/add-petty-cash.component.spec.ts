import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPettyCashComponent } from './add-petty-cash.component';

describe('AddPettyCashComponent', () => {
  let component: AddPettyCashComponent;
  let fixture: ComponentFixture<AddPettyCashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPettyCashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPettyCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
