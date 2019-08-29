import { Component, OnInit } from '@angular/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../login/services/auth.service';
import { CacheService } from '@farris/ide-devkit';

@Component({
  selector: 'app-ssologin',
  templateUrl: './ssologin.component.html',
  styleUrls: ['./ssologin.component.css']
})
export class SsologinComponent implements OnInit {

  constructor(private auth: AuthService,
    private router: Router,
    private cache: CacheService,
    private route: ActivatedRoute) { }

  token: any;//后期框架带token单点过来，然后当前su下边去验证token
  ssid: any;

  ngOnInit() {

    //单点过来以查询参数的形式获取
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      if (params.has('ssid')) {
        this.ssid = params.get('ssid');
        this.cache.set('sessionId', this.ssid);

        localStorage.setItem('sessionId', this.ssid);

        this.auth.LoginWithToken().subscribe(
          res => {
            if (res) {
              this.router.navigate(['home']);
            }
          },
          error => {
          });
      }
      else {
        this.router.navigate(['login']);
      }
    });
  }

}
