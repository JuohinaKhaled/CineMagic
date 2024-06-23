import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit{

  @Input() seat: any;
  @Output() remove = new EventEmitter<any>();

  constructor() {
  }
  onRemoveSeat() {
    this.remove.emit(this.seat);
  }

  ngOnInit(): void {
  }

}
