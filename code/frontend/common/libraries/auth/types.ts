//  ------------ API ------------ //

export interface APIUser {
  id: number;
  email: string;
  blockchainId: string;
  userName?: string;
  managerName?: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterUser {
  email: string;
  password: string;
  roleId: number;
}

// ---------- CONTEXT ---------- //

export type UserRole = number;

export interface User extends APIUser {
  sessionToken: string;
  role: UserRole;
}

interface BaseAuthState {
  loading: boolean;
  isLoggedIn: boolean;
  user: User | null;
}

interface AuthLoading extends BaseAuthState {
  loading: true;
  isLoggedIn: false;
  user: null;
}

interface AuthLoggedIn extends BaseAuthState {
  loading: false;
  isLoggedIn: true;
  user: User;
}

interface AuthNotLoggedIn extends BaseAuthState {
  loading: false;
  isLoggedIn: false;
  user: null;
}

export type AuthState = AuthLoading | AuthLoggedIn | AuthNotLoggedIn;

// ---------- REDUCER ---------- //

export enum ActionTypes {
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOADED = 'loaded',
}

interface BaseAction {
  type: ActionTypes;
  value?: User;
}

interface LoginAction extends BaseAction {
  type: ActionTypes.LOGIN;
  value: User;
}

interface OtherActions extends BaseAction {
  type: ActionTypes.LOGOUT | ActionTypes.LOADED;
}

export type Action = LoginAction | OtherActions;
