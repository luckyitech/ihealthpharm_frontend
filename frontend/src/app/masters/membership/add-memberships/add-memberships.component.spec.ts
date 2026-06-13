import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMembershipsComponent } from './add-memberships.component';

describe('AddMembershipsComponent', () => {
  let component: AddMembershipsComponent;
  let fixture: ComponentFixture<AddMembershipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMembershipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMembershipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
