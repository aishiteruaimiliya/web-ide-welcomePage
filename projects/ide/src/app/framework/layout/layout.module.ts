import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularDraggableDirective } from '../directives/angular-draggable.directive';
import { AngularResizableDirective } from '../directives/angular-resizeable.directive';
import { AutoHeightDirective } from '../directives/auto_height.directive';
import { DynamicComponent } from '../directives/dynamic-component/dynamic-component.component';
import { NumberToArray } from '../directives/split/number-array.pipe';
import { PanelComponent } from '../directives/split/panel/panel.component';
import { SplitComponent } from '../directives/split/split.component';


import { TabsComponent } from '../directives/tabs';
import { WindowService } from '../services/window.service';
import { MainComponent } from './main/main.component';
import { PropertyPanelComponent } from './property-panel/property-panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarModule, BsDropdownModule } from '@farris/ide-devkit';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { TerminalComponent } from './terminal/terminal.component';
import { NavbarComponent } from './top-menu/navbar/navbar.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { PerfectScrollbarModule } from '@farris/ui-perfect-scrollbar';
import { ModalFrameComponent, PanelFrameComponent } from '../directives/iframe';
import { ModalPanelComponent } from './modal-panel/modal-panel.component';
import { FarrisCommonModule } from '@farris/ui-common';
// import { FarrisDialogModule } from '@farris/ui-dialog';
import { ModalModule } from '@farris/ui-modal';
import { SafeUrlPipe } from '../directives/iframe/safe-url.pipe';

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    NavbarModule,
    // FarrisCommonModule,
    ModalModule.forRoot()
  ],
  declarations: [
    TopMenuComponent,
    NavbarComponent,
    MainComponent,
    AutoHeightDirective,
    SidebarComponent,
    TerminalComponent,
    AngularDraggableDirective,
    AngularResizableDirective,
    PropertyPanelComponent,
    DynamicComponent,
    TabsComponent,
    ModalFrameComponent,
    PanelFrameComponent,
    NumberToArray,
    SplitComponent,
    PanelComponent,
    StatusBarComponent,
    ModalPanelComponent,
    SafeUrlPipe
  ],
  exports: [
    TopMenuComponent,
    MainComponent,
    AutoHeightDirective,
    StatusBarComponent,
    ModalPanelComponent
  ],
  providers: [
    WindowService
  ],
  // todo: entryComponent for test open tabs, remove it after metadata opened.
  entryComponents: [/* StatusBarComponent, TopMenuComponent */ModalFrameComponent]
})
export class LayoutModule {
}
