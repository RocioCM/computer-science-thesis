import request from 'supertest';
import app from 'src/internal/server';
import { BASE_PATH } from 'src/pkg/constants';
import AuthHandler from 'src/modules/auth/authHandler';

describe('App setup', () => {
  it('Should return 404', async () => {
    const res = await request(app)
      .post(BASE_PATH + '/unexpected-endpoint')
      .expect(404);

    expect(res.body.status).toBe(404);
    expect(res.body.data).toBe("Endpoint doesn't exist or method not allowed.");
  });

  it('Should handle exception', async () => {
    // Mock user authentication with invalid response to
    // trigger a runtime error when trying to destructure
    // the user response object with IResult<User> expected type.
    jest
      .spyOn(AuthHandler, 'GetUserByFirebaseUid')
      .mockResolvedValueOnce(undefined as any);

    const res = await request(app)
      .get(BASE_PATH + '/auth/user')
      .set('Authorization', 'Bearer userWithId-some-uid')
      .expect(500);

    expect(res.body.status).toBe(500);
    expect(res.body.data).toBeNull();
  });
});
