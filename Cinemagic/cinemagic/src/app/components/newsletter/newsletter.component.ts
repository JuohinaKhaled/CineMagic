import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CustomSnackbarComponent} from '../custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent {
  newsletterForm: FormGroup;
  isRegistered = false;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      consent: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (!this.isRegistered) {
      this.register();
    } else {
      this.unregister();
    }
  }

  register(): void {
    if (this.newsletterForm.valid) {
      this.isRegistered = true;
      const formData = this.newsletterForm.value;
      this.showNotification('Successfully signed up for the newsletter!', 'success');
      console.log('Newsletter Registration:', formData);
      this.newsletterForm.controls['consent'].setValue(false);
      this.newsletterForm.controls['consent'].disable();
    } else {
      if (!this.newsletterForm.controls['consent'].value) {
        this.showNotification('Agree to terms first', 'error');
      } else if (!this.newsletterForm.controls['email'].valid) {
        this.showNotification('Wrong email format', 'error');
      }
    }
  }

  unregister(): void {
    this.isRegistered = false;
    this.newsletterForm.reset();
    this.newsletterForm.controls['consent'].enable();
    this.showNotification('Successfully unsubscribed from the newsletter!', 'success');
  }

  showNotification(message: string, type: string): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {message},
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [type === 'success' ? 'snackbar-success' : 'snackbar-error']
    });
  }

}
