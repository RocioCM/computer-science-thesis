import TestAppWrapper from '@/common/utils/tests';
import LoginPage from '@/pages/auth/login';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { toast } from 'react-toastify';
import auth from '@/common/libraries/auth';

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <TestAppWrapper>
        <LoginPage />
      </TestAppWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('does not submit with empty fields', async () => {
    const mockLoginWithPassword = jest.fn();
    (auth as jest.Mock).mockReturnValue({
      loginWithPassword: mockLoginWithPassword,
    });

    const toastErrorSpy = jest.spyOn(toast, 'error');

    render(
      <TestAppWrapper>
        <LoginPage />
      </TestAppWrapper>
    );

    const [emailInput, passwordInput] = screen.queryAllByTestId('input');
    const submitButton = screen.getByRole('button', {
      name: /iniciar sesión/i,
    });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      passwordInput.enterKeyHint = 'done'; // Simulate pressing Enter key
      fireEvent.change(passwordInput, { target: { value: '' } });
      fireEvent.click(submitButton);
    });

    expect(mockLoginWithPassword).not.toHaveBeenCalled(); // Ensure loginWithPassword was not called
    expect(toastErrorSpy).not.toHaveBeenCalled(); // Ensure toast.error was not called
  });

  it('Displays error when login fails', async () => {
    const mockLoginWithPassword = jest.fn().mockResolvedValue({ ok: false });
    (auth as jest.Mock).mockReturnValue({
      loginWithPassword: mockLoginWithPassword,
    });

    render(
      <TestAppWrapper>
        <LoginPage />
      </TestAppWrapper>
    );

    const [emailInput, passwordInput] = screen.queryAllByTestId('input');
    const submitButton = screen.getByRole('button', {
      name: /iniciar sesión/i,
    });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);
    });

    expect(mockLoginWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'wrongpassword',
    });
    expect(toast.error).toHaveBeenCalledWith(
      'Usuario o contraseña incorrectos. Intentá nuevamente.'
    );
  });

  it('Handles successful login', async () => {
    const mockLoginWithPassword = jest.fn().mockResolvedValue({ ok: true });
    (auth as jest.Mock).mockReturnValue({
      loginWithPassword: mockLoginWithPassword,
    });

    // Spy on toast.error to ensure it is not called
    const toastErrorSpy = jest.spyOn(toast, 'error');

    render(
      <TestAppWrapper>
        <LoginPage />
      </TestAppWrapper>
    );

    const [emailInput, passwordInput] = screen.queryAllByTestId('input');
    const submitButton = screen.getByRole('button', {
      name: /iniciar sesión/i,
    });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
      fireEvent.click(submitButton);
    });

    expect(mockLoginWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'correctpassword',
    });
    expect(toastErrorSpy).not.toHaveBeenCalled(); // Ensure toast.error was not called
  });
});
