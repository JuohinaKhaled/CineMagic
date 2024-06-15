export class Event {
  eventID: number;
  movieID: number;
  roomID: number;
  eventDate: string;
  eventTime: string;
  soldTickets: number;
  roomName: string;
  roomType: string;

  constructor(eventID: number, movieID: number, roomID: number, eventDate: string, eventTime: string, soldTickets: number,
              roomName: string, roomType: string) {
    this.eventID = eventID;
    this.movieID = movieID;
    this.roomID = roomID;
    this.eventDate = eventDate;
    this.eventTime = eventTime;
    this.soldTickets = soldTickets;
    this.roomName = roomName;
    this.roomType = roomType;
  }
}
