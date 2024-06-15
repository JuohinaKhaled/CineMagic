import {Component, OnInit} from '@angular/core';
import {MovieService} from '../movie/movie.service'
import {Router} from "@angular/router";
import {map, Observable, throwError} from "rxjs";
import {Movie} from "../models/movie";
import {catchError, tap} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  movies$: Observable<|Movie[]> | undefined

  constructor(private movieService: MovieService, private router: Router) {
  }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(){
    this.movies$ = this.movieService.fetchAllMovies().pipe(
      tap(movies => {
        console.log('Home_Component: Movies fetched:', movies);
      }),
      catchError(err => {
        console.error('Home_Component: Error loading Movies:', err);
        return throwError(err);
      })
    );

  }
  routeMovieDetails(movieID: number) {
    console.log('Home_Component: Navigating to movie-details: ' + movieID);
    this.router.navigate(['/movie-details', movieID]);
  }


}


