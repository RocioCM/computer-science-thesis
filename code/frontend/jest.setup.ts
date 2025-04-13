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
