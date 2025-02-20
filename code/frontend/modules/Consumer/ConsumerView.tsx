import withConsumerController from './withConsumerController';
import { ConsumerViewType } from './types';
import ComingSoon from '@/common/components/ComingSoon';

const ConsumerView: ConsumerViewType = ({ name }) => {
  return (
    <main className="w-full h-screen">
      <ComingSoon title={`Welcome to ${name} Page!`} />
    </main>
  );
};

export default withConsumerController(ConsumerView);
