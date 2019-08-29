import {Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {BsDropdownState} from './dropdown.state';

@Directive({
  selector: '[dropdownButton]'
})
export class DropdownButtonDirective implements OnDestroy {

  private _subscriptions: Subscription[] = [];

  @HostBinding('class.disabled') @Input() isDisabled: boolean = null;
  @HostBinding('attr.aria-expanded') isOpen: boolean;

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (this.isDisabled) {
      return;
    }
    this._state.onClick.emit(event);
  }

  @HostListener('mouseover')
  onHover(): void {
    if (this.isDisabled) {
      return;
    }
    this._state.onHover.emit();
  }

  constructor(private _state: BsDropdownState,
              private _element: ElementRef) {
    // 同步菜单的打开状态
    this._subscriptions.push(this._state.isOpenChange
      .subscribe((value: boolean) => this.isOpen = value)
    );
    // 同步菜单的禁用状态
    this._subscriptions.push(this._state.isDisabledChange
      .subscribe((value: boolean) => this.isDisabled = value || null)
    );
  }

  ngOnDestroy() {
    for (const sub of this._subscriptions) {
      sub.unsubscribe();
    }
  }

}
