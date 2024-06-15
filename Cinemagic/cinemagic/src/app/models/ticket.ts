export class Ticket {
  ticketID: number;
  roomType: string;
  ticketType: string;
  seatType: string;
  priceNetto: number;
  priceBrutto: number;

  constructor(ticketID: number, roomType: string, ticketType: string, seatType: string, priceNetto: number, priceBrutto: number,) {
    this.ticketID = ticketID;
    this.roomType = roomType;
    this.ticketType = ticketType;
    this.seatType = seatType;
    this.priceNetto = priceNetto;
    this.priceBrutto = priceBrutto;
  }
}
