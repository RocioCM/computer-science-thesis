import request from '@/common/services/request';
import { UserRole } from '../types';

export interface APIUser {
  id: number;
  name: string;
  email: string;
  roleId: UserRole;
}

/** Services for handling user domain in our api. */
const UserServices = {
  getUserData: () => request<APIUser>('/users'),
  updateUser: (user: APIUser) =>
    request<APIUser>('/users', {
      method: 'PUT',
      body: JSON.stringify(user),
    }),
};

export default UserServices;
