// -------- VIEW / CONTROLLER -------- //

export interface PrimaryProducerViewProps {
  name: string;
}

export type PrimaryProducerViewType = React.FC<PrimaryProducerViewProps>;

export interface PrimaryProducerControllerProps {}

// ---------- SERVICES ---------- //

export interface PrimaryProducer {
  name: string;
}
