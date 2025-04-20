import { reducer, initialState } from '../reducer';
import { ActionTypes } from '../types';

describe('reducer', () => {
  it('should handle LOGIN', () => {
    const user: any = { id: 1 };
    const newState = reducer(initialState, {
      type: ActionTypes.LOGIN,
      value: user,
    });
    expect(newState.isLoggedIn).toBe(true);
    expect(newState.loading).toEqual(false);
    expect(newState.user).toEqual(user);
  });

  it('should handle LOGOUT', () => {
    const user: any = { id: 2 };
    const firstState = reducer(initialState, {
      type: ActionTypes.LOGIN,
      value: user,
    });
    const newState = reducer(firstState, { type: ActionTypes.LOGOUT });
    expect(newState.isLoggedIn).toBe(false);
    expect(newState.loading).toBe(false);
    expect(newState.user).toBeNull();
  });

  it('should handle LOADED', () => {
    const newState = reducer(initialState, { type: ActionTypes.LOADED });
    expect(newState.loading).toBe(false);
    expect(newState.isLoggedIn).toBe(false);
    expect(newState.user).toBe(null);
  });

  it('should handle unexpected action type', () => {
    const newState = reducer(initialState, { type: 'UNEXPECTED' } as any);
    expect(newState).toEqual(initialState);
  });
});
