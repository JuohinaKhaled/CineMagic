import {Injectable} from '@angular/core';
import {catchError, tap} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Booking} from "../../models/booking/booking";
import {BookingTicket} from "../../models/bookingTicket/booking-ticket";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private fetchAllBookedTicketsUrl = '/api/booked-tickets';
  private fetchAllBookingsUrl = '/api/bookings';
  private fetchBookingUrl = '/api/booking';
  private addBookingUrl = '/api/add-booking';
  private addBookingTicketsUrl = '/api/add-booking-tickets';
  private deleteBookingUrl = '/api/delete-booking';
  private updateBookingUrl = '/api/update-booking';

  constructor(private http: HttpClient) {
  }

  fetchAllBookings(customerID: number): Observable<Booking[]> {
    return this.http.post<Booking[]>(this.fetchAllBookingsUrl, {customerID}, this.httpOptions).pipe(
      tap(bookings => {
        console.log('Booking_Service: Bookings fetched successful: ', bookings);
      }),
      catchError((err) => {
        console.error('Booking_Service: Error fetching Bookings: ', err);
        return throwError(err);
      })
    );
  }

  fetchBooking(bookingID: number): Observable<Booking> {
    return this.http.post<Booking>(this.fetchBookingUrl, {bookingID}, this.httpOptions).pipe(
      tap((booking: any) => {
        console.log('Booking_Service: Booking fetched successful: ', booking);
      }),
      catchError((err) => {
        console.error('Booking_Service: Error fetching Booking: ', err);
        return throwError(err);
      })
    );
  }

  fetchAllBookedTickets(bookingID: number): Observable<BookingTicket[]> {
    return this.http.post<BookingTicket[]>(this.fetchAllBookedTicketsUrl, {bookingID}, this.httpOptions).pipe(
      tap(tickets => {
        console.log('Booking_Service: Booked Tickets fetched successful:', tickets);
      }),
      catchError((err) => {
        console.error('Booking_Service: Error Fetching booked Tickets:', err);
        return throwError(err);
      })
    );
  }

  deleteBooking(bookingID: number): Observable<any> {
    const url = `${this.deleteBookingUrl}/${bookingID}`;
    return this.http.delete<any>(url, this.httpOptions).pipe(
      tap(deleteBooking => {
        console.log('Booking_Service: Booking removed successful: ', deleteBooking);
      }),
      catchError((err) => {
        console.error('Booking_Service: Error removing Booking: ', err);
        return throwError(err);
      })
    );
  }

  updateBooking(bookingID: number): Observable<number> {
    return this.http.put<number>(this.updateBookingUrl, {bookingID}, this.httpOptions).pipe(
      tap(updateBooking => {
        console.log('Booking_Service: Booking updated successful: ', updateBooking);
      }),
      catchError((err) => {
        console.error('Booking_Service: Error updating Booking:', err);
        return throwError(err);
      })
    );
  }

  addBooking(customerID: number, eventID: number, bookingDate: string, totalPriceNetto: number, totalPriceBrutto: number,
             counterTicketsAdult: number, counterTicketsChild: number, counterTicketsStudent: number): Observable<number> {
    return this.http.post<number>(this.addBookingUrl, {
      customerID,
      eventID,
      bookingDate,
      totalPriceNetto,
      totalPriceBrutto,
      counterTicketsAdult,
      counterTicketsChild,
      counterTicketsStudent
    }, this.httpOptions).pipe(
      tap(bookingID => {
        console.log('Booking_Service: Booking added successful: ', bookingID)
      }),
      catchError(err => {
        console.error('Booking_Service: Error adding Booking: ', err);
        return throwError(err);
      })
    );
  }

  bookTickets(bookingID: number, customerID: number, eventID: number, seatID: number, ticketID: number): Observable<any> {
    return this.http.put<any>(this.addBookingTicketsUrl, {
      bookingID,
      customerID,
      eventID,
      seatID,
      ticketID
    }, this.httpOptions).pipe(
      tap(booking => {
        console.log('Booking_Service: Tickets booked successful: ', booking.affectedRows);
      }),
      catchError(err => {
        console.error('Booking_Service: Error booking Tickets:', err);
        return throwError(err);
      })
    );
  }

}
