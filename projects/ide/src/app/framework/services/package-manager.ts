import { Injectable } from '@angular/core';
import { Package } from '@farris/ide-devkit';



@Injectable()
export class PackageManager {

  private packages: Map<string, {pack: Package, state: Object}>;

  constructor() {
    this.packages = new Map();
  }

  activePackage(id: string) {
    const pkg = this.packages.get(id);
    if (pkg) {
      pkg.pack.activate(pkg.state);
    }
  }

  setPackage(pkg: Package, state: Object) {
    this.packages.set(pkg.id, {pack: pkg, state: state});
  }
}
