import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';
import {AuthService} from "../../services/auth/auth.service";
import {BookingService} from "../../services/booking/booking.service";

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

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    this.authService.login(this.user.email, this.user.password).subscribe(
      response => {
        if (response.status === 'success') {
          console.log('Login successful');
          this.openSnackBar('Login successful!');
        } else {
          console.log('Login failed');
          this.openSnackBar('Login failed. Please check your credentials.');
          this.loginFailed = true;
        }
      },
      error => {
        console.log('Error during login:', error);
        this.openSnackBar('An error occurred during login. Please try again.');
        this.loginFailed = true;
      }
    );
  }

  openSnackBar(message: string) {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: { message: message },
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'custom-snackbar'
    });
  }
}
