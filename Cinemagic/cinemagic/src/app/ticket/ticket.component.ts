import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SocketService} from "../room/service/socket.service";

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {

  @Input() seat: any;
  @Output() remove = new EventEmitter<any>();

  constructor(private socketService: SocketService) {
  }
  onRemoveSeat() {
    this.remove.emit(this.seat);
  }
}
