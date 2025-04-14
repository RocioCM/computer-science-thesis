import '@testing-library/jest-dom';

// Mocking Next Router and Next Navigation
jest.mock('next/router', () => require('next-router-mock'));
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/mocked-path',
  useSearchParams: () =>
    new URLSearchParams({
      q: 'test',
    }),
}));

jest.mock('@/common/libraries/auth', () => ({
  __esModule: true,
  withAuth: (Component: any) => (props: any) => Component(props),
  useAuthState: jest.fn(),
  default: jest.fn().mockReturnValue({
    user: {
      id: 1,
      email: 'test@mail.com',
      role: 1,
      blockchainId: '0x1234567890abcdef',
      userName: 'testUser',
      managerName: 'managerUser',
      phone: '1234567890',
    },
    registerUser: jest.fn(),
    loginWithPassword: jest.fn(),
    updateUserData: jest.fn(),
  }),
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

// Define Global IntersectionObserver mock
(global as any).IntersectionObserver = class {
  callback: any;
  constructor(callback: any) {
    this.callback = callback;
  }
  observe = jest
    .fn()
    .mockImplementation(() =>
      this.callback([{ isIntersecting: true }, { isIntersecting: false }])
    );
  unobserve = jest.fn();

  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];
  disconnect() {}
  takeRecords() {
    return [];
  }
};
