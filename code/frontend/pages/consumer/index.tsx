import { ROLES } from '@/common/constants/auth';
import { withAuth } from '@/common/libraries/auth';
import ConsumerView from '@/modules/Consumer';

const ConsumerPage = () => {
  return <ConsumerView />;
};

export default withAuth(ConsumerPage, ROLES.consumer);
