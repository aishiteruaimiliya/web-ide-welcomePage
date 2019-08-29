import { PanelContainer } from './panel-container';
import { Panel, PanelOptions } from './panel';
import { Dock } from './dock';
import { WorkspaceCenter } from './workspace-center';
import { ViewRegistry } from './view-registry';
import { PanelLocation } from './types';
import { PaneContainer } from './pane-container';
import { Pane } from './pane';

export interface PaneContainers {
  center: WorkspaceCenter;
  left: Dock;
  right: Dock;
  bottom: Dock;
}

export interface PanelContainers {
  // top: PanelContainer;
  // left: PanelContainer;
  // right: PanelContainer;
  // bottom: PanelContainer;
  // header: PanelContainer;
  // footer: PanelContainer;
  // modal: PanelContainer;
  [location: string]: PanelContainer;
}
const gsp: any = {};
const ALL_LOCATIONS = ['center', 'left', 'right', 'bottom'];
export class Workspace {
  private paneContainers: PaneContainers;
  private panelContainers: PanelContainers;
  private activePaneContainer: Dock | WorkspaceCenter;
  private viewRegistry: ViewRegistry;
  private packageManager: any;
  private openers: any[];
  private frmOpeners: any[];
  private useFrmOpener: boolean;
  private notificationManager: any;
  private config: any;
  private destroyedItemURIs: any[];
  private project: any;

  constructor(params) {
    this.initOptions(params);
    this.initWorkspace();
    this.openers = [];
    this.frmOpeners = [];
    this.useFrmOpener = false;
    this.viewRegistry = params.viewRegistry;
    // this.subscribeToEvents();
  }

  private initOptions(params) {
    this.config = params.config || {};
  }

  private initWorkspace() {
    // 创建工作区停靠面板容器。
    this.paneContainers = {
      // 创建主区域。
      center: this.createCenter(),
      // 创建左侧面板。
      left: this.createDock('left'),
      // 创建右侧面板。
      right: this.createDock('right'),
      // 创建底部面板。
      bottom: this.createDock('bottom')
    };
    this.activePaneContainer = this.paneContainers.center;
    // 创建面板容器
    this.panelContainers = {
      top: new PanelContainer(this.viewRegistry, 'top'),
      left: new PanelContainer(this.viewRegistry, 'left', this.paneContainers.left),
      right: new PanelContainer(this.viewRegistry, 'right', this.paneContainers.right),
      bottom: new PanelContainer(this.viewRegistry, 'bottom', this.paneContainers.bottom),
      header: new PanelContainer(this.viewRegistry, 'header'),
      footer: new PanelContainer(this.viewRegistry, 'footer'),
      modal: new PanelContainer(this.viewRegistry, 'modal')
    };
  }

  get paneContainer(): PaneContainer {
    return this.paneContainers.center.paneContainer;
  }
  /**
   * 返回工作区元素
   */
  getElement() {
  }
  /**
   * 创建主面板
   */
  createCenter() {
    return new WorkspaceCenter({ viewRegistry: this.viewRegistry });
  }
  /**
   * 创建停靠面板
   * @param location 停靠面板位置
   */
  createDock(location) {
    return new Dock({
      location,
      viewRegistry: this.viewRegistry
    });
  }
  /**
   * 重置工作区
   * @param packageManager 包管理器
   */
  reset(packageManager) {
    this.packageManager = packageManager;

    this.destroyed();

    this.initWorkspace();
  }

  // Called by the Serializable mixin during serialization.
  /**
   * 序列化工作区配置
   */
  serialize() {
  }
  /**
   * 反序列化工作区配置
   * @param state state
   * @param deserializerManager dm
   */
  deserialize(state, deserializerManager) {
  }

  // Updates the application's title and proxy icon based on whichever file is
  // open.
  updateWindowTitle() {

  }

