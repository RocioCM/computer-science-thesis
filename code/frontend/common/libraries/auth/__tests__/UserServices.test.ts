import UserServices from '../services/UserServices';
import request from '@/common/services/request';

jest.mock('@/common/services/request');

describe('UserServices', () => {
  it('getUserData should call request', async () => {
    await UserServices.getUserData();
    expect(request).toHaveBeenCalledWith('/auth/user');
  });

  it('updateUser should call request with correct params', async () => {
    await UserServices.updateUser({
      id: 123,
      email: 'test@test.com',
      blockchainId: '',
    });
    expect(request).toHaveBeenCalledWith('/auth/user', expect.any(Object));
  });

  it('registerUser should call request with correct body', async () => {
    await UserServices.registerUser({ email: 'x', password: 'y', roleId: 1 });
    expect(request).toHaveBeenCalledWith('/auth/register', expect.any(Object));
  });
});
