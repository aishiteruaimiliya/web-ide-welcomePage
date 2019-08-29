import { Type } from '@angular/core';
import { GSP } from '../gsp/gsp';
import { PackageView } from './package-view';

export class Package {
  protected packageView: PackageView;
  // leftPanel: any;
  // modelPanel: any;
  protected subscriptions: any = [];
  protected packageId: string;
  public data: any;

  get id(): string {
    return this.packageId;
  }
  set id(value: string) {
    this.packageId = value;
  }

  get view(): PackageView {
    return this.packageView;
  }

  constructor(protected gsp: GSP) {
    this.packageId = gsp.util.newGuid();
  }

  activate(state) {
    this.packageView = new PackageView(state.sagipackageViewState);
    // /*this.leftPanel = */this.ws.addLeftPanel({
    //   title: 'test',
    //   item: this.packageView.getComponent(),
    //   visible: false
    // });
  }

  initialize() { }

  deactivate() {
    this.packageView.destroy();
  }

  serialize(): any {
    return {
      sagipackageViewState: this.packageView.serialize()
    };
  }

  toggle() {
    // return (
    //   this.modelPanel.isVisible() ?
    //     this.modelPanel.hide() :
    //     this.modelPanel.show()
    // );
  }

  getComponent(): Type<any> {
    return null;
  }
}
