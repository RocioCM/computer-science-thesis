import { renderHook, act } from '@testing-library/react';
import useDebouncedState from '../useDebouncedState';

jest.useFakeTimers();

describe('useDebouncedState', () => {
  it('initializes correctly', () => {
    const { result } = renderHook(() => useDebouncedState('initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('delays setting the new value', () => {
    const { result } = renderHook(() => useDebouncedState('initial', 1000));
    act(() => {
      result.current[1]('new value');
    });
    expect(result.current[0]).toBe('initial');
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current[0]).toBe('new value');
  });

  it('sets the last value', async () => {
    const { result } = renderHook(() => useDebouncedState('initial', 1000));
    await act(async () => {
      result.current[1]('new value');
    });
    await act(async () => {
      result.current[1]('second value');
    });
    expect(result.current[0]).toBe('initial');
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current[0]).toBe('second value');
  });
});
