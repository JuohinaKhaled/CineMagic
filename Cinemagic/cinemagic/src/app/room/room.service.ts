import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  getSaal(eventID: number): Observable<any[]> {
    return this.http.post<any[]>('/room', { eventID }).pipe(
      tap(response => {
        if (response.length > 0) {
          console.log('Saal-Daten abgerufen: ', response);
        } else {
          console.log('Fehler beim Abrufen der Saal-Daten, Antwort: ', response);
        }
      }),
      catchError(err => {
        console.log('Fehler beim Abrufen der Saal-Daten: ', err);
        return throwError(err);
      })
    );
  }

  getRoomCapacity(eventID: number): Observable<number> {
    return this.http.post<number>('/room/capacity', { eventID }).pipe(
      tap(response => {
        if (response != 0) {
          console.log('Saal-Daten abgerufen: ', response);
        } else {
          console.log('Fehler beim Abrufen der Saal-Daten, Antwort: ', response);
        }
      }),
      catchError(err => {
        console.log('Fehler beim Abrufen der Saal-Daten: ', err);
        return throwError(err);
      })
    );
  }
}
