import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMembershipsComponent } from './edit-memberships.component';

describe('EditMembershipsComponent', () => {
  let component: EditMembershipsComponent;
  let fixture: ComponentFixture<EditMembershipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMembershipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMembershipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
