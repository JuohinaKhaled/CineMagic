import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BookingService} from "../../services/booking/booking.service";
import {catchError} from "rxjs/operators";
import {map, Observable, throwError} from "rxjs";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {

  bookingID: number = 0;
  booking: any;
  seats$: Observable<any[]> | undefined;


  constructor(private bookingService: BookingService,
              private route: ActivatedRoute,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getEventID();
    this.getBooking();
    this.getAllBookedSeats();
  }

  getEventID() {
    this.bookingID = +this.route.snapshot.paramMap.get('bookingID')!;
    this.getBooking();
    this.getAllBookedSeats();
  }


  getAllBookedSeats() {
    this.seats$ = this.bookingService.fetchAllBookedSeats(this.bookingID).pipe(
      map((seats: any[]) => {
        this.cdRef.detectChanges();
        console.log('Booking_Component: Fetching booked Seats successful:', seats)
        return seats;
      }),
      catchError( err => {
        console.log('Booking_Component: Error fetching booked Seats:', err);
        return throwError(err);
      })
    );
  }

  getBooking() {
    this.bookingService.fetchBooking(this.bookingID).subscribe({
      next: (booking: any) => {
        this.booking = booking[0];
        this.cdRef.detectChanges();
        console.log('Booking_Component: Fetching Booking successful:', booking[0])
      },
      error: (err) => {
        console.log('Booking_Component: Error fetching Booking:', err);
        return throwError(err);
      }});
  }

}
