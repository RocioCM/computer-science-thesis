import { renderHook, act } from '@testing-library/react';
import useToggle from '../useToggle';

describe('useToggle', () => {
  it('initializes correctly', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('sets initial state', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('toggles state', async () => {
    const { result } = renderHook(() => useToggle());
    await act(async () => result.current[1]()); // switchState
    expect(result.current[0]).toBe(true);
  });

  it('sets true and false', async () => {
    const { result } = renderHook(() => useToggle());
    await act(async () => result.current[2]()); // setTrue
    expect(result.current[0]).toBe(true);
    await act(async () => result.current[3]()); // setFalse
    expect(result.current[0]).toBe(false);
  });
});
