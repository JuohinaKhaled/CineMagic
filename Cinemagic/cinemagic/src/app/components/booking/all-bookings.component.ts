import {Component, OnInit} from '@angular/core';
import {BookingService} from "../../services/booking/booking.service";
import {catchError, tap} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-all-bookings',
  templateUrl: './all-bookings.component.html',
  styleUrl: './all-bookings.component.css'
})
export class AllBookingsComponent implements OnInit {
  isDateValid: boolean = false;
  bookingIDs: any[] = [];
  bookings: any[] = [];
  customerID: number = 1;

  constructor(private bookingService: BookingService, private router: Router) {
  }

  ngOnInit(): void {
    this.getBookingIDs();
  }


  getBookingIDs() {
    this.bookingService.fetchAllBooking(this.customerID).pipe(
      tap(bookingIDs => {
        this.bookingIDs = bookingIDs;
        console.log('All_Bookings_Component: BookingIDs fetched succesful:', bookingIDs);
        this.getBookings();
      }),
      catchError(err => {
        console.log('All_Bookings_Component: Error fetching succesful: ', err)
        return err;
      })).subscribe();
  }

  getBookings() {
    this.bookingIDs.forEach(bookingID => {
        this.bookingService.fetchBooking(bookingID.BuchungsID).pipe(
          tap(booking => {
            this.bookings.push(booking[0]);
            console.log('All_Bookings_Component: BookingIDs fetched succesful:', booking);
          }),
          catchError(err => {
            console.log('All_Bookings_Component: Error fetching succesful: ', err)
            return err;
          })
        ).subscribe()
      }
    );
  }

  onNavigateBooking(bookingID: number) {
    this.router.navigate(['/booking', bookingID]);
  }

  isEventFinished(eventDate: Date) {
    const currentDate = new Date();
    return this.isDateValid = currentDate >= eventDate;
  }

  getStatus(bookingStatus: string, eventDate: Date){
    if(bookingStatus === 'Canceled'){
      return 'Canceled';
    } else if (bookingStatus === 'Booked' && this.isEventFinished(eventDate)){
      return 'Visited';
    } else {
      return 'Booked';
    }
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
