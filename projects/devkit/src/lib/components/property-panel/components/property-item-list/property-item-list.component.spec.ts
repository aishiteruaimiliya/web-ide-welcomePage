import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyItemListComponent } from './property-item-list.component';

describe('PropertyItemListComponent', () => {
  let component: PropertyItemListComponent;
  let fixture: ComponentFixture<PropertyItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
