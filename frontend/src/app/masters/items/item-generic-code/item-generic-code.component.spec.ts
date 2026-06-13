import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGenericCodeComponent } from './item-generic-code.component';

describe('ItemGenericCodeComponent', () => {
  let component: ItemGenericCodeComponent;
  let fixture: ComponentFixture<ItemGenericCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemGenericCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGenericCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
