import TestAppWrapper from '@/common/utils/tests';
import ProfilePage from '@/pages/profile';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { toast } from 'react-toastify';
import auth from '@/common/libraries/auth';
import { ROLES } from '@/common/constants/auth';

describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    const { container } = render(
      <TestAppWrapper>
        <ProfilePage />
      </TestAppWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('disables read-only fields', async () => {
    render(
      <TestAppWrapper>
        <ProfilePage />
      </TestAppWrapper>
    );

    const [
      emailInput,
      blockchainIdInput,
      usernameInput,
      managerNameInput,
      phoneInput,
    ] = screen.queryAllByTestId('input');
    const roleDropdown = screen.getByTestId('dropdown');

    expect(emailInput).toBeDisabled();
    expect(blockchainIdInput).toBeDisabled();
    expect(roleDropdown).toBeDisabled();
    expect(usernameInput).not.toBeDisabled();
    expect(managerNameInput).not.toBeDisabled();
    expect(phoneInput).not.toBeDisabled();
  });

  it('submits profile update successfully', async () => {
    const mockUpdateUser = jest.fn().mockResolvedValue({ ok: true });
    (auth as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        email: 'test@mail.com',
        role: ROLES.recycler,
        blockchainId: '0x1234567890abcdef',
        userName: 'testUser',
        managerName: 'managerUser',
        phone: '1234567890',
      },
      updateUserData: mockUpdateUser,
    });

    render(
      <TestAppWrapper>
        <ProfilePage />
      </TestAppWrapper>
    );

    const [
      _emailInput,
      _blockchainIdInput,
      usernameInput,
      managerNameInput,
      phoneInput,
    ] = screen.queryAllByTestId('input');

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: 'newUserName' } });
      fireEvent.change(managerNameInput, {
        target: { value: 'newManagerName' },
      });
      fireEvent.change(phoneInput, { target: { value: '9876543210' } });
    });

    const submitButton = screen.getByRole('button', {
      name: /actualizar perfil/i,
    });

    expect(submitButton).not.toBeDisabled();

    await act(async () => fireEvent.click(submitButton));

    expect(mockUpdateUser).toHaveBeenCalledWith({
      id: 1,
      email: 'test@mail.com',
      role: ROLES.recycler,
      blockchainId: '0x1234567890abcdef',

      userName: 'newUserName',
      managerName: 'newManagerName',
      phone: '9876543210',
    });
    expect(toast.success).toHaveBeenCalledWith(
      'Usuario actualizado exitosamente.'
    );
  });

  it('shows error message on failed profile update', async () => {
    const mockUpdateUser = jest.fn().mockResolvedValue({ ok: false });
    (auth as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        email: 'test@mail.com',
        role: ROLES.recycler,
        blockchainId: '0x1234567890abcdef',
        userName: 'testUser',
        managerName: 'managerUser',
        phone: '1234567890',
      },
      updateUserData: mockUpdateUser,
    });

    render(
      <TestAppWrapper>
        <ProfilePage />
      </TestAppWrapper>
    );

    const [
      _emailInput,
      _blockchainIdInput,
      _usernameInput,
      _managerNameInput,
      phoneInput,
    ] = screen.queryAllByTestId('input');

    await act(async () => {
      fireEvent.change(phoneInput, { target: { value: '9876543210' } });
    });

    const submitButton = screen.getByRole('button', {
      name: /actualizar perfil/i,
    });

    expect(submitButton).not.toBeDisabled();

    await act(async () => fireEvent.click(submitButton));

    expect(mockUpdateUser).toHaveBeenCalledWith({
      id: 1,
      email: 'test@mail.com',
      role: ROLES.recycler,
      blockchainId: '0x1234567890abcdef',
      userName: 'testUser',
      managerName: 'managerUser',
      phone: '9876543210',
    });
    expect(toast.error).toHaveBeenCalledWith(
      'Ocurrió un error al actualizar los datos. Intentá nuevamente.'
    );
  });
});
