// -------- VIEW / CONTROLLER -------- //

import { ActionMenuProps } from '@/common/components/ActionMenu';

export interface RecycledBatchesViewProps {
  editingId: number | null;
  DetailModal: React.FC<any>;
  shouldRefresh: boolean;
  handleRefreshComplete: () => void;
  handleFetchData: (offset: number, limit: number) => Promise<RecyclingBatch[]>;
  menuActions: (ActionMenuProps['actions'][0] & {
    hide?: (batch: RecyclingBatch) => boolean;
  })[];
}

export type RecycledBatchesViewType = React.FC<RecycledBatchesViewProps>;

export interface RecycledBatchesControllerProps {}

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
