import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient) {
  }

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private fetchRatingUrl = '/rating';
  private addRatingUrl = '/add/rating';


  addRating(customerID: number, movieID: number, rating: number): Observable<number> {
    return this.http.post<any>(this.addRatingUrl,{customerID, movieID, rating}, this.httpOptions).pipe(
      tap((response) => {
          if (response) {
            console.log('Rating_Service: Creating Rating successful: ', response);
          } else {
            console.log('Rating_Service: Error creating Rating successful: ', response);
          }
        }),
        catchError(err => {
          console.error('Rating_Service: Error creating Rating: ', err);
          return throwError(err);
        })
      );
  }

  fetchRating(customerID: number, movieID: number): Observable<number> {
    return this.http.post<any>(this.fetchRatingUrl,{customerID, movieID}, this.httpOptions).pipe(
      tap((response) => {
        if (response) {
          console.log('Rating_Service: Fetching Rating successful: ', response);
        } else {
          console.log('Rating_Service: Error fetching Rating successful: ', response);
        }
      }),
      catchError(err => {
        console.error('Rating_Service: Error fetching Rating: ', err);
        return throwError(err);
      })
    );

  }

}
