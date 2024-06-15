import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {Room} from "../../models/room";
import {Seat} from "../../models/seat";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) {
  }

  private seatsUrl = '/seats';
  private roomUrl = '/room';
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  fetchSeats(eventID: number): Observable<Seat[]> {
    return this.http.post<Seat[]>(this.seatsUrl, {eventID}, this.httpOptions).pipe(
      tap(seats => {
        console.log('Room_Service: Seats fetched: ', seats);
      }),
      catchError(err => {
        console.log('Room_Service: Error fetching Seats: ', err);
        return throwError(err);
      })
    );
  }

  fetchRoom(eventID: number): Observable<Room> {
    return this.http.post<Room>(this.roomUrl, {eventID}).pipe(
      tap(room => {
        console.log('Room_Service: Room fetched: ', room);
      }),
      catchError(err => {
        console.error('Room_Service: Error fetching Room: ', err);
        return throwError(err);
      })
    );

  }
}
