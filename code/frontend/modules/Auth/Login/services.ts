import request from '@/common/services/request';
import { Login } from './types';

const LoginServices = {
  get: () => request<Login>('/Login'),
};

export default LoginServices;
