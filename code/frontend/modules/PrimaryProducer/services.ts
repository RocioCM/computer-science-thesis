import request from '@/common/services/request';
import { BottleBatch } from './types';

const PrimaryProducerServices = {
  getAllBatches: (page: number, limit: number) =>
    request<BottleBatch[]>(
      `/producer/batches/user?page=${page}&limit=${limit}`
    ),
  getBatch: (id: number) => request<BottleBatch>(`/producer/batch/${id}`),
  createBatch: (data: Partial<BottleBatch>) =>
    request<BottleBatch>(`/producer/batch`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateBatch: (id: number, data: Partial<BottleBatch>) =>
    request<BottleBatch>(`/producer/batch`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteBatch: (id: number) =>
    request<void>(`/producer/batch/${id}`, { method: 'DELETE' }),
};

export default PrimaryProducerServices;
