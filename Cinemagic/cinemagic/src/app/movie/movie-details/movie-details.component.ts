import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit{
  filmID: number = 0;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.filmID = +this.route.snapshot.paramMap.get('movieID')!;
    console.log('Film ID:', this.filmID);

    if (!this.filmID) {
      console.error('No film data found in state. Redirecting to movie list.');
    } else {
      console.log('Film data loaded:', this.filmID);
    }
  }
}


