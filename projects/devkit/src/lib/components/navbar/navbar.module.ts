import { NgModule } from '@angular/core';
import { NavbarDirective } from './navbar.directive';
import { NavbarState } from './navbar.state';

@NgModule({
  declarations: [NavbarDirective],
  providers: [NavbarState],
  exports: [NavbarDirective]
})
export class NavbarModule { }
