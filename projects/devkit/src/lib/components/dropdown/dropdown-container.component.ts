import {
  ChangeDetectionStrategy, Component, OnDestroy, HostBinding, ChangeDetectorRef, Renderer2,
  ElementRef
} from '@angular/core';
import { BsDropdownState } from './dropdown.state';
import {isBs3} from '../utils/ng2-bootstrap-config';

@Component({
  selector: 'mdb-dropdown-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div [class.dropup]="direction === 'up'"
  [class.dropdown]="direction === 'down'"
  [class.show]="isOpen"
  [class.open]="isOpen">
    <ng-content></ng-content>
  </div>
  `
})
export class BsDropdownContainerComponent implements OnDestroy {
  isOpen = false;

  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'absolute';

  get direction(): 'down' | 'up' {
    return this._state.direction;
  }

  private _subscription: any;

  constructor(
    private _state: BsDropdownState,
    private cd: ChangeDetectorRef,
    private _renderer: Renderer2,
    _element: ElementRef
  ) {
    this._subscription = _state.isOpenChange.subscribe((value: boolean) => {
      this.isOpen = value;
      const dropdown = _element.nativeElement.querySelector('.dropdown-menu');
      if (dropdown && !isBs3()) {
        this._renderer.addClass(dropdown, 'show');
        if (dropdown.classList.contains('dropdown-menu-right')) {
          this._renderer.setStyle(dropdown, 'left', 'auto');
          this._renderer.setStyle(dropdown, 'right', '0');
        }
        if (this.direction === 'up') {
          this._renderer.setStyle(dropdown, 'top', 'auto');
          this._renderer.setStyle(
            dropdown,
            'transform',
            'translateY(-101%)'
          );
        }
      }
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
