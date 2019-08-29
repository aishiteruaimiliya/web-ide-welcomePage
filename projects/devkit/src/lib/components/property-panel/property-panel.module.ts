import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from '../popover/popover.module';
import { PropertyPanelComponent } from './components/property-panel/property-panel.component';
import { PropertyItemListComponent } from './components/property-item-list/property-item-list.component';
import { PropertyItemComponent } from './components/property-item/property-item.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FarrisDialogModule } from '@farris/ui-dialog';
import { FarrisPanelModule } from '@farris/ui-panel';
import { PerfectScrollbarModule } from '@farris/ui-perfect-scrollbar';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { NotifyModule } from '@farris/ui-notify';
@NgModule({
    declarations: [
        PropertyPanelComponent,
        PropertyItemListComponent,
        PropertyItemComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        PopoverModule/* .forRoot() */,
        PerfectScrollbarModule,
        InputsModule,
        DropDownsModule,
        FarrisDialogModule,
        DateInputsModule,
        FarrisPanelModule,
        NotifyModule.forRoot(),
    ],
    exports: [PropertyPanelComponent],
    entryComponents: [PropertyPanelComponent, PropertyItemComponent]
})
export class PropertyPanelModule {
    constructor() { }
}
