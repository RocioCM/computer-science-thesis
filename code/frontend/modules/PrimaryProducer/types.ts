// -------- VIEW / CONTROLLER -------- //

export interface PrimaryProducerViewProps {
  handleCreateButton: () => void;
  editingId: number | null;
  FormModal: React.FC<any>;
  hideFormModal: () => void;
  handleRefresh: () => void;
  shouldRefresh: boolean;
  handleRefreshComplete: () => void;
  handleFetchData: (offset: number, limit: number) => Promise<BottleBatch[]>;
  handleShowDetail: (id: number) => void;
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
