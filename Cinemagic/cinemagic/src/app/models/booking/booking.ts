export class Booking {
  bookingID: number;
  customerID: number;
  purchaseDate: string;
  totalPriceNetto: number;
  totalPriceBrutto: number;
  counterTicketsAdult: number;
  counterTicketsChild: number;
  counterTicketsStudent: number;
  paid: boolean;

  constructor
  (
    bookingID: number,
    customerID: number,
    purchaseDate: string,
    totalPriceNetto: number,
    totalPriceBrutto: number,
    counterTicketsAdult: number,
    counterTicketsChild: number,
    counterTicketsStudent: number,
    paid: boolean
  ) {
    this.bookingID = bookingID;
    this.customerID = customerID;
    this.purchaseDate = purchaseDate;
    this.totalPriceNetto = totalPriceNetto;
    this.totalPriceBrutto = totalPriceBrutto;
    this.counterTicketsAdult = counterTicketsAdult;
    this.counterTicketsChild = counterTicketsChild;
    this.counterTicketsStudent = counterTicketsStudent;
    this.paid = paid;
  }
}
