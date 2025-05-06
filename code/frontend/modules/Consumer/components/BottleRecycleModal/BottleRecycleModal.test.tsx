import { render } from '@testing-library/react';
import BottleRecycleModal from './BottleRecycleModal';

describe('Consumer - BottleRecycleModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <div id="modal-root">
        <BottleRecycleModal
          trackingCode="123"
          handleCancel={() => {}}
          handleSuccess={() => {}}
        />
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});
