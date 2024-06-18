import { Seat } from './seat';

describe('Seat', () => {
  it('should create an instance', () => {
    expect(new Seat(0,0,0,0,'','')).toBeTruthy();
  });
});
