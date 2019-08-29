import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbNavTabset, NgbNavTab, NgbNavTabContent, NgbNavTabTitle, NgbNavTabChangeEvent} from './navtab';
import {NgbNavTabsetConfig} from './navtab-config';

export {NgbNavTabset, NgbNavTab, NgbNavTabContent, NgbNavTabTitle, NgbNavTabChangeEvent} from './navtab';
export {NgbNavTabsetConfig} from './navtab-config';

const NGB_TABSET_DIRECTIVES = [NgbNavTabset, NgbNavTab, NgbNavTabContent, NgbNavTabTitle];

@NgModule({declarations: NGB_TABSET_DIRECTIVES, exports: NGB_TABSET_DIRECTIVES, imports: [CommonModule]})
export class NgbNavTabsetModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbNavTabsetModule, providers: [NgbNavTabsetConfig]}; }
}
