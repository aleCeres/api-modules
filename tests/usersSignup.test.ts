import request from 'supertest';
import app from '../src/server';
import { AppDataSource } from '../src/AppDataSource';
import { User } from '../src/entity/User';

describe('users/signup', () => {
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
    const usersBeforeInsertion = await AppDataSource.query('SELECT * FROM public.user');

    const res = await request(app)
      .post('/users/signup')
      .send({
        email: 'test@test.com',
        password: 'test',
        first_name: 'test',
        last_name: 'test',
      });

    const usersAfterInsertion = await AppDataSource.query('SELECT * FROM public.user');
    expect(res.status).toBe(201);
    expect(usersBeforeInsertion.length).toBe(0);
    expect(usersAfterInsertion.length).toBe(1);
  });

  it.each([
    {},
    {
      email: 'test@test.com',
      password: 'test',
      first_name: 'test',
    },
    {
      email: 'test@test.com',
      password: 'test',
      last_name: 'test',
    },
    {
      email: 'test@test.com',
      last_name: 'test',
      first_name: 'test',
    },
    {
      password: 'dsaest.com',
      last_name: 'test',
      first_name: 'test',
    },
    {
      first_name: 'dsam',
      last_name: 'test',
    },
    {
      password: 'ts',
      last_name: 'test',
    },
    {
      password: 'test@test.com',
      email: 'test',
    },
    {
      email: 'test@test.com',
      last_name: 'test',
    },
  ])('%o should return 400', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send({});

    expect(res.status).toBe(400);
  });

  it('should return 409 if exists a user with the same email', async () => {
    const userAlreadyRegistered = {
      email: 'alreadyRegistered@test.com',
      password: 'alreadyRegistered',
      first_name: 'alreadyRegistered',
      last_name: 'alreadyRegistered',
    };
    await AppDataSource.manager.insert(User, { ...userAlreadyRegistered, signup_kind: 'with_password' });

    const res = await request(app)
      .post('/users/signup')
      .send(userAlreadyRegistered);

    expect(res.status).toBe(409);
  });
});
