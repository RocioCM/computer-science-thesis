import React, { useEffect, useRef, useState } from 'react';

/**
 * Hook to implement infinite scrolling. This hook will trigger the provided
 * fetch function when the user scrolls to the bottom of the container.
 * @param handleFetch - The fetch function to be called when the user scrolls to the bottom
 * @param threshold? - The threshold in pixels to trigger the fetch function
 * @returns A ref to be attached to the container that needs to be scrolled.
 */
const useInfiniteScroll = (
  handleFetch: () => Promise<void>,
  threshold: number = 50
): React.RefObject<HTMLElement> => {
  const containerRef = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleScroll = async () => {
    const container = containerRef.current;
    // If container is not available or loading, return early. Avoid multiple fetches.
    if (!container || loading) return;

    // Extract relevant scroll dimensions
    const { scrollTop, scrollHeight, clientHeight } = container;
    // Check if the user has scrolled to the bottom within the threshold
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold;

    // If at the bottom, trigger the fetch function.
    if (isAtBottom) {
      setLoading(true);
      await handleFetch();
      setLoading(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) container.addEventListener('scroll', handleScroll);
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef]);

  // Return the container reference to be used in the component.
  // This reference should be attached to the container that needs to be scrolled.
  return containerRef;
};

export default useInfiniteScroll;
