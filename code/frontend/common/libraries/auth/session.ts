import { isServerSide } from '@/common/constants';

const SESSION_KEY = 'sessionToken';

// Functions to manage the session throughout the entire application.

export const getSession = (): string | null => {
  if (isServerSide) return null;
  return localStorage.getItem(SESSION_KEY);
};

export const updateSession = (session: string): void => {
  if (isServerSide) return;
  localStorage.setItem(SESSION_KEY, session);
};

export const removeSession = (): void => {
  if (isServerSide) return;
  localStorage.removeItem(SESSION_KEY);
};
