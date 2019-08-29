import { Observable } from 'rxjs';

export class Messager {
  info(message: string, callback?: () => void): void {

  }

  question(message: string, okCallback: () => void, cancelCallback?: () => void): void {

  }

  confirm(message: string): Observable<boolean> {
    return null;
  }

  error(message: string): void {

  }

  warning(message: string): void {

  }
}
