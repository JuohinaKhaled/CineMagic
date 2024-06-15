import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {Event} from "../../models/event";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) {
  }

  private eventsAllUrl = '/events';
  private eventUrl = '/event';
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  fetchAllEvents(movieID: number): Observable<Event[]> {
    console.log('BUUUUU')
    return this.http.post<Event[]>(this.eventsAllUrl, {movieID}, this.httpOptions).pipe(
      tap(response => {
        console.log('Event_Service: Events fetched: ', response);
      }),
      catchError(err => {
        console.log('Event_Service: Error fetching Events: ', err);
        return throwError(err);
      })
    );
  }

  fetchEvent(eventID: number): Observable<Event> {
    return this.http.post<Event>(this.eventUrl, {eventID}, this.httpOptions).pipe(
      tap(event => {
        console.log('Event_Service: Event fetched: ', event);
      }),
      catchError(err => {
        console.log('Event_Service: Error fetching Event: ', err);
        return throwError(err);
      })
    );
  }


}
