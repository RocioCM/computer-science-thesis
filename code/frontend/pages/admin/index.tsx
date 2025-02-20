import { withAuth } from '@/common/libraries/auth';
import AdminView from '@/modules/Admin';

const AdminPage = () => {
  return <AdminView />;
};

export default withAuth(AdminPage);
