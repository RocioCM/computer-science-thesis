import request from '@/common/services/request';
import {
  BottleOrigin,
  WasteBottle,
  BottleRecyclingTracking,
  Recycler,
} from './types';

const ConsumerServices = {
  searchBottle: (trackingCode: string) =>
    request<BottleOrigin>(`/consumer/origin/${trackingCode}`),
  searchRecyclers: (query: string) =>
    request<Recycler[]>(`/consumer/recyclers?query=${query}`),
  getUserWasteBottles: (page: number, limit: number) =>
    request<WasteBottle[]>(`/consumer/waste?page=${page}&limit=${limit}`),
  getWasteBottleTracking: (wasteId: number) =>
    request<BottleRecyclingTracking>(`/consumer/waste/${wasteId}`),
  createWasteBottle: (payload: Partial<WasteBottle>) =>
    request('/consumer/waste', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteWasteBottle: (wasteId: number) =>
    request(`/consumer/waste/${wasteId}`, {
      method: 'DELETE',
    }),
};

export default ConsumerServices;
