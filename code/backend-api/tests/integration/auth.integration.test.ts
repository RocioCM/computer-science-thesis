import request from 'supertest';
import app from 'src/internal/server';
import { BASE_PATH, ROLES } from 'src/pkg/constants';
import { setupTestEnvironment, teardownTestEnvironment } from '../utils';

describe('Integration: Authentication and Users', () => {
  beforeEach(async () => {
    await setupTestEnvironment();
  });

  afterEach(async () => {
    await teardownTestEnvironment();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post(BASE_PATH + '/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'TestPassword123',
        roleId: ROLES.PRODUCER,
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toBe('testuser@example.com');
  });
  it('should get the authenticated user (GetUserWithAuth) after registration', async () => {
    const email = 'authuser@example.com';
    const password = 'TestPassword123';
    const roleId = ROLES.PRODUCER;
    // Register user
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send({ email, password, roleId })
      .expect(201);
    // Consultar usuario autenticado
    const res = await request(app)
      .get(BASE_PATH + '/auth/user')
      .set('Authorization', 'Bearer userWithId-authuser')
      .expect(200);
    expect(res.body.status).toBe(200);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toBe(email);
  });
  it('should update the authenticated user (UpdateUserWithAuth) after registration', async () => {
    const email = 'updateuser@example.com';
    const password = 'TestPassword123';
    const roleId = ROLES.PRODUCER;
    // Register user
    await request(app)
      .post(BASE_PATH + '/auth/register')
      .send({ email, password, roleId })
      .expect(201);
    // Update user
    const updatedUser = {
      userName: 'Nombre Actualizado',
      managerName: 'Manager Test',
      phone: '+543261234567',
    };
    const updateRes = await request(app)
      .put(BASE_PATH + '/auth/user')
      .set('Authorization', 'Bearer userWithId-updateuser')
      .send(updatedUser)
      .expect(200);
    expect(updateRes.body.status).toBe(200); // Query updated user
    const getRes = await request(app)
      .get(BASE_PATH + '/auth/user')
      .set('Authorization', 'Bearer userWithId-updateuser')
      .expect(200);
    expect(getRes.body.data.userName).toBe(updatedUser.userName);
    expect(getRes.body.data.managerName).toBe(updatedUser.managerName);
    expect(getRes.body.data.phone).toBe(updatedUser.phone);
  });
});
