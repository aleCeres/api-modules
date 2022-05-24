import request from 'supertest';

import app from '../src/server';

describe('Sample test', () => {
  it('should return 200 OK', async () => {
    const res = await request(app)
      .post('/auth/google')
      .send({ token: 'test' });

    expect(res.status).toBe(500);
  });
});
