// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Compiler, ComponentFactory, ComponentRef, Injectable, Injector, Type } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import { EventBus, EventBusProxy } from '../eventbus/index';
// import { GSPMetadataService } from './metadata.service';
// import { MetadataDto } from './metadata/metadatadto';
// import { IDesignerComponent } from '../ide-dev-kit';
// import { Util } from './util/util';
// import { BsModalRef, BsModalService } from '../components/modal';
// import { ModalPanel } from '../ide-dev-kit/modal-panel/modal-panel';
// import { PackageManager } from '../framework/services/package-manager';
// import { WorkspaceManager } from '../framework/services/workspace.manager';
// import { Tab } from '../framework/directives/tabs';
// import { IWorkspaceManager } from './workspace-manager';
//
// export enum Layout {
//   left, right, bottom
// }
//
// export interface PanelOptions {
//   id: string;
//   title: string;
//   item: Type<any>;
//   layout?: Layout;
//   autoFocus?: boolean;
//   priority?: number;
//   className?: string;
// }
//
// export interface PluginOptions {
//   id: string;
//   item: ComponentRef<any>;
//   visible?: boolean;
// }
//
// export interface PluginOptions2 {
//   id: string;
//   title: string;
//   url: string;
// }
//
// declare var lazyRequire: any;
//
// // @Injectable()
// export class Workspace {
//   panelChanged: BehaviorSubject<PanelOptions>;
//
//   private pluginConfig: Observable<any>;
//
//   // Tabs中展示的内容
//   private _leftTabs: any[] = [];
//   private _rightTabs: any[] = [];
//   private _bottomTabs: any[] = [];
//   private _mainTabs: any[] = [];
//   private _modalPanels: any[] = [];
//   private _appendPanels: any[] = []; // 临时展示元数据创建窗口
//
//   // packages
//   private _leftPackages = new Map<string, Package>();
//   private _rightPackages = new Map<string, Package>();
//   private _bottomPackages = new Map<string, Package>();
//   private _mainPackages = new Map<string, Package>();
//   // private _packages = new Map<Package, {id, title, data, componentRef?}>();
//   private _packages = new Map<string, { title, data, pkg, componentRef?}>();
//   private _pluginComponentFactories = new Map<Type<any>, ComponentFactory<any>>();
//
//   private eventBusProxy2: EventBusProxy2;
//
//   private fileTreeActivedNode: FileTreeNode;
//   // get fileTreeActivedNodePath() {
//   //   return this.fileTreeActivedNode && this.fileTreeActivedNode.pathField;
//   // }
//   // get fileTreeActivedNodeType() {
//   //   return this.fileTreeActivedNode && this.fileTreeActivedNode.fileTypeField;
//   // }
//
//   currentPath: {path, fileType};
//
//   get leftTabs() {
//     return this._leftTabs;
//   }
//
//   get rightTabs() {
//     return this._rightTabs;
//   }
//
//   get bottomTabs() {
//     return this._bottomTabs;
//   }
//
//   get mainTabs() {
//     return this._mainTabs;
//   }
//
//   get modalPanels() {
//     return this._modalPanels;
//   }
//
//   get appendPanels() {
//     return this._appendPanels;
//   }
//
//   get leftPackages() {
//     return this._leftPackages;
//   }
//
//
//   isLoading: boolean;
//
//   private configService: ConfigService;
//   private modalService: BsModalService;
//   private compiler: Compiler;
//
//   private metadataService: GSPMetadataService;
//   private packageManager: PackageManager;
//
//   constructor(private injector: Injector, private workspaceManager: IWorkspaceManager) {
//     this.configService = this.injector.get(ConfigService);
//     this.modalService = this.injector.get(BsModalService);
//     this.compiler = this.injector.get(Compiler);
//     this.metadataService = this.injector.get(GSPMetadataService);
//     this.packageManager = this.injector.get(PackageManager);
//
//     this.panelChanged = new BehaviorSubject<PanelOptions>(null);
//     // configService.getPluginsConfig();
//     // [EventBus使用]4.使用EventBus，执行订阅，以获取指定事件的已发送数据
//     this.eventBus.subscribeByEventName('FileTreeNodeActived', this, (activedFileTreeNode: FileTreeNode) => {
//       this.fileTreeActivedNode = activedFileTreeNode;
//       this.metadataService.selectPath = activedFileTreeNode && activedFileTreeNode.pathField;
//       this.metadataService.selectType = activedFileTreeNode && activedFileTreeNode.fileTypeField;
//     });
//
//     // this.eventBus.subscribeByEventName('newTsFile', this, () => this.openMetadata('abc'));
//     // 元数据或者文件夹删除
//     this.eventBus2.on(null, null, 'delete', this, () => this.metadataService.Delete());
//     // 元数据打包服务
//     this.eventBus2.on(null, null, 'pack', this, () => this.metadataService.Pack());
//     // 元数据新建
//     this.eventBus2.on(null, null, 'CreateMetadata', this, (data) => this.openMetadata(data));
//     // 选择业务对象
//     // this.eventBus2.on(null, null, 'SelectBO', this, () => this.openBOSelect());
//     this.eventBus2.on(null, null, 'selectBusinessObject', this, () => this.openModalPanel('businessObject'));
//
//     // [EventBus2使用]3.使用EventBus，执行订阅，以获取指定事件的已发送数据
//     this.eventBus2.on(null, null, 'FileTreeNodeDoubleClick', this,
//       (ativedFileTreeNode: FileTreeNode) => this.openSelectedMetadata(ativedFileTreeNode));
//     this.eventBus2.on(null, null, 'newFolder', this, () => this.openModalPanel('folderWizard'));
//     this.eventBus2.on(null, null, 'newGSProject', this, () => this.openModalPanel('gsprojectWizard'));
//     this.eventBus2.on(null, null, 'newMetadata', this, () => this.openModalPanel('metadataWizard'));
//     this.eventBus2.on(null, null, 'newProject', this, () => this.openModalPanel('newProjectWizard'));
//     this.eventBus2.on(null, null, 'newProjectImport', this, () => this.openModalPanel('importProjectWizard'));
//     this.eventBusProxy2 = this.eventBus2.getProxy(Workspace, () => this.constructor.name);
//   }
//
//   private getPathFromFileTreeNode(ativedFileTreeNode: FileTreeNode) {
//     this.fileTreeActivedNode = ativedFileTreeNode;
//     this.metadataService.selectPath = ativedFileTreeNode && ativedFileTreeNode.pathField;
//     this.metadataService.selectType = ativedFileTreeNode && ativedFileTreeNode.fileTypeField;
//   }
//
//   private openSelectedMetadata(ativedFileTreeNode: FileTreeNode) {
//     // this.getPathFromFileTreeNode(ativedFileTreeNode);
//     this.metadataService.Load().subscribe((data) => this.openMetadata(data));
//   }
//
//   addLeftPanel(options: PanelOptions) {
//     // const packageOptions = this._packages.get(options.id);
//     // const compRef = options.item;
//     // // if (<IDesignerComponent>compRef) {
//     // //   (<IDesignerComponent>compRef.instance).metadataContent = packageOptions.data;
//     // // }
//     // packageOptions.componentRef = compRef;
//     // this._leftTabs.push(packageOptions);
//
//     this._leftTabs.push({
//       id: options.id,
//       title: options.title,
//       content: options.item
//     });
//   }
//
//   setLeftPackage(id: string, pkg: Package) {
//     if (!this._leftPackages.get(id)) {
//       this._leftPackages.set(id, pkg);
//     }
//   }
//
//   addRightPanel(options: any) {
//     const packageOption = this._packages.get(options.id);
//     const compRef = options.item;
//     packageOption.componentRef = compRef;
//     this._rightTabs.push(packageOption);
//   }
//
//   addTopPanel(options: PanelOptions) { }
//
//   addBottomPanel(options: PanelOptions) {
//     this._bottomTabs.push({
//       id: options.id,
//       title: options.title,
//       content: options.item
//     });
//   }
//
//   addMainPanel(options: any) {
//     const packageOption = this._packages.get(options.id);
//     const compRef = options.item;
//     if ((<IDesignerComponent>compRef)) {
//       // (<IDesignerComponent>compRef.instance).metadataContent = packageOption.data;
//     }
//     packageOption.componentRef = compRef;
//     this._mainTabs.push(packageOption);
//     // this.eventBusProxy2.post('ActiveTabs', {area: 'main', index: this._mainTabs.length - 1});
//
//     // this.workspaceManager.setMainPanelContent(options.item);
//     this.workspaceManager.addMainTab(new Tab(options.id, options.title, options.item), true);
//
//   }
//
//   addMainPanel2(options: PluginOptions2) {
//     if (!this._mainTabs.find((item) => item.id === options.id)) {
//       this._mainTabs.push({
//         id: options.id,
//         title: options.title,
//         url: options.url
//       });
//     }
//   }
//
//   addModalPanel(options: any): ModalPanel {
//     const modalConfig = {
//       ignoreBackdropClick: true,
//       class: 'bs-modal-dialog'
//     };
//
//     const bsModalRef = this.modalService.show(options.item, modalConfig);
//     return new ModalPanel(bsModalRef);
//   }
//
//   addNavbar(options: any) {
//     this.workspaceManager.loadNavbar(options.item);
//   }
//
//   activePackage(pkg: Package) {
//
//   }
//
//   appendPanel2(content: Type<any>): ComponentRef<any> {
//
//     let contentRef;
//     const compFactory = this._pluginComponentFactories.get(content);
//     if (this.workspaceComponet && compFactory) {
//       contentRef = this.workspaceComponet.appendPanel(compFactory);
//     }
//
//     return contentRef;
//   }
//
//   appendPanel(componentRef: ComponentRef<any>) {
//     this.workspaceComponet.appendPanels.insert(componentRef.hostView);
//   }
//
//   clearAppendPanel() {
//     if (this.workspaceComponet) {
//       this.workspaceComponet.clearAppendPanel();
//     }
//
//   }
//   // 将插件的Package实例存储在Workspace中
//   setPackages(id: string, pkg: Package) {
//     if (!this._mainPackages.get(id)) {
//       this._mainPackages.set(id, pkg);
//     }
//   }
//
//   leftTabSelected(newIndex: number, currentIndex: number) {
//     let id = this._leftTabs[currentIndex].id;
//     let pkg = this._leftPackages.get(id);
//     if (pkg) {
//       pkg.deactivate();
//     }
//     id = this._leftTabs[newIndex].id;
//     pkg = this._leftPackages.get(id);
//     if (pkg) {
//       // todo: 获取缓存的PackageViewState
//       pkg.activate({});
//     }
//   }
//
//   mainTabSelected(newIndex: number, currentIndex: number) {
//     let id = this._mainTabs[currentIndex].id;
//     let pkg = this._mainPackages.get(id);
//     if (pkg) {
//       pkg.deactivate();
//     }
//     id = this._mainTabs[newIndex].id;
//     pkg = this._mainPackages.get(id);
//     if (pkg) {
//       // todo: 获取缓存的PackageViewState
//       pkg.activate({});
//     }
//   }
//
//   bottomTabSelected(newIndex: number, currentIndex: number) {
//     let id = this.bottomTabs[currentIndex].id;
//     let pkg = this._bottomPackages.get(id);
//     if (pkg) {
//       pkg.deactivate();
//     }
//     id = this.bottomTabs[newIndex].id;
//     pkg = this._bottomPackages.get(id);
//     if (pkg) {
//       // todo: 获取缓存的PackageViewState
//       pkg.activate({});
//     }
//   }
//
//   registerPresetPlugins(data: any) {
//     // 加载预设插件
//     for (const plugin in data) {
//
//     }
//   }
//
//   registerAsyncPlugin() {
//     this.configService.getPluginsConfig()
//       .subscribe((data: any) => {
//         this.registerPresetPlugins(data.presetPlugins);
//       });
//   }
//
//   // 打开主窗口页面。根据指定的id打开对应的插件面板。
//   openMainTab(id: string, pluginType: string, title: string, metadataContent: any) {
//     this.configService.getPluginsConfig().subscribe((data) => {
//       if (!data[pluginType]) {
//         throw new Error(`No Property '${id}' found in config json, please check plugins.json`);
//       }
//       const url = data[pluginType];
//       this._mainTabs.push({
//         id: id,
//         title: title,
//         url: url,
//         metadataContent: metadataContent
//       });
//       // todo: Tabs控件完成加载之后选定最后一个标签页
//     });
//
//
//   }
//
//   registerMetadataWizardPanel() {
//     this.configService.getPluginsConfig().subscribe((data) => {
//       if (!data['metadataWizard']) {
//         return;
//       }
//       // const metadataWizardUrl = data['metadataWizard'];
//       // const metadataOb = this.lazyLoad(metadataWizardUrl, 'newMetadata');
//       // this.isLoading = false;
//       const projectWizardUrl = data['projectWizard'];
//       const projectOb = this.lazyLoad(projectWizardUrl, 'newProject');
//       Promise.all([projectOb]).then(() => {
//         this.isLoading = false;
//       });
//     });
//   }
//
//   lazyLoad(url: string, openCommand: string): Promise<any> {
//     if (!url) {
//       return Promise.resolve();
//     }
//     let moduleName: string, exportName: string;
//     [moduleName, , exportName] = url.split('#');
//     // 如果未指定导出模块，默认使用default.
//     if (!exportName) {
//       exportName = 'default';
//     }
//     // 异步加载模块
//     return lazyRequire(url)
//       .then((module: any) => module[exportName])
//       // .then((type: any) => this.checkNotEmpty(type, moduleName, exportName))
//       .then((type: any) => {
//         const compiled = this.compiler.compileModuleAndAllComponentsSync(type);
//         const moduleInstance = compiled.ngModuleFactory.create(this.injector);
//         const pkg = (<PackageModule>moduleInstance.instance).getPackage();
//         pkg.id = moduleName;
//         // const componentType = pkg.getComponent();
//
//         // const compFactory = compiled.componentFactories.find((comp: ComponentFactory<any>) => comp.componentType === componentType);
//         // this._pluginComponentFactories.set(componentType, compFactory);
//         // let modalPanel = this.createMetadataModalPanel.create(this.injector);
//         // this.workspaceComponet.appendPanels.insert(modalPanel.hostView)
//         // let comRef = this.workspaceComponet.appendPanels.createComponent(this.createMetadataModalPanel);
//
//         this.eventBus.subscribeByEventName(openCommand, this, () => {
//           // pkg.activate({});
//         });
//         pkg.activate({});
//       });
//   }
//
//   openModalPanel(panelName: string, state?: any) {
//     this.isLoading = true;
//     this.configService.getPluginsConfig().subscribe((pluginConfig) => {
//       if (!pluginConfig[panelName]) {
//         return;
//       }
//
//       const pluginUrl = pluginConfig[panelName];
//       let moduleName: string, exportName: string;
//       [moduleName, , exportName] = pluginUrl.split('#');
//       // 如果未指定导出模块，默认使用default.
//       if (!exportName) {
//         exportName = 'default';
//       }
//       // 异步加载模块
//       lazyRequire(pluginUrl)
//         .then((module: any) => module[exportName])
//         // .then((type: any) => this.checkNotEmpty(type, moduleName, exportName))
//         .then((type: any) => {
//           const compiled = this.compiler.compileModuleAndAllComponentsSync(type);
//           const moduleInstance = compiled.ngModuleFactory.create(this.injector);
//           const pkg = (<PackageModule>moduleInstance.instance).getPackage();
//           pkg.id = moduleName;
//           pkg.data = panelName;
//           pkg.activate(state ? state : {});
//           this.isLoading = false;
//         });
//     });
//   }
//
//
//   // add by wang-xh
//   lazyLoadMenu(url: string): Promise<any> {
//     if (!url) {
//       return Promise.resolve();
//     }
//     let moduleName: string, exportName: string;
//     [moduleName, , exportName] = url.split('#');
//     // 如果未指定导出模块，默认使用default.
//     if (!exportName) {
//       exportName = 'default';
//     }
//     // 异步加载模块
//     return lazyRequire(url)
//       .then((module: any) => module[exportName])
//       // .then((type: any) => this.checkNotEmpty(type, moduleName, exportName))
//       .then((type: any) => {
//         const compiled = this.compiler.compileModuleAndAllComponentsSync(type);
//         const moduleInstance = compiled.ngModuleFactory.create(this.injector);
//         const pkg = (<PackageModule>moduleInstance.instance).getPackage();
//         pkg.id = moduleName;
//         const componentType = pkg.getComponent();
//         const compFactory = compiled.componentFactories.find((comp: ComponentFactory<any>) => comp.componentType === componentType);
//         this._pluginComponentFactories.set(componentType, compFactory);
//         pkg.activate({});
//       });
//   }
//
//
//   openMainAreaPlugin(url: string, data: any) {
//     if (!url) {
//       return Promise.resolve();
//     }
//
//     // tslint:disable-next-line:prefer-const
//     let [moduleName, moduleKey, exportName] = url.split('#');
//     // 如果未指定导出模块，默认使用default.
//     if (!exportName) {
//       exportName = 'default';
//     }
//     // 异步加载模块
//     return lazyRequire(url)
//       .then((module: any) => module[exportName])
//       .then((type: any) => {
//         const compiled = this.compiler.compileModuleAndAllComponentsSync(type);
//         const moduleInstance = compiled.ngModuleFactory.create(this.injector);
//         const pkg = (<PackageModule>moduleInstance.instance).getPackage();
//         pkg.id = moduleName;
//         const componentType = pkg.getComponent();
//         const compFactory = compiled.componentFactories.find((comp: ComponentFactory<any>) => comp.componentType === componentType);
//         this._pluginComponentFactories.set(componentType, compFactory);
//
//         pkg.activate({});
//       });
//   }
//
//
//   /*openMetadata(metadataId: string){
//     this.queryMetadata.getMetadataContent(metadataId).subscribe((data) => {
//       const metaType = data.type;
//       const pluginType = this.getPluginType(metaType);
//       this.openMainTab(metadataId, 'bizEntityDesigner', data.name, data);
//     });
//   }*/
//
//   private getPluginType(metaType: string) {
//     switch (metaType) {
//       case 'GSPBusinessEntity':
//         return 'bizEntityDesigner';
//       case 'UnifiedDataType':
//         return 'udtDesigner';
//       case 'API':
//         return 'sgDesigner';
//       default:
//         return metaType;
//     }
//   }
//
//   createID(): string {
//     // const guid = Guid.newGuid();
//     // guid.tobase
//     return '';
//   }
//
//   openMetadata(metadata: MetadataDto) {
//     const metaType = metadata.type;
//     const id = metadata.id;
//     const pluginType = this.getPluginType(metaType);
//
//     // 判断是否已经打开
//     // let index = 0;
//     // for (const item of this._mainTabs) {
//     //   if (item.id === id) {
//     //     this.eventBusProxy2.post('ActiveTabs', {area: 'main', index: index});
//     //     return;
//     //   }
//     //   ++index;
//     // }
//
//     if (this.workspaceManager.findAndSelectMainTab(id)) {
//       return;
//     }
//
//     this.configService.getPluginsConfig().subscribe((data) => {
//       if (!data[pluginType]) {
//         console.warn(`No Property '${pluginType}' found in config json, please check plugins.json`);
//         alert(`找不到'${metadata.name}'对应的设计器，无法打开。`);
//         return;
//       }
//       const url = data[pluginType];
//
//       if (!url) {
//         return Promise.resolve();
//       }
//
//       let [, , exportName] = url.split('#');
//       // 如果未指定导出模块，默认使用default.
//       if (!exportName) {
//         exportName = 'default';
//       }
//       // 异步加载模块
//       return lazyRequire(url)
//         .then((module: any) => module[exportName])
//         .then((type: any) => {
//           const compiled = this.compiler.compileModuleAndAllComponentsSync(type);
//           const moduleInstance = compiled.ngModuleFactory.create(this.injector);
//           const pkg = (<PackageModule>moduleInstance.instance).getPackage();
//           pkg.id = id;
//           pkg.data = metadata;
//           this._packages.set(id, { title: metadata.name, data: metadata, pkg: pkg});
//           this.packageManager.setPackage(pkg, {});
//           pkg.activate({});
//         });
//     });
//
//   }
//
//   openRightPanel(panelData: any) {
//     const metaType = panelData.type;
//     const id = panelData.id;
//     const pluginType = this.getPluginType(metaType);
//
//     // 判断是否已经打开
//     if (this._packages.get(id)) {
//       this.eventBusProxy2.post('propertyData', panelData.data);
//       return;
//     }
//
//     this.configService.getPluginsConfig().subscribe((data) => {
//       if (!data[pluginType]) {
//         throw new Error(`No Property '${pluginType}' found in config json, please check plugins.json`);
//       }
//       const url = data[pluginType];
//
//       if (!url) {
//         return Promise.resolve();
//       }
//
//       let [, , exportName] = url.split('#');
//       // 如果未指定导出模块，默认使用default.
//       if (!exportName) {
//         exportName = 'default';
//       }
//       // 异步加载模块
//       return lazyRequire(url)
//         .then((module: any) => module[exportName])
//         .then((type: any) => {
//           const compiled = this.compiler.compileModuleAndAllComponentsSync(type);
//           const moduleInstance = compiled.ngModuleFactory.create(this.injector);
//           const pkg = (<PackageModule>moduleInstance.instance).getPackage();
//           pkg.id = id;
//           this._packages.set(id, { title: panelData.name, data: panelData.data, pkg: pkg });
//
//           pkg.activate({});
//
//           // 发送属性配置、属性值
//           this.eventBusProxy2.post('propertyData', panelData.data);
//         });
//     });
//   }
// }
