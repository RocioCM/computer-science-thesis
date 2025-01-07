import { useState } from 'react';
import { HomeViewType, HomeControllerProps, HomeViewProps } from './types';
import useLoginContext from '@/common/libraries/auth';

const withHomeController = (View: HomeViewType) =>
  function Controller(props: HomeControllerProps): JSX.Element {
    const [name, _setName] = useState<string>('Home');
    const { isLoggedIn, user } = useLoginContext();

    console.log('isLoggedIn', isLoggedIn, user);

    const viewProps: HomeViewProps = {
      name: name,
    };

    return <View {...viewProps} />;
  };

export default withHomeController;
