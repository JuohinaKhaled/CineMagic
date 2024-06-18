import {Event} from './event';

describe('Event', () => {
  it('should create an instance', () => {
    expect(new Event(1, 2, 3, '2024-06-08', '14:30', 100, '', '')).toBeTruthy();
  });
});
