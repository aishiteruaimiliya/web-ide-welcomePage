import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SsologinComponent } from './component/ssologin/ssologin.component';

const routes: Routes = [
  { path: 'token/:id', component: SsologinComponent},
  { path: '', component: SsologinComponent},
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class SsorouteModule { }
