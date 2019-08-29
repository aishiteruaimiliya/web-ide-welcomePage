import { ComponentRef } from '@angular/core';

export class Tab {

  id: string;

  /** 标题 */
  title: string;
  /** 需要加载的组件实例 */
  compRef: ComponentRef<any>;
  componentName: any;
  /** 是否为当前tab */
  active: boolean | undefined;
  /** 是否启用关闭功能 */
  removable = true;
  /** 对应工作空间中的item */
  item: any;

  constructor(id, title, compRef, removable = true) {
    this.title = title;
    this.compRef = compRef;
    this.removable = removable;
    this.id = id;
  }

  /** 根据标题的后缀获取对应的图标 */
  get icon(): string {
    if (this.title) {
      if (this.title.split('.').length > 1) {
        const ext = this.title.split('.')[1];
        return ext;
      }
    }

    return 'file';
  }

  get elementUrl(): string {
    return this.item ? this.item.elementUrl : null;
  }
}
