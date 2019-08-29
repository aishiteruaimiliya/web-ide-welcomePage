import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  Directive,
  TemplateRef,
  ContentChild,
  AfterContentChecked,
  Output,
  EventEmitter
} from '@angular/core';
import { NgbNavTabsetConfig } from './navtab-config';

let nextId = 0;

/**
 * This directive should be used to wrap tab titles that need to contain HTML markup or other directives.
 */
@Directive({ selector: 'ng-template[ngbNavTabTitle]' })
// tslint:disable-next-line:directive-class-suffix
export class NgbNavTabTitle {
  constructor(public templateRef: TemplateRef<any>) { }
}

/**
 * This directive must be used to wrap content to be displayed in a tab.
 */
@Directive({ selector: 'ng-template[ngbNavTabContent]' })
// tslint:disable-next-line:directive-class-suffix
export class NgbNavTabContent {
  constructor(public templateRef: TemplateRef<any>) { }
}

/**
 * A directive representing an individual tab.
 */
@Directive({ selector: 'ngb-navtab' })
// tslint:disable-next-line:directive-class-suffix
export class NgbNavTab {
  /**
   * Unique tab identifier. Must be unique for the entire document for proper accessibility support.
   */
  @Input() id = `ngb-tab-${nextId++}`;
  /**
   * Simple (string only) title. Use the "NgbNavTabTitle" directive for more complex use-cases.
   */
  @Input() title: string;
  /**
   * Allows toggling disabled state of a given state. Disabled tabs can't be selected.
   */
  @Input() disabled = false;

  @ContentChild(NgbNavTabContent) contentTpl: NgbNavTabContent;
  @ContentChild(NgbNavTabTitle) titleTpl: NgbNavTabTitle;
}

/**
 * The payload of the change event fired right before the tab change
 */
export interface NgbNavTabChangeEvent {
  /**
   * Id of the currently active tab
   */
  activeId: string;

  /**
   * Id of the newly selected tab
   */
  nextId: string;

  /**
   * Function that will prevent tab switch if called
   */
  preventDefault: () => void;
}

/**
 * A component that makes it easy to create tabbed interface.
 */
@Component({
  selector: 'ngb-navtabset',
  exportAs: 'NgbNavTabset',
  template: `
    <ul [class]="'web-ide-activity-bar nav nav-' + type + (orientation == 'horizontal'?  ' '
      + justifyClass : ' flex-column')" role="tablist">
      <li class="nav-item" *ngFor="let tab of tabs">
        <a [id]="tab.id" class="nav-link" [class.active]="tab.id === activeId" [class.disabled]="tab.disabled"
          href (click)="select(tab.id)" role="tab" [attr.tabindex]="(tab.disabled ? '-1': undefined)"
          [attr.aria-controls]="(!destroyOnHide || tab.id === activeId ? tab.id + '-panel' : null)"
          [attr.aria-expanded]="tab.id === activeId" [attr.aria-disabled]="tab.disabled">
          {{tab.title}}<ng-template [ngTemplateOutlet]="tab.titleTpl?.templateRef"></ng-template>
        </a>
      </li>
    </ul>
    <div class="web-ide-side-bar tab-content">
      <ng-template ngFor let-tab [ngForOf]="tabs">
        <div
          class="tab-pane {{tab.id === activeId ? 'active' : null}}"
          *ngIf="!destroyOnHide || tab.id === activeId"
          role="tabpanel"
          [attr.aria-labelledby]="tab.id" id="{{tab.id}}-panel"
          [attr.aria-expanded]="tab.id === activeId">
          <ng-template [ngTemplateOutlet]="tab.contentTpl.templateRef"></ng-template>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./navtab.css']
})
// tslint:disable-next-line:component-class-suffix
export class NgbNavTabset implements AfterContentChecked {
  justifyClass: string;

  @ContentChildren(NgbNavTab) tabs: QueryList<NgbNavTab>;

  /**
   * An identifier of an initially selected (active) tab. Use the "select" method to switch a tab programmatically.
   */
  @Input() activeId: string;

  /**
   * Whether the closed tabs should be hidden without destroying them
   */
  @Input() destroyOnHide = true;

  /**
   * The horizontal alignment of the nav with flexbox utilities. Can be one of 'start', 'center', 'end', 'fill' or
   * 'justified'
   * The default value is 'start'.
   */
  @Input()
  set justify(className: 'start' | 'center' | 'end' | 'fill' | 'justified') {
    if (className === 'fill' || className === 'justified') {
      this.justifyClass = `nav-${className}`;
    } else {
      this.justifyClass = `justify-content-${className}`;
    }
  }

  /**
   * The orientation of the nav (horizontal or vertical).
   * The default value is 'horizontal'.
   */
  @Input() orientation: 'horizontal' | 'vertical';

  /**
   * Type of navigation to be used for tabs. Can be one of 'tabs' or 'pills'.
   */
  @Input() type: 'tabs' | 'pills';

  /**
   * A tab change event fired right before the tab selection happens. See NgbNavTabChangeEvent for payload details
   */
  @Output() tabChange = new EventEmitter<NgbNavTabChangeEvent>();

  constructor(config: NgbNavTabsetConfig) {
    this.type = config.type;
    this.justify = config.justify;
    this.orientation = config.orientation;
  }

  /**
   * Selects the tab with the given id and shows its associated pane.
   * Any other tab that was previously selected becomes unselected and its associated pane is hidden.
   */
  select(tabId: string) {
    const selectedTab = this._getTabById(tabId);
    if (selectedTab && !selectedTab.disabled && this.activeId !== selectedTab.id) {
      let defaultPrevented = false;

      this.tabChange.emit(
        { activeId: this.activeId, nextId: selectedTab.id, preventDefault: () => { defaultPrevented = true; } });

      if (!defaultPrevented) {
        this.activeId = selectedTab.id;
      }
    }
  }

  ngAfterContentChecked() {
    // auto-correct activeId that might have been set incorrectly as input
    const activeTab = this._getTabById(this.activeId);
    this.activeId = activeTab ? activeTab.id : (this.tabs.length ? this.tabs.first.id : null);
  }

  private _getTabById(id: string): NgbNavTab {
    const tabsWithId: NgbNavTab[] = this.tabs.filter(tab => tab.id === id);
    return tabsWithId.length ? tabsWithId[0] : null;
  }
}
