import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BookingService} from "../../services/booking/booking.service";
import {catchError, tap} from "rxjs/operators";
import {Observable, Subscription, throwError} from "rxjs";
import {AuthService} from "../../services/auth/auth.service";
import {ModalService} from "../../services/modal/modal.service";
import {RatingService} from "../../services/rating/rating.service";
import {CustomSnackbarService} from "../../services/custom-snackbar/custom-snackbar.service";
import {BookingTicket} from "../../models/bookingTicket/booking-ticket";
import {Booking} from "../../models/booking/booking";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit, OnDestroy {
  ratingSubscription?: Subscription;
  bookingID: number = 0;
  isDateValid: boolean = false;
  booking$: Observable<Booking> | undefined;
  movieID!: number;
  customerID!: number;
  rating!: number;
  bookedTickets$: Observable<BookingTicket[]> | undefined;


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
    this.getAllBookedTickets();
  }

  getEventID() {
    this.bookingID = +this.route.snapshot.paramMap.get('bookingID')!;
  }


  getAllBookedTickets() {
    this.bookedTickets$ = this.bookingService.fetchAllBookedTickets(this.bookingID).pipe(
      tap((bookingTickets: BookingTicket[]) => {
        console.log('Booking_Component: Fetching booked Seats successful:', bookingTickets)
        return bookingTickets;
      }),
      catchError(err => {
        console.error('Booking_Component: Error fetching booked Seats:', err);
        return throwError(err);
      })
    );
  }

  getBooking() {
    this.booking$ = this.bookingService.fetchBooking(this.bookingID).pipe(
      tap(booking => {
        console.log('Booking_Component: Fetching Booking successful: ', booking)
        this.movieID = booking.movieID;
        this.getRating();
        return booking;
      }),
      catchError(err => {
        console.error('Booking_Component: Error fetching Booking: ', err);
        return throwError(err);
      })
    );
  }

  getRating() {
    this.ratingService.fetchRating(this.bookingID, this.movieID).subscribe({
      next: (rating: any) => {
        if(rating) {
          this.rating = rating.rating;
          this.cdRef.detectChanges();
          console.log('Booking_Component: Fetching Rating successful:', rating)
        } else {
          console.log('Booking_Component: No Rating existing!')
        }
      },
      error: (err) => {
        console.error('Booking_Component: Error fetching Rating:', err);
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

    this.modalService.open(title, isLoggedIn, modalType).then(({action, value}) => {
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
        this.snackBar.openSnackBar('Cancel booking successful.');
        console.log('Booking_Component: Removing Booking successful:', deletedBooking);
        this.router.navigate(['profile/all-bookings']);
        this.updateBookingStatus();
      },
      error: (err) => {
        this.snackBar.openSnackBar('Error during your cancelling booking. Please try again.');
        console.error('Booking_Component: Error removing Booking:', err);
        return throwError(err);
      }
    });
  }

  updateBookingStatus() {
    this.bookingService.updateBooking(this.bookingID).subscribe({
      next: (updateBooking: any) => {
        console.log('Booking_Component: Updating Booking successful: ', updateBooking)
      },
      error: (err) => {
        console.error('Booking_Component: Error updating Booking: ', err);
        return throwError(err);
      }
    });
  }

  rateMovie(currentRate: number) {
    this.ratingService.addRating(this.bookingID, this.movieID, currentRate).subscribe({
      next: (addRating: any) => {
        this.getRating();
        this.snackBar.openSnackBar("Rating of movie successful.");
        console.log('Booking_Component: Rating added successful:', addRating);
      },
      error: (err) => {
        this.snackBar.openSnackBar("Error during your rating movie. Please try again.");
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
    this.customerID = this.authService.getCurrentUser()?.customerID!;
  }
}
