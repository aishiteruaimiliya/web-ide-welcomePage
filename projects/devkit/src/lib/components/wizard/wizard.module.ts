import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from '@farris/ui-perfect-scrollbar';
import { WizardComponent } from './component/wizard.component';

@NgModule({
    declarations: [
        WizardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        PerfectScrollbarModule
    ],
    exports: [WizardComponent]
})
export class WizardModule {
    constructor() { }
}
