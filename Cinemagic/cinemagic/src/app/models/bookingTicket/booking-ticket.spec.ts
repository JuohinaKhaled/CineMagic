import {BookingTicket} from './booking-ticket';

describe('BookingTicket', () => {
  it('should create an instance', () => {
    expect(new BookingTicket(
      22,
      2,
      2,
      1,
      'Premium',
      '2D',
      'Adult',
      2.33,
      2.77
    )).toBeTruthy();
  });
});
