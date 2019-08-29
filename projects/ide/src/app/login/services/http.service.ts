import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '@farris/ide-devkit';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpService {

  constructor(private http: HttpClient, private cache: CacheService) {
  }

  get(url: string) {
    return this.request('Get', url, this.setHeader({}));
  }

  post(url: string, body: any) {
    return this.request('Post', url, this.setHeader({body}));
  }
  put(url: string, body: any) {
    return this.request('Put', url, this.setHeader({body}));
  }
  delete(url: string, body: any) {
    return this.request('Delete', url, this.setHeader({body}));
  }
  patch(url: string, body: any) {
    return this.request('Patch', url, this.setHeader({body}));
  }

  setHeader(options: any){

    options.headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    };
    if (this.cache.exists('session') && this.cache.get('session')) {
      options.headers['SessionId'] = this.cache.get('session');
    }
    return options;
  }
  request(method: string, url: string, options: any) {
    if (options.body) {
      if (typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body);
      }
    }


    return this.http.request(method, url, options)
      .pipe(map((data) => {
        console.log(data);
        return data;
      }));
  }
}
