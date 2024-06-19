import {Injectable} from '@angular/core';
import {catchError, tap} from "rxjs/operators";
import {map, Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private createBookingUrl = '/booking';
  private bookingTicketsUrl = '/bookingTickets';

  constructor(private http: HttpClient) {
  }

  createBooking(customerID: number, purchaseDate: string, totalPriceNetto: number, totalPriceBrutto: number, counterTicketsAdult: number,
                counterTicketsChild: number, counterTicketsStudent: number, paid: boolean): Observable<number> {
    return this.http.post<number>(this.createBookingUrl,
      {
        customerID,
        purchaseDate,
        totalPriceNetto,
        totalPriceBrutto,
        counterTicketsAdult,
        counterTicketsChild,
        counterTicketsStudent,
        paid
      }, this.httpOptions)
      .pipe(
        tap(response => {
          if (response) {
            console.log('Booking_Service: Creating Booking successful: ', response);
          } else {
            console.log('Booking_Service: Error creating Booking successful: ', response);
          }
        }),
        catchError(err => {
          console.log('Booking_Service: Error creating Booking: ', err);
          return throwError(err);
        })
      );
  }


  bookingTickets(bookingID: number, customerID: number, eventID: number, seatID: number, ticketID: number): Observable<any> {
    return this.http.put<any>(this.bookingTicketsUrl, {
      bookingID,
      customerID,
      eventID,
      seatID,
      ticketID
    }, this.httpOptions)
      .pipe(
        tap((results: any) => {
          if (results && results.affectedRows !== null) {
            console.log('Booking_Service: Tickets booked successfully');
          } else {
            console.error('Booking_Service: Error booking tickets');
          }
        }),
        catchError(err => {
          console.error('Booking_Service: Error occurred while booking tickets:', err);
          return throwError(err);
        })
      );
  }


}
