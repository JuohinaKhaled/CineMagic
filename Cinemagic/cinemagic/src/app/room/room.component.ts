import {Component, OnInit} from '@angular/core';
import {RoomService} from "./service/room.service";
import {ActivatedRoute} from "@angular/router";
import {MovieService} from "../movie/movie.service";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent implements OnInit{
  room: any;
  movie: any;
  seats: any[] = [];
  groupedSeats: any[][] = [];
  eventID: number = 0;
  movieID: number = 0;


  constructor(private roomService : RoomService, private route: ActivatedRoute,
              private movieService: MovieService) {}

  ngOnInit(): void {
    this.getEventID();
    this.getMovieID();
    this.getRoom();
    this.getRoomData();
    this.getMovie();
  }

  getEventID() {
    this.eventID = +this.route.snapshot.paramMap.get('eventID')!;
    console.log('Movie ID:', this.eventID);

    if (!this.eventID) {
      console.error('No event data found in state.');
    } else {
      console.log('Event data loaded:', this.eventID);
    }
  }

  getMovieID() {
    this.movieID = +this.route.snapshot.paramMap.get('movieID')!;
    console.log('Movie ID:', this.movieID);

    if (!this.movieID) {
      console.error('No movie data found in state.');
    } else {
      console.log('Event data loaded:', this.movieID);
    }
  }

  getRoom(){
    this.roomService.getRoom(this.eventID).subscribe(
      (data) =>{
        this.room = data;
        console.log("Room loaded:", this.room);
      },
      (error) => {
        console.error("Error loading room:", error);
      }
    );
  }

  getRoomData(){
    this.roomService.getSeats(this.eventID).subscribe(
      (data) => {
        this.seats = data;
        console.log("Seats loaded:", this.seats);
        this.groupSeatsByRow();
      },
      (error) => {
        console.error("Error loading seats:", error);
      }
    );
  }

  groupSeatsByRow(): void {
    let rowIndex = 0;
    let i = 0
    this.groupedSeats = [];
    for (let i = 0; i < this.seats.length; i += 10) {
      this.groupedSeats[rowIndex] = this.seats.slice(i, i + 10);
      rowIndex++;
    }
  }

  getMovie(){
    this.movieService.getMovieDetails(this.movieID).subscribe(
      (data) => {
        this.movie = data;
        console.log("Movie loaded:", this.movie);
      },
      (error) => {
        console.error("Error fetching movie details:", error);
      }
    );
  }
}
