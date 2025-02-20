import withAdminController from './withAdminController';
import { AdminViewType } from './types';
import ComingSoon from '@/common/components/ComingSoon';

const AdminView: AdminViewType = ({ name }) => {
  return (
    <main className="w-full h-screen">
      <ComingSoon title={`Welcome to ${name} Page!`} />
    </main>
  );
};

export default withAdminController(AdminView);
