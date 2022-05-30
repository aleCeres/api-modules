import request from 'supertest';
import app from '../src/server';
import { AppDataSource } from '../src/AppDataSource';

jest.mock('../src/lib/google', () => ({
  __esModule: true,
  getUserByToken: jest.fn(() => ({
    email: 'test@test.test',
    first_name: 'test',
    last_name: 'test',
    signup_kind: 'google',
  })),
}));

describe('auth/google', () => {
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
      .post('/auth/google')
      .send({ token: 'valid token' });

    const usersAfterInsertion = await AppDataSource.query('SELECT * FROM public.user');
    expect(res.status).toBe(200);
    expect(usersBeforeInsertion.length).toBe(0);
    expect(usersAfterInsertion.length).toBe(1);
  });

  it.each([
    [{}, 400],
    [{ tokenss: 'wrong tokensd' }, 400],
  ])('%o should return %i', async (body, expectedStatusCode) => {
    const res = await request(app)
      .post('/auth/google')
      .send(body);

    expect(res.status).toBe(expectedStatusCode);
  });

  it('should return 500', async () => {
    jest.resetAllMocks();
    const res = await request(app)
      .post('/auth/google')
      .send({ token: 'wrong token' });

    expect(res.status).toBe(500);
  });
});
