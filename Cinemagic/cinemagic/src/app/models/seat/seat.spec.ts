import {Seat} from './seat';

describe('Seat', () => {
  it('should create an instance', () => {
    expect(new Seat(
      1,
      1,
      1,
      1,
      'Premium',
      'Occupied')).toBeTruthy();
  });
});
