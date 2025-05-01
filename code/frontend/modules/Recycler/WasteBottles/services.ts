import request from '@/common/services/request';
import {
  BottleOrigin,
  WasteBottle,
  AssignBottleToBatchPayload,
  RecyclingBatch,
  BottleRecyclingTracking,
} from './types';

const WasteBottlesServices = {
  searchBottle: (trackingCode: string) =>
    request<BottleOrigin>(`/recycler/bottle/origin/${trackingCode}`),
  getWasteBottleTracking: (wasteBottleId: number) =>
    request<BottleRecyclingTracking>(
      `/recycler/bottle/tracking/${wasteBottleId}`
    ),
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
