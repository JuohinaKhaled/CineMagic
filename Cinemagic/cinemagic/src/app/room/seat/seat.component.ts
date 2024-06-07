import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.css'
})
export class SeatComponent {
  @Input() seat: any;
  @Input() canSelectMore! : boolean;
  @Output() seatSelected = new EventEmitter<any>();

  isAccessible() {
    return this.seat.Sitztyp === 'Barrierefrei';
  }

  isPremium() {
    return this.seat.Sitztyp === 'Premium';
  }

  isStandard() {
    return this.seat.Sitztyp === 'Standard';
  }

  isOccupied() {
    return this.seat.Buchungsstatus === 'Besetzt';
  }

  selectSeat() {
    if (!this.isOccupied()) {
      if(this.canSelectMore) {
        this.seat.selected = !this.seat.selected;
        this.seatSelected.emit(this.seat);
      } else {
        this.seat.selected = false;
        this.seatSelected.emit(this.seat);
      }
    }

  }
}
