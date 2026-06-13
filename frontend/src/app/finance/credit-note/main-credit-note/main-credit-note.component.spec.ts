import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCreditNoteComponent } from './main-credit-note.component';

describe('MainCreditNoteComponent', () => {
  let component: MainCreditNoteComponent;
  let fixture: ComponentFixture<MainCreditNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainCreditNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
