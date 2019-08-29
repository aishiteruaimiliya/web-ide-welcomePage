import {
  AfterContentChecked,
  AfterViewChecked, AfterViewInit,
  ContentChildren,
  Directive,
  EventEmitter,
  HostListener, OnChanges,
  OnInit,
  QueryList, ViewChildren
} from '@angular/core';
import {NavbarState} from './navbar.state';
import {ElementRef} from '@angular/core';
import {BsDropdownConfig} from '../dropdown/dropdown.config';
import {BsDropdownDirective} from '../dropdown/index';

@Directive({
  selector: '[navbar]',
  exportAs: 'navbar',
  providers: [NavbarState]
})
export class NavbarDirective implements OnInit, AfterViewInit {

  onItemClick: EventEmitter<string>;

  @ContentChildren(BsDropdownDirective) childDropdowns: QueryList<BsDropdownDirective>;
  @ViewChildren(BsDropdownDirective) childDropdowns2: QueryList<BsDropdownDirective>;
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any): void {
    this._state.hideAllDropdown();
  }

  @HostListener('keyup.esc')
  onEsc(): void {
    if (this._state.autoClose) {
      this._state.hideCurrentDropdown();
    }
  }

  constructor(private _elementRef: ElementRef,
              private _config: BsDropdownConfig,
              private _state: NavbarState) {
    this._state.autoClose = this._config.autoClose;
    this.onItemClick = this._state.onItemClick;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.childDropdowns.forEach((item: BsDropdownDirective) => this._state.addDropdown(item));
  }
}
