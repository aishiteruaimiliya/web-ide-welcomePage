import { ViewRegistry } from './view-registry';
import { Emitter, Disposable } from './event-kit';

export interface PanelOptions {
  item: any;
  autoFocus?: boolean;
  visible?: boolean;
  priority?: number;
  className?: string;
}

export class Panel {
  /*
  Section: Construction and Destruction
  */
  destroyed: boolean;
  item: any;
  autoFocus: boolean;
  visible: boolean;
  priority: number;
  className: string;
  viewRegistry: any;
  private emitter: Emitter;

  constructor(options: PanelOptions, viewRegistry: ViewRegistry) {
    this.destroyed = false;
    this.item = options.item;
    this.autoFocus = options.autoFocus == null ? false : options.autoFocus;
    this.visible = options.visible == null ? true : options.visible;
    this.priority = options.priority == null ? 100 : options.priority;
    this.className = options.className;
    this.viewRegistry = viewRegistry;
    this.emitter = new Emitter();
  }

  // Public: Destroy and remove this panel from the UI.
  destroy() {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
    this.hide();
    this.emitter.emit('did-destroy', this);
    return this.emitter.dispose();
  }

  getElement() {
    return this.item.getElement(); // 直接返回item的视图，不再包装一层Panel
  }

  /*
  Section: Event Subscription
  */

  // Public: Invoke the given callback when the pane hidden or shown.
  //
  // * `callback` {Function} to be called when the pane is destroyed.
  //   * `visible` {Boolean} true when the panel has been shown
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidChangeVisible(callback) {
    return this.emitter.on('did-change-visible', callback);
  }

  // Public: Invoke the given callback when the pane is destroyed.
  //
  // * `callback` {Function} to be called when the pane is destroyed.
  //   * `panel` {Panel} this panel
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidDestroy(callback): Disposable {
    return this.emitter.once('did-destroy', callback);
  }

  /*
  Section: Panel Details
  */

  // Public: Returns the panel's item.
  getItem() {
    return this.item;
  }

  // Public: Returns a {Number} indicating this panel's priority.
  getPriority() {
    return this.priority;
  }

  getClassName() {
    return this.className;
  }

  // Public: Returns a {Boolean} true when the panel is visible.
  isVisible() {
    return this.visible;
  }

  // Public: Hide this panel
  hide() {
    const wasVisible = this.visible;
    this.visible = false;
    if (wasVisible) {
      this.emitter.emit('did-change-visible', this.visible);
    }
  }

  // Public: Show this panel
  show() {
    const wasVisible = this.visible;
    this.visible = true;
    if (!wasVisible) {
      this.emitter.emit('did-change-visible', this.visible);
    }
  }
}
