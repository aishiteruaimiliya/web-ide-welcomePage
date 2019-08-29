import {Injectable} from '@angular/core';

/**
 * Configuration service for the NgbNavTabset component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tabsets used in the application.
 */
@Injectable()
export class NgbNavTabsetConfig {
  justify: 'start' | 'center' | 'end' | 'fill' | 'justified' = 'start';
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  type: 'tabs' | 'pills' = 'tabs';
}
