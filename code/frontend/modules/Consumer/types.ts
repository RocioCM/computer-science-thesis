// -------- VIEW / CONTROLLER -------- //

import { ActionMenuProps } from '@/common/components/ActionMenu';

export interface ConsumerViewProps {
  editingId: number | null;
  SearchModal: React.FC<any>;
  RecycleModal: React.FC<any>;
  DeleteModal: React.FC<any>;
  DetailModal: React.FC<any>;
  trackingCode: string;
  handleSearchButton: () => void;
  handleRecycle: (trackingCode: string) => void;
  handleDelete: () => void;
  shouldRefresh: boolean;
  handleFetchData: (page: number, limit: number) => Promise<any>;
  handleRefresh: () => void;
  handleRefreshComplete: () => void;
  menuActions: (ActionMenuProps['actions'][0] & {
    hide?: (rowData: WasteBottle) => boolean;
  })[];
}

export type ConsumerViewType = React.FC<ConsumerViewProps>;

export interface ConsumerControllerProps {}

// ---------- SERVICES ---------- //

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

export interface CreateWasteBottlePayload {
  trackingCode: string;
  owner: string; // Recycler UID
}

export type BottleOrigin = Array<{
  stage: string;
  data: any;
}>;

export type BottleRecyclingTracking = Array<{
  stage: string;
  data: any;
}>;

export type Recycler = {
  firebaseUid: string;
  userName: string;
  email: string;
};
