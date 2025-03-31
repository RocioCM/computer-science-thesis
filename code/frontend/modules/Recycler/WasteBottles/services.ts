import request from '@/common/services/request';
import {
  BottleOrigin,
  WasteBottle,
  AssignBottleToBatchPayload,
  RecyclingBatch,
} from './types';

const WasteBottlesServices = {
  searchBottle: (trackingCode: string) =>
    request<BottleOrigin>(`/recycler/bottle/${trackingCode}`),
  getWasteBottles: (page: number, limit: number) =>
    request<WasteBottle[]>(`/recycler/bottles?page=${page}&limit=${limit}`),
  assignBottleToBatch: (payload: AssignBottleToBatchPayload) =>
    request('/recycler/bottle/assign', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  getAllUserRecyclingBatches: (page: number, limit: number) =>
    request<RecyclingBatch[]>(`/recycler/batches?page=${page}&limit=${limit}`),
};

export default WasteBottlesServices;
