import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BookingService} from "../../services/booking/booking.service";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {SocketService} from "../../services/socket/socket.service";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  selectedSeats: any[] = [];
  totalPriceBrutto: number = 0;
  totalPriceNetto: number = 0;
  eventID: number = 0;
  adultCounterValue: number = 0;
  studentCounterValue: number = 0;
  childCounterValue: number = 0;
  currentDate: string = '';
  bookingID: number = 0;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private socketService: SocketService
  ) {
  }

  ngOnInit(): void {
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState) {
      this.selectedSeats = navigationState['selectedSeats'];
      this.totalPriceBrutto = navigationState['totalPriceBrutto'];
      this.totalPriceNetto = navigationState['totalPriceNetto'];
      this.eventID = navigationState['eventID'];
    }
    this.setDate();
    this.setCounter();
  }

  setCounter() {
    this.socketService.getCurrentCount('Adult', this.eventID).subscribe(adultValue => {
        this.adultCounterValue = adultValue;
        console.log('');
      }
    );
    this.socketService.getCurrentCount('Child', this.eventID).subscribe(childValue => {
        this.adultCounterValue = childValue;
        console.log('');
      }
    );
    this.socketService.getCurrentCount('Student', this.eventID)
      .pipe(
        catchError(err => {
          console.log('')
          return throwError(err);
        })
      )
      .subscribe(studentValue => {
        this.adultCounterValue = studentValue;
        console.log('');
      }
    );
  }

  setDate() {
    this.currentDate = this.currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  createBooking() {
    this.bookingService.createBooking(1, this.currentDate, this.totalPriceNetto, this.totalPriceBrutto,
      this.adultCounterValue, this.childCounterValue, this.studentCounterValue, false).pipe(
      catchError(err => {
        console.error('Booking_Component: Error creating Booking: ', err);
        return throwError(err);
      })
    ).subscribe(id => {
      this.bookingID = id;
      console.log('Booking_Component: Create Booking successful: ', id);
    })

  }


  /*  bookTicketsForSelectedSeats(bookingID: number) {
    this.selectedSeats.forEach(seat => {
      this.bookingService.bookTickets(bookingID, 1, 49, seat.seatID, seat.ticketID).pipe(
        tap((result: any) => {
          if (result && result.affectedRows !== undefined && result.affectedRows > 0) {
            console.log('Booking tickets for seat successful:', result.affectedRows);
          } else {
            console.error('Error booking tickets for seat:', result);
          }
        }),
        catchError(error => {
          console.error('Error booking tickets for seat:', seat, error);
          return throwError(error);
        }))
    });
  }*/
}
