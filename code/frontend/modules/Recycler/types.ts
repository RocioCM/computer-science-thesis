// -------- VIEW / CONTROLLER -------- //

import { ActionMenuProps } from '@/common/components/ActionMenu';

export interface RecyclerViewProps {
  handleDelete: () => void;
  editingId: number | null;
  handleCreateButton: () => void;
  handleSearchButton: () => void;
  SearchModal: React.FC<any>;
  DetailModal: React.FC<any>;
  FormModal: React.FC<any>;
  DeleteModal: React.FC<any>;
  SaleModal: React.FC<any>;
  handleRefresh: () => void;
  shouldRefresh: boolean;
  handleRefreshComplete: () => void;
  handleFetchData: (offset: number, limit: number) => Promise<RecyclingBatch[]>;
  menuActions: (ActionMenuProps['actions'][0] & {
    hide?: (batch: RecyclingBatch) => boolean;
  })[];
}

export type RecyclerViewType = React.FC<RecyclerViewProps>;

export interface RecyclerControllerProps {}

// ---------- SERVICES ---------- //

export interface RecyclingBatch {
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
}

export type BottleOrigin = Array<{
  stage: string;
  data: any;
}>;

export interface WasteBottle {
  id: number;
  trackingCode: string;
  owner: string; // UID
  creator: string; // UID
  recycledBatchId: number;
  createdAt: string;
  deletedAt?: string;
}

export interface Material {
  name: string;
  amount: number;
  measureUnit: string;
}

export interface SellRecyclingBatchPayload {
  batchId: number;
  buyerUid: string;
}

export type Buyer = {
  firebaseUid: string;
  userName: string;
  email: string;
};
