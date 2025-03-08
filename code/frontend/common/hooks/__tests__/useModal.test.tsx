import { renderHook, act } from '@testing-library/react';
import useModal from '../useModal';

jest.mock('@/common/components/Modal', () => {
  const Modal = () => <div data-testid="mockModal">Modal</div>;
  return Modal;
});

describe('useModal', () => {
  it('initializes with a hidden modal', () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.Modal({})).toBeNull();
  });

  it('shows and hides modal', () => {
    const { result } = renderHook(() => useModal());
    act(() => {
      result.current.showModal();
    });
    const ModalContent = result.current.Modal({});
    expect(ModalContent).not.toBeNull();
    act(() => {
      result.current.hideModal();
    });
    expect(result.current.Modal({})).toBeNull();
  });
});
