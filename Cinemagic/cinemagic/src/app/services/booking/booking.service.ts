import {Injectable} from '@angular/core';
import {catchError, tap} from "rxjs/operators";
import {map, Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private addBookingUrl = '/addBooking';
  private bookSeatsUrl = '/bookSeats';
  private bookingUrl = '/booking';
  private bookedSeatsUrl = '/bookedSeats';
  private allBookingUrl = '/allBooking'
  private deleteBookingUrl = '/deleteBooking';
  private updateBookingUrl = '/updateBooking';

  constructor(private http: HttpClient) {
  }

  addBooking(customerID: number, eventID: number, purchaseDate: string, totalPriceNetto: number, totalPriceBrutto: number, counterTicketsAdult: number,
             counterTicketsChild: number, counterTicketsStudent: number): Observable<number> {
    return this.http.post<number>(this.addBookingUrl,
      {
        customerID,
        eventID,
        purchaseDate,
        totalPriceNetto,
        totalPriceBrutto,
        counterTicketsAdult,
        counterTicketsChild,
        counterTicketsStudent,
      }, this.httpOptions)
      .pipe(
        tap((response) => {
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


  bookTickets(bookingID: number, customerID: number, eventID: number, seatID: number, ticketID: number): Observable<any> {
    return this.http.put<any>(this.bookSeatsUrl, {
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


  fetchBooking(bookingID: number): Observable<any> {
    return this.http.post<any>(this.bookingUrl, {bookingID}, this.httpOptions).pipe(
      tap((booking: any) => {
        console.log('Booking_Service: Fetching Booking Successful:', booking);
      }),
      catchError((err) =>{
        console.log('Booking_Service: Error Fetching Booking:', err);
        return throwError(err);
      })
    );
  }

  fetchAllBookedSeats(bookingID: number): Observable<any> {
    return this.http.post<any[]>(this.bookedSeatsUrl, {bookingID}, this.httpOptions).pipe(
      tap((seats: any[]) => {
        console.log('Booking_Service: Fetching Booking Successful:', seats);
      }),
      catchError((err) =>{
        console.log('Booking_Service: Error Fetching Booking:', err);
        return throwError(err);
      })
    );
  }

  fetchAllBooking(customerID: number): Observable<any> {
    return this.http.post<any[]>(this.allBookingUrl, {customerID}, this.httpOptions).pipe(
      tap((orders: any[]) => {
        console.log('Orders_Service: Fetching Orders Successful:', orders);
      }),
      catchError((err) =>{
        console.log('Orders_Service: Error Fetching Orders:', err);
        return throwError(err);
      })
    );
  }

  deleteBooking(bookingID: number): Observable<any> {
    const url = `${this.deleteBookingUrl}/${bookingID}`;
    return this.http.delete<any>(url, this.httpOptions).pipe(
      tap((deleteTickets) => {
        console.log('Booking_Service: Removing Booking Successful:', deleteTickets);
      }),
      catchError((err) =>{
        console.log('Booking_Service: Error removing Booking:', err);
        return throwError(err);
      })
    );
  }

  updateBooking(bookingID: number): Observable<number> {
    return this.http.put<number>(this.updateBookingUrl, {bookingID}, this.httpOptions).pipe(
      tap((update) => {
        console.log(`Booking_Service: Updating Booking successful`, update);
      }),
      catchError((err) => {
        console.log(`Booking_Service: Error updating Booking:`, err);
        return throwError(err);
      })
    );
  }
}
