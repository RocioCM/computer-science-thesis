import { render } from '@testing-library/react';
import BottleSearchModal from './BottleSearchModal';

describe('Recycler Waste Bottles - BottleSearchModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <div id="modal-root">
        <BottleSearchModal handleCancel={() => {}} />
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});
