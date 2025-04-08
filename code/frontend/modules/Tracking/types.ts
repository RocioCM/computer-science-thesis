// -------- VIEW / CONTROLLER -------- //

import { FormHandleChange } from '@/common/hooks/useForm/types';

export interface TrackingViewProps {
  form: any;
  handleChange: FormHandleChange;
  handleIdChange: (name: string, value: string) => void;
  handleSearch: () => void;
  submitEnabled: boolean;
  currentTab: string | null;
  setCurrentTab: (tab: string | null) => void;
  tabsData: TabsData;
  tabsIdsOptions: Record<
    string,
    { page: number; items: { label: string; value: number }[] }
  >;
  getCurrentTabContent: (tab: string | null) => React.ReactNode;
}

export interface TabsData {
  baseBatch?: BaseBottleBatch | null;
  productBatch?: ProductBottlesBatch | null;
  wasteBottle?: WasteBottle | null;
  recyclingBatch?: RecyclingBatch | null;
}

export type TrackingViewType = React.FC<TrackingViewProps>;

export interface TrackingControllerProps {}

// ---------- SERVICES ---------- //

type Material = {
  name: string;
  amount: number;
  measureUnit: string;
};

type Bottle = {
  weight: number; // uint256
  color: string;
  thickness: number; // uint256
  composition: Material[];
  shapeType: string;
  originLocation: string;
  extraInfo: string;
};

export type BaseBottleBatch = {
  id: number; // uint256
  quantity: number; // uint256
  bottleType: Bottle;
  soldQuantity: number; // uint256
  owner: string; // Ethereum address
  createdAt: string; // Timestamp as a string
};

export type ProductBottlesBatch = {
  id: number;
  quantity: number;
  availableQuantity: number;
  originBaseBatchId: number;
  trackingCode: string;
  owner: string; // Ethereum address
  createdAt: string;
};

export type WasteBottle = {
  id: number;
  trackingCode: string;
  owner: string; // UID
  creator: string; // UID
  recycledBatchId: number;
  createdAt: string;
  deletedAt?: string;
};

export type RecyclingBatch = {
  id: number;
  weight: number;
  size: string;
  materialType: string;
  composition: Material[];
  extraInfo: string;
  buyerOwner: string; // Ethereum address
  creator: string; // Ethereum address
  wasteBottleIds: number[];
  createdAt: string;
  deletedAt?: string;
};

export type UserData = {
  email: string;
  blockchainId: string;
  userName?: string;
  phone?: string;
};
