import { PaneContainer } from './pane-container';
import { Pane } from './pane';
import { ViewRegistry } from './view-registry';
import { Emitter, Disposable } from './event-kit';

export enum DockStyle {
  none,
  left,
  right,
  top,
  bottom
}

export class Dock {
  private location: any;
  private widthOrHeight: any;
  private viewRegistry: ViewRegistry;
  private didActivate: boolean;
  private paneContainer: PaneContainer;
  private state: any;
  private emitter: Emitter;


  constructor(params) {
    this.handleResizeHandleDragStart = this.handleResizeHandleDragStart.bind(this);
    this.handleResizeToFit = this.handleResizeToFit.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.location = params.location;
    this.widthOrHeight = getWidthOrHeight(this.location);
    this.viewRegistry = params.viewRegistry;
    this.didActivate = params.didActivate;

    this.emitter = new Emitter();

    this.paneContainer = new PaneContainer({
      location: this.location,
      viewRegistry: this.viewRegistry
    });

    this.state = {
      size: null,
      visible: false,
      shouldAnimate: false
    };

  }

  // This method is called explicitly by the object which adds the Dock to the document.
  elementAttached() {
    // Re-render when the dock is attached to make sure we remeasure sizes defined in CSS.
    this.render(this.state);
  }

  getElement() {

  }

  getLocation() {
    return this.location;
  }

  destroy() {
    this.paneContainer.destroy();
    // window.removeEventListener('mousemove', this.handleMouseMove);
    // window.removeEventListener('mouseup', this.handleMouseUp);
    // window.removeEventListener('drag', this.handleDrag);
    // window.removeEventListener('dragend', this.handleDragEnd);
  }

  setHovered(hovered) {
    if (hovered === this.state.hovered) {
      return;
    }
    this.setState({ hovered });
  }

  setDraggingItem(draggingItem) {
    if (draggingItem === this.state.draggingItem) { return; }
    this.setState({ draggingItem });
  }

  // Extended: Show the dock and focus its active {Pane}.
  activate() {
    this.getActivePane().activate();
  }

  // Extended: Show the dock without focusing it.
  show() {
    this.setState({ visible: true });
  }

  // Extended: Hide the dock and activate the {WorkspaceCenter} if the dock was
  // was previously focused.
  hide() {
    this.setState({ visible: false });
  }

  // Extended: Toggle the dock's visibility without changing the {Workspace}'s
  // active pane container.
  toggle() {
    // const state = { visible: !this.state.visible };
    // if (!state.visible) { state.hovered = false; }
    // this.setState(state);
  }

  // Extended: Check if the dock is visible.
  //
  // Returns a {Boolean}.
  isVisible() {
    return this.state.visible;
  }

  setState(newState) {
    const prevState = this.state;
    const nextState = Object.assign({}, prevState, newState);

    // Update the `shouldAnimate` state. This needs to be written to the DOM before updating the
    // class that changes the animated property. Normally we'd have to defer the class change a
    // frame to ensure the property is animated (or not) appropriately, however we luck out in this
    // case because the drag start always happens before the item is dragged into the toggle button.
    if (nextState.visible !== prevState.visible) {
      // Never animate toggling visibility...
      nextState.shouldAnimate = false;
    } else if (!nextState.visible && nextState.draggingItem && !prevState.draggingItem) {
      // ...but do animate if you start dragging while the panel is hidden.
      nextState.shouldAnimate = true;
    }

    this.state = nextState;
    this.render(this.state);

    const { visible } = this.state;
    // if (visible !== prevState.visible) {
    //   this.emitter.emit('did-change-visible', visible);
    // }
  }

  render(state) {

  }

  handleDidAddPaneItem() {
    if (this.state.size == null) {
      this.setState({ size: this.getInitialSize() });
    }
  }

  handleDidRemovePaneItem() {
    // Hide the dock if you remove the last item.
    if (this.paneContainer.getPaneItems().length === 0) {
      this.setState({ visible: false, hovered: false, size: null });
    }
  }

