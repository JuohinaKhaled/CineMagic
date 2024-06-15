import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";
import {Movie} from "../models/movie";

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) {
  }

  private moviesAllUrl = '/movies';
  private movieUrl = '/movieDetails';
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  fetchAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.moviesAllUrl, this.httpOptions).pipe(
      tap(movie => {
        console.log("Movie_Service: Movies fetched: ", movie);
      }),
      catchError(err => {
        console.log('Movie_Service: Error fetching Movies: ', err);
        return throwError(err);
      })
    );
  }

  fetchMovie(movieID: number): Observable<Movie> {
    return this.http.post<Movie>(this.movieUrl, {movieID}, this.httpOptions).pipe(
      tap(movie => {
        console.log('Movie_Service: Movie fetched: ', movie);
      }),
      catchError(err => {
        console.log('Movie_Service: Error fetching Movie', err);
        return throwError(err);
      })
    );
  }
}
