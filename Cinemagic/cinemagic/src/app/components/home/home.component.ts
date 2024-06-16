import { Component, OnInit } from '@angular/core';
import { MovieService } from '../services/movie.service'
import {ActivatedRoute, Route, Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  films: any[] = [];

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.movieService.getFilms().subscribe(
      (data: any[]) => {
        this.films = data;
        console.log("Films loaded:", this.films);
      },
      (error) => {
        console.error("Error loading films:", error);
      }
    );
  }

  routeMovieDetails(FilmID: any) {
    console.log('Navigating to movie-details with film: ' + FilmID);
    this.router.navigate(['/movie-details', FilmID]);
  }
}


