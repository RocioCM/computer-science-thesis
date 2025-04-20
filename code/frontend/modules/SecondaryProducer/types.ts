// -------- VIEW / CONTROLLER -------- //

import { ActionMenuProps } from '@/common/components/ActionMenu';

export interface SecondaryProducerViewProps {
  handleDelete: () => void;
  handleReject: () => void;
  editingId: number | null;
  DetailModal: React.FC<any>;
  FormModal: React.FC<any>;
  DeleteModal: React.FC<any>;
  RejectModal: React.FC<any>;
  SaleModal: React.FC<any>;
  RecycleModal: React.FC<any>;
  handleRefresh: () => void;
  shouldRefresh: boolean;
  handleRefreshComplete: () => void;
  handleFetchData: (
    offset: number,
    limit: number
  ) => Promise<ProductBottlesBatch[]>;
  menuActions: (ActionMenuProps['actions'][0] & {
    hide?: (batch: ProductBottlesBatch) => boolean;
  })[];
}

export type SecondaryProducerViewType = React.FC<SecondaryProducerViewProps>;

export interface SecondaryProducerControllerProps {}

// ---------- SERVICES ---------- //

export interface ProductBottlesBatch {
  id: number;
  quantity: number;
  availableQuantity: number;
  originBaseBatchId: number;
  trackingCode: string;
  owner: string; // Ethereum address
  createdAt: string;
}

export interface SoldProductBatch {
  id: number;
  quantity: number;
  originProductBatchId: number;
  owner: string; // Ethereum address
  createdAt: string;
}

export interface UpdateTrackingCodePayload {
  id: number;
  trackingCode: string;
}

export interface RecycleBaseBottlesPayload {
  productBatchId: number;
  quantity: number;
}

export interface SellProductBottlesPayload {
  batchId: number;
  quantity: number;
  buyerUid: string;
}

export type SellResponse = {
  soldProductId: number;
};

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

export type Buyer = {
  firebaseUid: string;
  userName: string;
  email: string;
};
