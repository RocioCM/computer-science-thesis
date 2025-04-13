import AppContext from '../context/context';
import { useAuthState } from '../libraries/auth';

const TestAppWrapper = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: object | null;
}) => {
  const state = { auth: useAuthState() };

  if (user !== undefined) state.auth.user = user as any; // Set user if provided

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

export default TestAppWrapper;
