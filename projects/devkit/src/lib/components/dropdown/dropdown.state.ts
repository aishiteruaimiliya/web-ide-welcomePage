import {ElementRef, EventEmitter, Injectable} from '@angular/core';
import { BsComponentRef } from '../utils/component-loader/bs-component-ref.class';

@Injectable()
export class BsDropdownState {
  direction: 'down' | 'up' = 'down';
  autoClose: boolean;
  isOpenChange = new EventEmitter<boolean>();
  isDisabledChange = new EventEmitter<boolean>();
  toggleClick = new EventEmitter<boolean>();
  onHover = new EventEmitter<any>();
  onClick = new EventEmitter<Event>();

  /**
   * Content to be displayed as popover.
   */
   dropdownMenu: Promise<BsComponentRef<any>>;
   resolveDropdownMenu: (componentRef: BsComponentRef<any>) => void;

   constructor() {
     this.dropdownMenu = new Promise((resolve) => {
       this.resolveDropdownMenu = resolve;
     });
   }
 }
