import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}
  get usernameControl() {
    return this.form.get('username');
  }

  get passwordControl() {
    return this.form.get('password');
  }
  ngOnInit(): void {
    
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  signIn() {
    if (this.form.invalid) {
      return;
    }

    this.authService.signIn(this.form.value).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        localStorage.setItem('userconnect', JSON.stringify(response));
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshtoken', response.refreshToken);
        localStorage.setItem('state', '0');

        const userConnect = localStorage.getItem("userconnect");

        if (userConnect) {
          const user = JSON.parse(userConnect);
          const roles = user.roles;

          if (roles) {
            console.log('User roles:', roles);

            if (roles.includes('ROLE_ADMIN')) {
              window.location.href = 'http://localhost:4200/home';
            } else {
              this.router.navigateByUrl('/home');
            }
          }
        }

        this.form.reset();
      },
      error => {
        console.error('Login failed:', error);
      }
    );
  }
}
