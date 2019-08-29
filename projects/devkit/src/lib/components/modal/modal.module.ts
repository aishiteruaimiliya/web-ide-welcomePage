import { NgModule, ModuleWithProviders } from '@angular/core';

import { ModalBackdropComponent } from './modal-backdrop.component';
import { ModalDirective } from './modal.directive';
import { PositioningService } from '../utils/positioning/index';
import { ComponentLoaderFactory } from '../utils/component-loader/index';
import { ModalContainerComponent } from './modal-container.component';
import { BsModalService } from './bs-modal.service';

@NgModule({
  declarations: [
    ModalBackdropComponent,
    ModalDirective,
    ModalContainerComponent
  ],
  exports: [ModalBackdropComponent, ModalDirective],
  entryComponents: [ModalBackdropComponent, ModalContainerComponent]
})
export class ModalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ModalModule,
      providers: [BsModalService, ComponentLoaderFactory, PositioningService]
    };
  }
}
