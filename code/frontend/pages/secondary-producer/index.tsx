import { withAuth } from '@/common/libraries/auth';
import SecondaryProducerView from '@/modules/SecondaryProducer';

const SecondaryProducerPage = () => {
  return <SecondaryProducerView />;
};

export default withAuth(SecondaryProducerPage);
