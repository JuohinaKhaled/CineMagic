  import {Component, EventEmitter, Input, Output} from '@angular/core';

  @Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
  })
  export class ModalComponent {
    @Input() title = '';
    @Input() message = '';
    @Input() isLoggedIn = false;
    @Input() currentRating = 0;
    @Input() modalType: 'confirmBooking' | 'cancelBooking' | 'warningMaxSeats' | 'rateMovie' | undefined;
    @Output() confirmBooking = new EventEmitter<void>();
    @Output() rate = new EventEmitter<number>();
    @Output() cancelEvent = new EventEmitter<void>();
    @Output() login = new EventEmitter<void>();
    @Output() register = new EventEmitter<void>();
    @Output() cancelBooking = new EventEmitter<void>();

    onCancel() {
      this.cancelEvent.emit();
    }

    onLogin() {
      this.login.emit();
    }

    onRegister() {
      this.register.emit();
    }

    onBooking() {
      this.confirmBooking.emit();
    }

    onCancelBooking() {
      this.cancelBooking.emit();
    }

    onRate(){
      this.rate.emit(this.currentRating);
    }

    onRatingUpdated(rating: number) {
      this.currentRating = rating;
    }
  }
