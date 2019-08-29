import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { ComponentLoaderFactory } from '../utils/component-loader';
// import { PositioningService } from '../utils/positioning';
import { PopoverConfig } from './popover.config';
import { PopoverDirective } from './popover.directive';
import { PopoverContainerComponent } from './popover-container.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PopoverDirective, PopoverContainerComponent],
  exports: [PopoverDirective],
  // providers: [PopoverConfig, ComponentLoaderFactory, PositioningService],
  entryComponents: [PopoverContainerComponent]
})
export class PopoverModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PopoverModule,
      providers: [PopoverConfig]
    };
  }
}
