import { Disposable, CompositeDisposable } from './event-kit';
import { Workspace } from './workspace';
import { ViewRegistry } from './view-registry';
import { Dock } from './dock';
import { PaneContainer } from './pane-container';

export class WorkspaceElement {
  location;
  injector;
  instance: any;
  hostView;
  changeDetectorRef;
  componentType;
  private subscriptions: CompositeDisposable;
  private model: Workspace;
  private viewRegistry: ViewRegistry;
  // project: any;
  private config: any;
  private paneContainer: any; // PanelContainerElement;
  private hoveredDock: Dock;
  private panelContainers: {
    //  top: PanelContainerElement;
    //  left: PanelContainerElement;
    //  right: PanelContainerElement;
    //  bottom: PanelContainerElement;
    //  header: PanelContainerElement;
    //  footer: PanelContainerElement;
    //  modal: PanelContainerElement;
  };
  cursorInCenter: boolean;
  // styleManager: any;

  onDestroy(callback: Function): void {
    throw new Error('Method not implemented.');
  }
  attachedCallback() {
  }

  detachedCallback() {
    this.subscriptions.dispose();
  }

  initializeContent() {
  }

  observeScrollbarStyle() {
  }

  observeTextEditorFontConfig() {
  }

  updateGlobalTextEditorStyleSheet() {
  }

  initialize(model, { config, project, styleManager, viewRegistry }) {
    this.handleCenterEnter = this.handleCenterEnter.bind(this);
    this.handleCenterLeave = this.handleCenterLeave.bind(this);
    // this.handleEdgesMouseMove = _.throttle(this.handleEdgesMouseMove.bind(this), 100)
    this.handleDockDragEnd = this.handleDockDragEnd.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDrop = this.handleDrop.bind(this);

    this.model = model;
    this.viewRegistry = viewRegistry;
    // this.project = project;
    this.config = config;
    // this.styleManager = styleManager;
    if (this.viewRegistry == null) { throw new Error('Must pass a viewRegistry parameter when initializing WorkspaceElements'); }
    // if (this.project == null) { throw new Error('Must pass a project parameter when initializing WorkspaceElements') }
    if (this.config == null) { throw new Error('Must pass a config parameter when initializing WorkspaceElements'); }
    // if (this.styleManager == null) { throw new Error('Must pass a styleManager parameter when initializing WorkspaceElements') }

    this.subscriptions = new CompositeDisposable(
      new Disposable(() => {
        // this.paneContainer.removeEventListener('mouseenter', this.handleCenterEnter);
        // this.paneContainer.removeEventListener('mouseleave', this.handleCenterLeave);
        // window.removeEventListener('mousemove', this.handleEdgesMouseMove);
        // window.removeEventListener('dragend', this.handleDockDragEnd);
        // window.removeEventListener('dragstart', this.handleDragStart);
        // window.removeEventListener('dragend', this.handleDragEnd, true);
        // window.removeEventListener('drop', this.handleDrop, true);
      }),
      ...[this.model.getLeftDock(), this.model.getRightDock(), this.model.getBottomDock()]
        .map(dock => dock.onDidChangeHovered(hovered => {
          if (hovered) {
            this.hoveredDock = dock;
          } else if (dock === this.hoveredDock) {
            this.hoveredDock = null;
          }
          this.checkCleanupDockHoverEvents();
        }))
    );
    this.initializeContent();
    this.observeScrollbarStyle();
    this.observeTextEditorFontConfig();

    // this.paneContainer = this.model.getCenter().paneContainer.getElement();
    // this.verticalAxis.appendChild(this.paneContainer);
    // this.addEventListener('focus', this.handleFocus.bind(this));

    // this.addEventListener('mousewheel', this.handleMousewheel.bind(this), true);
    // window.addEventListener('dragstart', this.handleDragStart);
    // window.addEventListener('mousemove', this.handleEdgesMouseMove);

    this.panelContainers = {
      top: this.model.getPanelContainer('top').getElement(),
      left: this.model.getPanelContainer('left').getElement(),
      right: this.model.getPanelContainer('right').getElement(),
      bottom: this.model.getPanelContainer('bottom').getElement(),
      header: this.model.getPanelContainer('header').getElement(),
      footer: this.model.getPanelContainer('footer').getElement(),
      modal: this.model.getPanelContainer('modal').getElement()
    };

    // this.horizontalAxis.insertBefore(this.panelContainers.left, this.verticalAxis);
    // this.horizontalAxis.appendChild(this.panelContainers.right);

    // this.verticalAxis.insertBefore(this.panelContainers.top, this.paneContainer);
    // this.verticalAxis.appendChild(this.panelContainers.bottom);

    // this.insertBefore(this.panelContainers.header, this.horizontalAxis);
    // this.appendChild(this.panelContainers.footer);

    // this.appendChild(this.panelContainers.modal);

    // this.paneContainer.addEventListener('mouseenter', this.handleCenterEnter);
    // this.paneContainer.addEventListener('mouseleave', this.handleCenterLeave);

    return this;
  }

