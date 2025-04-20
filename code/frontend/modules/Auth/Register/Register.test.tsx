import TestAppWrapper from '@/common/utils/tests';
import RegisterPage from '@/pages/auth/register';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { toast } from 'react-toastify';
import auth from '@/common/libraries/auth';
import { ROLES } from '@/common/constants/auth';

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <TestAppWrapper>
        <RegisterPage />
      </TestAppWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('Displays error when registration fails due to conflict', async () => {
    const mockRegisterUser = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 409 });
    (auth as jest.Mock).mockReturnValue({
      registerUser: mockRegisterUser,
    });

    render(
      <TestAppWrapper>
        <RegisterPage />
      </TestAppWrapper>
    );

    const [emailInput, passwordInput] = screen.queryAllByTestId('input');
    const rolesDropdown = screen.getByTestId('dropdown');
    const submitButton = screen.getByRole('button', { name: /crear usuario/i });

    await act(async () => rolesDropdown.click());

    const roleOption = screen.getByText('Reciclador');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(roleOption);
    });

    await act(async () => fireEvent.click(submitButton));

    expect(mockRegisterUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      roleId: ROLES.recycler,
    });
    expect(toast.error).toHaveBeenCalledWith(
      'El email ingresado ya está registrado, intentá con otro'
    );
  });

  it('Displays error when registration fails due to unknown error', async () => {
    const mockRegisterUser = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500 });
    (auth as jest.Mock).mockReturnValue({
      registerUser: mockRegisterUser,
    });

    render(
      <TestAppWrapper>
        <RegisterPage />
      </TestAppWrapper>
    );

    const [emailInput, passwordInput] = screen.queryAllByTestId('input');
    const rolesDropdown = screen.getByTestId('dropdown');
    const submitButton = screen.getByRole('button', { name: /crear usuario/i });

    await act(async () => rolesDropdown.click());

    const roleOption = screen.getByText('Reciclador');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(roleOption);
    });

    await act(async () => fireEvent.click(submitButton));

    expect(mockRegisterUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      roleId: ROLES.recycler,
    });
    expect(toast.error).toHaveBeenCalledWith(
      'Ocurrió un error al registrar. Intentá nuevamente'
    );
  });

  it('Displays success message on successful registration', async () => {
    const mockRegisterUser = jest.fn().mockResolvedValue({ ok: true });
    (auth as jest.Mock).mockReturnValue({
      registerUser: mockRegisterUser,
    });

    render(
      <TestAppWrapper>
        <RegisterPage />
      </TestAppWrapper>
    );

    const [emailInput, passwordInput] = screen.queryAllByTestId('input');
    const rolesDropdown = screen.getByTestId('dropdown');
    const submitButton = screen.getByRole('button', { name: /crear usuario/i });

    await act(async () => rolesDropdown.click());

    const roleOption = screen.getByText('Reciclador');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(roleOption);
    });

    await act(async () => fireEvent.click(submitButton));

    expect(mockRegisterUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      roleId: ROLES.recycler,
    });
    expect(toast.success).toHaveBeenCalledWith(
      '¡Usuario registrado exitosamente! Ya podés iniciar sesión con estas credenciales'
    );
  });
});
