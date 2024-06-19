import {Injectable} from '@angular/core';
import {catchError, tap} from "rxjs/operators";
import {map, Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private bookingUrl = '/booking';

  constructor(private http: HttpClient) {
  }

  createBooking(customerID: number, purchaseDate: string, totalPriceNetto: number, totalPriceBrutto: number,
                counterTicketsAdult: number, counterTicketsChild: number, counterTicketsStudent: number,
                paid: boolean): Observable<any> {
    return this.http.post<any>(this.bookingUrl, {
      customerID,
      purchaseDate,
      totalPriceNetto,
      totalPriceBrutto,
      counterTicketsAdult,
      counterTicketsChild,
      counterTicketsStudent,
      paid
    }, this.httpOptions).pipe(
      tap(response => response.id),
      catchError(err => {
        console.log('Error', err);
        return throwError(err);
      })
    );
  }
  /*

  bookTickets(bookingID: number, customerID: number, eventID: number,
              seatID: number, ticketID: number) {
    return this.http.put('/bookingTickets', {bookingID, customerID, eventID, seatID, ticketID}).pipe(
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
  }*/


}
