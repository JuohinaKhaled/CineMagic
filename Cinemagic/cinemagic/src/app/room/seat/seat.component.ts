import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.css'
})
export class SeatComponent {
  @Input() seat: any;

  isAccssible() {

  }

  isPremium() {

  }

  isStandard() {

  }

  isOccupied() {

  }

}
