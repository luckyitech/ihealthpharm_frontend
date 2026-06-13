import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UomEditComponent } from './uom-edit.component';

describe('UomEditComponent', () => {
  let component: UomEditComponent;
  let fixture: ComponentFixture<UomEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UomEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UomEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
