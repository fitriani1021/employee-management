import {Injectable} from "@angular/core";
import {Login, Token} from "../models/login";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {SessionService} from "../shared/services/session.service";
import {AuthGuard} from "../shared/guard/auth.guard";

const AUTH_KEY = 'token';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly router: Router,
    private authGuard: AuthGuard
  ) {
  }

  login(payload: Login): Token | null {
    const {email, password} = payload;
    if (email === 'admin@admin.com' && password === 'admin') {
      const token: Token = {token: 'this is token'};
      this.sessionService.set(AUTH_KEY, JSON.stringify(token));
      return token;
    } else {
      return null;
    }
  }

  logout() {
    Swal.fire({
      title: 'Are you sure want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sessionService.remove('token');
        this.authGuard.isLoggedIn = false;
        this.router.navigateByUrl('login');
      }
    })
  }
}
