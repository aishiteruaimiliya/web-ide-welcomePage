import { Component, OnInit, Input } from '@angular/core';
import { SplitComponent } from '../split.component';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  @Input() title: string;
  @Input() height: number;
  @Input() width: number;

  @Input() direction: string;

  constructor() { }

  ngOnInit() {
  }

  onMoving(pos: any) {

  }

}
