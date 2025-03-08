import { renderHook, act } from '@testing-library/react';
import React from 'react';
import useConditionalComponent from '../useConditionalComponent';

const MockComp = (props: any) => {
  return <div data-testid="mockComponent">{props.children}</div>;
};

describe('useConditionalComponent', () => {
  it('initial state hidden', () => {
    const { result } = renderHook(() =>
      useConditionalComponent(false, MockComp)
    );
    const [Component] = result.current;
    expect(Component({ children: 'Content' })).toBeNull();
  });

  it('shows component when toggled', async () => {
    const { result } = renderHook(() =>
      useConditionalComponent(false, MockComp)
    );
    const [_, toggleShow] = result.current;
    await act(async () => toggleShow());
    const [Component] = result.current;
    const rendered = Component({ children: 'Content' });
    expect(rendered).not.toBeNull();
  });

  it('invokes handleCancel prop', async () => {
    const { result } = renderHook(() =>
      useConditionalComponent(true, MockComp)
    );
    const [Component] = result.current;
    const handleCancel = jest.fn();
    const rendered = Component({ handleCancel });
    // simulate callback
    await act(async () => rendered?.props.handleCancel({}));
    expect(handleCancel).toHaveBeenCalled();
  });
});
