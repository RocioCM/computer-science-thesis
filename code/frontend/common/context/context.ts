import { useContext, createContext } from 'react';
import { useAuthState } from '../libraries/auth';

export interface AppContextState {
  auth: ReturnType<typeof useAuthState>;
}

/** Initial state of the app context */
export const initialState: AppContextState = {
  auth: useAuthState.defaultReturn(),
};

/** General purpose context */
const AppContext = createContext<AppContextState>(initialState);

/** Returns app global shared state. */
export const useAppContext = (): AppContextState => useContext(AppContext);

export default AppContext;
