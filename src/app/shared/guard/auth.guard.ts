import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isLoggedIn = false;
  constructor(private router: Router) {
  };

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    console.log('CanActivate called');
    if (this.isLoggedIn) {
      return true
    } else {
      this.router.navigate(['']);
    }
  }
}
