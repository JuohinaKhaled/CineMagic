import {Ticket} from './ticket';

describe('Ticket', () => {
  it('should create an instance', () => {
    expect(new Ticket(
      22,
      '2D',
      'Child',
      'Standard',
      2.33,
      2.77)).toBeTruthy();
  });
});
