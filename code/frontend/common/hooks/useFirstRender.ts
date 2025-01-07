import { useEffect, useState } from 'react';

/**
 * Returns true if the component is being rendered for the first time.
 * Returns false in the following renders.
 * Useful for special behaviors on the first render or to avoid an hydration error.
 * @returns boolean value to check if is the first render.
 */
const useFirstRender = (): boolean => {
  const [firstRender, setFirstRender] = useState<boolean>(true);

  useEffect(() => {
    setFirstRender(false);
  }, []);

  return firstRender;
};

export default useFirstRender;
