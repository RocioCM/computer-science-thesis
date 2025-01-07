import React, { useEffect, useState } from 'react';

/**
 * Hook to check if an element is on screen.
 * @param ref - React ref to the element to check.
 * @param rootMargin - Margin to check if the element is on screen.
 * @returns boolean value that is true when element is visible on screen.
 */
function useOnScreen(
  ref: React.RefObject<HTMLElement>,
  rootMargin = '0px'
): boolean {
  const [isIntersecting, setIntersecting] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, rootMargin]);

  return isIntersecting;
}

export default useOnScreen;
