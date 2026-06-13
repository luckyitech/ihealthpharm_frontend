import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemForumEditComponent } from './item-forum-edit.component';

describe('ItemForumEditComponent', () => {
  let component: ItemForumEditComponent;
  let fixture: ComponentFixture<ItemForumEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemForumEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemForumEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
