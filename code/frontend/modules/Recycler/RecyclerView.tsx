import withRecyclerController from './withRecyclerController';
import { RecyclerViewType } from './types';
import ComingSoon from '@/common/components/ComingSoon';

const RecyclerView: RecyclerViewType = ({ name }) => {
  return (
    <main className="w-full h-screen">
      <ComingSoon title={`Welcome to ${name} Page!`} />
    </main>
  );
};

export default withRecyclerController(RecyclerView);
