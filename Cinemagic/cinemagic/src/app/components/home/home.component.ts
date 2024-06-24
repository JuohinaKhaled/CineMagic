import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Route, Router} from "@angular/router";
import {MovieService} from "../../services/movie/movie.service";
import {ModalService} from "../../services/modal/modal.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  films: any[] = [];

  constructor(private movieService: MovieService,
              private router: Router,
              private modalService: ModalService) {
  }

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

  openVideoModal(videoUrl: string) {
    this.modalService.openVideoModal(videoUrl);
  }
}


