// -------- VIEW / CONTROLLER -------- //

export interface AdminViewProps {
  name: string;
}

export type AdminViewType = React.FC<AdminViewProps>;

export interface AdminControllerProps {}

// ---------- SERVICES ---------- //

export interface Admin {
  name: string;
}
