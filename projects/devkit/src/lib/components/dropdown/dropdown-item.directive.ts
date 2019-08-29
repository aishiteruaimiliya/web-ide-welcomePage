import {Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input} from '@angular/core';
import {NavbarState} from '../navbar/navbar.state';

@Directive({
  selector: '[dropdownItem]',
  exportAs: 'dropdownItem'
})
export class DropdownItemDirective {

  @HostBinding('class.disabled') @Input() isDisabled: boolean = null;

  @Input('dropdownItem') command;

  get elementRef(): ElementRef {
    return this._elementRef;
  }


  onHover = new EventEmitter<any>();
  onClick = new EventEmitter<string>();

  constructor(private _elementRef: ElementRef,
              private barState: NavbarState) {
    this.barState.addMenuItem(this);
  }

  @HostListener('mouseover')
  onMouseOver(): void {
    this.onHover.emit();
  }

  @HostListener('click')
  onItemClick(): void {
    if (this.isDisabled) {
      return;
    }
    this.onClick.emit(this.command);
  }
}
