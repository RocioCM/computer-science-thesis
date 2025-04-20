import { getSession, updateSession, removeSession } from '../session';

describe('session', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  it('getSession should return sessionToken', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue('fakeToken');
    expect(getSession()).toEqual('fakeToken');
  });

  it('updateSession should set sessionToken', () => {
    updateSession('newToken');
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'sessionToken',
      'newToken'
    );
  });

  it('removeSession should remove sessionToken', () => {
    removeSession();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('sessionToken');
  });
});
