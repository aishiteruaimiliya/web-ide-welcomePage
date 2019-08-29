import { AuthGuard } from './auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadChildren: './login/login.module#LoginModule', data: { title: 'Login' } },
  { path: 'home', canActivate: [AuthGuard], loadChildren: './ide.module#IDEModule', data: { title: 'home' } },
  // { path: 'userinfo', loadChildren: ''}
  { path: 'ssologin', loadChildren: './ssologin/ssologin.module#SsologinModule', data: { title: 'SsoLogin' } },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, enableTracing: false})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
