import {
  Component, HostBinding, Input, OnDestroy, Renderer2,
  ViewContainerRef, TemplateRef, AfterContentInit, ViewChild, EventEmitter,
  ComponentRef, OnChanges, ElementRef, ChangeDetectorRef
} from '@angular/core';
import { Tab } from './tab';
import { PerfectScrollbarComponent } from '@farris/ui-perfect-scrollbar';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styles: [`
    .tab-content-wrap {
      display: flex
    }
    .tab-content {
      display: none;
      flex: 1
    }
    .tab-content.active {
      display: flex
    }
  `]
})
export class TabsComponent implements OnDestroy, AfterContentInit {

  @Input() actionsRef: TemplateRef<any>;
  @Input() height: number;
  @Input() keepTabContent: boolean = true;

  @ViewChild('tabContent', {read: ViewContainerRef}) content: ViewContainerRef;
  @ViewChild('tablist') tabsEl: ElementRef;

  @ViewChild(PerfectScrollbarComponent) ps: PerfectScrollbarComponent;

  get currentTab(): Tab {
    if (this.tabs.length) {
      return this.tabs.find(tab => tab.active);
    }

    return undefined;
  }


  selecting: EventEmitter<Tab> = new EventEmitter();
  selected: EventEmitter<Tab> = new EventEmitter();
  unselected: EventEmitter<Tab> = new EventEmitter();
  removing: EventEmitter<Tab> = new EventEmitter();
  removed: EventEmitter<Tab> = new EventEmitter();


  @HostBinding('class.tab-container') clazz = true;

  // tabs: Tab[] = [];

  @Input() tabs = new Array<Tab>();
  classMap: any = {};

  protected isDestroyed: boolean;

  constructor(
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    // this.workspaceManager.setMainTabsComponent(this);
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
  }

  ngAfterContentInit() {
  }

  addTab(tab: Tab, active: Boolean): void {
    this.tabs.push(tab);
    // tab.active = this.tabs.length === 1 && typeof tab.active === 'undefined';
    if (active) {
      this.selectTab(tab);
    }

    setTimeout(() => {
      this.ps.directiveRef.update();
      this.ps.directiveRef.scrollToRight();
    });

    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  removeTab(
    tab: Tab,
    options = { reselect: true, emit: true }
  ): void {
    const index = this.tabs.indexOf(tab);
    if (index === -1 || this.isDestroyed) {
      return;
    }
    // Select a new tab if the tab to be removed is selected and not destroyed
    if (tab.active) {
      if (options.reselect && this.hasAvailableTabs(index)) {
        const newActiveIndex = this.getClosestTabIndex(index);
        this.selectTab(this.tabs[newActiveIndex]);
      }
    }

    if (options.emit) {
      this.removed.emit(tab);
    }
    this.tabs.splice(index, 1);

    // if (!this.currentTab) {
    //   this.dynamicComp.clear();
    // }
  }

  protected getClosestTabIndex(index: number): number {
    const tabsLength = this.tabs.length;
    if (!tabsLength) {
      return -1;
    }

    for (let step = 1; step <= tabsLength; step += 1) {
      const prevIndex = index - step;
      const nextIndex = index + step;
      if (this.tabs[prevIndex]) {
        return prevIndex;
      }
      if (this.tabs[nextIndex]) {
        return nextIndex;
      }
    }

    return -1;
  }

  protected hasAvailableTabs(index: number): boolean {
    const tabsLength = this.tabs.length;
    if (!tabsLength) {
      return false;
    }

    for (let i = 0; i < tabsLength; i += 1) {
      if (i !== index) {
        return true;
      }
    }

    return false;
  }

  findAndSelectTab(id: string): boolean {
    const tab = this.tabs.find((item) => item.id === id);
    if (tab && !tab.active) {
      this.selectTab(tab);
    }

    return !!tab;
  }

  selectTab(tab: Tab) {
    if (this.currentTab) {
      this.currentTab.active = false;
      this.unselected.emit(this.currentTab);
    }

    tab.active = true;
    this.selected.emit(tab);
    // this.setContent(tab.compRef);

    // 强制刷新视图
    this.changeDetectorRef.detectChanges();

    // TODO: 移动tabs 中的滚动条到合适位置，将当前的tab 显示粗来。
    setTimeout(() => this.setTabPosition());
  }

  private setTabPosition() {
    const index = this.tabs.findIndex(tab => tab === this.currentTab);
    if (index > -1) {
        const li = this.tabsEl.nativeElement.querySelectorAll('li')[index];
        this.ps.directiveRef.scrollToLeft(li.offsetLeft);
    }
  }

  setContent(compRef: ComponentRef<any>) {
    this.content.detach();
    // this.content.clear();
    this.content.insert(compRef.hostView);
  }

  onSelectingTab(tab: Tab, changeView: boolean) {
    this.selecting.emit(tab);
    if (changeView) {
      this.selectTab(tab);
    }
  }

  onRemovingTab(tab: Tab) {
    this.removing.emit(tab);
    this.removeTab(tab);
  }
}
