import {
  AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild
} from '@angular/core';
import { Menu } from './menu';
import { NavbarDirective } from '@farris/ide-devkit';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit, OnDestroy {

  @ViewChild(NavbarDirective) navbar: NavbarDirective;
  @Input() menuConfig: Menu;
  @Output() clicked = new EventEmitter<string>();

  private itemClickSubscription: Subscription;

  constructor() { }

  ngAfterViewInit() {
    if (this.navbar) {
      this.itemClickSubscription = this.navbar.onItemClick.subscribe((command: string) => this.itemClick(command));
    }
  }

  ngOnDestroy() {
    this.itemClickSubscription.unsubscribe();
  }

  private itemClick(command: string): any {
    if (!command) {
      return false;
    }

    this.clicked.emit(command);
  }
}
