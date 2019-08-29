import { ModuleWithProviders, NgModule } from '@angular/core';
import { SashDirective } from './sash.directive';

@NgModule({
  declarations: [
    SashDirective
  ],
  exports: [
    SashDirective
  ]
})
export class PanelModule {
  public static forRoot(config?: any): ModuleWithProviders {
    return {
      ngModule: PanelModule
    };
  }
}
