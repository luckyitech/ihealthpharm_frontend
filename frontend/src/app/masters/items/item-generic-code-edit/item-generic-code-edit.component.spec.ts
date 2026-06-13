import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGenericCodeEditComponent } from './item-generic-code-edit.component';

describe('ItemGenericCodeEditComponent', () => {
  let component: ItemGenericCodeEditComponent;
  let fixture: ComponentFixture<ItemGenericCodeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemGenericCodeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGenericCodeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
