import { ROLES } from '@/common/constants/auth';
import { withAuth } from '@/common/libraries/auth';
import RecycledBatchesView from '@/modules/PrimaryProducer/RecycledBatches';

const RecycledBatchesPage = () => {
  return <RecycledBatchesView />;
};

export default withAuth(RecycledBatchesPage, ROLES.producer);
