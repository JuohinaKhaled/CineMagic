import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {Ticket} from "../../models/ticket/ticket";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private fetchTicketsAllUrl = '/api/tickets';

  constructor(private http: HttpClient) {
  }

  fetchTickets(roomType: string): Observable<Ticket[]> {
    return this.http.post<Ticket[]>(this.fetchTicketsAllUrl, {roomType}, this.httpOptions).pipe(
      tap(tickets => {
        console.log('Ticket_Service: Tickets fetches successful: ', tickets);
      }),
      catchError(err => {
        console.error('Ticket_Service: Error fetching Tickets: ', err);
        return throwError(err);
      })
    );
  }

}
