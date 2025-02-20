import { useState } from 'react';
import { RecyclerViewType, RecyclerControllerProps, RecyclerViewProps } from './types';

const withRecyclerController = (View: RecyclerViewType) =>
  function Controller(props: RecyclerControllerProps): JSX.Element {
    const [name, _setName] = useState<string>('Recycler');

    const viewProps: RecyclerViewProps = {
      name: name,
    };

    return <View {...viewProps} />;
  };

export default withRecyclerController;
