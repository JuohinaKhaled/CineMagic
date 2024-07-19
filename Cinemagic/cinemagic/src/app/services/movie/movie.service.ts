import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";
import {Movie} from "../../models/movie/movie";

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private fetchMoviesAllUrl = '/api/movies';
  private fetchMovieUrl = '/api/movie';

  constructor(private http: HttpClient) {
  }

  fetchAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.fetchMoviesAllUrl, this.httpOptions).pipe(
      tap(movies => {
        console.log('Movie_Service: Movies fetched successful: ', movies);
      }),
      catchError(err => {
        console.error('Movie_Service: Error fetching Movies: ', err);
        return throwError(err);
      })
    );
  }

  fetchMovie(movieID: number): Observable<Movie> {
    return this.http.post<Movie>(this.fetchMovieUrl, {movieID}).pipe(
      tap(movie => {
        console.log('Movie_Service: Movie fetched successful: ', movie);
      }),
      catchError(err => {
        console.error('Movie_Service: Error fetching Movies: ', err);
        return throwError(err);
      })
    );
  }

}
