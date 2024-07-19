import {Booking} from './booking';

describe('Booking', () => {
  it('should create an instance', () => {
    expect(new Booking(
      1,
      '2024-07-10',
      2.33,
      2.77,
      1,
      0,
      0,
      'booked',
      new Date(2024, 9, 5),
      '17:00',
      1,
      'Titanic',
      3,
      18,
      'Action',
      'Kino 5',
      '2D')).toBeTruthy();
  });
});
