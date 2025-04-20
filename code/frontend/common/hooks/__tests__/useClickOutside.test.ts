import { act, renderHook } from '@testing-library/react';
import useClickOutside from '../useClickOutside';
import { fireEvent } from '@testing-library/react';

describe('useClickOutside', () => {
  it('calls handler when clicking outside', async () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside(handler));
    const clickableElement = document.createElement('div');
    const ref: { current: any } = result.current;
    ref.current = clickableElement;
    document.body.appendChild(clickableElement);
    await act(async () => {
      fireEvent.mouseDown(document.body);
      fireEvent.click(document.body);
    });
    expect(handler).toHaveBeenCalled();
  });

  it('does not call handler when clicking inside', async () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside(handler));

    const clickableElement = document.createElement('div');
    const button = document.createElement('button');
    clickableElement.appendChild(button);

    const ref: { current: any } = result.current;
    ref.current = clickableElement;
    document.body.appendChild(clickableElement);

    await act(async () => {
      fireEvent.mouseDown(button);
      fireEvent.click(button);
    });
    expect(handler).not.toHaveBeenCalled();
  });
});
