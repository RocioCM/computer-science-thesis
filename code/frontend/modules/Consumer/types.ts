// -------- VIEW / CONTROLLER -------- //

export interface ConsumerViewProps {
  name: string;
}

export type ConsumerViewType = React.FC<ConsumerViewProps>;

export interface ConsumerControllerProps {}

// ---------- SERVICES ---------- //

export interface Consumer {
  name: string;
}
