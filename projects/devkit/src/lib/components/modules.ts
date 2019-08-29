import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BsDropdownModule } from './dropdown';
import { NgbTabsetModule, NgbTabChangeEvent } from './tabset/tabset.module';
import { NgbNavTabsetModule, NgbNavTabChangeEvent } from './navtab/navtab.module';
import { NgbAccordionModule } from './accordion/accordion.module';
import { PanelModule } from './panel/panel.module';

const MODULES = [
  BsDropdownModule
];

const NGB_MODULES = [
  NgbTabsetModule,
  NgbNavTabsetModule,
  NgbAccordionModule
];

const IDE_MODULES = [
  PanelModule
];

// @NgModule({
//   imports: [
//     BsDropdownModule.forRoot()
//   ],
//   exports: [BsDropdownModule],
//   schemas: [NO_ERRORS_SCHEMA]
// })
// export class MDBRootModule {
// }

// @NgModule({ exports: [BsDropdownModule] })
// export class MDBBootstrapModule {
//   public static forRoot(): ModuleWithProviders {
//     return { ngModule: MDBRootModule };
//   }
// }

@NgModule({
  imports: [
    NgbTabsetModule.forRoot(),
    NgbNavTabsetModule.forRoot(),
    NgbAccordionModule.forRoot()
  ],
  exports: [
    NGB_MODULES
  ]
})
export class NgbRootModule {
}

@NgModule({})
export class NgbModule {
  static forRoot(): ModuleWithProviders { return { ngModule: NgbRootModule }; }
}

@NgModule({
  imports: [
    PanelModule.forRoot()
  ]
})
export class IDERootModule {
}

// @NgModule({ imports: IDE_MODULES, exports: IDE_MODULES })
// export class IDEModule {
//   static forRoot(): ModuleWithProviders { return { ngModule: IDERootModule }; }
// }