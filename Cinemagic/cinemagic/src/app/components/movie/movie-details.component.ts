import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';
import { EventService } from '../../services/event/event.service';
import { groupBy } from 'lodash-es';
import { Movie } from '../../models/movie/movie';
import { Event } from '../../models/event/event';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movieID: number = 0;
  movie$: Observable<Movie> | undefined;
  events$: Observable<Event[]> | undefined;
  groupedEvents$ = new BehaviorSubject<any[]>([]);
  displayLimit: number = 3;
  maxDaysToShow: number = 3;
  Math = Math;

  constructor(
    private movieService: MovieService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMovieID();
    this.getMovie();
    this.getEvents();
  }

  getMovieID() {
    this.movieID = +this.route.snapshot.paramMap.get('movieID')!;
    console.log('Movie-Details_Component: Fetching MovieID successful:', this.movieID);
  }

  getMovie() {
    this.movie$ = this.movieService.fetchMovie(this.movieID).pipe(
      tap(movie => {
        console.log('Movie_Details_Component: Movie fetched successfully: ', movie);
      }),
      catchError(err => {
        console.error('Movie_Details_Component: Error fetching Movie: ', err);
        return throwError(err);
      })
    );
  }

  getEvents() {
    this.events$ = this.eventService.fetchAllEvents(this.movieID).pipe(
      tap(events => {
        console.log('Movie_Details_Component: Events loaded successfully:', events);
      }),
      catchError(err => {
        console.error('Movie_Details_Component: Error fetching Events: ', err);
        return throwError(err);
      }),
      map(events => this.groupEventsByDate(events))
    );

    this.events$.subscribe(groupedEvents => {
      this.groupedEvents$.next(groupedEvents);
    });
  }

  groupEventsByDate(events: Event[]): any[] {
    const today = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7);

    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.eventDate);
      return eventDate >= today && eventDate <= oneWeekLater;
    }).sort((a: Event, b: Event) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

    const grouped = groupBy(filteredEvents, 'eventDate');
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
    this.groupedEvents$.next(this.groupedEvents$.getValue().map(group => {
      if (group.date === date) {
        const newLimit = group.eventsToShow.length + this.displayLimit;
        return { ...group, eventsToShow: group.events.slice(0, newLimit) };
      }
      return group;
    }));
  }

  showMoreDays() {
    this.maxDaysToShow = Math.min(this.maxDaysToShow + 3, 7);
  }
}
