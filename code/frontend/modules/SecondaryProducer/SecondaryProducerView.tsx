import withSecondaryProducerController from './withSecondaryProducerController';
import { SecondaryProducerViewType } from './types';
import ComingSoon from '@/common/components/ComingSoon';

const SecondaryProducerView: SecondaryProducerViewType = ({ name }) => {
  return (
    <main className="w-full h-screen">
      <ComingSoon title={`Welcome to ${name} Page!`} />
    </main>
  );
};

export default withSecondaryProducerController(SecondaryProducerView);
