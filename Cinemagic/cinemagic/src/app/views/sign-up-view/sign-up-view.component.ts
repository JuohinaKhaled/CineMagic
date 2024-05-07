import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sign-up-view',
  standalone: true,
  templateUrl: './sign-up-view.component.html',
  styleUrls: ['./sign-up-view.component.css'],
  imports: [
    FormsModule,
    RouterOutlet,
    RouterLink
  ]
})

export class SignUpViewComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';

  register() {
    const signupData = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password
    };

    if (this.password !== this.confirmPassword) {
      console.error('Die Passwörter stimmen nicht überein.');
      return;
    }



    console.log('Registrierungsdaten:', signupData);
  }
}
