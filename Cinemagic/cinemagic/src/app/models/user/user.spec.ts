import { User } from './user';

describe('Customer', () => {
  it('should create an instance', () => {
    expect(new User(
      44,
      'danzel@washington.com',
      '01783456780',
      'xyz',
      'Danzel',
      'Washington')).toBeTruthy();
  });
});
