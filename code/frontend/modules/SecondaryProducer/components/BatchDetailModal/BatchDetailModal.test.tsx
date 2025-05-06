import { render } from '@testing-library/react';
import BatchDetailModal from './BatchDetailModal';

describe('Secondary Producer - BatchDetailModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <div id="modal-root">
        <BatchDetailModal editingId={1} handleCancel={() => {}} />
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});