  open(itemOrURI, options: any = {}) {
    let uri, item;
    if (typeof itemOrURI === 'string') {
      uri = itemOrURI; // this.project.resolvePath(itemOrURI);
    } else if (itemOrURI) {
      item = itemOrURI;
      if (typeof item.getURI === 'function') { uri = item.getURI(); }
    }

    if (!this.config.get('core.allowPendingPaneItems')) {
      options.pending = false;
    }

    // Avoid adding URLs as recent documents to work-around this Spotlight crash:
    // https://github.com/atom/atom/issues/10071
    // if (uri && (!url.parse(uri).protocol || process.platform === 'win32')) {
    //   this.applicationDelegate.addRecentDocument(uri);
    // }

    let pane, itemExistsInWorkspace;

    // Try to find an existing item in the workspace.
    if (item || uri) {
      if (options.pane) {
        pane = options.pane;
      } else if (options.searchAllPanes) {
        pane = item ? this.paneForItem(item) : this.paneForURI(uri);
      } else {
        // If an item with the given URI is already in the workspace, assume
        // that item's pane container is the preferred location for that URI.
        let container;
        if (uri) { container = this.paneContainerForURI(uri); }
        if (!container) { container = this.getActivePaneContainer(); }

        // The `split` option affects where we search for the item.
        pane = container.getActivePane();
        switch (options.split) {
          case 'left':
            pane = pane.findLeftmostSibling();
            break;
          case 'right':
            pane = pane.findRightmostSibling();
            break;
          case 'up':
            pane = pane.findTopmostSibling();
            break;
          case 'down':
            pane = pane.findBottommostSibling();
            break;
        }
      }

      if (pane) {
        if (item) {
          itemExistsInWorkspace = pane.getItems().includes(item);
        } else {
          item = pane.itemForURI(uri);
          itemExistsInWorkspace = item != null;
        }
      }
    }

    // If we already have an item at this stage, we won't need to do an async
    // lookup of the URI, so we yield the event loop to ensure this method
    // is consistently asynchronous.
    if (item) {
      Promise.resolve();
    }

    if (!itemExistsInWorkspace) {
      item = item || this.createItemForURI(uri, options);
      if (!item) { return; }

      if (options.pane) {
        pane = options.pane;
      } else {
        let location = options.location;
        // if (!location && !options.split && uri && this.enablePersistence) {
        //   // location = await;
        //   this.itemLocationStore.load(uri);
        // }
        if (!location && typeof item.getDefaultLocation === 'function') {
          location = item.getDefaultLocation();
        }

        const allowedLocations = typeof item.getAllowedLocations === 'function' ? item.getAllowedLocations() : ALL_LOCATIONS;
        location = allowedLocations.includes(location) ? location : allowedLocations[0];

        const container = this.paneContainers[location] || this.getCenter();
        pane = container.getActivePane();
        switch (options.split) {
          case 'left':
            pane = pane.findLeftmostSibling();
            break;
          case 'right':
            pane = pane.findOrCreateRightmostSibling();
            break;
          case 'up':
            pane = pane.findTopmostSibling();
            break;
          case 'down':
            pane = pane.findOrCreateBottommostSibling();
            break;
        }
      }
    }

    if (!options.pending && (pane.getPendingItem() === item)) {
      pane.clearPendingItem();
    }

    this.itemOpened(item);

    if (options.activateItem === false) {
      pane.addItem(item, { pending: options.pending });
    } else {
      pane.activateItem(item, { pending: options.pending });
    }

    if (options.activatePane !== false) {
      pane.activate();
    }

    let initialColumn = 0;
    let initialLine = 0;
    if (!Number.isNaN(options.initialLine)) {
      initialLine = options.initialLine;
    }
    if (!Number.isNaN(options.initialColumn)) {
      initialColumn = options.initialColumn;
    }
    if (initialLine >= 0 || initialColumn >= 0) {
      if (typeof item.setCursorBufferPosition === 'function') {
        item.setCursorBufferPosition([initialLine, initialColumn]);
      }
    }

    const index = pane.getActiveItemIndex();
    return item;
  }

  hide(itemOrURI) {
    let foundItems = false;

    // If any visible item has the given URI, hide it
    for (const container of this.getPaneContainers()) {
      const isCenter = container === this.getCenter();
      if (isCenter || (container as Dock).isVisible()) {
        for (const pane of container.getPanes()) {
          const activeItem = pane.getActiveItem();
          const foundItem = (
            activeItem != null && (
              activeItem === itemOrURI ||
              typeof activeItem.getURI === 'function' && activeItem.getURI() === itemOrURI
            )
          );
          if (foundItem) {
            foundItems = true;
            // We can't really hide the center so we just destroy the item.
            if (isCenter) {
              pane.destroyItem(activeItem);
            } else {
              (container as Dock).hide();
            }
          }
        }
      }
    }

    return foundItems;
  }

