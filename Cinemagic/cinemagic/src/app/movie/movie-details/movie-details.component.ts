import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MovieService} from '../movie.service';
import {EventService} from '../../event/service/event.service';
import * as _ from 'lodash';
import {Movie} from "../../models/movie";
import {Event} from "../../models/event";
import {map, Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movieID: number = 0;
  movie$: Observable<Movie> | undefined;
  events$: Observable<Event[]> | undefined;
  groupedEvents$: Observable<any[]> | undefined;
  displayLimit: number = 3;

  constructor(
    private movieService: MovieService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getMovieID();
    this.getMovie();
    this.getEvents();
  }

  getMovieID() {
    this.movieID = +this.route.snapshot.paramMap.get('movieID')!;
    console.log('Film ID:', this.movieID);
  }

  getMovie() {
    this.movie$ = this.movieService.fetchMovie(this.movieID).pipe(
      tap(movie => {
        console.log('Movie_Details_Component: Movie fetched: ', movie);
      }),
      catchError(err => {
        console.log('Movie_Details_Component: Error fetching Movie: ', err);
        return throwError(err);
      })
    );
  }

  getEvents() {
    this.events$ = this.eventService.fetchAllEvents(this.movieID).pipe(
      tap(events => {
        console.log('Movie_Details_Component: Events loaded:', events);
      }),
      catchError(err => {
        console.log('Movie_Details_Component: Error fetching Events: ', err);
        return throwError(err);
      }),
    );

    this.groupedEvents$ = this.events$.pipe(
      map(events => this.groupEventsByDate(events))
    );
  }

  groupEventsByDate(events: Event[]): any[] {
    const grouped = _.groupBy(events, 'eventDate');
    return Object.keys(grouped).map(date => ({
      date,
      events: grouped[date],
      eventsToShow: grouped[date].slice(0, this.displayLimit)
    }));
  }

  goToRoom(eventID: number) {
    this.router.navigate(['/room', eventID, this.movieID]);
  }

  showMore(date: string) {
    this.groupedEvents$ = this.groupedEvents$?.pipe(
      map(groupedEvents =>
        groupedEvents.map(group => {
          if (group.date === date) {
            const newLimit = group.eventsToShow.length + this.displayLimit;
            return { ...group, eventsToShow: group.events.slice(0, newLimit) };
          }
          return group;
        })
      )
    );
  }
}

