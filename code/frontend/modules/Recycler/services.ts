import request from '@/common/services/request';
import { Recycler } from './types';

const RecyclerServices = {
  get: () => request<Recycler>('/Recycler'),
};

export default RecyclerServices;
