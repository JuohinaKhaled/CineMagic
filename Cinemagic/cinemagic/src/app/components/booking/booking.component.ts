import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BookingService} from "../../services/booking/booking.service";
import {catchError, tap} from "rxjs/operators";
import {Observable, throwError} from "rxjs";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  selectedSeats: any[] = [];
  totalPriceBrutto: number = 0;
  totalPriceNetto: number = 0;
  adultCounterValue: number = 0;
  studentCounterValue: number = 0;
  childCounterValue: number = 0;
  currentDate: string = new Date().toISOString().slice(0, 19).replace('T', ' ');
  bookingID?: number;
  b$ : Observable<any> | undefined;


  constructor(private route: ActivatedRoute, private bookingService: BookingService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['selectedSeats']) {
        this.selectedSeats = JSON.parse(params['selectedSeats']);
      }
      if (params['totalPriceBrutto']) {
        this.totalPriceBrutto = +params['totalPriceBrutto'];
      }
      if (params['totalPriceNetto']) {
        this.totalPriceNetto = +params['totalPriceNetto'];
      }
      if (params['adultTickets']) {
        this.adultCounterValue = +params['adultTickets'];
      }
      if (params['studentTickets']) {
        this.studentCounterValue = +params['studentTickets'];
      }
      if (params['childTickets']) {
        this.childCounterValue = +params['childTickets'];
      }
    });
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

 /* createBooking(totalPriceBrutto: number, totalPriceNetto: number) {
    console.log('Totaler Preis:', totalPriceBrutto, totalPriceNetto);
    console.log(this.currentDate);
    this.bookingService.createBooking().subscribe(response => {
      this.bookingID = response;
    });
  }*/

  createBooking(){
     this.bookingService.createBooking(1, this.currentDate,
      this.totalPriceNetto, this.totalPriceBrutto, this.adultCounterValue, this.childCounterValue,
      this.studentCounterValue, false).subscribe(id => {
        this.bookingID = id;
        console.log('Booking_Component: Create Booking successful: ', id);
      }),
      catchError(err => {
        console.error('Booking_Component: Error creating Booking: ', err);
        return throwError(err);
      });
  }

}
