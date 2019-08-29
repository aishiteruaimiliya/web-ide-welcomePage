import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ElementPropertyConfig } from '../../entity/property-entity';
import { PropertyItemComponent } from '../property-item/property-item.component';

@Component({
  selector: 'webide-property-item-list',
  templateUrl: './property-item-list.component.html',
  styleUrls: ['./property-item-list.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class PropertyItemListComponent implements OnChanges {
  @Input() category: ElementPropertyConfig; // 某一分类下的属性配置
  @Input() propertyData; // 属性值
  @Output() valueChanged = new EventEmitter<any>();
  @Output() submitModal = new EventEmitter<any>();

  @ViewChildren(PropertyItemComponent) items: Array<PropertyItemComponent>;

  data; // 实际属性值
  constructor() { }

  ngOnChanges(simpleChanges: SimpleChanges) {
    // 若分类下有propertyData，则取分类下的propertyData；否则取整体的propertyData
    if (this.category.propertyData) {
      this.data = this.category.propertyData;
    } else {
      this.data = this.propertyData;
    }
  }
  refresh() {
    // 若分类下有propertyData，则取分类下的propertyData；否则取整体的propertyData
    if (this.category.propertyData) {
      this.data = this.category.propertyData;
    } else {
      this.data = this.propertyData;
    }
    this.items.forEach(item => item.refresh());
  }

  /**
   * 一般属性变更
   * @param $event
   */
  _itemChanged($event) {
    const { changeObject } = $event;
    this.data[changeObject.propertyID] = changeObject.propertyValue;

    if (this.category.setPropertyRelates && typeof (this.category.setPropertyRelates) === 'function') {
      this.category.setPropertyRelates(changeObject, this.data);
      this.items.forEach(item => item.refresh());
    }
    changeObject.categoryId = this.category.categoryId;
    this.valueChanged.emit(changeObject);
  }

  /**
   * 模态框数据变更（TODO:待优化，合并valueChange事件）
   * @param $event
   */
  _submitModal($event) {
    const { changeObject, parameters } = $event;
    this.data[changeObject.propertyID] = changeObject.propertyValue;

    if (this.category.setPropertyRelates && typeof (this.category.setPropertyRelates) === 'function') {
      this.category.setPropertyRelates(changeObject, this.data, parameters);
      this.items.forEach(item => item.refresh());
    }

    changeObject.categoryId = this.category.categoryId;
    this.submitModal.emit($event);
  }

  /**
   * 级联属性变更
   * @param $event
   * @param parentPropertyID
   */
  _cascadeitemChanged($event, parentPropertyID) {
    if (!parentPropertyID) {
      return;
    }
    const { changeObject } = $event;
    if (!this.data[parentPropertyID]) {
      this.data[parentPropertyID] = {};
    }

    this.data[parentPropertyID][changeObject.propertyID] = changeObject.propertyValue;

    changeObject.categoryId = this.category.categoryId;
    changeObject.parentPropertyID = parentPropertyID;

    if (this.category.setPropertyRelates && typeof (this.category.setPropertyRelates) === 'function') {
      this.category.setPropertyRelates(changeObject, this.data);
      this.items.forEach(item => item.refresh());
    }
    this.valueChanged.emit(changeObject);
  }

  /**
   * 级联模态框属性变更
   * @param $event
   * @param parentPropertyID
   */
  __cascadeitemSubmitModal($event, parentPropertyID) {
    if (!parentPropertyID) {
      return;
    }
    const { changeObject, parameters } = $event;
    if (!this.data[parentPropertyID]) {
      this.data[parentPropertyID] = {};
    }

    this.data[parentPropertyID][changeObject.propertyID] = changeObject.propertyValue;

    changeObject.categoryId = this.category.categoryId;
    changeObject.parentPropertyID = parentPropertyID;

    if (this.category.setPropertyRelates && typeof (this.category.setPropertyRelates) === 'function') {
      this.category.setPropertyRelates(changeObject, this.data, parameters);
      this.items.forEach(item => item.refresh());
    }
    this.submitModal.emit($event);
  }
  /**
   * 级联属性的汇总信息
   * @param propItem
   * @param valueObject
   */
  _valueStringify(propItem, valueObject) {
    if (!propItem || !propItem.cascadeConfig || !valueObject) {
      return '';
    }
    if (!propItem.cascadeConverter || !propItem.cascadeConverter.convertTo) {
      return JSON.stringify(valueObject);
    }

    return propItem.cascadeConverter.convertTo(valueObject, propItem.cascadeConfig);


  }

  _checkCascadeVisible(propItem) {
    if (Object.keys(propItem).indexOf('visible') < 0) {
      return true;
    } else {
      return propItem.visible;
    }
  }
}
