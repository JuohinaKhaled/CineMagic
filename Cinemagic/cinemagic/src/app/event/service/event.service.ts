import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getEvents(movieID: number): Observable<any[]> {
    return this.http.post<any[]>('/events', { movieID }).pipe(
      tap(response => {
        if (response.length > 0) {
          console.log('Vorfuehrungen abgerufen: ', response);
        } else {
          console.log('Keine Vorfuehrungen gefunden, Antwort: ', response);
        }
      }),
      catchError(err => {
        console.log('Fehler beim Abrufen der Vorfuehrungen: ', err);
        return throwError(err);
      })
    );
  }
}
