import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Seat} from "../../models/seat/seat";

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent{

  @Input() seat?: Seat;
  @Output() remove = new EventEmitter<any>();

  onRemoveSeat() {
    this.remove.emit(this.seat);
  }

}
