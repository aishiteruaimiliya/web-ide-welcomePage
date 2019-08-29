import {Type} from '@angular/core';

export interface IDisposable {
  dispose(subscriber: object): void;
}

export interface IEmitable {
  post(emitterType: Type<any>, tokenValue: string, eventName: string, eventArgs: any): void;

  on(target: string, tokenValue: string, eventName: string, handler: (value: any) => void, caller: object): IDisposable;

  once(target: string, tokenValue: string, eventName: string, handler: (value: any) => void, caller: object): IDisposable;
}
