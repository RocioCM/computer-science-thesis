import request from '@/common/services/request';
import { BottleBatch, Buyer, RecyclePayload, SellPayload } from './types';

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
  updateBatch: (data: Partial<BottleBatch>) =>
    request<BottleBatch>(`/producer/batch`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  sellBatch: (payload: SellPayload) =>
    request<null>(`/producer/batch/sell`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  recycleBatch: (payload: RecyclePayload) =>
    request<null>(`/producer/batch/recycle`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteBatch: (id: number) =>
    request<void>(`/producer/batch/${id}`, { method: 'DELETE' }),
  searchBuyers: (query: string) =>
    request<Buyer[]>(`/producer/buyers?query=${query}`),
};

export default PrimaryProducerServices;
