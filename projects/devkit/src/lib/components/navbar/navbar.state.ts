import {ElementRef, EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {BsDropdownDirective} from '../dropdown/index';
import {Subscription} from 'rxjs/Subscription';
import {BsDropdownState} from '../dropdown/dropdown.state';
import {DropdownItemDirective} from '../dropdown/dropdown-item.directive';

@Injectable()
export class NavbarState implements OnDestroy {
  private dropdownInstances: BsDropdownDirective[] = [];
  private menuItems: DropdownItemDirective[] = [];
  private subscriptions: Subscription[] = [];

  private level1Dropdown: BsDropdownDirective; // 当前下拉菜单的主菜单，
  private level2Dropdown: BsDropdownDirective; // 当前下拉菜单的子菜单

  onItemClick = new EventEmitter<string>();

  autoClose: boolean;

  constructor() {

  }

  addDropdown(dropdown: BsDropdownDirective): void {
    if (!this.dropdownInstances.find((item) => item === dropdown)) {
      this.dropdownInstances.push(dropdown);
      this.subscribeDropdown(dropdown);
      dropdown.onShown.subscribe(() => setTimeout(() => {
        dropdown.childDropdowns.forEach((item: BsDropdownDirective) => this.addDropdown(item));
      }));
    }
  }

  addMenuItem(menuItem: DropdownItemDirective): void {
    if (!this.menuItems.find((item) => item === menuItem)) {
      this.menuItems.push(menuItem);
      this.subscribeMenuItem(menuItem);
    }
  }

  private subscribeDropdown(dropdown: BsDropdownDirective): void {
    // 在下拉菜单显示、隐藏时，记录下显示状态。
    // this.subscriptions.push(
    //   dropdown.onShown.subscribe((value) => {
    //     debugger;
    //     if(dropdown.isSubMenu) {
    //
    //     }
    //   })
    // );
    //
    // this.subscriptions.push(
    //   dropdown.onHidden.subscribe((value) => {
    //
    //   })
    // );

    this.subscriptions.push(
      dropdown.state.onClick.subscribe((event: Event) => {
        if (dropdown.level === 1) {
          if (dropdown.isOpen && this.level1Dropdown === dropdown) {
            this.innerHideL1Dropdown();
          } else {
            this.innerShowL1Dropdown(dropdown);
          }
        } else if (dropdown.level === 2) {
          if (!dropdown.isOpen || this.level2Dropdown !== dropdown) {
            this.innerShowL2Dropdown(dropdown);
          }
        }
        event.stopPropagation();
      })
    );

    this.subscriptions.push(
      dropdown.state.onHover.subscribe(() => {
        if (!this.level1Dropdown) {
          // 菜单没展开，鼠标悬停没有效果
          return;
        }
        this.show(dropdown);
      })
    );
  }

  private subscribeMenuItem(menuItem: DropdownItemDirective): void {
    this.subscriptions.push(
      menuItem.onHover.subscribe(() => {
        if (!this.level1Dropdown) {
          return;
        }
        if (this.level1Dropdown.containsItem(menuItem)) {
          this.innerHideL2Dropdown();
        }
      })
    );

    this.subscriptions.push(
      menuItem.onClick.subscribe((command: string) => {
        this.onItemClick.emit(command);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  hideCurrentDropdown(): void {
    if (this.level2Dropdown) {
      this.innerHideL2Dropdown();
    } else {
      this.innerHideL1Dropdown();
    }
  }

  hideAllDropdown(): void {
    this.innerHideL2Dropdown();
    this.innerHideL1Dropdown();
  }

  show(dropdown: BsDropdownDirective): void {
    if (dropdown.level === 1) {
      if (dropdown !== this.level1Dropdown) {
        this.innerShowL1Dropdown(dropdown);
      }
      this.innerHideL2Dropdown();
    } else if (dropdown.level === 2) {
      if (dropdown !== this.level2Dropdown) {
        this.innerShowL2Dropdown(dropdown);
      }
    }



    ///////////////////////////////
    /*if (this.isMenuShown && this.isSubMenuShown && this.parentDropdown && this.parentDropdown.containsItem(dropdown)) {
      // 要显示的是子菜单，不是当前子菜单
      if (this.currentDropdown && this.currentDropdown !== dropdown) {
        this.currentDropdown.hide();
      }
      dropdown.show();
      this.currentDropdown = dropdown;
      this.isSubMenuShown = true;
    } else if (this.isMenuShown && !this.isSubMenuShown && this.currentDropdown && this.currentDropdown.containsItem(dropdown)) {

    } else {
      // 主菜单
      if (this.isSubMenuShown && this.currentDropdown && this.parentDropdown) {
        this.currentDropdown.hide();
        this.currentDropdown = null;
        this.isSubMenuShown = false;
      }
      if (this.isMenuShown && this.currentDropdown && this.currentDropdown !== dropdown) {
        this.currentDropdown.hide();
      }
      dropdown.show();
      this.currentDropdown = dropdown;
      this.isMenuShown = true;
    }*/
  }

  hide(dropdown: BsDropdownDirective): void {
    // if
  }

  private innerShowL1Dropdown(target: BsDropdownDirective): void {
    if (this.level1Dropdown) {
      this.level1Dropdown.hide();
    }
    target.show();
    this.level1Dropdown = target;
  }

  private innerHideL1Dropdown(): void {
    if (this.level1Dropdown) {
      this.level1Dropdown.hide();
      this.level1Dropdown = null;
    }
  }

  private innerShowL2Dropdown(target: BsDropdownDirective): void {
    if (this.level2Dropdown) {
      this.level2Dropdown.hide();
    }
    target.show();
    this.level2Dropdown = target;
  }

  private innerHideL2Dropdown(): void {
    if (this.level2Dropdown) {
      this.level2Dropdown.hide();
      this.level2Dropdown = null;
    }
  }
}
