import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login-view',
  standalone: true,
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css'],
  imports: [
    FormsModule,
    RouterOutlet,
    RouterLink
  ]
})
export class LoginViewComponent {
  email: string = '';
  password: string = '';

  login() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    console.log('Login-Daten:', loginData);
  }
}
