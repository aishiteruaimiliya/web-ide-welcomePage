import { PluginCenter } from './../plugin-center/plugin-center';
import { AfterViewInit, Component, ComponentRef, Injector, OnInit, ViewChild } from '@angular/core';
import { Tab } from '../framework/directives/tabs/tab';
import { WorkspaceManager } from './workspace.manager';
// import { Panel } from '@farris/ide-devkit';
import { TopMenuComponent } from '../framework/layout/top-menu/top-menu.component';
import { MainComponent } from '../framework/layout/main/main.component';
import { BsModalService } from '@farris/ui-modal';
import { ModalPanelComponent } from '../framework/layout/modal-panel/modal-panel.component';
import { NotifyOptions, NotifyService } from '@farris/ui-notify';
import { LoadingService, LoadingComponent } from '@farris/ui-loading';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit, AfterViewInit {

  // private pluginLoader: PluginLoader;
  private manager: WorkspaceManager;
  private modalService: BsModalService;
  private loadingCmp: LoadingComponent;

  public headerPanel: ComponentRef<any>;

  @ViewChild(TopMenuComponent) topMenuComp: TopMenuComponent;
  @ViewChild(MainComponent) mainComp: MainComponent;
  @ViewChild(ModalPanelComponent) modalPanel: ModalPanelComponent;

  constructor(private injector: Injector, private notify: NotifyService, private loading: LoadingService, private Http: HttpClient) {
    // this.pluginLoader = new PluginLoader(gsp, this.injector);
    this.modalService = this.injector.get(BsModalService);
  }

  ngOnInit() {
    this.bindViewToGSPEnvironment();
    this.manager = this.injector.get(WorkspaceManager);
    this.manager.initWorkspace();

    const pluginCenter = this.injector.get(PluginCenter);

    pluginCenter.registryPlugin(this.mainComp).subscribe(() => {
      this.listenOnWelcomePage();
    });

  }

  ngAfterViewInit() {
    setTimeout(() => {
      // this.test();
      // this.pluginLoader.loadSidebar();
      // this.pluginLoader.loadNavbar();
      this.observeMenu();
    }, 500);
  }

  private bindViewToGSPEnvironment() {
    // center
    const center = gsp.workspace.getCenter().getActivePane();
    center.onDidAddItem(({ item }) => this.onCenterItemAdded(item));
    center.onDoingChangeActiveItem((item) => this.onCenterActiveItemChanging(item));
    center.onDidChangeActiveItem((item) => this.onCenterActiveItemChanged(item));
    center.onDidRemoveItem(({ item }) => this.onCenterItemRemoved(item));
    this.mainComp.tabsComp.selecting.subscribe((tab: Tab) => this.onMainTabsSelecting(tab));
    this.mainComp.tabsComp.removing.subscribe((tab: Tab) => this.onMainTabsRemoving(tab));

    // left
    const leftPane = gsp.workspace.getLeftDock().getActivePane();
    // leftDock.observeActiveItem((item) => this.onLeftViewChanged(item));
    // leftPane.onDidAddItem(({item}) => this.onLeftTabsAdded(item));

    // modal
    const modalPanelContainer = gsp.workspace.getPanelContainer('modal');
    // modalPanelContainer.onDidAddPanel(({panel}) => this.onModalPanelAdded(panel));


    // new addin
    gsp.ide.onPanelAdded(options => this.loadPanel(options));
    gsp.ide.onPanelRemoved(id => this.modalPanel.remove(id));
    gsp.ide.onLeftActivated(id => this.activatePanel(id, 'left'));
    gsp.ide.onNotifyShown((level, content) => this.showNotify(level, content));
    gsp.ide.onLoadingShown(() => this.showLoading());
    gsp.ide.onLoadingHidden(() => this.hideLoading());
  }

  /* #region  deprecated */
  private bindMainComponent() {
    // center
    const center = gsp.workspace.getCenter().getActivePane();

    // 打开
    // 可以支持调用组件的api打开一个tab页，暂不需要。
    center.onDidAddItem(({ item }) => this.onCenterItemAdded(item));

    // 切换tab页
    this.mainComp.tabsComp.selecting.subscribe((tab: Tab) => this.onMainTabsSelecting(tab));
    center.onDoingChangeActiveItem((item) => this.onCenterActiveItemChanging(item));
    center.onDidChangeActiveItem((item) => this.onCenterActiveItemChanged(item));

    // 关闭tab页
    this.mainComp.tabsComp.removing.subscribe((tab: Tab) => this.onMainTabsRemoving(tab));
    center.onDidRemoveItem(({ item }) => this.onCenterItemRemoved(item));

    // 切换tab页顺序？？
  }

  private onCenterActiveChanged(item: any) {
    if (item == null) {
      return;
    }
    const contentContainer = this.mainComp.tabsComp.content;
    contentContainer.detach();
    contentContainer.insert(gsp.views.getView(item).hostView);
  }

  private onLeftTabsAdded(item: any) {
    if (item == null) {
      return;
    }
    // const contentContainer = this.mainComp.sidebar.loadPanel(item.getTitle(), gsp.views.getView(item));
    const contentContainer = this.mainComp.sidebar.loadPanel(item.getTitle(), item);
  }

  private onModalPanelAdded(panel/* : Panel */) {
    if (panel == null) {
      return;
    }
    const item = panel.getItem();
    const element = item && (item.element || (item.getElement && item.getElement()));
    if (element) {
      const modalPanel = this.modalService.show(element, item.modalOptions || {});
      panel.onDidDestroy(() => modalPanel.close());
    }
  }
  /* #endregion */

  private onCenterItemAdded(item: any) {
    if (item == null) {
      return;
    }
    const tab = new Tab(
      (item.getURI && item.getURI()) || (item.getUri && item.getUri()),
      item.getTitle(),
      item.getElement && item.getElement());
    tab.item = item;
    this.mainComp.addMainTab(tab, false);
  }

  private onCenterActiveItemChanging(item: any) {
    if (item == null) {
      return;
    }

    // 通知tab页将要被隐藏
    // const item = mainPane.getActiveItem();
    const uri = (item.getURI && item.getURI()) || (item.getUri && item.getUri());
    gsp.eventBus.post(WorkspaceComponent, 'Workspace', 'tabHidding', item);
    // console.log('tab changing: ' + uri);
  }

  private onCenterActiveItemChanged(item: any) {
    if (item == null) {
      return;
    }

    // const activatedIndex = this.gsp.workspace.getCenter().getActivePane().getItems().indexOf(item);
    this.mainComp.findAndSelectMainTab((item.getURI && item.getURI()) || (item.getUri && item.getUri()));
  }

  private onCenterItemRemoved(item: any) {
    if (item == null) {
      return;
    }
    const uri = (item.getURI && item.getURI()) || (item.getUri && item.getUri());
    this.mainComp.removeMainTab(uri);
  }

  private onMainTabsSelecting(tab: Tab) {
    const mainPane = gsp.workspace.getCenter().getActivePane();

    // const selectedItem = mainPane.itemForURI(tab.id);
    mainPane.activateItemForURI(tab.id);
  }

  private onMainTabsRemoving(tab: Tab) {
    const mainPane = gsp.workspace.getCenter().getActivePane();
    mainPane.removeItem(tab.item, false);
  }

  /**
   * 监听菜单
   * 相应菜单的点击事件。
   */
  private observeMenu() {
    this.topMenuComp.navbarClicked.subscribe((command: string) => this.runCommand(command));
  }

  private runCommand(command: string) {
    gsp.eventBus.post(WorkspaceComponent, 'workspace.component', 'Command:' + command, null);
  }

  private test() {
    const item1 = {
      getURI: () => '111',
      getTitle: () => '111',
      elementUrl: 'http://localhost:4201?test=a/b/c.json'
    };
    // gsp.workspace.open(item1);

    const item2 = {
      getURI: () => '222',
      getTitle: () => '222',
      elementUrl: '/demo/index.html?test=d/e/f.ts'
      // elementUrl: 'http://localhost:5000/api/dev/main/v1.0/tsfile/test'
    };
    // gsp.workspace.open(item2);

    gsp.workspace.open('aaa/bbb/ccc.frm');

    gsp.eventBus.post(WorkspaceComponent, 'abc', 'Command:openMetadataGuide:Form', null);
  }

  private loadPanel(options: any, location?: string) {
    location = location || options.location;
    options.frameID = options.frameID || gsp.util.newGuid();
    switch (location) {
      case 'modal':
        // for test
        // options.modalOptions = {
        //   width: 820,
        //   height: 623,
        //   btns: {
        //     ok: 'confirm',
        //     cancle: ''
        //   }
        // };
        // options.frameID = '12345';
        // end test
        this.modalPanel.add(options);
        break;
      case 'left':
        this.mainComp.sidebar.loadPanel(options.title, options);
        break;
      default:
        break;
    }
  }

  private closePanel(id: string, location: string) {
    switch (location) {
      case 'modal':
        this.modalPanel.remove(id);
        break;
      case 'left':
        // this.mainComp.sidebar.loadPanel('文件', options);
        break;
      default:
        break;
    }
  }

  private activatePanel(id: string, location: string) {
    switch (location) {
      case 'left':
        this.mainComp.sidebar.activateItem(id);
        break;
      default:
        break;
    }
  }

  private showNotify(level: 'error' | 'warning' | 'info', content: string | NotifyOptions) {
    this.notify[level](content);
  }

  private showLoading() {
    if (this.loadingCmp) {
      return;
    }

    this.loadingCmp = this.loading.show();
  }

  private hideLoading() {
    if (this.loadingCmp) {
      this.loadingCmp.close();
      this.loadingCmp = null;
    }
  }

  private listenOnWelcomePage() {
    const welcomePageUri = 'about.md';
    const configUrl = 'http://127.0.0.1:5000/api/dev/main/v1.0/welcomePageUtil/getstatus';
    this.Http.get(configUrl).subscribe(
      (data) => {
        if (data && data['config'] === 'open') {
          gsp.workspace.open(welcomePageUri);
        }
      }
    );
    gsp.eventBus.on(null, 'workspace.component', 'Command:welcomePage', this, () => {
      gsp.workspace.open(welcomePageUri);
    });
    console.log('hello,on welcomePage');
  }
}
