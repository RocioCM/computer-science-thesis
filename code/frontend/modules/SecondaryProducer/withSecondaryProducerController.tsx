import { useState } from 'react';
import { SecondaryProducerViewType, SecondaryProducerControllerProps, SecondaryProducerViewProps } from './types';

const withSecondaryProducerController = (View: SecondaryProducerViewType) =>
  function Controller(props: SecondaryProducerControllerProps): JSX.Element {
    const [name, _setName] = useState<string>('SecondaryProducer');

    const viewProps: SecondaryProducerViewProps = {
      name: name,
    };

    return <View {...viewProps} />;
  };

export default withSecondaryProducerController;
