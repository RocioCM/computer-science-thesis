import { render } from '@testing-library/react';
import BottleDetailModal from './BottleDetailModal';

describe('Consumer - BottleDetailModal', () => {
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
      <BottleDetailModal handleRecycle={() => {}} handleCancel={() => {}} />
    );
    expect(container).toMatchSnapshot();
  });
});
