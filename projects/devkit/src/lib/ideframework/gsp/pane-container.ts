import { Pane } from './pane';
import { ItemRegistry } from './item-registry';

const SERIALIZATION_VERSION = 1;

export class PaneContainer {
  itemRegistry: any;
  alive: boolean;
  viewRegistry: any;
  location: any;
  activePane: any;
  root: any;
  config: any;

  constructor(params) {
    let applicationDelegate, deserializerManager, notificationManager;
    ({
      config: this.config,
      applicationDelegate,
      notificationManager,
      deserializerManager,
      viewRegistry: this.viewRegistry,
      location: this.location
    } = params);

    this.itemRegistry = new ItemRegistry();
    this.alive = true;


    this.setRoot(new Pane({
      container: this,
      config: this.config,
      applicationDelegate,
      notificationManager,
      deserializerManager,
      viewRegistry: this.viewRegistry
    }));
    this.didActivatePane(this.getRoot());
  }

  getLocation() { return this.location; }

  getElement() {
  }

  destroy() {
    this.alive = false;
    for (const pane of this.getRoot().getPanes()) { pane.destroy(); }

  }

  isAlive() { return this.alive; }

  isDestroyed() { return !this.isAlive(); }

  serialize(...params) {
    return {
      deserializer: 'PaneContainer',
      version: SERIALIZATION_VERSION,
      root: this.root ? this.root.serialize() : null,
      activePaneId: this.activePane.id
    };
  }

  deserialize(state, deserializerManager) {
    if (state.version !== SERIALIZATION_VERSION) { return; }
    this.setRoot(deserializerManager.deserialize(state.root));
    this.activePane = this.getRoot().getPanes().find(pane => pane.id === state.activePaneId) || this.getPanes()[0];
    if (this.config && this.config.get && this.config.get('core.destroyEmptyPanes')) {
      this.destroyEmptyPanes();
    }
  }

  onDidChangeRoot(fn) {
  }

  observeRoot(fn) {
    fn(this.getRoot());
    return this.onDidChangeRoot(fn);
  }

  onDidAddPane(fn) {
  }

  observePanes(fn) {
    for (const pane of this.getPanes()) { fn(pane); }
    return this.onDidAddPane(({ pane }) => fn(pane));
  }

  onDidDestroyPane(fn) {
  }

  onWillDestroyPane(fn) {
  }

  onDidChangeActivePane(fn) {
  }

  onDidActivatePane(fn) {
  }

  observeActivePane(fn) {
    fn(this.getActivePane());
    return this.onDidChangeActivePane(fn);
  }

  onDidAddPaneItem(fn) {
  }

  observePaneItems(fn) {
    for (const item of this.getPaneItems()) { fn(item); }
    return this.onDidAddPaneItem(({ item }) => fn(item));
  }

  onDidChangeActivePaneItem(fn) {
  }

  onDidStopChangingActivePaneItem(fn) {
  }

  observeActivePaneItem(fn) {
    fn(this.getActivePaneItem());
    return this.onDidChangeActivePaneItem(fn);
  }

  onWillDestroyPaneItem(fn) {
  }

  onDidDestroyPaneItem(fn) {
  }

  getRoot() { return this.root; }

  setRoot(root) {
    this.root = root;
    this.root.setParent(this);
    this.root.setContainer(this);
    if ((this.getActivePane() == null) && this.root instanceof Pane) {
      this.didActivatePane(this.root);
    }
  }

  replaceChild(oldChild, newChild) {
    if (oldChild !== this.root) { throw new Error('Replacing non-existent child'); }
    this.setRoot(newChild);
  }

  getPanes(): Pane[] {
    if (this.alive) {
      return this.getRoot().getPanes();
    } else {
      return [];
    }
  }

  getPaneItems(): any[] {
    return this.getRoot().getItems();
  }

  getActivePane(): Pane {
    return this.activePane;
  }

  getActivePaneItem(): any {
    return this.getActivePane().getActiveItem();
  }

  paneForURI(uri): Pane {
    return this.getPanes().find(pane => pane.itemForURI(uri) != null);
  }

  paneForItem(item): Pane {
    return this.getPanes().find(pane => pane.getItems().find(it => it === item));
  }

  saveAll() {
    for (const pane of this.getPanes()) { pane.saveItems(); }
  }

  confirmClose(options) {
    const promises = [];
    for (const pane of this.getPanes()) {
      for (const item of pane.getItems()) {
        promises.push(pane.promptToSaveItem(item, options));
      }
    }
    return Promise.all(promises).then((results: boolean[]) => !results.find(item => item === false));
  }

  activateNextPane() {
    const panes = this.getPanes();
    if (panes.length > 1) {
      const currentIndex = panes.indexOf(this.activePane);
      const nextIndex = (currentIndex + 1) % panes.length;
      panes[nextIndex].activate();
      return true;
    } else {
      return false;
    }
  }

  activatePreviousPane() {
    const panes = this.getPanes();
    if (panes.length > 1) {
      const currentIndex = panes.indexOf(this.activePane);
      let previousIndex = currentIndex - 1;
      if (previousIndex < 0) { previousIndex = panes.length - 1; }
      panes[previousIndex].activate();
      return true;
    } else {
      return false;
    }
  }

  moveActiveItemToPane(destPane) {
    const item = this.activePane.getActiveItem();

    if (!destPane.isItemAllowed(item)) { return; }

    this.activePane.moveItemToPane(item, destPane);
    destPane.setActiveItem(item);
  }

  copyActiveItemToPane(destPane) {
    const item = this.activePane.copyActiveItem();

    if (item && destPane.isItemAllowed(item)) {
      destPane.activateItem(item);
    }
  }

  destroyEmptyPanes() {
    for (const pane of this.getPanes()) { if (pane.items.length === 0) { pane.destroy(); } }
  }

  didAddPane(event) {
    const items = event.pane.getItems();
    for (let i = 0, length = items.length; i < length; i++) {
      const item = items[i];
      this.didAddPaneItem(item, event.pane, i);
    }
  }

  willDestroyPane(event) {
  }

  didDestroyPane(event) {
  }

  didActivatePane(activePane) {
    if (activePane !== this.activePane) {
      if (!this.getPanes().find(item => item === activePane)) {
        throw new Error('Setting active pane that is not present in pane container');
      }

      this.activePane = activePane;
      this.didChangeActiveItemOnPane(this.activePane, this.activePane.getActiveItem());
    }
    return this.activePane;
  }

  didAddPaneItem(item, pane, index) {
    this.itemRegistry.addItem(item);
  }

  willDestroyPaneItem(event) {
  }

  didDestroyPaneItem(event) {
    this.itemRegistry.removeItem(event.item);
    // this.emitter.emit('did-destroy-pane-item', event);
  }

  didChangeActiveItemOnPane(pane, activeItem) {
    if (pane === this.getActivePane()) {

      this.cancelStoppedChangingActivePaneItemTimeout();
      // `setTimeout()` isn't available during the snapshotting phase, but that's okay.

    }
  }

  cancelStoppedChangingActivePaneItemTimeout() {

  }
}
