import { renderHook } from '@testing-library/react';
import useFirstRender from '../useFirstRender';

describe('useFirstRender', () => {
  it('returns false aafter renders', () => {
    const { result, rerender } = renderHook(() => useFirstRender());
    rerender();
    expect(result.current).toBe(false);
    rerender();
    expect(result.current).toBe(false);
  });
});
