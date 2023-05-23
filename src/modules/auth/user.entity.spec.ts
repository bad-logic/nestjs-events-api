import { User } from './user.entity';

test('User should be initialized through constructor', () => {
  const user = new User({
    email: 'user@email.com',
    id: 5,
  });

  expect(user).toEqual({
    email: 'user@email.com',
    id: 5,
    attended: undefined,
    events: undefined,
    password: undefined,
    username: undefined,
    profile: undefined,
  });
});
