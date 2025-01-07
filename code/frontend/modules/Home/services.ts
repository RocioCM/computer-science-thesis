import request from '@/common/services/request';
import { Home } from './types';

const HomeServices = {
  get: () => request<Home>('/Home'),
};

export default HomeServices;
