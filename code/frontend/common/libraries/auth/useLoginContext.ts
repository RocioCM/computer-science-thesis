import { useAppContext } from '@/common/context';

/**
 * Provides global shared state and methods related to user auth.
 * Shared state is available throughout application.
 */
const useLoginContext = () => {
  const { auth } = useAppContext();
  return auth;
};

export default useLoginContext;
