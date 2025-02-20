import { LegacyRef, useEffect, useRef } from 'react';

/**
 * Hook to implement infinite scrolling. This hook will trigger the provided
 * fetch function when the user scrolls to the bottom of the container.
 * @param handleFetch - The fetch function to be called when the user scrolls to the bottom
 * @param dependencyEffect - The dependencies to be watched for changes
 * @returns A ref to be attached to the element at the bottom of the list to trigger the fetch function
 */
const useInfiniteScroll = (
  handleFetch: () => Promise<void>,
  dependencyEffect: any[]
): LegacyRef<HTMLDivElement> | undefined => {
  const observerRef = useRef(null); // Create a reference to the observer to persist across renders
  const loading = useRef<boolean>(false);

  useEffect(() => {
    if (!observerRef?.current) return;
    // Create a new IntersectionObserver to watch for intersection changes
    // Iterate through intersection entries
    const observer = new IntersectionObserver((entries) => {
      // Check if the observed element is intersecting and the condition is true
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          // Call the provided callback function
          loading.current = true;
          await handleFetch();
          loading.current = false;
        }
      });
    });
    // Attach the observer to the current element referenced by observerRef

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    // Cleanup function to disconnect the observer when the component unmounts
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [...dependencyEffect]);

  // Return the observer reference to be used in the component.
  // This reference should be attached to the element at the bottom of the list.
  // When that element scrolls into view, the callback function will be called.
  return observerRef;
};

export default useInfiniteScroll;
