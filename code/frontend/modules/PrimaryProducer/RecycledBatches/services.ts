import request from '@/common/services/request';
import { RecyclingBatch } from './types';

const RecycledBatchesServices = {
  getAllUserRecyclingBatches: (page: number, limit: number) =>
    request<RecyclingBatch[]>(
      `/producer/recycled-batches?page=${page}&limit=${limit}`
    ),
  getRecyclingBatch: (batchId: number) =>
    request<RecyclingBatch>(`/producer/recycled-batch/${batchId}`),
};

export default RecycledBatchesServices;
