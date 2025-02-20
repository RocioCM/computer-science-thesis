// -------- VIEW / CONTROLLER -------- //

export interface SecondaryProducerViewProps {
  name: string;
}

export type SecondaryProducerViewType = React.FC<SecondaryProducerViewProps>;

export interface SecondaryProducerControllerProps {}

// ---------- SERVICES ---------- //

export interface SecondaryProducer {
  name: string;
}
