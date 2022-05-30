import request from 'supertest';
import app from '../src/server';
import { AppDataSource } from '../src/AppDataSource';
import { upsert } from '../src/repository/user';
import { getAuthToken } from '../src/utils/jwt';

describe('users/login', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  afterEach(async () => {
    await AppDataSource.query('DELETE FROM public.user');
    jest.clearAllMocks();
    app.close();
  });

  it('should return 200', async () => {
    const user = {
      email: 'user@test.com',
      password: 'password',
      first_name: 'first_name',
      last_name: 'last_name',
    };
    const userId = await upsert({ ...user, signup_kind: 'with_password' });
    const expectedToken = getAuthToken(userId);
    const res = await request(app)
      .post('/users/login')
      .send({
        email: user.email,
        password: user.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe(expectedToken);
  });

  it.each([
    {},
    {
      email: 'test@test.com',
    },
    {
      password: 'test',
    },
  ])('%o should return 400', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({});

    expect(res.status).toBe(400);
  });
});