  destroy() {
    this.subscriptions.dispose();
  }

  getModel() { return this.model; }

  handleDragStart(event) {
    // if (!isTab(event.target)) return;
    // const { item } = event.target;
    // if (!item) return;
    // this.model.setDraggingItem(item);
    // window.addEventListener('dragend', this.handleDragEnd, true);
    // window.addEventListener('drop', this.handleDrop, true);
  }

  handleDragEnd(event) {
    this.dragEnded();
  }

  handleDrop(event) {
    this.dragEnded();
  }

  dragEnded() {
    // this.model.setDraggingItem(null);
    // window.removeEventListener('dragend', this.handleDragEnd, true);
    // window.removeEventListener('drop', this.handleDrop, true);
  }

  handleCenterEnter(event) {
  }

  handleCenterLeave(event) {
    // If the cursor leaves the center, we start listening to determine whether one of the docs is
    // being hovered.
    this.cursorInCenter = false;
    this.updateHoveredDock({ x: event.pageX, y: event.pageY });
    window.addEventListener('dragend', this.handleDockDragEnd);
  }

  handleEdgesMouseMove(event) {
    this.updateHoveredDock({ x: event.pageX, y: event.pageY });
  }

  handleDockDragEnd(event) {
    this.updateHoveredDock({ x: event.pageX, y: event.pageY });
  }

  updateHoveredDock(mousePosition) {
    // // If we haven't left the currently hovered dock, don't change anything.
    // if (this.hoveredDock && this.hoveredDock.pointWithinHoverArea(mousePosition, true)) return;

    // const docks = [this.model.getLeftDock(), this.model.getRightDock(), this.model.getBottomDock()];
    // const nextHoveredDock =
    //   docks.find(dock => dock !== this.hoveredDock && dock.pointWithinHoverArea(mousePosition));
    // docks.forEach(dock => { dock.setHovered(dock === nextHoveredDock) });
  }

  checkCleanupDockHoverEvents() {
    if (this.cursorInCenter && !this.hoveredDock) {
      window.removeEventListener('dragend', this.handleDockDragEnd);
    }
  }

  handleMousewheel(event) {
    // if (event.ctrlKey && this.config.get('editor.zoomFontWhenCtrlScrolling') && (event.target.closest('atom-text-editor') != null)) {
    //   if (event.wheelDeltaY > 0) {
    //     this.model.increaseFontSize();
    //   } else if (event.wheelDeltaY < 0) {
    //     this.model.decreaseFontSize();
    //   }
    //   event.preventDefault();
    //   event.stopPropagation();
    // }
  }

  handleFocus(event) {
    this.model.getActivePane().activate();
  }

  focusPaneViewAbove() {
    // this.focusPaneViewInDirection('above');
  }

  focusPaneViewBelow() {
    // this.focusPaneViewInDirection('below');
  }

  focusPaneViewOnLeft() {
    // this.focusPaneViewInDirection('left');
  }

  focusPaneViewOnRight() {
    // this.focusPaneViewInDirection('right')
  }

  focusPaneViewInDirection(direction, pane) {
    const activePane = this.model.getActivePane();
    // const paneToFocus = this.nearestVisiblePaneInDirection(direction, activePane);
    // paneToFocus && paneToFocus.focus();
  }

  moveActiveItemToPaneAbove(params) {
    // this.moveActiveItemToNearestPaneInDirection('above', params);
  }

  moveActiveItemToPaneBelow(params) {
    // this.moveActiveItemToNearestPaneInDirection('below', params);
  }

