import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'farris-panelFrame',
  template: `
    <iframe [src]="this.src|safeUrl" alt="Oppppppps! Cannot find the correct resource!" allowtransparency="true"
    ></iframe>
  `,
  styles: [`
    :host {
      // display: contents !important;
      // border: solid red 1px;
      height: 100%;
      width: 100%
    }
    iframe {
      height: 100%;
      width: 100%;
      // border: solid red 1px;
      border: none
    }
  `]
})
export class PanelFrameComponent implements OnInit {
  @Input() src: string;

  constructor() {}

  ngOnInit() {
  }
}
