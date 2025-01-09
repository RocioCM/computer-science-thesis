import { withAuth } from '@/common/libraries/auth';
import PrimaryProducerView from '@/modules/PrimaryProducer';

const PrimaryProducerPage = () => {
  return <PrimaryProducerView />;
};

export default PrimaryProducerPage;
// export default withAuth(PrimaryProducerPage); /// TODO: uncomment