  moveActiveItemToPaneOnLeft(params) {
    // this.moveActiveItemToNearestPaneInDirection('left', params);

    // moveActiveItemToPaneOnRight(params) {
    //   this.moveActiveItemToNearestPaneInDirection('right', params);
    // }

    // moveActiveItemToNearestPaneInDirection(direction, params) {
    //   const activePane = this.model.getActivePane();
    //   const nearestPaneView = this.nearestVisiblePaneInDirection(direction, activePane);
    //   if (nearestPaneView == null) { return }
    //   if (params && params.keepOriginal) {
    //     activePane.getContainer().copyActiveItemToPane(nearestPaneView.getModel());
    //   } else {
    //     activePane.getContainer().moveActiveItemToPane(nearestPaneView.getModel());
    //   }
    //   nearestPaneView.focus();
    // }

    // nearestVisiblePaneInDirection(direction, pane) {
    //   const distance = function (pointA, pointB) {
    //     const x = pointB.x - pointA.x;
    //     const y = pointB.y - pointA.y;
    //     return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    //   }

    //   const paneView = pane.getElement()
    //   const box = this.boundingBoxForPaneView(paneView);

    //   const paneViews = atom.workspace.getVisiblePanes()
    //     .map(otherPane => otherPane.getElement())
    //     .filter(otherPaneView => {
    //       const otherBox = this.boundingBoxForPaneView(otherPaneView);
    //       switch (direction) {
    //         case 'left': return otherBox.right.x <= box.left.x;
    //         case 'right': return otherBox.left.x >= box.right.x;
    //         case 'above': return otherBox.bottom.y <= box.top.y;
    //         case 'below': return otherBox.top.y >= box.bottom.y;
    //       }
    //     }).sort((paneViewA, paneViewB) => {
    //       const boxA = this.boundingBoxForPaneView(paneViewA);
    //       const boxB = this.boundingBoxForPaneView(paneViewB);
    //       switch (direction) {
    //         case 'left': return distance(box.left, boxA.right) - distance(box.left, boxB.right);
    //         case 'right': return distance(box.right, boxA.left) - distance(box.right, boxB.left);
    //         case 'above': return distance(box.top, boxA.bottom) - distance(box.top, boxB.bottom);
    //         case 'below': return distance(box.bottom, boxA.top) - distance(box.bottom, boxB.top);
    //       }
    //     })

    //   return paneViews[0];
    // }

    // boundingBoxForPaneView(paneView) {
    //   const boundingBox = paneView.getBoundingClientRect();

    //   return {
    //     left: { x: boundingBox.left, y: boundingBox.top },
    //     right: { x: boundingBox.right, y: boundingBox.top },
    //     top: { x: boundingBox.left, y: boundingBox.top },
    //     bottom: { x: boundingBox.left, y: boundingBox.bottom }
    //   }
    // }

    // runPackageSpecs() {
    //   const activePaneItem = this.model.getActivePaneItem();
    //   const activePath = activePaneItem && typeof activePaneItem.getPath === 'function' ? activePaneItem.getPath() : null;
    //   let projectPath;
    //   if (activePath != null) {
    //     [projectPath] = this.project.relativizePath(activePath);
    //   } else {
    //     [projectPath] = this.project.getPaths();
    //   }
    //   if (projectPath) {
    //     let specPath = path.join(projectPath, 'spec');
    //     const testPath = path.join(projectPath, 'test');
    //     if (!fs.existsSync(specPath) && fs.existsSync(testPath)) {
    //       specPath = testPath;
    //     }

    //     ipcRenderer.send('run-package-specs', specPath);
    //   }
    // }

    // runBenchmarks() {
    //   const activePaneItem = this.model.getActivePaneItem();
    //   const activePath = activePaneItem && typeof activePaneItem.getPath === 'function' ? activePaneItem.getPath() : null;
    //   let projectPath;
    //   if (activePath) {
    //     [projectPath] = this.project.relativizePath(activePath);
    //   } else {
    //     [projectPath] = this.project.getPaths();
    //   }

    //   if (projectPath) {
    //     ipcRenderer.send('run-benchmarks', path.join(projectPath, 'benchmarks'));
    //   }
    // }
  }
}
