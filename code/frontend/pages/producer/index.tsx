import { ROLES } from '@/common/constants/auth';
import { withAuth } from '@/common/libraries/auth';
import PrimaryProducerView from '@/modules/PrimaryProducer';

const PrimaryProducerPage = () => {
  return <PrimaryProducerView />;
};

export default withAuth(PrimaryProducerPage, ROLES.producer);
