import request from '@/common/services/request';
import {
  BottleOrigin,
  Buyer,
  RecyclingBatch,
  SellRecyclingBatchPayload,
  WasteBottle,
} from './types';

const RecyclerServices = {
  getAvailableWasteBottles: (page: number, limit: number) =>
    request<WasteBottle[]>(
      `/recycler/bottles/available?page=${page}&limit=${limit}`
    ),
  getRecyclingBatch: (batchId: number) =>
    request<RecyclingBatch>(`/recycler/batch/${batchId}`),
  getRecyclingBatchWasteBottles: (batchId: number) =>
    request<WasteBottle[]>(`/recycler/batch/${batchId}/bottles`),
  getAllUserRecyclingBatches: (page: number, limit: number) =>
    request<RecyclingBatch[]>(`/recycler/batches?page=${page}&limit=${limit}`),
  createRecyclingBatch: (batch: Partial<RecyclingBatch>) =>
    request<RecyclingBatch>('/recycler/batch', {
      method: 'POST',
      body: JSON.stringify(batch),
    }),
  updateRecyclingBatch: (batch: Partial<RecyclingBatch>) =>
    request('/recycler/batch', {
      method: 'PUT',
      body: JSON.stringify(batch),
    }),
  deleteRecyclingBatch: (batchId: number) =>
    request(`/recycler/batch/${batchId}`, {
      method: 'DELETE',
    }),

  searchBuyers: (query: string) =>
    request<Buyer[]>(`/recycler/buyers?query=${query}`),
  sellRecyclingBatch: (payload: SellRecyclingBatchPayload) =>
    request('/recycler/batch/sell', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

export default RecyclerServices;
