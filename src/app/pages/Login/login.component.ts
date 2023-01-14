import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {SessionService} from "../../shared/services/session.service";
import {AuthGuard} from "../../shared/guard/auth.guard";
import Swal from 'sweetalert2';
import {LoginField} from "../../models/login-field";
import {Token} from "../../models/login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class Login implements OnInit {
  title: string = "Login";
  loginForm!: FormGroup;
  field: typeof LoginField = LoginField;
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly sessionService: SessionService,
    private authGuard: AuthGuard
  ) {
  }

  buildForm(): void {
    this.loginForm = new FormGroup({
      [LoginField.EMAIL]: new FormControl('', [Validators.required, Validators.email]),
      [LoginField.PASSWORD]: new FormControl('', [Validators.required, Validators.minLength(4)]),
    })
  }

  ngOnInit(): void {
    this.buildForm();

    const authorize: boolean = (this.sessionService.get('token') !== null);
    if (authorize) {
      this.authGuard.isLoggedIn = true;
      this.router.navigateByUrl('dashboard').finally();
    }
  }

  onShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // console.log("cek data submit: ", this.loginForm.value);
    const payload = this.loginForm.value;
    this.isLoading = true;
    setTimeout(() => {
      const token: Token | null = this.authService.login(payload);
      if (token) {
        this.authGuard.isLoggedIn = true;
        this.isLoading = false;
        this.router.navigateByUrl('dashboard');
      } else {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Incorrect email or password',
        });
      }
    }, 3000);
  }

  isFieldValid(loginField: LoginField): string {
    const control: AbstractControl = this.loginForm.get(loginField) as AbstractControl;
    if (control && control.touched && control.invalid) {
      return 'is-invalid';
    } else if (control && control.valid) {
      return 'is-valid';
    } else {
      return '';
    }
  }
}
