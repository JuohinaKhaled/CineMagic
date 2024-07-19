import {Component} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {CustomSnackbarService} from "../../services/custom-snackbar/custom-snackbar.service";

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
    private snackBar: CustomSnackbarService
  ) {
  }

  onSubmit() {
    this.authService.login(this.user.email, this.user.password).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            console.log('Login_Component: Login successful');
            this.snackBar.openSnackBar('Login successful!');
          } else {
            console.error('Login_Component: Login failed');
            this.snackBar.openSnackBar('Login failed. Please check your credentials.');
            this.loginFailed = true;
          }
        },
        error: (err) => {
          console.error('Login_Component: Error during login: ', err);
          this.snackBar.openSnackBar('An error occurred during login. Please try again.');
          this.loginFailed = true;
        }
      }
    );
  }

}
