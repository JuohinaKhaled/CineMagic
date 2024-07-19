export class BookingTicket {
  seatID: number;
  roomID: number;
  rowNumber: number;
  seatNumber: number;
  seatType: string;
  roomType: string;
  personType: string;
  priceNetto: number;
  priceBrutto: number;

  constructor
  (
    seatID: number,
    roomID: number,
    rowNumber: number,
    seatNumber: number,
    seatType: string,
    roomType: string,
    personType: string,
    priceNetto: number,
    priceBrutto: number
  ) {
    this.seatID = seatID;
    this.roomID = roomID;
    this.rowNumber = rowNumber;
    this.seatNumber = seatNumber;
    this.seatType = seatType;
    this.roomType = roomType;
    this.personType = personType;
    this.priceNetto = priceNetto;
    this.priceBrutto = priceBrutto;
  }
}