  handleResizeHandleDragStart() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    this.setState({ resizing: true });
  }

  handleResizeToFit() {
    const item = this.getActivePaneItem();
    if (item) {
      const size = getPreferredSize(item, this.getLocation());
      if (size != null) { this.setState({ size }); }
    }
  }

  handleMouseMove(event) {
    if (event.buttons === 0) { // We missed the mouseup event. For some reason it happens on Windows
      this.handleMouseUp(event);
      return;
    }

    const size = 0;
    // switch (this.location) {
    //   case 'left':
    //     size = event.pageX - this.element.getBoundingClientRect().left;
    //     break;
    //   case 'bottom':
    //     size = this.element.getBoundingClientRect().bottom - event.pageY;
    //     break;
    //   case 'right':
    //     size = this.element.getBoundingClientRect().right - event.pageX;
    //     break;
    // }
    this.setState({ size });
  }

  handleMouseUp(event) {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.setState({ resizing: false });
  }

  // Determine whether the cursor is within the dock hover area. This isn't as simple as just using
  // mouseenter/leave because we want to be a little more forgiving. For example, if the cursor is
  // over the footer, we want to show the bottom dock's toggle button. Also note that our criteria
  // for detecting entry are different than detecting exit but, in order for us to avoid jitter, the
  // area considered when detecting exit MUST fully encompass the area considered when detecting
  // entry.
  pointWithinHoverArea (point, detectingExit) {
  }

  getInitialSize() {
    // The item may not have been activated yet. If that's the case, just use the first item.
    const activePaneItem = this.paneContainer.getActivePaneItem() || this.paneContainer.getPaneItems()[0];
    // If there are items, we should have an explicit width; if not, we shouldn't.
    return activePaneItem
      ? getPreferredSize(activePaneItem, this.location)
      : null;
  }

  serialize() {
    return {
      deserializer: 'Dock',
      size: this.state.size,
      paneContainer: this.paneContainer.serialize({}),
      visible: this.state.visible
    };
  }

  deserialize(serialized, deserializerManager) {
    this.paneContainer.deserialize(serialized.paneContainer, deserializerManager);
    this.setState({
      size: serialized.size || this.getInitialSize(),
      // If no items could be deserialized, we don't want to show the dock (even if it was visible last time)
      visible: serialized.visible && (this.paneContainer.getPaneItems().length > 0)
    });
  }

  /*
  Section: Event Subscription
  */

  // Essential: Invoke the given callback when the visibility of the dock changes.
  //
  // * `callback` {Function} to be called when the visibility changes.
  //   * `visible` {Boolean} Is the dock now visible?
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidChangeVisible(callback) {
  }

  // Essential: Invoke the given callback with the current and all future visibilities of the dock.
  //
  // * `callback` {Function} to be called when the visibility changes.
  //   * `visible` {Boolean} Is the dock now visible?
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  observeVisible(callback) {
    callback(this.isVisible());
    return this.onDidChangeVisible(callback);
  }

  // Essential: Invoke the given callback with all current and future panes items
  // in the dock.
  //
  // * `callback` {Function} to be called with current and future pane items.
  //   * `item` An item that is present in {::getPaneItems} at the time of
  //      subscription or that is added at some later time.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  observePaneItems(callback) {
    return this.paneContainer.observePaneItems(callback);
  }

  // Essential: Invoke the given callback when the active pane item changes.
  //
  // Because observers are invoked synchronously, it's important not to perform
  // any expensive operations via this method. Consider
  // {::onDidStopChangingActivePaneItem} to delay operations until after changes
  // stop occurring.
  //
  // * `callback` {Function} to be called when the active pane item changes.
  //   * `item` The active pane item.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidChangeActivePaneItem(callback) {
    return this.paneContainer.onDidChangeActivePaneItem(callback);
  }

  // Essential: Invoke the given callback when the active pane item stops
  // changing.
  //
  // Observers are called asynchronously 100ms after the last active pane item
  // change. Handling changes here rather than in the synchronous
  // {::onDidChangeActivePaneItem} prevents unneeded work if the user is quickly
  // changing or closing tabs and ensures critical UI feedback, like changing the
  // highlighted tab, gets priority over work that can be done asynchronously.
  //
  // * `callback` {Function} to be called when the active pane item stopts
  //   changing.
  //   * `item` The active pane item.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidStopChangingActivePaneItem(callback) {
    return this.paneContainer.onDidStopChangingActivePaneItem(callback);
  }

  // Essential: Invoke the given callback with the current active pane item and
  // with all future active pane items in the dock.
  //
  // * `callback` {Function} to be called when the active pane item changes.
  //   * `item` The current active pane item.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  observeActivePaneItem(callback) {
    return this.paneContainer.observeActivePaneItem(callback);
  }

  // Extended: Invoke the given callback when a pane is added to the dock.
  //
  // * `callback` {Function} to be called panes are added.
  //   * `event` {Object} with the following keys:
  //     * `pane` The added pane.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidAddPane(callback) {
    return this.paneContainer.onDidAddPane(callback);
  }

  // Extended: Invoke the given callback before a pane is destroyed in the
  // dock.
  //
  // * `callback` {Function} to be called before panes are destroyed.
  //   * `event` {Object} with the following keys:
  //     * `pane` The pane to be destroyed.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onWillDestroyPane(callback) {
    return this.paneContainer.onWillDestroyPane(callback);
  }

  // Extended: Invoke the given callback when a pane is destroyed in the dock.
  //
  // * `callback` {Function} to be called panes are destroyed.
  //   * `event` {Object} with the following keys:
  //     * `pane` The destroyed pane.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidDestroyPane(callback) {
    return this.paneContainer.onDidDestroyPane(callback);
  }

  // Extended: Invoke the given callback with all current and future panes in the
  // dock.
  //
  // * `callback` {Function} to be called with current and future panes.
  //   * `pane` A {Pane} that is present in {::getPanes} at the time of
  //      subscription or that is added at some later time.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  observePanes(callback) {
    return this.paneContainer.observePanes(callback);
  }

  // Extended: Invoke the given callback when the active pane changes.
  //
  // * `callback` {Function} to be called when the active pane changes.
  //   * `pane` A {Pane} that is the current return value of {::getActivePane}.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidChangeActivePane(callback) {
    return this.paneContainer.onDidChangeActivePane(callback);
  }

  // Extended: Invoke the given callback with the current active pane and when
  // the active pane changes.
  //
  // * `callback` {Function} to be called with the current and future active#
  //   panes.
  //   * `pane` A {Pane} that is the current return value of {::getActivePane}.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  observeActivePane(callback) {
    return this.paneContainer.observeActivePane(callback);
  }

  // Extended: Invoke the given callback when a pane item is added to the dock.
  //
  // * `callback` {Function} to be called when pane items are added.
  //   * `event` {Object} with the following keys:
  //     * `item` The added pane item.
  //     * `pane` {Pane} containing the added item.
  //     * `index` {Number} indicating the index of the added item in its pane.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidAddPaneItem(callback) {
    return this.paneContainer.onDidAddPaneItem(callback);
  }

  // Extended: Invoke the given callback when a pane item is about to be
  // destroyed, before the user is prompted to save it.
  //
  // * `callback` {Function} to be called before pane items are destroyed.
  //   * `event` {Object} with the following keys:
  //     * `item` The item to be destroyed.
  //     * `pane` {Pane} containing the item to be destroyed.
  //     * `index` {Number} indicating the index of the item to be destroyed in
  //       its pane.
  //
  // Returns a {Disposable} on which `.dispose` can be called to unsubscribe.
  onWillDestroyPaneItem(callback) {
    return this.paneContainer.onWillDestroyPaneItem(callback);
  }

  // Extended: Invoke the given callback when a pane item is destroyed.
  //
  // * `callback` {Function} to be called when pane items are destroyed.
  //   * `event` {Object} with the following keys:
  //     * `item` The destroyed item.
  //     * `pane` {Pane} containing the destroyed item.
  //     * `index` {Number} indicating the index of the destroyed item in its
  //       pane.
  //
  // Returns a {Disposable} on which `.dispose` can be called to unsubscribe.
  onDidDestroyPaneItem(callback) {
    return this.paneContainer.onDidDestroyPaneItem(callback);
  }

  // Extended: Invoke the given callback when the hovered state of the dock changes.
  //
  // * `callback` {Function} to be called when the hovered state changes.
  //   * `hovered` {Boolean} Is the dock now hovered?
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidChangeHovered (callback): Disposable {
    return this.emitter.on('did-change-hovered', callback);
  }

  /*
  Section: Pane Items
  */

  // Essential: Get all pane items in the dock.
  //
  // Returns an {Array} of items.
  getPaneItems() {
    return this.paneContainer.getPaneItems();
  }

  // Essential: Get the active {Pane}'s active item.
  //
  // Returns an pane item {Object}.
  getActivePaneItem() {
    return this.paneContainer.getActivePaneItem();
  }

  // Save all pane items.
  saveAll() {
    this.paneContainer.saveAll();
  }

  confirmClose(options) {
    return this.paneContainer.confirmClose(options);
  }

  /*
  Section: Panes
  */

  // Extended: Get all panes in the dock.
  //
  // Returns an {Array} of {Pane}s.
  getPanes(): Pane[] {
    return this.paneContainer.getPanes();
  }

  // Extended: Get the active {Pane}.
  //
  // Returns a {Pane}.
  getActivePane() {
    return this.paneContainer.getActivePane();
  }

  // Extended: Make the next pane active.
  activateNextPane() {
    return this.paneContainer.activateNextPane();
  }

  // Extended: Make the previous pane active.
  activatePreviousPane() {
    return this.paneContainer.activatePreviousPane();
  }

  paneForURI(uri) {
    return this.paneContainer.paneForURI(uri);
  }

  paneForItem(item) {
    return this.paneContainer.paneForItem(item);
  }

  // Destroy (close) the active pane.
  destroyActivePane() {
    const activePane = this.getActivePane();
    if (activePane != null) {
      activePane.destroy();
    }
  }
}


function getWidthOrHeight(location) {
  return location === 'left' || location === 'right' ? 'width' : 'height';
}

function getPreferredSize(item, location) {
  switch (location) {
    case 'left':
    case 'right':
      return typeof item.getPreferredWidth === 'function'
        ? item.getPreferredWidth()
        : null;
    default:
      return typeof item.getPreferredHeight === 'function'
        ? item.getPreferredHeight()
        : null;
  }
}

function getIconName(location, visible) {
  switch (location) {
    case 'right': return visible ? 'icon-chevron-right' : 'icon-chevron-left';
    case 'bottom': return visible ? 'icon-chevron-down' : 'icon-chevron-up';
    case 'left': return visible ? 'icon-chevron-left' : 'icon-chevron-right';
    default: throw new Error(`Invalid location: ${location}`);
  }
}

function rectContainsPoint(rect, point) {
  return (
    point.x >= rect.left &&
    point.y >= rect.top &&
    point.x <= rect.right &&
    point.y <= rect.bottom
  );
}

// Is the item allowed in the given location?
function isItemAllowed(item, location) {
  if (typeof item.getAllowedLocations !== 'function') {
    return true;
  }
  return item.getAllowedLocations().includes(location);
}
