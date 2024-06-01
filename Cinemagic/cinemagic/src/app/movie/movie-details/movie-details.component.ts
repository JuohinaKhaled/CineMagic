import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MovieService} from "../movie.service";
import {EventService} from "../../event/service/event.service";

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit {
  movieID: number = 0;
  movie: any;
  events: any [] = [];

  constructor(private movieService : MovieService, private eventService : EventService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getMovieID();
    this.getMovie();
  }


  getMovieID() {
    this.movieID = +this.route.snapshot.paramMap.get('movieID')!;
    console.log('Movie ID:', this.movieID);

    if (!this.movieID) {
      console.error('No movie data found in state. Redirecting to movie list.');
    } else {
      console.log('Movie data loaded:', this.movieID);
    }

  }

  getMovie() {
    this.movieService.getMovieDetails(this.movieID).subscribe(
      (data ) => {
        this.movie = data;
        console.log('Movie:', this.movie);
      },
      (error) => {
        console.error('Error fetching movie details:', error);
      }
    );
  }

  getEvents(){
    this.eventService.getEvents(this.movieID).subscribe(
      (data) => {
        this.events = data; // assuming the response is an array with a single movie object
        console.log('Events:', this.events);
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );

  }
}
