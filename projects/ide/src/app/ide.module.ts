import { TestModule } from './test/test.module';
import { environment } from './../environments/environment';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { PackageManager } from './framework/services/package-manager';
import { ModalModule } from '@farris/ide-devkit';
import { LoadingModule } from '@farris/ui-loading';
import { WorkspaceComponent } from './workspace/workspace.component';
import { PluginConfigService } from './plugin-center/plugin-config.service';
import { GridModule } from '@progress/kendo-angular-grid';
import { WorkspaceManager } from './workspace/workspace.manager';
import { LayoutModule as IDELayoutModule } from './framework/layout/layout.module';
import { FarrisDialogModule } from '@farris/ui-dialog';
import { IDERootingModule } from './ide.routes';
// import { GSPMetadataServiceModule } from '@gsp-lcm/metadata-selector';
import { PluginCenter } from './plugin-center/plugin-center';
// const monacoConfig: NgxMonacoEditorConfig = {
//   baseUrl: 'assets',
//   defaultOptions: { scrollBeyondLastLine: false },
//   onMonacoLoad: () => { console.log((<any>window).monaco); }
// };

const ip = environment.SERVER_IP;

@NgModule({
  declarations: [
    WorkspaceComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    LayoutModule,
    ModalModule.forRoot(),
    GridModule,
    IDELayoutModule,
    // CacheModule.forRoot(),
    LoadingModule.forRoot(),
    FarrisDialogModule,
    IDERootingModule,
    // GSPMetadataServiceModule.forRoot(ip),
    TestModule
  ],
  providers: [
    PluginConfigService,
    PluginCenter,
    HttpClient,
    PackageManager,
    WorkspaceManager
  ],
  bootstrap: [WorkspaceComponent],
  entryComponents: []
})
export class IDEModule { }
