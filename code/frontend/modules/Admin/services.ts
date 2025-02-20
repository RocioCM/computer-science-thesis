import request from '@/common/services/request';
import { Admin } from './types';

const AdminServices = {
  get: () => request<Admin>('/Admin'),
};

export default AdminServices;
