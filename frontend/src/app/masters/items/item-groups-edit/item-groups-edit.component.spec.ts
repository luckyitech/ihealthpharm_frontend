import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGroupsEditComponent } from './item-groups-edit.component';

describe('ItemGroupsEditComponent', () => {
  let component: ItemGroupsEditComponent;
  let fixture: ComponentFixture<ItemGroupsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemGroupsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
