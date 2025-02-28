// -------- VIEW / CONTROLLER -------- //

import { ActionMenuProps } from '@/common/components/ActionMenu';

export interface PrimaryProducerViewProps {
  handleCreateButton: () => void;
  editingId: number | null;
  DetailModal: React.FC<any>;
  FormModal: React.FC<any>;
  DeleteModal: React.FC<any>;
  SaleModal: React.FC<any>;
  RecycleModal: React.FC<any>;
  handleRefresh: () => void;
  shouldRefresh: boolean;
  handleRefreshComplete: () => void;
  handleFetchData: (offset: number, limit: number) => Promise<BottleBatch[]>;
  menuActions: ActionMenuProps['actions'];
}

export type PrimaryProducerViewType = React.FC<PrimaryProducerViewProps>;

export interface PrimaryProducerControllerProps {}

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

export type BottleBatch = {
  id: number; // uint256
  quantity: number; // uint256
  bottleType: Bottle;
  soldQuantity: number; // uint256
  owner: string; // Ethereum address
  createdAt: string; // Timestamp as a string
};
