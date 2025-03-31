import { ROLES } from '@/common/constants/auth';
import { withAuth } from '@/common/libraries/auth';
import RecyclerView from '@/modules/Recycler/Inventory';

const RecyclerPage = () => {
  return <RecyclerView />;
};

export default withAuth(RecyclerPage, ROLES.recycler);
