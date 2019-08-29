import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPanelComponent } from './modal-panel.component';

describe('ModalPanelComponent', () => {
  let component: ModalPanelComponent;
  let fixture: ComponentFixture<ModalPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
