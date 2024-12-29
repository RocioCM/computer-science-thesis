import request from '@/common/services/request';
import { RegisterUser } from './types';

const RegisterServices = {
  register: (payload: RegisterUser) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export default RegisterServices;
