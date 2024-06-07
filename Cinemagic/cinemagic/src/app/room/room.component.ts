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
  adultCounterValue: number = 0;
  studentCounterValue: number = 0;
  childCounterValue: number = 0;
  selectedSeats: any[] = [];


  constructor(private roomService : RoomService, private route: ActivatedRoute,
              private movieService: MovieService) {}

  ngOnInit(): void {
    this.getEventID();
    this.getMovieID();
    this.getRoom();
    this.getSeats();
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

  getSeats(){
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

  onCounterValueChanged(type: string, value: number) {
    switch (type) {
      case 'Adult':
        this.adultCounterValue = value;
        break;
      case 'Student':
        this.studentCounterValue = value;
        break;
      case 'Child':
        this.childCounterValue = value;
        break;
      default:
        break;
    }
    this.updateSelectedSeats();
  }

  updateSelectedSeats() {
    const totalSeats = this.getTotalCount();
    if (this.selectedSeats.length > totalSeats) {
      this.selectedSeats.splice(totalSeats).forEach(seat => {
        const seatToDeselect = this.seats.find(s => s.Reihennummer === seat.Reihennummer && s.Sitznummer === seat.Sitznummer);
        if (seatToDeselect) {
          seatToDeselect.selected = false;
        }
      });
    }
  }

  getTotalCount(): number {
    return this.adultCounterValue + this.studentCounterValue + this.childCounterValue;
  }

  canSelectMoreSeats(): boolean {
    return this.selectedSeats.length < this.getTotalCount();
  }

  getPersonType(index: number): string {
    let totalAdults = this.adultCounterValue;
    let totalStudents = this.studentCounterValue;
    if (index < totalAdults) {
      return 'Adult';
    } else if (index < totalAdults + totalStudents) {
      return 'Student';
    } else {
      return 'Child';
    }
  }

  getPrice(personType: string): number {
    switch (personType) {
      case 'Adult':
        return 12.3;
      case 'Student':
        return 10;
      case 'Child':
        return 8;
      default:
        return 0;
    }
  }

  onSeatSelected(seat: any) {
    console.log("Seat selected: ", seat);
    if (this.isSeatAlreadySelected(seat)) {
      console.log("Seat already selected, removing...");
      this.removeSeat(seat);
      console.log("delete : ", seat)
    } else {
      if (this.canSelectMoreSeats()) {
          seat.selected = true;
          const personType = this.getPersonType(this.selectedSeats.length);
          const price = this.getPrice(personType);
          this.selectedSeats.push({
            Reihennummer: seat.Reihennummer,
            Sitznummer: seat.Sitznummer,
            personType,
            price
          });
      } else {
        alert('You have selected the maximum number of seats allowed.');
      }
    }
  }

  isSeatAlreadySelected(seat: any): boolean {
    return this.selectedSeats.some(s => s.Reihennummer === seat.Reihennummer && s.Sitznummer === seat.Sitznummer);
  }
  removeSeat(seat: any) {
    console.log("Removing seat: ", seat);
    console.log(seat);
    const index = this.selectedSeats.findIndex(s => s.Reihennummer === seat.Reihennummer && s.Sitznummer === seat.Sitznummer);
    if (index > -1) {
      console.log("Seat found at index: ", index);
      const seatToDeselect = this.seats.find(s => s.Reihennummer === seat.Reihennummer && s.Sitznummer === seat.Sitznummer);
      this.selectedSeats.splice(index, 1);
      if (seatToDeselect) {
        seatToDeselect.selected = false;
      }
      console.log('Seat removed:', seat);
    } else {
      console.log('Seat not found in selectedSeats:', seat);
    }
  }
}
