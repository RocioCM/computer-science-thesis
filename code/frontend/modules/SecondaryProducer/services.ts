import request from '@/common/services/request';
import {
  BaseBottleBatch,
  Buyer,
  ProductBottlesBatch,
  RecycleBaseBottlesPayload,
  SellProductBottlesPayload,
  UpdateTrackingCodePayload,
} from './types';

const SecondaryProducerServices = {
  getAllBatches: (page: number, limit: number) =>
    request<ProductBottlesBatch[]>(
      `/secondary-producer/batches/user?page=${page}&limit=${limit}`
    ),
  getBatch: (id: number) =>
    request<ProductBottlesBatch>(`/secondary-producer/batch/${id}`),
  getBaseBatch: (baseBatchId: number) =>
    request<BaseBottleBatch>(`/secondary-producer/batch/base/${baseBatchId}`),
  searchBuyers: (query: string) =>
    request<Buyer[]>(`/secondary-producer/buyers?query=${query}`),

  updateTrackingCode: (data: UpdateTrackingCodePayload) =>
    request<null>(`/secondary-producer/batch/code`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  sellBatch: (payload: SellProductBottlesPayload) =>
    request<null>(`/secondary-producer/batch/sell`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  rejectBaseBatch: (productBatchId: number) =>
    request<void>(`/secondary-producer/batch/reject/${productBatchId}`, {
      method: 'PUT',
    }),
  recycleBatch: (payload: RecycleBaseBottlesPayload) =>
    request<null>(`/secondary-producer/batch/recycle`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteTrackingCode: (batchId: number) =>
    request<void>(`/secondary-producer/batch/code/${batchId}`, {
      method: 'DELETE',
    }),
};

export default SecondaryProducerServices;
