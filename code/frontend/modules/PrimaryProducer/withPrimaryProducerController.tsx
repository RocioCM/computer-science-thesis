import { useState } from 'react';
import { PrimaryProducerViewType, PrimaryProducerControllerProps, PrimaryProducerViewProps } from './types';

const withPrimaryProducerController = (View: PrimaryProducerViewType) =>
  function Controller(props: PrimaryProducerControllerProps): JSX.Element {
    const [name, _setName] = useState<string>('PrimaryProducer');

    const viewProps: PrimaryProducerViewProps = {
      name: name,
    };

    return <View {...viewProps} />;
  };

export default withPrimaryProducerController;
