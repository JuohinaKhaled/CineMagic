import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie/movie.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  films: any[] = [];

  constructor(private movieService: MovieService) {}

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

}
