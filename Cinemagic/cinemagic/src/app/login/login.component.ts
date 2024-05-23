// login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };

  loginFailed = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.user.email, this.user.password).subscribe(
      response => {
        if (response.status === 'success') {
          console.log('Login successful');
          this.router.navigate(['/home']);
        } else {
          console.log('Login failed');
          this.loginFailed = true;
        }
      },
      error => {
        console.log('Error during login:', error);
        this.loginFailed = true;
      }
    );
  }
}
