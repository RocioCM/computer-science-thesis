import React from 'react';
import { render } from '@testing-library/react';
import withAuth from '../withAuth';
import { useLoginContext } from '..';

const replaceFnMock = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({ replace: replaceFnMock }),
}));
jest.mock('..', () => ({
  useLoginContext: jest.fn(),
}));

const MockedComponent = () => <div>Secret Page</div>;

describe('withAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders null if loading is true', () => {
    (useLoginContext as jest.Mock).mockReturnValue({
      loading: true,
      isLoggedIn: false,
      user: null,
    });
    const Wrapped = withAuth(MockedComponent);
    const { container } = render(<Wrapped />);
    expect(container.firstChild).toBeNull();
  });

  it('redirects if not authenticated', () => {
    (useLoginContext as jest.Mock).mockReturnValue({
      loading: false,
      isLoggedIn: false,
      user: null,
    });
    const Wrapped = withAuth(MockedComponent);
    const { container } = render(<Wrapped />);
    expect(container.firstChild).toBeNull();
    expect(replaceFnMock).toHaveBeenCalledWith('/auth/login');
  });

  it('renders component if authenticated', () => {
    (useLoginContext as jest.Mock).mockReturnValue({
      loading: false,
      isLoggedIn: true,
      user: {},
    });
    const Wrapped = withAuth(MockedComponent);
    const { getByText } = render(<Wrapped />);
    expect(getByText('Secret Page')).toBeInTheDocument();
  });

  it('renders component if role allowed', () => {
    (useLoginContext as jest.Mock).mockReturnValue({
      loading: false,
      isLoggedIn: true,
      user: { role: 1 },
      userHasRole: (role: number) => role === 1,
    });
    const Wrapped = withAuth(MockedComponent, 1);
    const { getByText } = render(<Wrapped />);
    expect(getByText('Secret Page')).toBeInTheDocument();
  });

  it('does not render page if role not allowed', () => {
    (useLoginContext as jest.Mock).mockReturnValue({
      loading: false,
      isLoggedIn: true,
      user: { role: 2 },
      userHasRole: (role: number) => role === 3,
    });
    const Wrapped = withAuth(MockedComponent, 1);
    const { queryByText, getByText } = render(<Wrapped />);
    expect(getByText(/No tienes permiso/i)).toBeInTheDocument();
    expect(queryByText('Secret Page')).toBeNull();
  });

  it('renders component if multiple roles allowed', () => {
    (useLoginContext as jest.Mock).mockReturnValue({
      loading: false,
      isLoggedIn: true,
      user: { role: 2 },
      userHasRole: (role: number) => role === 1,
    });
    const Wrapped = withAuth(MockedComponent, [1, 2]);
    const { getByText } = render(<Wrapped />);
    expect(getByText('Secret Page')).toBeInTheDocument();
  });
});
