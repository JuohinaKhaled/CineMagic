import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';
import { EventService } from '../../services/event/event.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  filmID: number = 0;
  film: any = {};
  events: any[] = [];
  groupedEvents: any[] = [];
  displayLimit: number = 3;

  constructor(
    private movieService: MovieService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getFilmID();
    this.getFilm();
    this.getEvents();
  }

  getFilmID() {
    this.filmID = +this.route.snapshot.paramMap.get('movieID')!;
    console.log('Film ID:', this.filmID);

    if (!this.filmID) {
      console.error('No film data found in state. Redirecting to film list.');
    } else {
      console.log('Film data loaded:', this.filmID);
    }
  }

  getFilm() {
    this.movieService.getMovieDetails(this.filmID).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.film = data[0];
          console.log('Film loaded:', this.film);
        } else {
          console.error('No film data found');
        }
      },
      (error) => {
        console.error('Error fetching film details:', error);
      }
    );
  }

  getEvents() {
    this.eventService.getEvents(this.filmID).subscribe(
      (data) => {
        this.events = data;
        this.groupEventsByDate();
        console.log('Events loaded:', this.events);
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  groupEventsByDate() {
    const grouped = _.groupBy(this.events, 'Vorfuehrungsdatum');
    this.groupedEvents = Object.keys(grouped).map(date => ({
      date,
      events: grouped[date],
      eventsToShow: grouped[date].slice(0, this.displayLimit)
    }));
  }

  goToRoom(eventID: number) {
    this.router.navigate(['/room', eventID, this.filmID]);
  }

  showMore(date: string) {
    this.groupedEvents = this.groupedEvents.map(group => {
      if (group.date === date) {
        const newLimit = group.eventsToShow.length + this.displayLimit;
        return { ...group, eventsToShow: group.events.slice(0, newLimit) };
      }
      return group;
    });
  }
}
