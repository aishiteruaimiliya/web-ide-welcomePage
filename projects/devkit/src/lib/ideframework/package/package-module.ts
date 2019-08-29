import { GSP } from '../gsp/gsp';
import { Package } from './package';


export class PackageModule {

  protected package: Package;

  constructor() {

  }

  getPackage(gsp: GSP) {
    if (!this.package) {
      this.initPackage(gsp);
      // ng7升级后，插件包是iframe的形式，初始化方式改变。
      if (this.package) {
        this.package.initialize();
      }
    }
    return this.package;
  }

  protected initPackage(gsp: GSP) {
    this.package = new Package(gsp);
  }
}
