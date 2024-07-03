import {Component, OnInit, ViewChild} from '@angular/core';
import {RoomService} from "../../services/room/room.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MovieService} from "../../services/movie/movie.service";
import {TicketService} from "../../services/ticket/ticket.service";
import {Room} from "../../models/room/room";
import {of, switchMap, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {SocketService} from "../../services/socket/socket.service";
import {EventService} from "../../services/event/event.service";
import {AuthService} from "../../services/auth/auth.service";
import {ModalComponent} from "../modal/modal.component";
import {ModalService} from "../../services/modal/modal.service";
import {BookingService} from "../../services/booking/booking.service";
import {CustomSnackbarService} from "../../services/custom-snackbar/custom-snackbar.service";


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  @ViewChild('modal') modal!: ModalComponent;
  room?: Room;
  event: any;
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
  tickets: any[] = [];
  customerID!: number;
  bookingID?: number;
  currentDate: string = '';

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
    this.getMovie();
    this.getEvent();
    this.getRoom();
    this.getSeats();
    this.getOtherClientSeats();
    this.getCurrentClientSeats();
    this.getSeatsReleasedByOtherClient();
    this.setCounter();
  }

  getCustomerID() {
    this.customerID = this.authService.getCustomerID()!;
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

  setCounter() {
    this.socketService.getCurrentCount('Adult', this.eventID).subscribe(
      startValue => {
        this.adultCounterValue = startValue;
      },
      error => {
        console.error("Error loading counter:", error);
      });
    this.socketService.getCurrentCount('Child', this.eventID).subscribe(
      startValue => {
        this.childCounterValue = startValue;
      },
      error => {
        console.error("Error loading counter:", error);
      });
    this.socketService.getCurrentCount('Student', this.eventID).subscribe(
      startValue => {
        this.studentCounterValue = startValue;
      },
      error => {
        console.error("Error loading counter:", error);
      });
  }


  getOtherClientSeats() {
    this.socketService.getOtherClientSeat(this.eventID).subscribe(
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
    this.socketService.getSeatReleasedByOtherClient(this.eventID).subscribe(
      (seat) => {
        const seatToUpdate = this.seats.find(s => s.Reihennummer === seat.Reihennummer && s.Sitznummer === seat.Sitznummer);
        if (seatToUpdate) {
          seatToUpdate.Buchungsstatus = seat.isBooked ? 'Occupied' : 'Free';
        }
      },
      (error) => {
        console.error("Error loading released seats:", error);
      }
    );
  }

  getCurrentClientSeats() {
    this.socketService.getCurrentClientSeat(this.eventID).subscribe(
      (data) => {
        this.selectedSeats = data;
        this.selectedSeats.forEach(seat => {
          const seatToSelect = this.seats.find(s => s.Reihennummer === seat.Reihennummer && s.Sitznummer === seat.Sitznummer);
          if (seatToSelect) {
            seatToSelect.selected = true;
          }
        });
        this.updateTotalPrice();
        console.log("Seats loaded:", this.selectedSeats);
      },
      (error) => {
        console.error("Error loading seats:", error);
      });
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

  getEvent() {
    this.eventService.getEvent(this.eventID).subscribe(
      (data) => {
        this.event = data;
        console.log("Movie loaded:", this.movie);
      },
      (error) => {
        console.error("Error fetching movie details:", error);
      }
    );
  }

  getRoom() {
    this.roomService.getRoom(this.eventID).pipe(
      tap((data) => {
        this.room = new Room(data[0].roomID, data[0].roomName, data[0].roomCapacity, data[0].roomType);
        console.log("Room loaded:", this.room);
      }), switchMap(() => {
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

  getSeats() {
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
    let maxRowNumber = Math.max(...this.seats.map(seat => seat.Reihennummer));
    this.groupedSeats = Array.from({length: maxRowNumber}, () => []);
    for (let seat of this.seats) {
      this.groupedSeats[seat.Reihennummer - 1][seat.Sitznummer - 1] = seat;
    }
    console.log('Room_Component: Seats grouped by row: ', this.groupedSeats);
  }

  getMovie() {
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
    this.updateSelectedSeats(type);
  }

  updateSelectedSeats(personType: string) {
    const totalSeats = this.getTotalCount();
    if (this.selectedSeats.length > totalSeats) {
      const seatIndex = this.selectedSeats.findIndex(s => s.personType === personType);
      if (seatIndex !== -1) {
        const removedSeat = this.selectedSeats.splice(seatIndex, 1)[0];
        console.log("RemovedSeat", removedSeat);
        const seatToDeselect = this.seats.find(s => s.Reihennummer === removedSeat.Reihennummer && s.Sitznummer === removedSeat.Sitznummer);
        console.log("SeatToDeselect", seatToDeselect);
        this.socketService.releaseSeat(seatToDeselect, this.eventID, false);
        if (seatToDeselect) {
          seatToDeselect.selected = false;
        }
      }
    } else {
      const selectedSeatsOfType = this.selectedSeats.filter(s => s.personType === personType).length;

      if (selectedSeatsOfType > this.getCounterValue(personType)) {
        const index = this.selectedSeats.findIndex(s => s.personType === personType);

        console.log(index);
        if (index !== -1) {
          const oldSeat = this.selectedSeats.splice(index, 1)[0];
          const newSeat = this.seats.find(s => s.Reihennummer === oldSeat.Reihennummer && s.Sitznummer === oldSeat.Sitznummer);

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
          console.log('Alter Sitz:', oldSeat);
          console.log('Neuer Sitz: ', updatedSeat);
          this.selectedSeats.splice(index, 0, updatedSeat);
          this.socketService.updateSeat(updatedSeat, this.eventID);
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
    let ticket = this.tickets.find(t => t.Tickettyp === personType && t.Sitztyp === seat.Sitztyp);
    return ticket ? ticket.TicketID : 0;
  }

  getBruttoPrice(personType: string, seat: any): number {
    let priceData = this.tickets.find(t => t.Tickettyp === personType && t.Sitztyp === seat.Sitztyp);
    return priceData ? priceData.PreisBrutto : 0;
  }

  getNettoPrice(personType: string, seat: any) {
    let priceData = this.tickets.find(t => t.Tickettyp === personType && t.Sitztyp === seat.Sitztyp);
    return priceData ? priceData.PreisNetto : 0;
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
        const ticketID = this.getTicketID(personType, seat);
        const priceBrutto = this.getBruttoPrice(personType, seat);
        const priceNetto = this.getNettoPrice(personType, seat);
        this.socketService.reserveSeat({
          SitzplatzID: seat.SitzplatzID,
          Sitztyp: seat.Sitztyp,
          Reihennummer: seat.Reihennummer,
          Sitznummer: seat.Sitznummer,
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
    return this.selectedSeats.some(s => s.Reihennummer === seat.Reihennummer && s.Sitznummer === seat.Sitznummer);
  }

  removeSeat(seat: any) {
    const index = this.selectedSeats.findIndex(s => s.Reihennummer === seat.Reihennummer && s.Sitznummer === seat.Sitznummer);
    if (index > -1) {
      const removeSeat = this.seats.find(s => s.Reihennummer === seat.Reihennummer && s.Sitznummer === seat.Sitznummer);
      if (removeSeat) {
        this.socketService.releaseSeat(removeSeat, this.eventID, false);
        removeSeat.selected = false;
        console.log('Room_Component: Seat removed:', removeSeat);
      } else {
        console.log('Room_Component: Seat not found:', removeSeat);
      }
    } else {
      console.log('Seat not found in selectedSeats:', seat);
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
          console.log(this.bookingID);
        } else {
          this.router.navigate([navigationMap[action]]);
        }
      } else {
        console.log('Room_Component: Modal cancelled or closed!');
      }
    }).catch(() => {
      console.log('Room_Component: Modal could not be opened!');
    });
  }

  setDate() {
    return this.currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  addBooking() {
    this.bookingService.addBooking(this.customerID, this.eventID, this.setDate(), this.totalPriceNetto, this.totalPriceBrutto,
      this.adultCounterValue, this.childCounterValue, this.studentCounterValue)
      .subscribe({
        next: (bookingID) => {
          this.bookingID = bookingID;
          console.log('Booking_Component: Create Booking successful: ', bookingID);
          if (bookingID) {
            this.bookSeats(bookingID);
            this.router.navigate(['/booking', this.bookingID]);
          }
        },
        error: (error) => {
          console.error('Booking_Component: Error creating Booking: ', error)
        }
      })
  }

  bookSeats(bookingID: number) {
    this.selectedSeats.forEach(seat => {
      this.bookingService.bookTickets(bookingID, this.customerID, this.eventID, seat.SitzplatzID, seat.ticketID).subscribe({
        next: (result: any) => {
          if (result) {
            this.socketService.releaseSeat(seat, this.eventID, true);
            this.snackBar.openSnackBar("Booking successful");
            console.log('Booking tickets for seat successful:', result);
          } else {
            console.error('Error booking tickets for seat:', result);
          }
        },
        error: (error) => {
          this.snackBar.openSnackBar("Error during your booking. Please try again.");
          console.error('Error booking tickets for seat:', seat, error);
          return throwError(error);
        }
      })
    });
  }

}
