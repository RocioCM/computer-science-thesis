import { render } from '@testing-library/react';
import BottleSearchModal from './BottleSearchModal';

describe('Consumer - BottleSearchModal', () => {
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
      <BottleSearchModal handleRecycle={() => {}} handleCancel={() => {}} />
    );
    expect(container).toMatchSnapshot();
  });
});
