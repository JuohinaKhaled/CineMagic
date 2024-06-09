import {Component, OnInit} from '@angular/core';
import {RoomService} from "./service/room.service";
import {ActivatedRoute} from "@angular/router";
import {MovieService} from "../movie/movie.service";
import {TicketService} from "../ticket/service/ticket.service";
import {Room} from "../models/room";
import {of, switchMap} from "rxjs";
import {catchError, tap} from "rxjs/operators";



@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent implements OnInit{

  room?: Room;
  movie: any;
  seats: any[] = [];
  groupedSeats: any[][] = [];
  eventID: number = 0;
  movieID: number = 0;
  adultCounterValue: number = 0;
  studentCounterValue: number = 0;
  childCounterValue: number = 0;
  selectedSeats: any[] = [];
  tickets: any[] = [];


  constructor(private roomService : RoomService,
              private route: ActivatedRoute,
              private movieService: MovieService,
              private ticketService: TicketService) {}

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
    this.roomService.getRoom(this.eventID).pipe(
      tap((data) => {
        this.room = new Room(data[0].roomID, data[0].roomName, data[0].roomCapacity, data[0].roomType);
        console.log("Room loaded:", this.room);
      }), switchMap(()=> {
        if (this.room) {
          return this.ticketService.getTickets(this.room.roomType).pipe(
            tap((data) => {
              this.tickets = data;
              console.log('Ticket data loaded:', this.tickets);
        })
      );
      } else {
        return of([]);
      }
      }),
      catchError(error => {
        console.error("Error loading room:", error);
        return of([]);
      })
    ).subscribe();
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
    console.log(type, value);

    switch (type) {
      case 'Adult':
          console.log('Erwachsen:' + this.adultCounterValue, value);
        this.adultCounterValue = value;
        break;
      case 'Student':
          console.log('Student:' + this.studentCounterValue, value);
        this.studentCounterValue = value;
        break;
      case 'Child':
          console.log('Child:' + this.childCounterValue, value);
        this.childCounterValue = value;
        break;
      default:
        break;
    }
    console.log(type);
    this.updateSelectedSeats(type);
  }

  updateSelectedSeats(personType : string) {
    const totalSeats = this.getTotalCount();
    if (this.selectedSeats.length > totalSeats) {
      const seatIndex = this.selectedSeats.findIndex(s => s.personType === personType);
      // Finde den ersten ausgewählten Sitz mit dem angegebenen Personentyp
      if (seatIndex !== -1) {
        // Entferne den ausgewählten Sitz aus den ausgewählten Sitzen
        const removedSeat = this.selectedSeats.splice(seatIndex, 1)[0];
        // Aktualisiere den ausgewählten Sitz, um ihn als nicht ausgewählt zu markieren
        const seatToDeselect = this.seats.find(s => s.Reihennummer === removedSeat.Reihennummer && s.Sitznummer === removedSeat.Sitznummer);
        if (seatToDeselect) {
          seatToDeselect.selected = false;
        }
      }
    } else {
      const selectedSeatsOfType = this.selectedSeats.filter(s => s.personType === personType).length;
      // Überprüfe, ob die Anzahl der ausgewählten Sitze kleiner als der entsprechende Counter ist

      if (selectedSeatsOfType > this.getCounterValue(personType)) {
        const index = this.selectedSeats.findIndex(s => s.personType === personType);

        if (index !== -1) {
          const oldSeat = this.selectedSeats.splice(index, 1)[0];
          const newSeat = this.seats.find(s => s.Reihennummer === oldSeat.Reihennummer && s.Sitznummer === oldSeat.Sitznummer);

          const newPersonType = this.getPersonType();
          const newPriceBrutto = this.getBruttoPrice(newPersonType, newSeat);
          const newPriceNetto = this.getNettoPrice(newPersonType, newSeat);

          const updatedSeat = { ...oldSeat, personType: newPersonType, priceBrutto: newPriceBrutto, priceNetto: newPriceNetto };

          this.selectedSeats.splice(index, 0, updatedSeat);
        }
      }
    }
  }

  getCounterValue(personType: string){
    let count: number = 0;
    switch (personType) {
      case 'Adult':
        count = this.adultCounterValue;
        break;
      case 'Student':
        count = this.studentCounterValue;
        break;
      case 'Child':
        count = this.childCounterValue;
        break;
      default:
        break;
    }
    return count;
  }

  getTotalCount(): number {
    return this.adultCounterValue + this.studentCounterValue + this.childCounterValue;
  }

  canSelectMoreSeats(): boolean {
    return this.selectedSeats.length < this.getTotalCount();
  }

  getPersonType(): string {
    let personType = '';
    let adult = this.selectedSeats.filter(pt => pt.personType === 'Adult').length;
    let student = this.selectedSeats.filter(pt => pt.personType === 'Student').length;
    let child = this.selectedSeats.filter(pt => pt.personType === 'Child').length;

    if (adult < this.adultCounterValue) {
      personType = 'Adult';
    } else if (student < this.studentCounterValue) {
      personType = 'Student';
    } else if (child < this.childCounterValue) {
      personType = 'Child';
    }

    return personType;
  }

  getBruttoPrice(personType: string, seat: any): number {
    let priceData = this.tickets.find(t => t.Tickettyp === personType && t.Sitztyp === seat.Sitztyp);
    console.log('Ausgewähltes Ticket', priceData);
    if (priceData) {
      console.log('Preis: ', priceData.PreisBrutto)
      return priceData.PreisBrutto;
    } else {
      return 0;
    }
  }

  private getNettoPrice(personType: string, seat: any) {
    let priceData = this.tickets.find(t => t.Tickettyp === personType && t.Sitztyp === seat.Sitztyp);
    console.log('Ausgewähltes Ticket', priceData);
    if (priceData) {
      console.log('Preis: ', priceData.PreisBrutto)
      return priceData.PreisNetto;
    } else {
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
          const personType = this.getPersonType();
          console.log(personType);
          const priceBrutto = this.getBruttoPrice(personType, seat);
          const priceNetto = this.getNettoPrice(personType, seat);
          this.selectedSeats.push({
            Sitztyp: seat.Sitztyp,
            Reihennummer: seat.Reihennummer,
            Sitznummer: seat.Sitznummer,
            personType,
            priceBrutto,
            priceNetto
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
