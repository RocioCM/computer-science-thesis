import { render, screen, fireEvent, act } from '@testing-library/react';
import BatchSaleModal from './BatchSaleModal';

describe('Primary Producer Inventory - BatchSaleModal', () => {
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
      <BatchSaleModal
        editingId={1}
        handleCancel={() => {}}
        handleSuccess={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
