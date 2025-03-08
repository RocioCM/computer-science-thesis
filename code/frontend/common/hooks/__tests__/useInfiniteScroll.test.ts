import { renderHook } from '@testing-library/react';
import useInfiniteScroll from '../useInfiniteScroll';

describe('useInfiniteScroll', () => {
  beforeAll(() => {
    (global as any).IntersectionObserver = class {
      callback: any;
      constructor(callback: any) {
        this.callback = callback;
      }
      observe = jest
        .fn()
        .mockImplementation(() =>
          this.callback([{ isIntersecting: true }, { isIntersecting: false }])
        );
      unobserve = jest.fn();
    };
  });

  it('does not fetch if element is not observed', () => {
    const mockFetch = jest.fn();
    renderHook(() => useInfiniteScroll(mockFetch, []));
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('calls handleFetch when intersection occurs', async () => {
    const mockFetch = jest.fn().mockResolvedValue(null);
    const { result, rerender } = renderHook(
      ({ fetch, deps }) => useInfiniteScroll(fetch, deps),
      { initialProps: { fetch: mockFetch, deps: [1] } }
    );
    const ref: { current: any } = result.current;
    ref.current = document.createElement('div');

    // Modify dependency effect array to trigger useEffect
    rerender({ fetch: mockFetch, deps: [2] });
    expect(mockFetch).toHaveBeenCalled();
  });
});
