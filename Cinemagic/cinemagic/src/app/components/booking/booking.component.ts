import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BookingService} from "../../services/booking/booking.service";
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs";
import {SocketService} from "../../services/socket/socket.service";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {

  eventID: number = 0;
  booking: any[] = [];


  constructor(private bookingService: BookingService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getEventID();
    this.getAllBookedTickets();
  }

  getEventID() {
    this.eventID = +this.route.snapshot.paramMap.get('bookingID')!;
    this.getAllBookedTickets();
  }


  getAllBookedTickets() {
    this.bookingService.fetchAllBookedTickets(this.eventID).pipe(
      tap((dataBooking: any[]) => {
        this.booking = dataBooking;
        console.log('Booking_Component: Fetching Booking successful:', dataBooking)
      }),
      catchError((err) => {
        console.log('Booking_Component: Error fetching Booking:', err);
        return throwError(err);
      })
    )
  }

}