  toggle(itemOrURI) {
    if (this.hide(itemOrURI)) {
      return Promise.resolve();
    } else {
      return this.open(itemOrURI, { searchAllPanes: true });
    }
  }

  openSync(fileUri = '', options = { initialColumn: '', initialLine: '', activateItem: '', activatePane: '' }) {
    const { initialLine, initialColumn } = options;
    const activatePane = options.activatePane != null ? options.activatePane : true;
    const activateItem = options.activateItem != null ? options.activateItem : true;

    const uri = fileUri; // this.project.resolvePath(uri_);
    let item = this.getActivePane().itemForURI(uri);
    if (uri && (item == null)) {
      for (const opener of this.getOpeners()) {
        item = opener(uri, options);
        if (item) { break; }
      }
    }
    if (item == null) {
      item = this.project.openSync(uri, { initialLine, initialColumn });
    }

    if (activateItem) {
      this.getActivePane().activateItem(item);
    }
    this.itemOpened(item);
    if (activatePane) {
      this.getActivePane().activate();
    }
    return item;
  }

  openURIInPane(uri, pane) {
    return this.open(uri, { pane });
  }

  createItemForURI(uri, options) {
    if (uri != null) {
      for (const opener of this.getOpeners()) {
        const item = opener(uri, options);
        if (item != null) {
          if (!item.getURI || typeof item.getURI !== 'function' || !item.getUri || typeof item.getURI !== 'function') {
            item.getUri = () => uri;
          }
          return item;
        }
      }
    }

    try {
      // return this.openTextFile(uri, options);
    } catch (error) {
      // switch (error.code) {
      //   case 'CANCELLED':
      //     return Promise.resolve();
      //   case 'EACCES':
      //     this.notificationManager.addWarning(`Permission denied '${error.path}'`);
      //     return Promise.resolve();
      //   case 'EPERM':
      //   case 'EBUSY':
      //   case 'ENXIO':
      //   case 'EIO':
      //   case 'ENOTCONN':
      //   case 'UNKNOWN':
      //   case 'ECONNRESET':
      //   case 'EINVAL':
      //   case 'EMFILE':
      //   case 'ENOTDIR':
      //   case 'EAGAIN':
      //     this.notificationManager.addWarning(
      //       `Unable to open '${error.path != null ? error.path : uri}'`,
      //       { detail: error.message }
      //     );
      //     return Promise.resolve();
      //   default:
      //     throw error;
      // }
    }
  }

  reopenItem() {
    const uri = this.destroyedItemURIs.pop();
    if (uri) {
      return this.open(uri);
    } else {
      return Promise.resolve();
    }
  }

  addOpener(opener) {
    this.openers.push(opener);
    // return new Disposable(() => { _.remove(this.openers, opener); });
  }

  addFrmOpener(opener) {
    if (!this.useFrmOpener) {
      this.useFrmOpener = true;
    }
    this.frmOpeners.push(opener);
  }

  getOpeners() {
    return this.useFrmOpener ? this.frmOpeners : this.openers;
  }

  getPaneItems() {
    return new Array().concat(this.getPaneContainers().map(container => container.getPaneItems()));
  }

  getActivePaneItem() {
    return this.getActivePaneContainer().getActivePaneItem();
  }

  saveAll() {
    this.getPaneContainers().forEach(container => {
      container.saveAll();
    });
  }

  confirmClose(options) {
    return Promise.all(this.getPaneContainers().map(container =>
      container.confirmClose(options)
    )).then((results) => !results.find(item => item === false));
  }

  saveActivePaneItem() {
    return this.getCenter().getActivePane().saveActiveItem();
  }

  saveActivePaneItemAs() {
    this.getCenter().getActivePane().saveActiveItemAs();
  }

  destroyActivePaneItem() {
    return this.getActivePane().destroyActiveItem();
  }

  getActivePaneContainer() {
    return this.activePaneContainer;
  }

  getPanes() {
    return new Array().concat(this.getPaneContainers().map(container => container.getPanes()));
  }

  getVisiblePanes() {
    return new Array().concat(this.getVisiblePaneContainers().map(container => container.getPanes()));
  }

  getActivePane() {
    return this.getActivePaneContainer().getActivePane();
  }

  activateNextPane() {
    return this.getActivePaneContainer().activateNextPane();
  }

