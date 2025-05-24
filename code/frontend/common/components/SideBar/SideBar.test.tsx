import { render, screen, fireEvent, act } from '@testing-library/react';
import SideBar from './SideBar';
import useLoginContext from '@/common/libraries/auth';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/common/libraries/auth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('SideBar Component', () => {
  const mockedUseRouter = useRouter as jest.Mock;
  const mockedUseLoginContext = useLoginContext as jest.Mock;

  beforeEach(() => {
    mockedUseRouter.mockReturnValue({
      asPath: '/',
      push: jest.fn(),
    });
    mockedUseLoginContext.mockReturnValue({
      isLoggedIn: true,
      logout: jest.fn(),
    });

    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    jest.clearAllMocks();

    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  });

  it('renders when user is logged in', () => {
    render(<SideBar />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('does not render if user is not logged in', () => {
    mockedUseLoginContext.mockReturnValueOnce({ isLoggedIn: false });
    render(<SideBar />);
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('does not render if path starts with /auth', () => {
    mockedUseRouter.mockReturnValueOnce({ asPath: '/auth/login' });
    render(<SideBar />);
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('shows logout modal when clicking "Cerrar sesión"', async () => {
    render(<SideBar />);
    await act(async () => {
      fireEvent.click(screen.getByText('Cerrar sesión'));
    });
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    expect(screen.getByText('¿Deseas cerrar sesión?')).toBeInTheDocument();
  });

  it('logs out when confirming logout', async () => {
    const logoutMock = jest.fn();
    mockedUseLoginContext.mockReturnValue({
      isLoggedIn: true,
      logout: logoutMock,
    });
    const rendered = render(<SideBar />);
    await act(async () => {
      fireEvent.click(rendered.getByText('Cerrar sesión'));
    });
    await act(async () => {
      fireEvent.click(rendered.getByText('Aceptar'));
    });
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it('expands and collapses on mouse enter and leave', async () => {
    render(<SideBar />);
    const sidebar = screen.getByTestId('sidebar');

    await act(async () => {
      // Simulate mouse enter
      fireEvent.mouseEnter(sidebar);
    });
    expect(screen.getByText('Perfil')).toHaveClass('w-[8rem]');

    await act(async () => {
      // Simulate mouse leave
      fireEvent.mouseLeave(sidebar);
    });
    expect(screen.getByText('Perfil')).toHaveClass('w-0');
  });
});
