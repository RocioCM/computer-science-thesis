import { render, screen, fireEvent, act } from '@testing-library/react';
import BatchDetailModal from './BatchDetailModal';

describe('Primary Producer Recycled Batches - BatchDetailModal', () => {
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
      <BatchDetailModal editingId={1} handleCancel={() => {}} />
    );
    expect(container).toMatchSnapshot();
  });
});
