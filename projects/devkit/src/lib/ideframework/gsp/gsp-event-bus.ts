import { EventBus, IDisposable } from '../eventbus';
import { Observable, of } from 'rxjs';
import { Type } from '@angular/core';

export class GspEventBus extends EventBus {
  private commands: any[] = [];

  on(target: string, tokenValue: string, eventName: string, caller: object, handler: (value: any) => void) {
    // 如果有对应激活命令，监听事件时立即执行回调函数
    const command = this.commands.find(item => item.name === eventName);
    if (command) {
      handler.call(caller, command.eventeParams);
    }
    return super.on(target, tokenValue, eventName, caller, handler);
  }

  post(emitterType: Type<any> | string, tokenValue: string, eventName: string, eventArgs: any): void {
    this.dispatchCommand(eventName, eventArgs);
    super.post(emitterType, tokenValue, eventName, eventArgs);
  }

  registryActivateCommand(commandName: string, plugin: any, activateFn: (arg0: any) => void) {
    this.commands.push({
      name: commandName,
      plugin,
      activateFn
    });
  }

  private dispatchCommand(commandName: string, args: any) {
    const command = this.commands.find(item => item.name === commandName);
    if (command) {
      command.activateFn(command.plugin);
      command.eventParams = args;
    }
  }
}
