import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'farris-modalFrame',
  template: `
    <iframe [src]="this.src|safeUrl" alt="Oppppppps! Cannot find the correct resource!" allowtransparency="true"
      style="position:relative;left:0;top:0;height:100%;width:100%"
    ></iframe>
  `,
  styles: [`
    iframe {
      height: 100%;
      width: 100%;
      border: none
    }
  `]
})
export class ModalFrameComponent implements OnInit {
  @Input() src: string;

  constructor() {}

  ngOnInit() {
  }

}
