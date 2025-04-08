import { useState } from 'react';
import { AdminViewType, AdminViewProps } from './types';

const withAdminController = (View: AdminViewType) =>
  function Controller(): JSX.Element {
    const [name, _setName] = useState<string>('Admin');

    const viewProps: AdminViewProps = {
      name: name,
    };

    return <View {...viewProps} />;
  };

export default withAdminController;
