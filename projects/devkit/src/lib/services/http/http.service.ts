import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../cache/services/cache.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService {

  constructor(private http: HttpClient, private cache: CacheService) {
  }

  get(url: string): Observable<any> {
    return this.request('Get', url, this.setHeader({}));
  }

  post(url: string, body: any): Observable<any> {
    return this.request('Post', url, this.setHeader({body}));
  }
  put(url: string, body: any): Observable<any> {
    return this.request('Put', url, this.setHeader({body}));
  }
  delete(url: string, body: any): Observable<any> {
    return this.request('Delete', url, this.setHeader({body}));
  }
  patch(url: string, body: any): Observable<any> {
    return this.request('Patch', url, this.setHeader({body}));
  }

  setHeader(options: any) {

    options.headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    };
    if (this.cache.exists('sessionId') && this.cache.get('sessionId')) {
      options.headers['SessionId'] = this.cache.get('sessionId');
    }
    return options;
  }
  request(method: string, url: string, options: any): Observable<any> {
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
