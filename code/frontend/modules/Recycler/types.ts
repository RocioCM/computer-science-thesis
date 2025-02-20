// -------- VIEW / CONTROLLER -------- //

export interface RecyclerViewProps {
  name: string;
}

export type RecyclerViewType = React.FC<RecyclerViewProps>;

export interface RecyclerControllerProps {}

// ---------- SERVICES ---------- //

export interface Recycler {
  name: string;
}
