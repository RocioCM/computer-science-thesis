import request from '@/common/services/request';
import { Consumer } from './types';

const ConsumerServices = {
  get: () => request<Consumer>('/Consumer'),
};

export default ConsumerServices;
