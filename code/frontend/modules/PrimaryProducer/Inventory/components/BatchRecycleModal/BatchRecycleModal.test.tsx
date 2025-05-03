import { render } from '@testing-library/react';
import BatchRecycleModal from './BatchRecycleModal';

describe('Primary Producer Inventory - BatchRecycleModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <div id="modal-root">
        <BatchRecycleModal
          editingId={1}
          handleCancel={() => {}}
          handleSuccess={() => {}}
        />
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});
