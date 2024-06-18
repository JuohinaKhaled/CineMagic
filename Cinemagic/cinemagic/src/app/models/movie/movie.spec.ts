import { Movie } from './movie';

describe('Movie', () => {
  it('should create an instance', () => {
    expect(new Movie(0,'','',0,0,'','','',0,0,'','')).toBeTruthy();
  });
});
