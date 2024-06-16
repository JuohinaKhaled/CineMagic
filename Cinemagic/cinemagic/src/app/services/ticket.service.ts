import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) { }

  getTickets(roomType: string): Observable<any[]> {
    return this.http.post<any[]>('/tickets', { roomType }).pipe(
      tap(response => {
        if (response.length > 0) {
          console.log('Tickets abgerufen: ', response);
        } else {
          console.log('Keine Tickets gefunden, Antwort: ', response);
        }
      }),
      catchError(err => {
        console.log('Fehler beim Abrufen der Tickets: ', err);
        return throwError(err);
      })
    );
  }
}
