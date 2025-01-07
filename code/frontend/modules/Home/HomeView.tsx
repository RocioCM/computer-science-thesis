import withHomeController from './withHomeController';
import { HomeViewType } from './types';
import ComingSoon from '@/common/components/ComingSoon';

const HomeView: HomeViewType = ({ name }) => {
  return (
    <main className="w-full h-screen">
      <ComingSoon title={`Welcome to ${name} Page!`} />
    </main>
  );
};

export default withHomeController(HomeView);
