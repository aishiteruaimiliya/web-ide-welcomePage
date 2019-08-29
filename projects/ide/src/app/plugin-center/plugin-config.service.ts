import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class PluginConfigService {
  private pluginConfig = new ReplaySubject();
  constructor(private http: HttpClient) {
    const url = environment.SERVER_IP + '/api/dev/main/v1.0/getpluginconfig';
    this.http.get(url).subscribe((data) => {
      this.pluginConfig.next(data);
    });
  }

  getConfig(): Observable<object> {
    return this.pluginConfig;
  }
}
