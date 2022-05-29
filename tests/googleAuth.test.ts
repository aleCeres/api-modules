import request from 'supertest';
import { QueryRunner } from 'typeorm';
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

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('auth/google', () => {
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    await AppDataSource.query('DELETE FROM public.user');
    queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    jest.clearAllMocks();
  });

  it.only('should return 200', async () => {
    const usersBeforeInsertion = await AppDataSource.query('SELECT * FROM public.user');

    const res = await request(app)
      .post('/auth/google')
      .send({ token: 'valid token' });

    const usersAfterInsertion = await AppDataSource.query('SELECT * FROM public.user');
    expect(res.status).toBe(200);
    expect(usersBeforeInsertion.length).toBe(0);
    expect(usersAfterInsertion.length).toBe(1);
  });

  it('should return 400', async () => {
    const res = await request(app)
      .post('/auth/google')
      .send({});

    expect(res.status).toBe(400);
  });

  it('should return 500', async () => {
    jest.resetAllMocks();
    const res = await request(app)
      .post('/auth/google')
      .send({ token: 'wrong token' });

    expect(res.status).toBe(500);
  });
});
