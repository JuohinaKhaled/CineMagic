import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BookingService} from "../../services/booking/booking.service";
import {catchError, tap} from "rxjs/operators";
import {Observable, Subscription, throwError} from "rxjs";
import {AuthService} from "../../services/auth/auth.service";
import {ModalService} from "../../services/modal/modal.service";
import {RatingService} from "../../services/rating/rating.service";
import {CustomSnackbarService} from "../../services/custom-snackbar/custom-snackbar.service";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit , OnDestroy{
  private ratingSubscription?: Subscription;
  bookingID: number = 0;
  isDateValid: boolean = false;
  booking: any;
  customerID!: number;
  rating!: number;
  seats$: Observable<any[]> | undefined;


  constructor(private bookingService: BookingService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private modalService: ModalService,
              private router: Router,
              private ratingService: RatingService,
              private cdRef: ChangeDetectorRef,
              private snackBar: CustomSnackbarService
  ) {
  }

  ngOnInit(): void {
    this.getCustomerID();
    this.getEventID();
    this.getBooking();
    this.getAllBookedSeats();
  }

  getEventID() {
    this.bookingID = +this.route.snapshot.paramMap.get('bookingID')!;
  }


  getAllBookedSeats() {
    this.seats$ = this.bookingService.fetchAllBookedSeats(this.bookingID).pipe(
      tap((seats: any[]) => {
        this.cdRef.detectChanges();
        console.log('Booking_Component: Fetching booked Seats successful:', seats)
        return seats;
      }),
      catchError(err => {
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
        this.getRating()
        console.log('Booking_Component: Fetching Booking successful:', booking[0])
      },
      error: (err) => {
        console.log('Booking_Component: Error fetching Booking:', err);
        return throwError(err);
      }
    });
  }

  getRating() {
    this.ratingService.fetchRating(this.bookingID, this.booking.FilmID).subscribe({
      next: (rating: any) => {
        this.rating = rating[0].Bewertung;
        this.cdRef.detectChanges();
        console.log('Booking_Component: Fetching Rating successful:', rating)
      },
      error: (err) => {
        console.log('Booking_Component: Error fetching Rating:', err);
        return throwError(err);
      }
    });
  }

  isEventFinished(eventDate: Date) {
    const currentDate = new Date();
    return this.isDateValid = new Date(currentDate) >= new Date(eventDate);
  }

  openModal(title: string, modalType: 'rateMovie' | 'cancelBooking' | undefined) {
    let isLoggedIn = this.authService.isLoggedIn

    this.modalService.open(title, isLoggedIn, modalType).then(({ action, value}) => {
      if (action) {
        if (action === 'cancelBooking') {
          this.cancelBooking();
        } else if (action === 'rateMovie') {
          this.rateMovie(value!);
        }
      } else {
        console.log('Booking_Component: Modal cancelled or closed!');
      }
    }).catch(() => {
      console.log('Booking_Component: Modal could not be opened!');
    });
  }

  cancelBooking() {
    this.bookingService.deleteBooking(this.bookingID).subscribe({
      next: (deletedBooking: any) => {
        this.snackBar.openSnackBar("Cancel booking successful.");
        this.router.navigate(['profile/all-bookings']);
        console.log('Booking_Component: Removing Booking successful:', deletedBooking);
        this.updateBookingStatus();
      },
      error: (err) => {
        this.snackBar.openSnackBar("Error during your cancelling booking. Please try again.");
        console.log('Booking_Component: Error removing Booking:', err);
        return throwError(err);
      }
    });
  }

  updateBookingStatus() {
    this.bookingService.updateBooking(this.bookingID).subscribe({
      next: (updateBooking: any) => {
        console.log('Booking_Component: Updating Booking successful:', updateBooking)
      },
      error: (err) => {
        console.log('Booking_Component: Error updating Booking:', err);
        return throwError(err);
      }
    });
  }

  rateMovie(currentRate: number) {
    console.log('DALAL', this.bookingID);
    this.ratingService.addRating(this.bookingID, this.booking.FilmID, currentRate).subscribe({
      next: (addRating: any) => {
        this.getRating();
        this.snackBar.openSnackBar("Rating of movie successful.");
        console.log('Booking_Component: Add Rating successful:', addRating);
      },
      error: (err) => {
        this.snackBar.openSnackBar("Error during your rating movie . Please try again.");
        console.log('Booking_Component: Error adding Booking:', err);
        return throwError(err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.ratingSubscription) {
      this.ratingSubscription.unsubscribe();
    }
  }

  getCustomerID() {
    this.customerID = this.authService.getCustomerID()!;
  }
}
