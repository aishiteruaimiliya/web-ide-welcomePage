import { ComponentRef } from '@angular/core';

export class PackageView {
  protected element: ComponentRef<any>;

  constructor(serializedState: any) {

  }

  getElement() {
    return this.element;
  }

  /**
   * Returns an object that can be retrieved when package is activated.
   */
  serialize() { }

  destroy() {
  }
}
