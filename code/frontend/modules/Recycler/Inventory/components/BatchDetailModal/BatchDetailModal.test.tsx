import { render } from '@testing-library/react';
import BatchDetailModal from './BatchDetailModal';

describe('Recycler Inventory - BatchDetailModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <div id="modal-root">
        <BatchDetailModal
          editingId={1}
          handleCancel={() => {}}
          handleSuccess={() => {}}
        />
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});
