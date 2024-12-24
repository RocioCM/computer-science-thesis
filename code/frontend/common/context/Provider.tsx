import AppContext from './context';
import { useAuthState } from '@/common/libraries/auth';
// import useReactNativeApp from './modules/reactNative/useReactNativeApp';

/**
 * Context provider for general purpose app shared state.
 *
 * You can use this context to store any kind of shared state
 * you need throughout the app.
 */
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. To add a new state to the context, first init a new state hook here.
  const auth = useAuthState();
  // const nativeApp = useReactNativeApp();

  // 2. Then add the new state as a new property to this object and that's all.
  // Your state will be available in every component of the app.
  const state = {
    auth,
    // nativeApp,
  };

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

export default AppProvider;
