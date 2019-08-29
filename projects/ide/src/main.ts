import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { GSP } from '@farris/ide-devkit';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

/**
 * 下面 declare 只是告诉ts编译器，已经定义了一个全局的变量名为gsp，在编译时不会报错。
 * 编译之后的es代码里面没有这块内容，而编译出的es代码是strict模式，全局变量不能直接用，必须window.gsp
 * 也就是appmodule下(window as any).gsp = new GSP();
 */
declare global {
  var gsp: GSP;
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
