import request from '@/common/services/request';
import {
  BaseBottleBatch,
  ProductBottlesBatch,
  RecyclingBatch,
  UserData,
  WasteBottle,
} from './types';

const TrackingServices = {
  getUserPublicData: (blockchainId: string) =>
    request<UserData>(`/tracking/user/${blockchainId}`),

  getBaseBottlesBatchById: (id: number) =>
    request<BaseBottleBatch>(`/tracking/base-batch/${id}`),
  getProductBatchByCode: (trackingCode: string) =>
    request<ProductBottlesBatch>(
      `/tracking/product-batch/trackingCode/${trackingCode}`
    ),
  getProductBatchById: (id: number) =>
    request<ProductBottlesBatch>(`/tracking/product-batch/${id}`),
  getWasteBottleById: (id: number) =>
    request<WasteBottle>(`/tracking/waste-bottle/${id}`),
  getRecyclingBatchById: (id: number) =>
    request<RecyclingBatch>(`/tracking/recycling-batch/${id}`),

  getAllProductsFromBaseBatch: (
    baseBatchId: number,
    page: number,
    limit: number
  ) =>
    request<number[]>(
      `/tracking/base-batch/${baseBatchId}/products?page=${page}&limit=${limit}`
    ),
  getAllWasteBottlesFromProductBatchById: (
    productBatchId: number,
    page: number,
    limit: number
  ) =>
    request<number[]>(
      `/tracking/product-batch/${productBatchId}/waste-bottles?page=${page}&limit=${limit}`
    ),
};

export default TrackingServices;
