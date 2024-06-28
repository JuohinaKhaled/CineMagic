import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {strongPasswordValidator} from './strong-password.validator';
import {AuthService} from "../../services/auth/auth.service";
import {CustomSnackbarService} from "../../services/custom-snackbar/custom-snackbar.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackbarService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      password: ['', [Validators.required, Validators.minLength(8), strongPasswordValidator()]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = {
        Vorname: this.registerForm.value.firstName,
        Nachname: this.registerForm.value.lastName,
        Email: this.registerForm.value.email,
        Telefonnummer: this.registerForm.value.phoneNumber,
        Passwort: this.registerForm.value.password
      };

      this.authService.registerCustomer(formData).subscribe(
        response => {
          if (response.status === 'success') {
            this.snackBar.openSnackBar('Registration successful!');
            this.registerForm.reset();
            this.router.navigate(['/login']);
          } else {
            this.snackBar.openSnackBar(response.message);
          }
        },
        error => {
          console.error('Error during registration:', error);
          if (error.error && error.error.message) {
            this.snackBar.openSnackBar(error.error.message);
          } else {
            this.snackBar.openSnackBar('Registration failed!');
          }
        }
      );
    } else {
      this.snackBar.openSnackBar('Please fill all fields correctly.');
    }
  }

}
