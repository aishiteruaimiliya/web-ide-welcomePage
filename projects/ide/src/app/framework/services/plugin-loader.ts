import { Injectable, ComponentFactoryResolver, Injector } from '@angular/core';
import { GSP } from '@farris/ide-devkit';

export class PluginLoader {
  private cfr: ComponentFactoryResolver;

  constructor(
    private injector: Injector
  ) {
    this.cfr = injector.get(ComponentFactoryResolver);
  }

  loadSidebar() {
    // const fileTreePanelPackage = new FileTreePanelPackage(this.gsp, this.cfr, this.injector);
    // fileTreePanelPackage.activate({});

    // const controlTreePanelPackage = new ControlTreePanelPackage(this.workspace, 'controlTreePanelPackage');
    // controlTreePanelPackage.activate({});

    // let toolboxPackage = new ControlToolboxPackage(this.workspace);
    // // this.leftTabs.push(toolboxPackage);
    // toolboxPackage.activate({});

    // const gitpanelPackage = new GitPanelPackage(this.workspace, this.cfr, this.injector);
    // gitpanelPackage.id = 'gitpanelPackage';
    // gitpanelPackage.activate({});
  }

  loadNavbar() {
    // const navbarPackage = new NavbarPackage(this.gsp, this.cfr, this.injector);
    // navbarPackage.id = 'navbarPackage';
    // navbarPackage.activate({});
  }

  foo() { }
}
