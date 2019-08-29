import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsologinComponent } from '../ssologin/component/ssologin/ssologin.component';
import { SsorouteModule } from './ssoroute.module';
import { LoginModule } from '../login/login.module';

@NgModule({
  imports: [
    CommonModule,
    SsorouteModule,
    LoginModule.forRoot()
  ],
  declarations: [SsologinComponent]
})
export class SsologinModule { }
