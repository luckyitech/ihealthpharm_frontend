import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemForumComponent } from './item-forum.component';

describe('ItemForumComponent', () => {
  let component: ItemForumComponent;
  let fixture: ComponentFixture<ItemForumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemForumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
