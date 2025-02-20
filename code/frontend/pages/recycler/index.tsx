import { withAuth } from '@/common/libraries/auth';
import RecyclerView from '@/modules/Recycler';

const RecyclerPage = () => {
  return <RecyclerView />;
};

export default withAuth(RecyclerPage);
