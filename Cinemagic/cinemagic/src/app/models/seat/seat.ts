export class Seat {
  seatID: number;
  roomID: number;
  rowNumber: number;
  seatNumber: number;
  seatType: string
  bookingStatus: string;
  personType: string;
  priceBrutto: number;
  priceNetto: number;

  constructor
  (
    seatID: number,
    roomID: number,
    rowNumber: number,
    seatNumber: number,
    seatType: string,
    bookingStatus: string
  ) {
    this.seatID = seatID;
    this.roomID = roomID;
    this.rowNumber = rowNumber;
    this.seatNumber = seatNumber;
    this.seatType = seatType
    this.bookingStatus = bookingStatus;
    this.personType = '';
    this.priceBrutto = 0;
    this.priceNetto = 0;
  }

}
