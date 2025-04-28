import { withAuth } from '@/common/libraries/auth';
import TrackingView from '@/modules/Tracking';

const TrackingPage = () => {
  return <TrackingView />;
};

export default withAuth(TrackingPage);
