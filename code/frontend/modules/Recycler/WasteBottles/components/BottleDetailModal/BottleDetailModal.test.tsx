import { render } from '@testing-library/react';
import BottleDetailModal from './BottleDetailModal';

describe('Recycler Waste Bottles - BottleDetailModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <div id="modal-root">
        <BottleDetailModal wasteBottleId={1} handleCancel={() => {}} />
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});
