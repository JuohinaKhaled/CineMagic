import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BookingService} from "../../services/booking/booking.service";
import {catchError, tap} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {AuthService} from "../../services/auth/auth.service";
import {ModalService} from "../../services/modal/modal.service";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {

  bookingID: number = 0;
  isDateValid: boolean = false;
  booking: any;
  seats$: Observable<any[]> | undefined;


  constructor(private bookingService: BookingService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private modalService: ModalService,
              private router: Router,
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
        console.log('Booking_Component: Fetching Booking successful:', booking[0])
      },
      error: (err) => {
        console.log('Booking_Component: Error fetching Booking:', err);
        return throwError(err);
      }
    });
  }

  isEventFinished() {
    const currentDate = new Date();
    return this.isDateValid = currentDate >= this.booking.Vorfuehrungsdatum;
  }

  openModal(title: string, modalType: 'rateMovie' | 'cancelBooking' | undefined) {
    let isLoggedIn = this.authService.isLoggedIn

    this.modalService.open(title, isLoggedIn, modalType).then((result: string) => {
      if (result) {
        if (result === 'cancelBooking') {
          this.cancelBooking();
          this.router.navigate(['/']);
        } else if (result === 'rateMovie') {
          this.rateMovie();
        }
      } else {
        console.log('Booking_Component: Modal cancelled or closed!');
      }
    }).catch(() => {
      console.log('Booking_Component: Modal could not be opened!');
    });
  }

  cancelBooking() {

  }

  rateMovie() {

  }
}
