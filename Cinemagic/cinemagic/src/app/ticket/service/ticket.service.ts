import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {Ticket} from "../../models/ticket";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) {
  }

  private ticketsUrl = '/tickets';
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  fetchTickets(roomType: string): Observable<Ticket[]> {
    return this.http.post<Ticket[]>(this.ticketsUrl, {roomType}, this.httpOptions).pipe(
      tap(response => {
        console.log('Ticket_Service: Tickets fetched: ', response);
      }),
      catchError(err => {
        console.log('Ticket_Service: Error fetching Tickets: ', err);
        return throwError(err);
      })
    );
  }

}
