import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpService } from './http.service';
import { CacheService } from '@farris/ide-devkit';


@Injectable()
export class AuthService {
  // tslint:disable: variable-name
  private API_PATH = '/api/runtime/sys/v1.0/Authentication/inspurId';

  private Api_Token = '/api/runtime/sys/v1.0/login-states/ExternalLoginWithToken';

  private Api_ClientSecurity = '/api/runtime/sys/v1.0/Authentication/InspurIDInfo';

  // private Api_UserLogin = '/api/runtime/sys/v1.0/login-states/UserLogin';
  private Api_UserLogin = '/api/runtime/sys/v1.0/UserLogin';

  // private Api_Language = '/api/runtime/sys/v1.0/login-infos?infoType=supportedLanguage';
  // private Api_Language = '/api/runtime/sys/v1.0/GetLoginInfo(infoType=\'supportedLanguage\',languageCode=\'\')';
  private Api_Language = '/api/runtime/sys/v1.0/loginInfo?infoType=supportedLanguage';

  // private Api_TenantList = '/api/runtime/sys/v1.0/login-infos?infoType=tenants';
  private Api_TenantList = '/api/runtime/sys/v1.0/GetLoginInfo(infoType=\'tenants\',languageCode=\'\')';

  // private Api_AutehTypeList = '/api/runtime/sys/v1.0/login-infos?infoType=authenTypes';
  private Api_AutehTypeList = '/api/runtime/sys/v1.0/GetLoginInfo(infoType=\'authenTypes\',languageCode=\'\')';

  // private Api_i18nTenant = '/api/runtime/sys/v1.0/login-infos?infoType=i18nTenants';
  // private Api_i18nTenant = '/api/runtime/sys/v1.0/GetLoginInfo';
  private Api_i18nTenant = '/api/runtime/sys/v1.0/loginInfo?infoType=i18nTenants';
  // tslint:enable: variable-name

  constructor(
    private http: HttpService,
    private cache: CacheService,
  ) {
    if (!environment.production) {
      // this.API_PATH = 'http://localhost:5000/api/runtime/sys/v1.0/login-states/ExternalLogin';
      // this.Api_UserLogin = 'http://localhost:5000/api/runtime/sys/v1.0/UserLogin';
      // this.API_PATH = 'http://localhost:5000/api/runtime/sys/v1.0/Authentication/inspurId';//认证登录分离模式
      // this.Api_Language = 'http://localhost:5000/api/runtime/sys/v1.0/GetLoginInfo(infoType=\'supportedLanguage\',languageCode=\'\')';
      // this.Api_Token = 'http://localhost:5000/api/runtime/sys/v1.0/login-states/ExternalLoginWithToken';
      // this.Api_TenantList = 'http://localhost:5000/api/runtime/sys/v1.0/GetLoginInfo(infoType=\'tenants\',languageCode=\'\')';
      // this.Api_AutehTypeList = 'http://localhost:5000/api/runtime/sys/v1.0/GetLoginInfo(infoType=\'authenTypes\',languageCode=\'\')';
      // this.Api_ClientSecurity = 'http://localhost:5000/api/runtime/sys/v1.0/Authentication/InspurIDInfo';
      // this.Api_i18nTenant = 'http://localhost:5000/api/runtime/sys/v1.0/GetLoginInfo';
    }
  }

  //二级域名不跳转的登录模式
  Login(body: any) {
      // 也可以根据环境变量，再开发环境下获取本地的JSON,跳过验证
      return this.http.post(this.Api_UserLogin, body).pipe(
        exhaustMap(v => {
          const sessionId = v['sessionId'];
          this.cache.set('sessionId', sessionId);
          this.cache.set('languageCode', v['lanCode']);

          // todo: 把sessionId放在了localStorage上面，需要在登出操作中清除掉。
          localStorage.setItem('sessionId', sessionId);

          return of(true);
            //.catch(error => of(error));
        })
      );
  }

  LoginWithToken() {
    return of(true);
  }

  GetSupportedLanguage() {
    return this.http.get(this.Api_Language);
  }
  GetTenantList() {
    return this.http.get(this.Api_TenantList);
  }

  GetAuthenTypeList() {
    return this.http.get(this.Api_AutehTypeList);
  }

  GetClientSecurity() {
      return this.http.get(this.Api_ClientSecurity);
  }

  Geti18nTenant(languagecode: string){
    const path = this.Api_i18nTenant + '&&languagecode=' + languagecode;
    // const path = this.Api_i18nTenant + '(infoType=\'i18nTenants\',languageCode=\'' + languagecode + '\')'
    return this.http.get(path);
  }
}
