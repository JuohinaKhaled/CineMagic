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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.user.email, this.user.password).subscribe(
      response => {
        if (response) {
          console.log('Login successful');
          this.router.navigate(['/home']);
        } else {
          console.log('Login failed');
        }
      },
      error => {
        // Handle error
        console.log('Error during login:', error);
      }
    );
  }
}
