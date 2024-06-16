import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { strongPasswordValidator } from './strong-password.validator';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';

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
    private snackBar: MatSnackBar,
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
            this.openSnackBar('Registration successful!');
            this.registerForm.reset();
            this.router.navigate(['/login']);
          } else {
            this.openSnackBar(response.message);
          }
        },
        error => {
          console.error('Error during registration:', error);
          if (error.error && error.error.message) {
            this.openSnackBar(error.error.message);
          } else {
            this.openSnackBar('Registration failed!');
          }
        }
      );
    } else {
      this.openSnackBar('Please fill all fields correctly.');
    }
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
