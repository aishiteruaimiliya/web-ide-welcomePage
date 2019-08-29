import {
  Component,
  OnInit,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
  Output,
  EventEmitter,
  ComponentRef,
  ViewChildren,
  QueryList,
  ViewContainerRef,
  ChangeDetectorRef
} from '@angular/core';
import { AngularDraggableDirective } from '../../directives/angular-draggable.directive';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidebar') sidebarEl: ElementRef;
  @Input() bounds: HTMLDivElement;
  @Input() width: number;
  @Input() height: number;
  panels: Array<any>;
  @Output() resizing: EventEmitter<any> = new EventEmitter();

  @ViewChild(AngularDraggableDirective) draggable: AngularDraggableDirective;
  @ViewChildren('panelContainer', {read: ViewContainerRef}) panelContainers: QueryList<ViewContainerRef>;

  originalWidth: number;

  currentTabIndex = 0;
  isOpen = true;
  currentWidth: number;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.panels = [];
  }

  ngOnInit() {
    // this.originalWidth = this.sidebarEl.nativeElement.clientWidth;
    // console.log(`原始宽度：${this.originalWidth}`);
    this.originalWidth = this.width;
  }

  onMoving(pos: any) {
    this.isOpen = true;
    this.width = this.originalWidth + pos.x;
    this.resizing.emit({ left: this.width, target: this });
  }

  onEndOffset(pos: any) {
  }

  onSelectedTabChanged(index) {
    if (this.currentTabIndex !== index) {
      this.currentTabIndex = index;
      if (!this.isOpen) {
        this.expand();
      }
    } else {
      if (this.isOpen) {
        // 隐藏面板
        this.collapse();
      } else {
        this.expand();
      }
    }
  }

  // 展开面板
  private expand() {
    this.isOpen = true;
    this.width = this.originalWidth = this.currentWidth;
    this.draggable.minWidth = 240;
    this.resizing.emit({ left: this.width, target: this });
  }

  // 隐藏面板
  private collapse() {
    // 记录当前的尺寸
    this.currentWidth = this.width;
    this.isOpen = false;

    this.width = 50;
    this.originalWidth = 50;
    this.draggable.minWidth = 0;
    this.draggable.resetPosition();

    this.resizing.emit({ left: this.width, target: this });
  }

  isActiveTab(index) {
    return this.currentTabIndex === index;
  }

  changeStatus(item: any) {
    if (item.status === 'open') {
      item.status = 'closed';
    } else {
      item.status = 'open';
    }
  }

  loadPanelOld(name: string, compRef: ComponentRef<any>) {
    let panelIndex;
    switch (name) {
      case '文件':
        panelIndex = 0;
        break;
      case 'Git':
        panelIndex = 1;
        break;
      default:
        return;
    }

    const container = this.panelContainers.find((item, index, array) => index === panelIndex);
    if (container) {
      container.clear();
      container.insert(compRef.hostView);
    }
  }

  loadPanel(name: string, item: any) {
    if (item.url) {
      let panelIndex;
      switch (name) {
        case '业务对象':
          panelIndex = 0;
          break;
        case '文件':
          panelIndex = 1;
          break;
        case 'Git':
          panelIndex = 2;
          break;
        default:
          return;
      }
      let url: string = item.url;
      if (url.includes('?')) {
        url = url + '&frameID=' + item.frameID;
      } else {
        url = url + '?frameID=' + item.frameID;
      }
      // this.panels.push({title: name, elementUrl: url});
      this.panels[panelIndex] = {title: name, elementUrl: url, frameID: item.frameID};
    } else {
      let panelIndex;
      const compRef = item.getElement() as ComponentRef<any>;
      switch (name) {
        case '文件':
          panelIndex = 0;
          break;
        case 'Git':
          panelIndex = 1;
          break;
        default:
          return;
      }

      const container = this.panelContainers.find((i, index, array) => index === panelIndex);
      if (container) {
        // container.clear();
        container.insert(compRef.hostView);
      }
    }
  }

  /**
   * 激活指定的面板，显示在前台
   * @param frameId 被激活面板的IFrame id
   */
  activateItem(frameId: string) {
    const index = this.panels.findIndex(item => item.frameID === frameId);
    this.onSelectedTabChanged(index);

    // 强制刷新界面。焦点在iframe中时ide视图不会被刷新。ide处于focus状态时无需执行。
    this.changeDetectorRef.detectChanges();
  }
}
