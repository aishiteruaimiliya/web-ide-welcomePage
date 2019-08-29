import {
  Component, OnInit, ElementRef, HostListener, ViewChild,
  EventEmitter, AfterViewInit, AfterContentInit, ComponentFactoryResolver, Injector, ReflectiveInjector, Type, Input
} from '@angular/core';
import { WindowService } from '../../services/window.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TerminalComponent } from '../terminal/terminal.component';
import { TabsComponent } from '../../directives/tabs';
import { Tab } from '../../directives/tabs/tab';
import { WorkspaceManager } from '../../../workspace/workspace.manager';
import { AutoHeightDirective } from '../../directives/auto_height.directive';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit, AfterContentInit {

  private activitybar: HTMLDivElement;
  @ViewChild('designArea') centerArea: ElementRef;
  @ViewChild('main') main: ElementRef;

  @ViewChild(SidebarComponent) sidebar: SidebarComponent;
  @ViewChild(TerminalComponent) terminal: TerminalComponent;
  // @ViewChild(PropertyPanelComponent) propertyPanel: PropertyPanelComponent;

  @ViewChild(TabsComponent) tabsComp: TabsComponent;

  @ViewChild('workbench') container: AutoHeightDirective;

  centerWidth: number;
  tabsContainerHeight: number;


  // @Input() panels;

  onMainTabRemove: EventEmitter<Tab>;

  private workSpaceMgr: WorkspaceManager;

  constructor(private elementRef: ElementRef, private winSer: WindowService,
              private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) {
    this.workSpaceMgr = this.injector.get(WorkspaceManager);
  }

  ngOnInit() {
    this.activitybar = this.elementRef.nativeElement.firstElementChild as HTMLDivElement;
    setTimeout(() => {
      this.centerWidth = this.winSer.size.width - this.sidebar.width;
      this.centerArea.nativeElement.style.width = this.centerWidth + 'px';

      this.sidebar.draggable.maxWidth = this.winSer.size.width - 212;
      this.sidebar.draggable.minWidth = 240;

      // this.propertyPanel.draggable.maxWidth = this.winSer.size.width - this.sidebar.width - 212;
      // this.propertyPanel.draggable.minWidth = 240;

      this.tabsContainerHeight = this.container.containerHeight - 200;
    });

    this.tabsComp.selected.subscribe(tab => console.log(`select: ${tab.title}`));
    this.tabsComp.unselected.subscribe(tab => {
      if (tab) {
        // console.log(`unselect: ${tab.title}`);
      }
    });
    this.onMainTabRemove = this.tabsComp.removed;
    this.tabsComp.removed.subscribe(tab => {
      // console.log(`removed: ${tab.title}`);
    });

    this.container.windowResize.subscribe(h => {
      this.tabsContainerHeight = h - this.terminal.height;
    });

  }

  ngAfterContentInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.terminal.collapse();
    });
  }

  addNewTab(component: Type<any>) {
    const title = '新建工作区 - ' + this.tabsComp.tabs.length;

    // const testFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    // const test = testFactory.create(this.injector);

    // this.tabsComp.addTab(new Tab(id, title, component));

  }

  addMainTab(tab: Tab, active: Boolean) {
    this.tabsComp.addTab(tab, active);
  }

  removeMainTab(id: string) {
    const tabToRemoved = this.tabsComp.tabs.find((item) => item.id === id);
    if (tabToRemoved) {
      this.tabsComp.removeTab(tabToRemoved, {reselect: false, emit: true});
    }
  }

  findAndSelectMainTab(id: string): boolean {
    return this.tabsComp.findAndSelectTab(id);
  }

  selectMainTab(tab: Tab) {
    return this.tabsComp.selectTab(tab);
  }

  @HostListener('window:resize', ['$event'])
  windowResize() {
    const winSize = this.winSer.size;
    this.centerWidth = winSize.width - this.sidebar.width;
    this.centerArea.nativeElement.style.width = this.centerWidth + 'px';
    this.winSer.onResize.emit({ width: this.centerWidth, height: winSize.height - 32 });
  }



  leftResizing(offset: any) {
    let left = offset.left;
    const winSize = this.winSer.size;
    if (offset.target === window) {
      left = this.sidebar.width;
    }

    this.centerWidth = winSize.width - left;
    this.centerArea.nativeElement.style.width = this.centerWidth + 'px';
    this.centerArea.nativeElement.style.left = left + 'px';

    this.resetMaxWidth();
    this.workSpaceMgr.leftSidebarResize.emit(offset.target);
  }

  private resetMaxWidth() {
    // this.propertyPanel.draggable.maxWidth = this.winSer.size.width - this.sidebar.width - 212;
    this.sidebar.draggable.maxWidth = this.winSer.size.width - 212;
  }

  rightResizing(offset: any) {
    this.centerWidth = this.winSer.size.width - this.sidebar.width - offset.right;
    this.centerArea.nativeElement.style.width = this.centerWidth + 'px';

    this.resetMaxWidth();
  }


  bottomResizing(e: any) {
    this.tabsContainerHeight = this.container.containerHeight - e.height;
  }

  closeTab(tab?: Tab) {
    if (tab) {
      this.tabsComp.removeTab(tab);
    } else {
      this.tabsComp.removeTab(this.tabsComp.currentTab);
    }
  }
}
