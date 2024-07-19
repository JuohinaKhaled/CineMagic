import {Component, OnInit} from '@angular/core';

import {Router} from "@angular/router";
import {MovieService} from "../../services/movie/movie.service";
import {ModalService} from "../../services/modal/modal.service";
import {Observable, throwError} from "rxjs";
import {Movie} from "../../models/movie/movie";
import {catchError, tap} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  movies$: Observable<|Movie[]> | undefined;

  constructor(private movieService: MovieService,
              private router: Router,
              private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.getMovies();
  }

  routeMovieDetails(movieID: any) {
    console.log('Home_Component: Navigating to movie-details: ' + movieID);
    this.router.navigate(['/movie-details', movieID]);
  }

  openVideoModal(videoUrl: string) {
    this.modalService.openVideoModal(videoUrl);
  }

  getMovies() {
    this.movies$ = this.movieService.fetchAllMovies().pipe(
      tap(movies => {
        console.log('Home_Component: Movies fetched successful: ', movies);
      }),
      catchError(err => {
        console.error('Home_Component: Error loading Movies: ', err);
        return throwError(err);
      })
    );
  }

}


