import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoomService} from "./service/room.service";
import {ActivatedRoute} from "@angular/router";
import {MovieService} from "../movie/movie.service";
import {TicketService} from "../ticket/service/ticket.service";
import {Room} from "../models/room";
import {Event} from "../models/event";
import {Ticket} from "../models/ticket";
import {Observable, of, switchMap} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {SocketService} from "./service/socket.service";
import {EventService} from "../event/service/event.service";


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent implements OnInit, OnDestroy {

  room$: Observable<Room | any> | undefined;
  event$: Observable<Event | any> | undefined;
  movie: any;
  seats: any[] = [];
  groupedSeats: any[][] = [];
  eventID: number = 0;
  movieID: number = 0;
  adultCounterValue: number = 0;
  studentCounterValue: number = 0;
  childCounterValue: number = 0;
  totalPriceBrutto: number = 0;
  totalPriceNetto: number = 0;
  selectedSeats: any[] = [];
  otherSelectedSeats: any[] = [];
  tickets: Ticket[] = []


  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private ticketService: TicketService,
    private socketService: SocketService,
    private eventService: EventService) {
  }

  ngOnInit(): void {
    this.initializeIDs();
    this.getRoom();
    this.getSeats();
    this.getMovie();
    this.getEvent();
    this.getOtherClientSeats();
    this.getCurrentClientSeats();
    this.getSeatsReleasedByOtherClient();
  }

  private initializeIDs() {
    try {
      this.movieID = +this.route.snapshot.paramMap.get('movieID')!;
      this.eventID = +this.route.snapshot.paramMap.get('eventID')!;
    } catch (error) {
      console.error('Error initializing IDs:', error);
      throw error;
    }
  }

  getOtherClientSeats() {
    this.socketService.getOtherClientSeat().subscribe(
      (data) => {
        this.otherSelectedSeats = data;
        this.otherSelectedSeats.forEach(seat => {
          const seatToUpdate = this.seats.find(s => s.Reihennummer === seat.Reihennummer && s.Sitznummer === seat.Sitznummer);
          if (seatToUpdate) {
            seatToUpdate.Buchungsstatus = 'Occupied';
          }
        });
      },
      (error) => {
        console.error("Error loading seats:", error);
      });
  }

  getSeatsReleasedByOtherClient() {
    this.socketService.getSeatReleasedByOtherClient().subscribe(
      (seat) => {
        const seatToUpdate = this.seats.find(s => s.Reihennummer === seat.Reihennummer && s.Sitznummer === seat.Sitznummer);
        if (seatToUpdate) {
          seatToUpdate.Buchungsstatus = 'Free';
        }
      },
      (error) => {
        console.error("Error loading released seats:", error);
      }
    );
  }

  getCurrentClientSeats() {
    this.socketService.getCurrentClientSeat().subscribe(
      (data) => {
        this.selectedSeats = data;
        this.updateTotalPrice();
        console.log("Seats loaded:", this.selectedSeats);
      },
      (error) => {
        console.error("Error loading seats:", error);
      });
  }


  getEvent() {
    this.event$ = this.eventService.fetchEvent(this.eventID).pipe(
      catchError(err => {
        console.error('Error fetching Event:', err);
        return [];
      })
    );
  }

  getRoom() {
    this.room$ = this.roomService.fetchRoom(this.eventID).pipe(
      switchMap(room =>{
        if (room) {
          this.ticketService.fetchTickets(room.roomType).pipe(
            tap( data => {
              this.tickets = data;
            }),
            catchError(err => {
              console.error('Error fetching Tickets:', err);
              return of([]); // Handle error as needed
            })
          );
        } else {
          console.error('Room not fetched');
          return of(null); // Return null or handle case where room is not fetched
        }
        return of(room);
      }),
      catchError(err => {
        console.error('Error fetching Room:', err);
        return of(null); // Handle error as needed
      })
    );
  }


  getSeats() {
    this.roomService.fetchSeats(this.eventID).subscribe(
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

  getMovie() {
    this.movieService.fetchMovie(this.movieID).subscribe(
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
    this.updateSelectedSeats(type);
  }

  updateSelectedSeats(personType: string) {
    console.log("HIEEEEER:", this.otherSelectedSeats, this.selectedSeats)
    const totalSeats = this.getTotalCount();
    if (this.selectedSeats.length > totalSeats) {
      console.log('WHAT: :D', this.selectedSeats.length, this.selectedSeats);
      const seatIndex = this.selectedSeats.findIndex(s => s.personType === personType);
      console.log("SEATINDEX:", seatIndex);
      if (seatIndex !== -1) {
        const removedSeat = this.selectedSeats.splice(seatIndex, 1)[0];
        console.log("RemovedSeat", removedSeat);
        const seatToDeselect = this.seats.find(s => s.Reihennummer === removedSeat.Reihennummer && s.Sitznummer === removedSeat.Sitznummer);
        console.log("SeatToDeselect", seatToDeselect);
        this.socketService.releaseSeat(seatToDeselect);
        if (seatToDeselect) {
          seatToDeselect.selected = false;
        }
      }
    } else {
      const selectedSeatsOfType = this.selectedSeats.filter(s => s.personType === personType).length;
      // Überprüfe, ob die Anzahl der ausgewählten Sitze kleiner als der entsprechende Counter ist

      if (selectedSeatsOfType > this.getCounterValue(personType)) {
        const index = this.selectedSeats.findIndex(s => s.personType === personType);

        console.log(index);
        if (index !== -1) {
          const oldSeat = this.selectedSeats.splice(index, 1)[0];
          const newSeat = this.seats.find(s => s.Reihennummer === oldSeat.Reihennummer && s.Sitznummer === oldSeat.Sitznummer);

          const newPersonType = this.getPersonType();
          const newPriceBrutto = this.getBruttoPrice(newPersonType, newSeat);
          const newPriceNetto = this.getNettoPrice(newPersonType, newSeat);

          const updatedSeat = {
            ...oldSeat,
            personType: newPersonType,
            priceBrutto: newPriceBrutto,
            priceNetto: newPriceNetto
          };
          console.log('Alter Sitz:', oldSeat);
          console.log('Neuer Sitz: ', updatedSeat);
          this.selectedSeats.splice(index, 0, updatedSeat);
          this.socketService.updateSeat(updatedSeat);
        }
      }
    }
  }

  getCounterValue(personType: string) {
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
    let priceData = this.tickets.find(t => t.ticketType === personType && t.seatType === seat.Sitztyp);
    console.log('Ausgewähltes Ticket', priceData);
    if (priceData) {
      console.log('Preis: ', priceData.priceBrutto)
      return priceData.priceNetto;
    } else {
      return 0;
    }
  }

  getNettoPrice(personType: string, seat: any) {
    let priceData = this.tickets.find(t => t.ticketType === personType && t.seatType === seat.Sitztyp);
    console.log('Ausgewähltes Ticket', priceData);
    if (priceData) {
      console.log('Preis: ', priceData.priceBrutto)
      return priceData.priceNetto;
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
        this.socketService.reserveSeat({
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
    const index = this.selectedSeats.findIndex(s => s.Reihennummer === seat.Reihennummer && s.Sitznummer === seat.Sitznummer);
    if (index > -1) {
      console.log("Seat found at index: ", index);
      const seatToDeselect = this.seats.find(s => s.Reihennummer === seat.Reihennummer && s.Sitznummer === seat.Sitznummer);
      this.socketService.releaseSeat(seatToDeselect);
      if (seatToDeselect) {
        seatToDeselect.selected = false;
      }
      console.log('Seat removed:', seat);
    } else {
      console.log('Seat not found in selectedSeats:', seat);
    }
  }

  updateTotalPrice() {
    this.totalPriceBrutto = 0;
    this.totalPriceNetto = 0;
    this.selectedSeats.forEach(seat => {
      this.totalPriceBrutto += seat.priceBrutto;
      this.totalPriceNetto += seat.priceNetto;
    })
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }


}
