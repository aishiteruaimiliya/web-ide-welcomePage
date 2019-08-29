import { AuthGuard } from './auth-guard.service';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CacheService, GSP, CacheModule, GSPHttpModule} from '@farris/ide-devkit';
import { NotifyModule } from '@farris/ui-notify';
import { MessagerModule } from '@farris/ui-messager';
import {HttpClientModule} from '@angular/common/http';
// import '@gsp-lcm/metadata-selector';

// 初始化全局gsp变量
(window as any).gsp = new GSP();

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MessagerModule.forRoot(),
    NotifyModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
    // CacheModule.forRoot()
  ],
  declarations: [AppComponent],
  providers: [
    { provide: CacheService, useValue: gsp.cache },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
