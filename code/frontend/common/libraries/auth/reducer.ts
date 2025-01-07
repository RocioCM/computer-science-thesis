import { Action, ActionTypes, AuthState } from './types';

const initialState: AuthState = {
  loading: true, // True while fetching user info from cache. False else case.
  isLoggedIn: false,
  user: null,
};

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return { ...state, loading: false, isLoggedIn: true, user: action.value };
    case ActionTypes.LOGOUT:
      return { ...initialState, loading: false };
    case ActionTypes.LOADED:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export { reducer, initialState };
