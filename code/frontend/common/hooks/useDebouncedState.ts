import { useState, useRef, SetStateAction } from 'react';

type DebouncedState<T> = [
  state: T,
  setState: (_newValue: SetStateAction<T>) => void
];

/**
 * Hook to manage a debounced state. It will update the state after a delay.
 * @param initialValue - Initial value of the state.
 * @returns eturns the current value and a function to update it.
 */
function useDebouncedState<T>(
  initialValue: T | (() => T),
  delay: number = 500
): DebouncedState<T> {
  const [value, setValue] = useState<T>(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setDebouncedValue = (newValue: SetStateAction<T>) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => setValue(newValue), delay);
  };

  return [value, setDebouncedValue];
}

export default useDebouncedState;
