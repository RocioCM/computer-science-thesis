import { ROLES } from '@/common/constants/auth';
import { withAuth } from '@/common/libraries/auth';
import WasteBottlesView from '@/modules/Recycler/WasteBottles';

const WasteBottlesPage = () => {
  return <WasteBottlesView />;
};

export default withAuth(WasteBottlesPage, ROLES.recycler);
