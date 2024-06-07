export class Event {
  eventID: number;
  movieID: number;
  roomID: number;
  eventDate: string;
  eventTime: string;
  soldTickets: number;

  constructor(eventID: number, movieID: number, roomID: number, eventDate: string, eventTime: string, soldTickets: number) {
    this.eventID = eventID;
    this.movieID = movieID;
    this.roomID = roomID;
    this.eventDate = eventDate;
    this.eventTime = eventTime;
    this.soldTickets = soldTickets;
  }
}
