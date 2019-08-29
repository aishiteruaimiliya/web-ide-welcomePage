import {
  Component, OnInit, Input, ViewChild, ElementRef, Output,
  EventEmitter, OnChanges, SimpleChanges, ViewChildren
} from '@angular/core';
import { ElementPropertyConfig } from '../../entity/property-entity';
import { PropertyItemListComponent } from '../property-item-list/property-item-list.component';

@Component({
  selector: 'app-property-panel',
  templateUrl: './property-panel.component.html',
  styleUrls: ['./property-panel.component.css']
})
export class PropertyPanelComponent implements OnInit, OnChanges {
  @Input() width: number;
  @Input() height: number;

  @Input() isPersitOpenState = false; // 是否持有面板的隐藏显示状态
  @Input() isShowPanel = false; // isPersitOpenState=true时，控制面板是否隐藏显示
  @Output() closePropertyPanel = new EventEmitter<any>(); // isPersitOpenState=true时，抛出面板的关闭事件

  @Input() propertyConfig: ElementPropertyConfig[]; // 属性类型
  @Input() propertyData = {}; // 属性值

  @Output() propertyChanged = new EventEmitter<any>(); // 属性变更事件
  @Output() submitModal = new EventEmitter<any>(); // 模态框属性变更事件
  @Input() showCloseBtn = true;


  @ViewChild('east') private eastDiv: ElementRef;
  @ViewChildren(PropertyItemListComponent) itemLists: Array<PropertyItemListComponent>;
  isOpen = true;
  constructor() { }

  ngOnInit() {

    if (this.width) {
      this.eastDiv.nativeElement.style.width = this.width + 'px';
    } else {
      this.eastDiv.nativeElement.style.width = 'inherit';
    }
    if (this.height) {
      this.eastDiv.nativeElement.style.height = this.height + 'px';
    } else {
      this.eastDiv.nativeElement.style.height = '100%';
    }


    if (this.isPersitOpenState) {
      this.isOpen = this.isShowPanel;
    }
  }

  /**
   *  更改面板的隐藏显示状态，只有在isPersitOpenState=true时生效
   * @param simpleChanges
   */
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.isShowPanel && this.isPersitOpenState) {
      this.isOpen = this.isShowPanel;
    }
  }
  refreshPanel() {
    this.itemLists.forEach(item => item.refresh());
  }
  changeStatus(item: any) {
    if (this.propertyConfig.length < 2) {
      return;
    }
    if (!item.status || item.status === 'open') {
      item.status = 'closed';
    } else {
      item.status = 'open';
    }
  }

  // 隐藏面板
  collapse() {
    // isPersitOpenState=true时,由外部确定状态
    if (this.isPersitOpenState) {
      this.closePropertyPanel.emit();
    } else {
      this.isOpen = false;
    }
  }

  /**
   * 抛出属性变更事件
   * @param changeObject
   */
  _valueChanged(changeObject) {
    this.propertyChanged.emit(changeObject);
  }
  _submitModal($event) {
    this.submitModal.emit($event);
  }
}
