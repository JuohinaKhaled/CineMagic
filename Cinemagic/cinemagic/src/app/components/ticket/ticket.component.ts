import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {

  @Input() seat: any;
  @Output() remove = new EventEmitter<any>();

  constructor() {
  }
  onRemoveSeat() {
    this.remove.emit(this.seat);
  }
}
