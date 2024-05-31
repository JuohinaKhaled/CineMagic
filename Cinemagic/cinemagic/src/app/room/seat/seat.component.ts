import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.css'
})
export class SeatComponent {
  @Input() seat: any;

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

}
