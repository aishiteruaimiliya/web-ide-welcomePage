import { Component, ComponentRef, Input, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Menu } from './navbar/menu';
import { menus } from './navbar/navbarConfigMock';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {

  @ViewChild(NavbarComponent) private navbarComp: NavbarComponent;

  @Input() navbarContent: ComponentRef<any>;
  public menuConfig: Menu = {items: []};
  public navbarClicked: EventEmitter<any>;

  constructor() {
    this.menuConfig = {items: menus.menu};
  }

  ngOnInit() {
    this.navbarClicked = this.navbarComp.clicked;
  }
}
