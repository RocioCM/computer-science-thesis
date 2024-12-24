import { useEffect, useState } from 'react';

export const BREAKPOINTS = {
  MOBILE: 320,
  TABLET_SMALL: 600,
  TABLET: 768,
  TABLET_LARGE: 900,
  DESKTOP: 1024,
  WIDE: 1440,
};

export const DEFAULT_BREAKPOINT = BREAKPOINTS.TABLET;

/**
 * Returns a boolean values to check if is mobile or desktop.
 * @param {number?} breakPoint breakPoint value to check.
 * @returns boolean isMobile and isDesktop values.
 */
const useResponsive = (breakPoint: number = DEFAULT_BREAKPOINT) => {
  const [isDesktop, setIsDesktop] = useState(true);

  const handleResize = () => {
    setIsDesktop(window.innerWidth > breakPoint);
  };

  // useEffect only runs on client and "window" is only on the client
  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = !isDesktop;

  return { isMobile, isDesktop };
};

export default useResponsive;
