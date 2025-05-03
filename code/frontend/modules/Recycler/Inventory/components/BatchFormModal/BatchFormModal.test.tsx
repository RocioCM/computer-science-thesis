import { render } from '@testing-library/react';
import BatchFormModal from './BatchFormModal';

describe('Recycler Inventory - BatchFormModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <div id="modal-root">
        <BatchFormModal
          editingId={1}
          handleCancel={() => {}}
          handleSuccess={() => {}}
        />
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});
