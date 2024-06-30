import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BookingService} from "../../services/booking/booking.service";
import {catchError, tap} from "rxjs/operators";
import {Observable, Subscription, throwError} from "rxjs";
import {AuthService} from "../../services/auth/auth.service";
import {ModalService} from "../../services/modal/modal.service";
import {RatingService} from "../../services/rating/rating.service";

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
  rating!: number;
  seats$: Observable<any[]> | undefined;


  constructor(private bookingService: BookingService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private modalService: ModalService,
              private router: Router,
              private ratingService: RatingService,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
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
        console.log('GGGG', this.booking);
        console.log('GGGG', this.booking.FilmID);
        console.log('Booking_Component: Fetching Booking successful:', booking[0])
      },
      error: (err) => {
        console.log('Booking_Component: Error fetching Booking:', err);
        return throwError(err);
      }
    });
  }

  getRating() {
    this.ratingService.fetchRating(1, this.booking.FilmID).subscribe({
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
        console.log('DDDD', action);
        if (action === 'cancelBooking') {
          this.cancelBooking();
          this.router.navigate(['/all-bookings']);
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
        console.log('Booking_Component: Removing Booking successful:', deletedBooking);
        this.updateBookingStatus();
      },
      error: (err) => {
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
    console.log('DALAL', this.rating);
    this.ratingService.addRating(5, this.booking.FilmID, currentRate).subscribe({
      next: (addRating: any) => {
        console.log('Booking_Component: Add Rating successful:', addRating);
      },
      error: (err) => {
        console.log('Booking_Component: Error adding Booking:', err);
        return throwError(err);
      }
    });
    console.log("HALLO RATING")
  }

  ngOnDestroy(): void {
    if (this.ratingSubscription) {
      this.ratingSubscription.unsubscribe();
    }
  }
}
