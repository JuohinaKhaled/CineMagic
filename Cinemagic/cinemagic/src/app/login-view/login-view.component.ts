import { Component, input, computed } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-login-view',
  standalone: true,
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css'],
  imports: [
    FormsModule,
    RouterOutlet
  ]
})
export class LoginViewComponent {
  username = input<string>();
  password = input<string>();


  login() {
    console.log("Username: ", this.username, "Password: ", this.password);
    // Login-Logik hier
  }
}
