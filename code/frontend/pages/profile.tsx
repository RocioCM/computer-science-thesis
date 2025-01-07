import { withAuth } from '@/common/libraries/auth';
import ProfileView from '@/modules/Profile';

const ProfilePage = () => {
  return <ProfileView />;
};

export default withAuth(ProfilePage);
