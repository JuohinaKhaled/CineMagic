import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomSnackbarService } from '../../services/custom-snackbar/custom-snackbar.service';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.component.html',
  styleUrls: ['./my-data.component.css']
})
export class MyDataComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  customerID: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: CustomSnackbarService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phoneNumber: [''],
      password: ['']
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.populateUserData();
  }

  populateUserData() {
    this.customerID = this.authService.getCustomerID();
    if (this.customerID !== null) {
      this.profileForm.patchValue({
        firstName: this.authService.getCustomerName()?.split(' ')[0] || '',
        lastName: this.authService.getCustomerName()?.split(' ')[1] || '',
        email: this.authService.getCustomerEmail(),
        phoneNumber: this.authService.getCustomerPhoneNumber(),
        password: '********' // Placeholder for password
      });
      this.profileForm.get('email')?.disable(); // Disable email field
    }
  }

  onSave(): void {
    if (this.profileForm.valid) {
      const updateData = {
        customerID: this.customerID,
        Vorname: this.profileForm.value.firstName,
        Nachname: this.profileForm.value.lastName,
        Email: this.profileForm.value.email,
        Telefonnummer: this.profileForm.value.phoneNumber,
      };

      this.userService.updateUserData(updateData).pipe(
        tap(response => {
          this.snackBar.openSnackBar('Changes have been successfully saved');
        }),
        catchError(err => {
          console.error('Error updating profile:', err);
          this.snackBar.openSnackBar('Error updating profile. Please try again.');
          return of(null);
        })
      ).subscribe();
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value;
      if (newPassword === confirmPassword) {
        this.userService.changePassword({
          customerID: this.customerID,
          oldPassword: this.passwordForm.value.oldPassword,
          newPassword
        }).pipe(
          tap(response => {
            this.snackBar.openSnackBar('Password changed successfully');
            this.passwordForm.reset();
          }),
          catchError(err => {
            console.error('Error changing password:', err);
            this.snackBar.openSnackBar('Error changing password. Please try again.');
            return of(null);
          })
        ).subscribe();
      } else {
        this.snackBar.openSnackBar('Passwords do not match');
      }
    }
  }
}
