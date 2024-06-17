import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() isLoggedIn = false;
  @Input() modalType: 'confirmation' | 'information' | 'warning' = 'information';
  @Output() booking = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() login = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();

  onLogin() {
    this.login.emit();
  }

  onRegister() {
    this.register.emit();
  }

  onBooking() {
    this.booking.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

}
