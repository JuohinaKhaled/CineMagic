import { User } from './user';

describe('Customer', () => {
  it('should create an instance', () => {
    expect(new User(0,'','','','','')).toBeTruthy();
  });
});
