import { Component, Input, Injector } from '@angular/core';
import { IdeMessager } from './ide-framework-impl/ide-messager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private injector: Injector) {
    const messager = this.injector.get(IdeMessager);
    gsp.ide.setMessager(messager);
  }
}
