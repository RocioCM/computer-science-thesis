// -------- VIEW / CONTROLLER -------- //

export interface HomeViewProps {
  name: string;
}

export type HomeViewType = React.FC<HomeViewProps>;

export interface HomeControllerProps {}

// ---------- SERVICES ---------- //

export interface Home {
  name: string;
}
