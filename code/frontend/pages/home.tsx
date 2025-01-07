import { withAuth } from '@/common/libraries/auth';
import HomeView from '@/modules/Home';

/// TODO: create profile page editable.
const HomePage = () => {
  return <HomeView />;
};

export default withAuth(HomePage);
