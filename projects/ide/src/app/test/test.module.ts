import { ContentContainerComponent } from './content-container/content-container.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ContentContainerComponent],
  exports: [ContentContainerComponent],
  entryComponents: [ContentContainerComponent]
})
export class TestModule {

}
