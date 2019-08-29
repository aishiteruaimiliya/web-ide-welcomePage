import {Injectable} from '@angular/core';

@Injectable()
export class Util {
  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // tslint:disable: no-bitwise
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * 向url添加QueryParam
   * @param url 原始url
   * @param paramName 参数名
   * @param paramValue 参数值
   * @param override 是否覆盖。为True时，如果参数已存在，将覆盖已有参数，否则放弃处理。默认为False。
   */
  setUrlParam(url: string, paramName: string, paramValue: string, override?: boolean) {
    const [path, search] = url.split('?');
    const params = new URLSearchParams(search);
    if (params.has(paramName) && !override) {
      return url;
    }

    params.set(paramName, paramValue);
    return path + '?' + params.toString();
  }
}
