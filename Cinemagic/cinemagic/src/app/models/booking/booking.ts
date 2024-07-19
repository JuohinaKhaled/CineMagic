export class Booking {
  bookingID: number;
  bookingDate: string;
  totalPriceNetto: number;
  totalPriceBrutto: number;
  counterTicketsAdult: number;
  counterTicketsChild: number;
  counterTicketsStudent: number;
  bookingStatus: string;
  eventDate: Date;
  eventTime: string;
  movieID: number;
  movieName: string;
  duration: number;
  age: number;
  genre: string;
  roomName: string;
  roomType: string;


  constructor
  (
    bookingID: number,
    bookingDate: string,
    totalPriceNetto: number,
    totalPriceBrutto: number,
    counterTicketsAdult: number,
    counterTicketsChild: number,
    counterTicketsStudent: number,
    bookingStatus: string,
    eventDate: Date,
    eventTime: string,
    movieID: number,
    movieName: string,
    duration: number,
    age: number,
    genre: string,
    roomName: string,
    roomType: string,
  ) {
    this.bookingID = bookingID;
    this.bookingDate = bookingDate;
    this.totalPriceNetto = totalPriceNetto;
    this.totalPriceBrutto = totalPriceBrutto;
    this.counterTicketsAdult = counterTicketsAdult;
    this.counterTicketsChild = counterTicketsChild;
    this.counterTicketsStudent = counterTicketsStudent;
    this.bookingStatus = bookingStatus;
    this.eventDate = eventDate;
    this.eventTime = eventTime;
    this.movieID = movieID;
    this.movieName = movieName;
    this.duration = duration;
    this.age = age;
    this.genre = genre;
    this.roomName = roomName;
    this.roomType = roomType;
  }
}
