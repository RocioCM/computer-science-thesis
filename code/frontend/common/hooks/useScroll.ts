import { useEffect } from 'react';
import useDebouncedState from './useDebouncedState';

/**
 * Hook to check if the user has scrolled past a certain offset.
 * @param offset - The offset to check if the user has scrolled past.
 * @param elementId - The id of the element to check the scroll on.
 * If not provided, it will check the window scroll.
 * @returns hasScrolled - Boolean value to check if the user has scrolled past the offset.
 * @returns scrollProgress - Number value to check the scroll progress in percentage.
 */
export default function useScroll(offset: number = 0, elementId: string = '') {
  const [hasScrolled, setHasScrolled] = useDebouncedState<boolean>(false, 50);
  const [scrollProgress, setScrollProgress] = useDebouncedState<number>(0, 200);

  useEffect(() => {
    const handleScroll = (e: UIEvent) => {
      const scrollableElement = elementId
        ? (e.target as HTMLElement)
        : (e.target as Document).documentElement;
      const sp = Math.ceil(
        (scrollableElement.scrollTop /
          (scrollableElement.scrollHeight - scrollableElement.clientHeight)) *
          100
      );
      setScrollProgress(sp);

      if (scrollableElement.scrollTop > offset) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    const element = elementId ? document.getElementById(elementId) : window;

    if (element) {
      element.addEventListener('scroll', handleScroll as EventListener);
      return () =>
        element.removeEventListener('scroll', handleScroll as EventListener); // Clean event listener to avoid memory leaks
    }
  }, [offset, elementId]);

  return { hasScrolled, scrollProgress };
}
