import { Panel } from './panel';
import { Dock } from './dock';
import { PanelLocation } from './types';
import { ViewRegistry } from './view-registry';
import { CompositeDisposable, Emitter, Disposable } from './event-kit';

export class PanelContainer {
  private emitter: Emitter;
  private subscriptions: CompositeDisposable;

  panels: Panel[] = [];

  constructor(
    private viewRegistry: ViewRegistry,
    private location: PanelLocation,
    private dock: Dock = null) {
      this.emitter = new Emitter();
      this.subscriptions = new CompositeDisposable();
    }

  destroy() {
    for (const panel of this.getPanels()) {
      panel.destroy();
    }
  }

  getElement() {
  }

  /*
  Section: Event Subscription
  */

  onDidAddPanel(callback): Disposable {
    return this.emitter.on('did-add-panel', callback);
  }

  onDidRemovePanel(callback): Disposable {
    return this.emitter.on('did-remove-panel', callback);
  }

  onDidDestroy(callback): Disposable {
    return this.emitter.once('did-destroy', callback);
  }

  getLocation(): PanelLocation {
    return this.location;
  }

  isModal() { return this.location === 'modal'; }

  getPanels(): Panel[] { return this.panels.slice(); }

  addPanel(panel: Panel): Panel {
    this.subscriptions.add(panel.onDidDestroy(this.panelDestroyed.bind(this)));

    const index = this.getPanelIndex(panel);
    if (index === this.panels.length) {
      this.panels.push(panel);
    } else {
      this.panels.splice(index, 0, panel);
    }

    this.emitter.emit('did-add-panel', {panel, index});
    return panel;
  }

  panelForItem(item) {
    for (const panel of this.panels) {
      if (panel.getItem() === item) {
        return panel;
      }
    }
    return null;
  }

  panelDestroyed(panel) {
    const index = this.panels.indexOf(panel);
    if (index > -1) {
      this.panels.splice(index, 1);
      this.emitter.emit('did-remove-panel', {panel, index});
    }
  }

  getPanelIndex(panel) {
    const priority = panel.getPriority();
    if (['bottom', 'right'].find(item => item === this.location)) {
      for (let i = this.panels.length - 1; i >= 0; i--) {
        const p = this.panels[i];
        if (priority < p.getPriority()) { return i + 1; }
      }
      return 0;
    } else {
      for (let i = 0; i < this.panels.length; i++) {
        const p = this.panels[i];
        if (priority < p.getPriority()) { return i; }
      }
      return this.panels.length;
    }
  }
}
