// -------- VIEW / CONTROLLER -------- //

import { ActionMenuProps } from '@/common/components/ActionMenu';

export interface WasteBottlesViewProps {
  currentTab: string;
  handleCurrentTab: (tab: string) => void;
  SearchModal: React.FC<any>;
  handleSearchButton: () => void;
  handleFetchData: (offset: number, limit: number) => Promise<WasteBottle[]>;
  editingId: number | null;
  DetailModal: React.FC<any>;
  AssignModal: React.FC<any>;
  shouldRefresh: boolean;
  handleRefreshComplete: () => void;
  handleRefresh: () => void;
  menuActions: (ActionMenuProps['actions'][0] & {
    hide?: (batch: WasteBottle) => boolean;
  })[];
}

export type WasteBottlesViewType = React.FC<WasteBottlesViewProps>;

export interface WasteBottlesControllerProps {}

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

export interface WasteBottle {
  id: number;
  trackingCode: string;
  owner: string; // UID
  creator: string; // UID
  recycledBatchId: number;
  createdAt: string;
  deletedAt?: string;
}

export type BottleOrigin = Array<{
  stage: string;
  data: any;
}>;

export type BottleRecyclingTracking = Array<{
  stage: string;
  data: any;
}>;

export interface Material {
  name: string;
  amount: number;
  measureUnit: string;
}

export interface AssignBottleToBatchPayload {
  bottleId: number;
  batchId: number;
}
