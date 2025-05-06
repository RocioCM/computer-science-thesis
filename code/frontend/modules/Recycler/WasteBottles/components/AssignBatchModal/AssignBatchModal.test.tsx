import { render } from '@testing-library/react';
import AssignBatchModal from './AssignBatchModal';

describe('Recycler Waste Bottles - AssignBatchModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <div id="modal-root">
        <AssignBatchModal
          editingId={1}
          handleCancel={() => {}}
          handleSuccess={() => {}}
        />
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});
