import request from '@/common/services/request';
import { APIUser, RegisterUser } from '../types';

/** Services for handling user domain in our api. */
const UserServices = {
  getUserData: () => request<APIUser>('/auth/user'),
  updateUser: (user: APIUser) =>
    request<APIUser>('/auth/user', {
      method: 'PUT',
      body: JSON.stringify(user),
    }),
  registerUser: (payload: RegisterUser) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export default UserServices;
