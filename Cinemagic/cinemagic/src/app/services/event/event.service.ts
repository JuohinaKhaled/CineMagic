import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {Event} from "../../models/event/event";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private fetchEventsAllUrl = '/api/events';
  private fetchEventUrl = '/api/event';

  constructor(private http: HttpClient) {
  }

  fetchAllEvents(movieID: number): Observable<Event[]> {
    return this.http.post<Event[]>(this.fetchEventsAllUrl, {movieID}, this.httpOptions).pipe(
      tap(events => {
        console.log('Event_Service: Events fetched successful: ', events);
      }),
      catchError(err => {
        console.log('Event_Service: Error fetching Events: ', err);
        return throwError(err);
      })
    );
  }

  fetchEvent(eventID: number): Observable<Event> {
    return this.http.post<Event>(this.fetchEventUrl, {eventID}, this.httpOptions).pipe(
      tap(event => {
        console.log('Event_Service: Event fetched successful: ', event);
      }),
      catchError(err => {
        console.log('Event_Service: Error fetching Event: ', err);
        return throwError(err);
      })
    );
  }

}
