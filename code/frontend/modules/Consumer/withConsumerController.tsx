import { useState } from 'react';
import { ConsumerViewType, ConsumerControllerProps, ConsumerViewProps } from './types';

const withConsumerController = (View: ConsumerViewType) =>
  function Controller(props: ConsumerControllerProps): JSX.Element {
    const [name, _setName] = useState<string>('Consumer');

    const viewProps: ConsumerViewProps = {
      name: name,
    };

    return <View {...viewProps} />;
  };

export default withConsumerController;
