import { render, screen, fireEvent, act } from '@testing-library/react';
import AccountDetails from './AccountDetails';

describe('Tracking - AccountDetails', () => {
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
      <AccountDetails blockchainId={'0x123456789'} />
    );
    expect(container).toMatchSnapshot();
  });
});
