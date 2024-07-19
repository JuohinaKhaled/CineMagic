import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {Room} from "../../models/room/room";
import {Seat} from "../../models/seat/seat";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private fetchSeatsAllUrl = '/api/seats';
  private fetchRoomUrl = '/api/room';

  constructor(private http: HttpClient) {
  }

  fetchAllSeats(eventID: number): Observable<Seat[]> {
    return this.http.post<Seat[]>(this.fetchSeatsAllUrl, {eventID}, this.httpOptions).pipe(
      tap(seats => {
        console.log('Room_Service: Seats fetched successful: ', seats);
      }),
      catchError(err => {
        console.error('Room_Service: Error fetching Seats: ', err);
        return throwError(err);
      })
    );
  }

  fetchRoom(eventID: number): Observable<Room> {
    return this.http.post<Room>(this.fetchRoomUrl, {eventID}, this.httpOptions).pipe(
      tap(room => {
        console.log('Room_Service: Room fetched successful: ', room);
      }),
      catchError(err => {
        console.error('Room_Service: Error fetching Room: ', err);
        return throwError(err);
      })
    );
  }

}
