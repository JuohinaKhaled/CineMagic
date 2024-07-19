import {Component, OnInit} from '@angular/core';
import {BookingService} from "../../services/booking/booking.service";
import {catchError, tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {Observable, of} from "rxjs";
import {Booking} from "../../models/booking/booking";

@Component({
  selector: 'app-all-bookings',
  templateUrl: './all-bookings.component.html',
  styleUrl: './all-bookings.component.css'
})
export class AllBookingsComponent implements OnInit {
  isDateValid: boolean = false;
  customerID!: number;
  bookings$: Observable<Booking[]> | undefined;

  constructor(private bookingService: BookingService,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.getCustomer();
    this.getBookings();
  }

  getCustomer() {
    this.customerID = this.authService.getCurrentUser()?.customerID!;
  }

  getBookings() {
    this.bookings$ = this.bookingService.fetchAllBookings(this.customerID).pipe(
      tap(bookings => {
        console.log('All_Bookings_Component: Bookings fetched successful:', bookings);
        return bookings;
      }),
      catchError(err => {
        console.log('All_Bookings_Component: Error fetching Bookings: ', err)
        return of([]);
      }),
    );
  }

  onNavigateBooking(bookingID: number) {
    this.router.navigate(['/booking', bookingID]);
  }

  isEventFinished(eventDate: Date) {
    const currentDate = new Date().toISOString();
    return this.isDateValid = new Date(currentDate) >= new Date(eventDate);
  }

  getStatus(bookingStatus: string, eventDate: Date) {
    if (bookingStatus === 'Canceled') {
      return 'Canceled';
    }
    if (bookingStatus === 'Booked') {
      return this.isEventFinished(eventDate) ? 'Visited' : 'Booked';
    }
    return '';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Canceled':
        return 'bg-canceled';
      case 'Visited':
        return 'bg-visited';
      case 'Booked':
        return 'bg-booked';
      default:
        return '';
    }
  }

}
