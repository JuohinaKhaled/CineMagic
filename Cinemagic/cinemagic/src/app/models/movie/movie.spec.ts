import {Movie} from './movie';

describe('Movie', () => {
  it('should create an instance', () => {
    expect(new Movie(
      1,
      'Titanic',
      'This is the movie Titanic.',
      2,
      18,
      'Drama',
      '',
      '2024-07-10',
      5,
      25,
      'assets/images/...',
      'assets/images/...',
      'assets/images/...',
      'assets/images/...')).toBeTruthy();
  });
});
