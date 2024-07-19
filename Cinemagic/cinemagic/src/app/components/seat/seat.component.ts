import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.css'
})

export class SeatComponent {
  @Input() seat: any;
  @Input() canSelectMore = false;
  @Output() seatSelected = new EventEmitter<any>();

  isAccessible() {
    return this.seat.seatType === 'Accessible';
  }

  isPremium() {
    return this.seat.seatType === 'Premium';
  }

  isStandard() {
    return this.seat.seatType === 'Standard';
  }

  isOccupied() {
    return this.seat.bookingStatus === 'Occupied';
  }

  isSelected() {
    if (!this.isOccupied()) {
      if (this.canSelectMore) {
        this.seat.selected = !this.seat.selected;
        this.seatSelected.emit(this.seat);
      } else {
        this.seat.selected = false;
        this.seatSelected.emit(this.seat);
      }
    }
  }
}
