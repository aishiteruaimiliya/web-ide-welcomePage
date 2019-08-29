import {
  Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild,
  ElementRef, Output, EventEmitter, Inject, forwardRef, ViewContainerRef
} from '@angular/core';
import { WindowService } from '../../services/window.service';
import { AngularDraggableDirective } from '../../directives/angular-draggable.directive';

@Component({
  selector: 'app-property-panel',
  templateUrl: './property-panel.component.html',
  styleUrls: ['./property-panel.component.css']
})
export class PropertyPanelComponent implements OnInit, OnChanges {
  @Input() width = 200;
  @Input() height: number;
  @Input() bounds: HTMLDivElement;
  @ViewChild('east') eastDiv: ElementRef;
  @Output() resizing = new EventEmitter();
  @ViewChild('panelDrag') draggable: AngularDraggableDirective;
  @ViewChild('content', { read: ViewContainerRef }) content: ViewContainerRef;



  private originalWidth: number;
  initBarPosition = 0;
  propertyTitleWidth = 100;
  initDragbarLeft = this.propertyTitleWidth + 30;

  isOpen = true;
  currentWidth: number;
  properties = [];
  // properties = [{
  //   groupName: 'Form表单', propertyList: [
  //     { title: '按钮', code: 'button', editor: { type: 'textbox' } },
  //     { title: '复选框', code: 'checkbox', editor: { type: 'checkbox' } },
  //     { title: '复选框列表', code: 'checkboxlist' },
  //     { title: '单选框', code: 'radiobutton' },
  //     { title: '文本框', code: 'textbox' },
  //     { title: '多行文本框', code: 'textarea' },
  //     { title: '树控件', code: 'treeview' },
  //     { title: '下拉框', code: 'combobox' },
  //     { title: '颜色选择器', code: 'colordialog' },
  //     { title: '日期选择框', code: 'datetimepicker' },
  //   ], status: 'open'
  // },
  // {
  //   groupName: '布局容器', propertyList: [
  //     { title: '按钮', code: 'button' },
  //     { title: '复选框', code: 'checkbox' },
  //     { title: '复选框列表', code: 'checkboxlist' },
  //     { title: '单选框', code: 'radiobutton' },
  //     { title: '文本框', code: 'textbox' },
  //     { title: '多行文本框', code: 'textarea' },
  //     { title: '树控件', code: 'treeview' },
  //     { title: '下拉框', code: 'combobox' },
  //     { title: '颜色选择器', code: 'colordialog' },
  //     { title: '日期选择框', code: 'datetimepicker' },
  //   ], status: 'open'
  // },
  // {
  //   groupName: '数据列表', propertyList: [
  //     { title: '按钮', code: 'button' },
  //     { title: '复选框', code: 'checkbox' },
  //     { title: '复选框列表', code: 'checkboxlist' },
  //     { title: '单选框', code: 'radiobutton' },
  //     { title: '文本框', code: 'textbox' },
  //     { title: '多行文本框', code: 'textarea' },
  //     { title: '树控件', code: 'treeview' },
  //     { title: '下拉框', code: 'combobox' },
  //     { title: '颜色选择器', code: 'colordialog' },
  //     { title: '日期选择框', code: 'datetimepicker' },
  //   ], status: 'open'
  // },
  // {
  //   groupName: '导航菜单', propertyList: [
  //     { title: '按钮', code: 'button' },
  //     { title: '复选框', code: 'checkbox' },
  //     { title: '复选框列表', code: 'checkboxlist' },
  //     { title: '单选框', code: 'radiobutton' },
  //     { title: '文本框', code: 'textbox' },
  //     { title: '多行文本框', code: 'textarea' },
  //     { title: '树控件', code: 'treeview' },
  //     { title: '下拉框', code: 'combobox' },
  //     { title: '颜色选择器', code: 'colordialog' },
  //     { title: '日期选择框', code: 'datetimepicker' },
  //   ], status: 'open'
  // }];

  constructor(private winSer: WindowService) {

  }

  ngOnInit() {
    this.originalWidth = this.width;
    this.initBarPosition = this.winSer.size.width - this.width;

    this.winSer.onResize.subscribe(s => {
      this.initBarPosition = s.width - this.width;
      this.originalWidth = this.width;
      this.draggable.resetPosition();
    });

    this.collapse();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['width'] && !changes['width'].isFirstChange()) {
      this.eastDiv.nativeElement.style.width = changes['width'].currentValue + 'px';
    }
  }

  onMoving(pos: any) {
    this.width = this.originalWidth - pos.x;
    this.eastDiv.nativeElement.style.width = this.width + 'px';
    this.resizing.emit({ right: this.width, target: this });
  }

  changeStatus(item: any) {
    if (item.status === 'open') {
      item.status = 'closed';
    } else {
      item.status = 'open';
    }
  }

  resizePropertyWidth(e: any) {
    this.propertyTitleWidth = this.initDragbarLeft - 30 + e.x;
  }

  // 展开面板
  expand() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.width = this.originalWidth = this.currentWidth;
      this.draggable.minWidth = 240;
      this.updateContainerWidth();
      this.resizing.emit({ right: this.width });
    }
  }

  // 隐藏面板
  collapse() {
    if (this.isOpen) {
      // 记录当前的尺寸
      this.currentWidth = this.width;
      this.isOpen = false;

      this.width = 0;
      this.originalWidth = 0;
      this.draggable.minWidth = 0;
      this.draggable.resetPosition();
      this.updateContainerWidth();
      this.resizing.emit({ right: this.width });
    }
  }

  private updateContainerWidth() {
    this.eastDiv.nativeElement.style.width = this.width + 'px';
  }

  setContent(compRef) {
    this.content.clear();
    this.content.insert(compRef.hostView);
    this.expand();
  }
}
