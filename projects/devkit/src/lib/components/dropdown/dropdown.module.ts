import {ModuleWithProviders, NgModule} from '@angular/core';
import {ComponentLoaderFactory} from '../utils/component-loader/index';

import {PositioningService} from '../utils/positioning/index';
import {BsDropdownContainerComponent} from './dropdown-container.component';
import {BsDropdownMenuDirective} from './dropdown-menu.directive';
import {BsDropdownToggleDirective} from './dropdown-toggle.directive';
import {BsDropdownConfig} from './dropdown.config';

import {BsDropdownDirective} from './dropdown.directive';
import {BsDropdownState} from './dropdown.state';
import {NavbarState} from '../navbar/navbar.state';
import { DropdownButtonDirective } from './dropdown-button.directive';
import { DropdownItemDirective } from './dropdown-item.directive';

@NgModule({
  declarations: [
    BsDropdownMenuDirective,
    BsDropdownToggleDirective,
    BsDropdownContainerComponent,
    BsDropdownDirective,
    DropdownButtonDirective,
    DropdownItemDirective
  ],
  exports: [
    BsDropdownMenuDirective,
    BsDropdownToggleDirective,
    BsDropdownDirective,
    DropdownButtonDirective,
    DropdownItemDirective
  ],
  entryComponents: [BsDropdownContainerComponent]
})
export class BsDropdownModule {
  public static forRoot(config?: any): ModuleWithProviders {
    return {
      ngModule: BsDropdownModule, providers: [
        ComponentLoaderFactory,
        PositioningService,
        BsDropdownState,
        {provide: BsDropdownConfig, useValue: config ? config : {autoClose: true}}
      ]
    };
  }
}
