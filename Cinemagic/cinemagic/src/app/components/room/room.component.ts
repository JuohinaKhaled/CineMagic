import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of, switchMap, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {RoomService} from "../../services/room/room.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MovieService} from "../../services/movie/movie.service";
import {TicketService} from "../../services/ticket/ticket.service";
import {SocketService} from "../../services/socket/socket.service";
import {EventService} from "../../services/event/event.service";
import {AuthService} from "../../services/auth/auth.service";
import {ModalComponent} from "../modal/modal.component";
import {ModalService} from "../../services/modal/modal.service";
import {BookingService} from "../../services/booking/booking.service";
import {CustomSnackbarService} from "../../services/custom-snackbar/custom-snackbar.service";
import {Room} from "../../models/room/room";
import {Event} from "../../models/event/event";
import {Movie} from "../../models/movie/movie";
import {Seat} from "../../models/seat/seat";
import {Ticket} from "../../models/ticket/ticket";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  @ViewChild('modal') modal!: ModalComponent;
  room$: Observable<Room | null> | undefined;
  event$: Observable<Event> | undefined;
  movie$: Observable<Movie> | undefined;
  groupedSeats$: Observable<Seat[][]> | undefined;
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  tickets: Ticket[] = [];
  otherSelectedSeats: Seat[] = [];

  customerID!: number;
  eventID: number = 0;
  movieID: number = 0;
  bookingID!: number;
  adultCounterValue: number = 0;
  studentCounterValue: number = 0;
  childCounterValue: number = 0;
  totalPriceBrutto: number = 0;
  totalPriceNetto: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private movieService: MovieService,
    private ticketService: TicketService,
    private socketService: SocketService,
    private eventService: EventService,
    private authService: AuthService,
    private modalService: ModalService,
    private bookingService: BookingService,
    private snackBar: CustomSnackbarService
  ) {
  }

  ngOnInit(): void {
    this.getCustomerID();
    this.getEventID();
    this.getMovieID();
    this.getEvent();
    this.getMovie();
    this.getRoom();
    this.getSeats();
    this.getOtherClientSeats();
    this.getCurrentClientSeats();
    this.getSeatsReleasedByOtherClient();
    this.setCounter();
  }

  getCustomerID() {
    this.customerID = this.authService.getCurrentUser()?.customerID!;
    console.log('Room_Component: CustomerID fetched successful: ', this.customerID);
  }

  getEventID() {
    this.eventID = +this.route.snapshot.paramMap.get('eventID')!;
    console.log('Room_Component: EventID fetched successful: ', this.eventID);
  }

  getMovieID() {
    this.movieID = +this.route.snapshot.paramMap.get('movieID')!;
    console.log('Room_Component: MovieID fetched successful: ', this.movieID);
  }


  setCounter() {
    this.socketService.getCurrentCount('Adult', this.eventID).subscribe({
      next: (startValue) => {
        this.adultCounterValue = startValue;
      },
      error: (err) => {
        console.error("Room_Component: Error loading Adult-Counter:", err);
      }
    });

    this.socketService.getCurrentCount('Child', this.eventID).subscribe({
        next: (startValue) => {
          this.childCounterValue = startValue;
        },
        error: (err) => {
          console.error("Room_Component: Error loading Child-Counter:", err);
        }
      }
    );
    this.socketService.getCurrentCount('Student', this.eventID).subscribe({
      next: (startValue) => {
        this.studentCounterValue = startValue;
      },
      error: (err) => {
        console.error("Room_Component: Error loading Student-Counter:", err);
      }
    });
  }

  getOtherClientSeats() {
    this.socketService.getOtherClientSeat(this.eventID).subscribe({
      next: (data) => {
        this.otherSelectedSeats = data;
        this.otherSelectedSeats.forEach(seat => {
          const seatToUpdate = this.seats.find(s => s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber);
          if (seatToUpdate) {
            seatToUpdate.bookingStatus = 'Occupied';
          }
        });
        console.log('Room_Component: Selected Seats by Others loaded: ', this.selectedSeats);
      },
      error: (error) => {
        console.error('Room_Component: Error loading Selected Seats by Others:', error);
      }
    });
  }

  getSeatsReleasedByOtherClient() {
    this.socketService.getSeatReleasedByOtherClient(this.eventID).subscribe({
      next: (seat) => {
        const seatToUpdate = this.seats.find(s => s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber);
        if (seatToUpdate) {
          seatToUpdate.bookingStatus = seat.bookingStatus ? 'Occupied' : 'Free';
        }
        console.log('Room_Component: Released Seat fetched successful:', seat);
      },
      error: (err) => {
        console.error('Room_Component: Error loading released Seat: ', err);
        return throwError(err);
      }
    })
  }

  getCurrentClientSeats() {
    this.socketService.getCurrentClientSeat(this.eventID).subscribe({
      next: (data) => {
        this.selectedSeats = data;
        this.selectedSeats.forEach(seat => {
          const seatToSelect = this.seats.find(s => s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber);
          if (seatToSelect) {
            seatToSelect.selected = true;
          }
        });
        this.updateTotalPrice();
        console.log('Room_Component: Selected Seats loaded: ', this.selectedSeats);
      },
      error: (err) => {
        console.error('Room_Component: Error loading Selected Seats: ', err);
      }
    });
  }


  getEvent() {
    this.event$ = this.eventService.fetchEvent(this.eventID).pipe(
      tap(event => {
        console.log('Room_Component: Event fetched successful. ', event);
      }),
      catchError(err => {
        console.error('Room_Component: Error fetching Event: ', err);
        return throwError(err);
      })
    );
  }

  getRoom() {
    this.room$ = this.roomService.fetchRoom(this.eventID).pipe(
      switchMap(room => {
        if (room) {
          this.ticketService.fetchTickets(room.roomType).subscribe({
            next: (tickets) => {
              this.tickets = tickets;
              console.log('Room_Component: Tickets fetched successful: ', tickets);
            },
            error: (err) => {
              console.error('Room_Component: Error fetching Tickets: ', err);
            }
          });
        } else {
          console.error('Room_Component: Error fetching Room: ');
          return of(null);
        }
        return of(room);
      }),
      catchError(err => {
        console.error('Room_Component: Error fetching Room:', err);
        return of(null);
      })
    );
  }

  getSeats() {
    this.roomService.fetchAllSeats(this.eventID).subscribe({
      next: (data) => {
        this.seats = data;
        console.log('Room_Component: Loading Seats successful: ', this.seats);
        this.groupedSeats$ = this.groupSeatsByRow();
      },
      error: (error) => {
        console.error('Room_Component: Error loading Seats: ', error);
      }
    });
  }


  groupSeatsByRow(): Observable<Seat[][]> {
    let maxRowNumber: number = Math.max(...this.seats.map(seat => seat.rowNumber));
    let groupedSeats: any[][] = Array.from({length: maxRowNumber}, () => []);
    for (let seat of this.seats) {
      groupedSeats[seat.rowNumber - 1][seat.seatNumber - 1] = seat;
    }
    console.log('Room_Component: Seats grouped by row: ', groupedSeats);
    return of(groupedSeats);
  }

  getMovie() {
    this.movie$ = this.movieService.fetchMovie(this.movieID).pipe(
      tap(movie => {
        console.log('Room_Component: Movie fetched successful. ', movie);
      }),
      catchError(err => {
        console.error('Room_Component: Error fetching Movie: ', err);
        return throwError(err);
      })
    )
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
    this.updateSelectedSeats(type);
  }

  updateSelectedSeats(personType: string) {
    const totalSeats = this.getTotalCount();
    if (this.selectedSeats.length > totalSeats) {
      const seatIndex = this.selectedSeats.findIndex(s => s.personType === personType);
      if (seatIndex !== -1) {
        const removedSeat = this.selectedSeats.splice(seatIndex, 1)[0];
        const seatToDeselect = this.seats.find(s => s.rowNumber === removedSeat.rowNumber && s.seatNumber === removedSeat.seatNumber);
        this.socketService.releaseSeat(seatToDeselect, this.eventID, false);
        if (seatToDeselect) {
          seatToDeselect.selected = false;
        }
      }
    } else {
      const selectedSeatsOfType = this.selectedSeats.filter(s => s.personType === personType).length;
      if (selectedSeatsOfType > this.getCounterValue(personType)) {
        const index = this.selectedSeats.findIndex(s => s.personType === personType);
        if (index !== -1) {
          const oldSeat = this.selectedSeats.splice(index, 1)[0];
          const newSeat = this.seats.find(s => s.rowNumber === oldSeat.rowNumber && s.seatNumber === oldSeat.seatNumber);
          const newTicketID: number = this.getTicketID(personType, newSeat)
          const newPersonType: string = this.getPersonType();
          const newPriceBrutto: number = this.getBruttoPrice(newPersonType, newSeat);
          const newPriceNetto = this.getNettoPrice(newPersonType, newSeat);
          const updatedSeat = {
            ...oldSeat,
            ticketID: newTicketID,
            personType: newPersonType,
            priceBrutto: newPriceBrutto,
            priceNetto: newPriceNetto
          };
          this.selectedSeats.splice(index, 0, updatedSeat);
          this.socketService.updateSeat(updatedSeat, this.eventID);
        }
      }
    }
  }

  getCounterValue(personType: string) {
    switch (personType) {
      case 'Adult':
        return this.adultCounterValue;
      case 'Student':
        return this.studentCounterValue;
      case 'Child':
        return this.childCounterValue;
      default:
        return 0;
    }
  }

  getTotalCount(): number {
    return this.adultCounterValue + this.studentCounterValue + this.childCounterValue;
  }

  canSelectMoreSeats(): boolean {
    return this.selectedSeats.length < this.getTotalCount();
  }

  getPersonType(): string {
    if ((this.selectedSeats.filter(pt => pt.personType === 'Adult').length) < this.adultCounterValue) {
      return 'Adult';
    } else if ((this.selectedSeats.filter(pt => pt.personType === 'Student').length) < this.studentCounterValue) {
      return 'Student';
    } else if ((this.selectedSeats.filter(pt => pt.personType === 'Child').length) < this.childCounterValue) {
      return 'Child';
    }
    return '';
  }

  getTicketID(personType: string, seat: any): number {
    let ticket = this.tickets.find(t => t.personType === personType && t.seatType === seat.seatType);
    return ticket ? ticket.ticketID : 0;
  }

  getBruttoPrice(personType: string, seat: any): number {
    let priceData = this.tickets.find(t => t.personType === personType && t.seatType === seat.seatType);
    return priceData ? priceData.priceBrutto : 0;
  }

  getNettoPrice(personType: string, seat: any) {
    let priceData = this.tickets.find(t => t.personType === personType && t.seatType === seat.seatType);
    return priceData ? priceData.priceNetto : 0;
  }

  onSeatSelected(seat: any) {
    if (this.isSeatAlreadySelected(seat)) {
      this.removeSeat(seat);
    } else {
      if (this.canSelectMoreSeats()) {
        seat.selected = true;

        const personType = this.getPersonType();
        const ticketID = this.getTicketID(personType, seat);
        const priceBrutto = this.getBruttoPrice(personType, seat);
        const priceNetto = this.getNettoPrice(personType, seat);
        this.socketService.reserveSeat({
          seatID: seat.seatID,
          seatType: seat.seatType,
          rowNumber: seat.rowNumber,
          seatNumber: seat.seatNumber,
          ticketID,
          personType,
          priceBrutto,
          priceNetto
        }, this.eventID);
      } else {
        this.openModal('Maximum Seats Selected', 'warningMaxSeats')
      }
    }
  }

  isSeatAlreadySelected(seat: any): boolean {
    return this.selectedSeats.some(s => s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber);
  }

  removeSeat(seat: any) {
    const index = this.selectedSeats.findIndex(s => s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber);
    if (index > -1) {
      const removeSeat = this.seats.find(s => s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber);
      if (removeSeat) {
        this.socketService.releaseSeat(removeSeat, this.eventID, false);
        removeSeat.selected = false;
        console.log('Room_Component: Seat removed successful: ', removeSeat);
      } else {
        console.log('Room_Component: Error removing Seat: ', removeSeat);
      }
    } else {
      console.log('Room_Component: Seat not found in Selected Seats:', seat);
    }
  }

  updateTotalPrice() {
    this.totalPriceBrutto = this.selectedSeats.reduce((total, seat) => total + seat.priceBrutto, 0);
    this.totalPriceNetto = this.selectedSeats.reduce((total, seat) => total + seat.priceNetto, 0);
  }


  openModal(title: string, modalType: 'confirmBooking' | 'warningMaxSeats' | undefined) {
    let isLoggedIn = this.authService.isLoggedIn
    if (!this.authService.isLoggedIn && modalType === 'confirmBooking') {
      title = 'Please login';
    }

    console.log('Trying to open modal with title:', title, 'and type:', modalType);
    this.modalService.open(title, isLoggedIn, modalType).then(({action}) => {
      console.log('Modal opened successfully with result:', action);
      const navigationMap: { [key: string]: string } = {
        'login': '/login',
        'register': '/register',
        'confirmBooking': '/booking'
      };

      if (action && navigationMap[action]) {
        if (action === 'login') {
          const roomUrl = `/room/${this.eventID}/${this.movieID}`;
          this.authService.setRedirectUrl(roomUrl);
        }
        if (action === 'confirmBooking') {
          this.addBooking();
        } else {
          this.router.navigate([navigationMap[action]]);
        }
      } else {
        console.error('Room_Component: Modal cancelled or closed!');
      }
    }).catch(() => {
      console.error('Room_Component: Modal could not be opened!');
    });
  }

  setDate() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  addBooking() {
    this.bookingService.addBooking(this.customerID, this.eventID, this.setDate(), this.totalPriceNetto, this.totalPriceBrutto,
      this.adultCounterValue, this.childCounterValue, this.studentCounterValue).subscribe({
      next: (bookingID) => {
        this.bookingID = bookingID;
        if (bookingID) {
          this.bookTickets(bookingID);
          console.log('Room_Component: Booking added successful: ', bookingID);
          this.snackBar.openSnackBar("Booking successful");
          this.router.navigate(['/booking', this.bookingID]);
        }
      },
      error: (error) => {
        console.error('Room_Component: Error adding Booking: ', error)
      }
    })
  }

  bookTickets(bookingID: number) {
    this.selectedSeats.forEach(seat => {
      this.bookingService.bookTickets(bookingID, this.customerID, this.eventID, seat.seatID, seat.ticketID).subscribe({
        next: (result) => {
          this.socketService.releaseSeat(seat, this.eventID, true);
          console.log('Room_Component: Booking Tickets successful: ', result);
        },
        error: (error) => {
          this.snackBar.openSnackBar('Error during your booking. Please try again.');
          console.error('Room_Component: Error booking Tickets: ', seat, error);
          return throwError(error);
        }
      })
    });
  }

}
