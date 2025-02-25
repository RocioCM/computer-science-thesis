import request from 'supertest';
import app from '../src/internal/server';
import { BASE_PATH, ROLES } from '../src/pkg/constants';

describe('App setup', () => {
  it('Should return 404', async () => {
    const res = await request(app)
      .post(BASE_PATH + '/unexpected-endpoint')
      .expect(404);

    expect(res.body.status).toBe(404);
    expect(res.body.data).toBe("Endpoint doesn't exist or method not allowed.");
  });

  xit('Should handle exception', async () => {
    const loginUser = {
      email: 'test@example.com',
      password: 'password123',
      roleId: ROLES.PRODUCER,
    };

    // It should throw an exception because external dependencies like
    // Firebase Authentication are not configured on this test run.
    const res = await request(app)
      .post(BASE_PATH + '/auth/register')
      .send(loginUser)
      .expect(500);

    expect(res.body.status).toBe(500);
    expect(res.body.data).toBeNull();
  });
});
