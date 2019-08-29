import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Messager } from '@farris/ide-devkit';
import { MessagerService } from '@farris/ui-messager';

@Injectable({
  providedIn: 'root'
})
export class IdeMessager extends Messager {
  constructor(private messager: MessagerService) {
    super();
  }

  info(message: string, callback?: () => void): void {
    this.messager.info(message, callback);
  }

  question(message: string, okCallback: () => void, cancelCallback?: () => void): void {
    this.messager.question(message, okCallback, cancelCallback);
  }

  confirm(message: string): Observable<boolean> {
    return this.messager.confirm(message);
  }

  error(message: string): void {
    this.messager.error(message);
  }

  warning(message: string): void {

  }
}