  activatePreviousPane() {
    return this.getActivePaneContainer().activatePreviousPane();
  }

  paneContainerForURI(uri) {
    return this.getPaneContainers().find(container => !!container.paneForURI(uri));
  }

  paneContainerForItem(uri) {
    return this.getPaneContainers().find(container => !!container.paneForItem(uri));
  }

  paneForURI(uri): Pane {
    for (const location of this.getPaneContainers()) {
      const pane = location.paneForURI(uri);
      if (pane != null) {
        return pane;
      }
    }
  }

  paneForItem(item): Pane {
    for (const location of this.getPaneContainers()) {
      const pane = location.paneForItem(item);
      if (pane != null) {
        return pane;
      }
    }
  }

  destroyActivePane() {
    const activePane = this.getActivePane();
    if (activePane != null) {
      activePane.destroy();
    }
  }


  closeActivePaneItemOrEmptyPaneOrWindow() {
    if (this.getCenter().getActivePaneItem() != null) {
      this.getCenter().getActivePane().destroyActiveItem();
    } else if (this.getCenter().getPanes().length > 1) {
      this.getCenter().destroyActivePane();
    } else if (this.config.get('core.closeEmptyWindows')) {
      // 原为关闭atom应用窗口。ide中暂不关闭整个窗口。
      // atom.close();
    }
  }

  itemOpened(item) {
  }


  destroyed() {
    this.paneContainers.center.destroy();
    this.paneContainers.left.destroy();
    this.paneContainers.right.destroy();
    this.paneContainers.bottom.destroy();

    for (const panelLocation in this.panelContainers) {
      if (this.panelContainers.hasOwnProperty(panelLocation)) {
        const panelContainer = this.panelContainers[panelLocation];
        this.paneContainer.destroy();
      }
    }
  }

  getCenter(): WorkspaceCenter {
    return this.paneContainers.center;
  }

  getLeftDock() {
    return this.paneContainers.left;
  }

  getRightDock() {
    return this.paneContainers.right;
  }

  getBottomDock() {
    return this.paneContainers.bottom;
  }

  getPaneContainers() {
    return [
      this.paneContainers.center,
      this.paneContainers.left,
      this.paneContainers.right,
      this.paneContainers.bottom
    ];
  }

  getVisiblePaneContainers() {
    const center = this.getCenter();
    return this.getPaneContainers()
      .filter(container => container === center || (container as Dock).isVisible());
  }

  getBottomPanels() {
    return this.getPanels('bottom');
  }

  addBottomPanel(options: PanelOptions): Panel {
    return this.addPanel('bottom', options);
  }

  getLeftPanels() {
    return this.getPanels('left');
  }

  addLeftPanel(options: PanelOptions): Panel {
    return this.addPanel('left', options);
  }

  getRightPanels() {
    return this.getPanels('right');
  }

  addRightPanel(options: PanelOptions): Panel {
    return this.addPanel('right', options);
  }

  getTopPanels() {
    return this.getPanels('top');
  }

  addTopPanel(options: PanelOptions): Panel {
    return this.addPanel('top', options);
  }

  getHeaderPanels() {
    return this.getPanels('header');
  }

  addHeaderPanel(options: PanelOptions): Panel {
    return this.addPanel('header', options);
  }

  getFooterPanels() {
    return this.getPanels('footer');
  }

  addFooterPanel(options: PanelOptions): Panel {
    return this.addPanel('footer', options);
  }

  getModalPanels() {
    return this.getPanels('modal');
  }

  addModalPanel(options: PanelOptions): Panel {
    return this.addPanel('modal', options);
  }

  panelForItem(item): Panel {
    for (const location in this.panelContainers) {
      if (this.panelContainers.hasOwnProperty(location)) {
        const panel = this.panelContainers[location].panelForItem(item);
        if (panel != null) {
          return panel;
        }
      }
    }
    return null;
  }

  getPanelContainer(location: PanelLocation): PanelContainer {
    return this.panelContainers[location];
  }

  getPanels(location: PanelLocation): Panel[] {
    return this.panelContainers[location].getPanels();
  }

  addPanel(location: PanelLocation, options: PanelOptions): Panel {
    const panel = new Panel(options, this.viewRegistry);
    return this.panelContainers[location].addPanel(panel);
  }
}
