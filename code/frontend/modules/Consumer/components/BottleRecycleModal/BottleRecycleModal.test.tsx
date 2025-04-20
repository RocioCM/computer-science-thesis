import { render } from '@testing-library/react';
import BottleRecycleModal from './BottleRecycleModal';

describe('Consumer - BottleRecycleModal', () => {
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
      <BottleRecycleModal
        trackingCode="123"
        handleCancel={() => {}}
        handleSuccess={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
