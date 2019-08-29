// import { ConfigService } from '../plugin-center/config.service';
import { EventEmitter, Injectable, Injector, NgModuleFactory, Type, Compiler } from '@angular/core';
import { PackageModule, GSP } from '@farris/ide-devkit';
import { PluginCenter } from '../plugin-center/plugin-center';

declare var lazyRequire: any;

declare interface Window {
  gsp: GSP;
}

@Injectable()
export class WorkspaceManager {

  leftSidebarResize = new EventEmitter();
  private compiler: Compiler;

  constructor(private injector: Injector) {
    this.compiler = this.injector.get(Compiler);
  }

  initWorkspace() {
    // const configService = this.injector.get(ConfigService);
    // configService.getPluginsConfig().subscribe((data) => this.loadPlugin(data));
    
    const pluginCenter = this.injector.get(PluginCenter);
  }

  private loadPlugin(data) {
    // 先加载left面板
    if (data.left && data.left.length) {
      this.loadLeft(data.left);
    }

    return;
    for (const opener of data.openers) {
      this.activateLazyPackage(opener.url);
    }
    for (const panel of data.panels) {
      this.activateLazyPackage(panel.url);
    }
  }

  private loadLeft(leftPanels: any[]) {
    for (const panel of leftPanels) {
      gsp.workspace.getLeftDock().getActivePane().addItem({getTitle: () => panel.title, url: panel.url});
    }
  }
  //
  // setMainTabsComponent(tabs: TabsComponent) {
  //   this.mainTabsComponent = tabs;
  // }
  //
  // setMainPanelContent(compRef: ComponentRef<any>) {
  //   this.mainTabsComponent.setContent(compRef);
  // }
  //
  // addMainTab(tab: Tab, active: Boolean) {
  //   if (this.mainComponent) {
  //     this.mainComponent.addMainTab(tab, active);
  //   }
  // }
  //
  // findAndSelectMainTab(id: string) {
  //   return this.mainComponent.findAndSelectMainTab(id);
  // }
  //
  // loadNavbar(compRef: ComponentRef<any>) {
  //   this.topMenuComponent.navbarContent = compRef;
  // }

  private activateLazyPackage(url: string) {
    // this.loadLazyModule(url).then((moduleFactory: NgModuleFactory<any>) => { // AoT
    this.loadLazyModule(url).then((moduleType: Type<any>) => { // JIT
      const moduleFactory = this.compiler.compileModuleSync(moduleType);
      const moduleRef = moduleFactory.create(this.injector);
      const pkg = (<PackageModule>moduleRef.instance).getPackage(gsp);
      pkg.activate({});
    });
  }

  private loadLazyModule(url: string): Promise<any> {
    if (!url) {
      return Promise.reject('url为空，加载异步模块失败');
    }

    let [, , exportName] = url.split('#');
    // 如果未指定导出模块，默认使用default.
    if (!exportName) {
      exportName = 'default';
    }
    // 异步加载模块
    return lazyRequire(url)
      .then((module: any) => module[exportName]);
  }
}
