import {Injectable, Type} from '@angular/core';
import {EventBusProxy} from './event-bus-proxy';
import {IDisposable, IEmitable} from './types';
import {EventPipe} from './event-pipe';

@Injectable()
export class EventBus implements IEmitable {
  private proxyMap: Map<string, EventBusProxy>;
  private eventMap: Map<string, Array<EventPipe>>;

  constructor() {
    this.proxyMap = new Map<string, EventBusProxy>();
    this.eventMap = new Map<string, Array<EventPipe>>();
  }

  getProxy(ownerType: Type<any>, eventTokenValueProvider: () => any): EventBusProxy {
    const ownerName = ownerType.constructor.name;
    if (!this.proxyMap.has(ownerName)) {
      this.proxyMap.set(ownerName, new EventBusProxy(this, ownerType, eventTokenValueProvider));
    }
    return this.proxyMap.get(ownerName);
  }

  /**
   * 发送事件，通知订阅者接收消息。
   */
  post(emitterType: Type<any> | string, tokenValue: string, eventName: string, eventArgs: any): void {
    const eventPipeList = this.eventMap.get(eventName);
    if (!eventPipeList) {
      return;
    }

    if (!emitterType) {
      console.error('post方法的参数emitterType不能为空。');
      return;
    }
    let emitter: string;
    if (emitterType instanceof Type) {
      emitter = emitterType.name;
    } else {
      emitter = emitterType;
    }

    for (const eventPipe of eventPipeList) {
      if (eventPipe.matchEmitterToken(emitter, tokenValue)) {
        eventPipe.post(eventArgs);
        eventPipe.unSubscribeForOnce();
      }
    }
  }

  /**
   * 订阅事件
   */
  on(target: string, tokenValue: string, eventName: string, caller: object, handler: (value: any) => void): IDisposable {
    return this.getEventPipe(eventName, target, tokenValue).subscribe(handler, caller);
  }

  /**
   * 订阅一次。接收到一次消息之后自动取消订阅
   */
  once(target: string, tokenValue: string, eventName: string, caller: object, handler: (value: any) => void): IDisposable {
    return this.getEventPipe(eventName, target, tokenValue).subscribeOnce(handler, caller);
  }

  /**
   * 发送一个请求事件，获取监听者的响应并处理
   */
  requestFor(target: string, tokenValue: string, requestName: string, requestValue: any, success: (any) => any, fail?: (string) => any) {
    const eventPipe = this.findExistEventPipe(requestName, 'RequestSubject', tokenValue);
    if (eventPipe) {
      this.once(target, tokenValue, requestName, this, (response) => {
        if (response.status === 'success') {
          success(response.data);
        } else {
          if (fail) {
            fail('No target responser listening');
          }
        }
      });
      eventPipe.post({target, token: tokenValue, data: requestValue});
    } else {
      if (fail) {
        fail('No target responser listening.');
      }
    }
  }

  /**
   * 监听一个请求事件，给出响应
   */
  responseOn(responseSubject: string, requestName: string, callback: (any) => any) {
    this.on('RequestSubject', null, requestName, this, (requestObj) => {
      const response = {status: 'fail', data: null};
      if (responseSubject === requestObj.target) {
        response.data = callback(requestObj.data);
        response.status = 'success';
      }
      this.post(requestObj.target, requestObj.token, requestName, response);
    });
  }

  private getEventPipe(eventName: string, target: string, tokenValue: string) {
    let eventPipeList = this.eventMap.get(eventName);
    if (!eventPipeList) {
      eventPipeList = new Array<EventPipe>();
      this.eventMap.set(eventName, eventPipeList);
    }
    let eventPipe = eventPipeList.find(item => item.examByTargetToken(target, tokenValue));
    if (!eventPipe) {
      eventPipe = new EventPipe(eventName, tokenValue, target, eventPipeList);
    }
    return eventPipe;
  }

  private findExistEventPipe(eventName: string, target: string, tokenValue: string): EventPipe {
    const eventPipeList = this.eventMap.get(eventName);
    if (!eventPipeList) {
      return null;
    }
    // return eventPipeList.find(item => item.examByTargetToken(target, tokenValue));
    for (const eventPipe of eventPipeList) {
      if (eventPipe.matchEmitterToken(target, tokenValue)) {
        return eventPipe;
      }
    }
    return null;
  }
}

class RequestSubject {}
class DataClass {}
