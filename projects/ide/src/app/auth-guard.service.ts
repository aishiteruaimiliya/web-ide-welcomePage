import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { CacheService } from '@farris/ide-devkit';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private cache: CacheService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const sessionId = this.cache.get('sessionId');
    if (sessionId) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
