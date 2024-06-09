import { Room } from './room';

describe('Room', () => {
  it('should create an instance', () => {
    expect(new Room(1,'Kino 5', 150, '2D')).toBeTruthy();
  });
});
