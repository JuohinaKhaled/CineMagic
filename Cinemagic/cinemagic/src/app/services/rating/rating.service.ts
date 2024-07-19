import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private fetchRatingUrl = '/api/rating';
  private addRatingUrl = '/api/add-rating';

  constructor(private http: HttpClient) {
  }

  fetchRating(bookingID: number, movieID: number): Observable<number> {
    return this.http.post<number>(this.fetchRatingUrl, {bookingID, movieID}, this.httpOptions).pipe(
      tap(rating => {
        if(rating) {
          console.log('Rating_Service: Rating fetched successful: ', rating);
        }
      }),
      catchError(err => {
        console.error('Rating_Service: Error fetching Rating: ', err);
        return throwError(err);
      })
    );
  }

  addRating(bookingID: number, movieID: number, rating: number): Observable<number> {
    return this.http.put<any>(this.addRatingUrl, {bookingID, movieID, rating}, this.httpOptions).pipe(
      tap(rating => {
        console.log('Rating_Service: Rating added successful: ', rating);
      }),
      catchError(err => {
        console.error('Rating_Service: Error adding Rating: ', err);
        return throwError(err);
      })
    );
  }

}
