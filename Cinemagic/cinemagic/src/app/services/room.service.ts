import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {Room} from "../models/room";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) {
  }

  getSeats(eventID: number): Observable<any> {
    return this.http.post<any>('/seats', {eventID}).pipe(
      tap(response => {
        if (response.length > 0) {
          console.log('Sitzplatz-Daten abgerufen: ', response);
        } else {
          console.log('Fehler beim Abrufen der Sitzplatz-Daten, Antwort: ', response);
        }
      }),
      catchError(err => {
        console.log('Fehler beim Abrufen der Sitzplatz-Daten: ', err);
        return throwError(err);
      })
    );
  }

  getRoom(eventID: number): Observable<Room[]> {
    return this.http.post<any[]>('/room', {eventID}).pipe(
      map(response => {
        return response.map(item => ({
          roomID: item.SaalID,
          roomName: item.Saalname,
          roomCapacity: item.AnzahlSitzplaetze,
          roomType: item.Saaltyp
        }));
      }),
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
}
