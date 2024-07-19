export class Event {
  eventID: number;
  movieID: number;
  roomID: number;
  eventDate: string;
  eventTime: string;
  roomName: string;
  roomType: string;

  constructor
  (
    eventID: number,
    movieID: number,
    roomID: number,
    eventDate: string,
    eventTime: string,
    roomName: string,
    roomType: string
  ) {
    this.eventID = eventID;
    this.movieID = movieID;
    this.roomID = roomID;
    this.eventDate = eventDate;
    this.eventTime = eventTime;
    this.roomName = roomName;
    this.roomType = roomType;
  }

}
