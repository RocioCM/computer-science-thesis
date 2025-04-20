import { render, screen, fireEvent, act } from '@testing-library/react';
import AccountDetails from './AccountDetails';
import TrackingServices from '../../services';

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

  it('show account information', async () => {
    const mockGetUserPublicData = jest.fn().mockResolvedValue({
      ok: true,
      data: {
        email: 'test@mail.com',
        blockchainId: '0x123456789',
        userName: 'Test Name',
        phone: '1234567890',
      },
    });
    TrackingServices.getUserPublicData = mockGetUserPublicData;

    render(<AccountDetails blockchainId={'0x123456789'} />);

    expect(mockGetUserPublicData).toHaveBeenCalledWith('0x123456789');
    const userNameTrigger = await screen.findByText('Test Name');
    expect(userNameTrigger).toBeInTheDocument();

    await act(async () => fireEvent.click(userNameTrigger));

    expect(screen.getByText('test@mail.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('0x123456789')).toBeInTheDocument();
  });
});
