import withPrimaryProducerController from './withPrimaryProducerController';
import { PrimaryProducerViewType } from './types';
import ComingSoon from '@/common/components/ComingSoon';

const PrimaryProducerView: PrimaryProducerViewType = ({ name }) => {
  return (
    <main className="w-full h-screen">
      <ComingSoon title={`Welcome to ${name} Page!`} />
    </main>
  );
};

export default withPrimaryProducerController(PrimaryProducerView);
