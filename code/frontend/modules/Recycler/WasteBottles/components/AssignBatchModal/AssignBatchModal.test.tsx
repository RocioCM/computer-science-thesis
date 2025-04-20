import { render, screen, fireEvent, act } from '@testing-library/react';
import AssignBatchModal from './AssignBatchModal';

describe('Recycler Waste Bottles - AssignBatchModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <AssignBatchModal
        editingId={1}
        handleCancel={() => {}}
        handleSuccess={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
