export class Room {
  roomID: number;
  roomName: string;
  roomCapacity: number;
  roomType: string;

  constructor
  (
    roomID: number,
    roomName: string,
    roomCapacity: number,
    roomType: string
  ) {
    this.roomID = roomID;
    this.roomName = roomName;
    this.roomCapacity = roomCapacity;
    this.roomType = roomType;
  }

}
