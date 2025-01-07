import useConditionalComponent from './useConditionalComponent';
import Modal, { ModalProps } from '@/common/components/Modal';

/**
 * Returns a stateful Modal component and functions to update it.
 * @param initialState init component on a visible state.
 * @returns Modal Component and methods to show and hide it.
 */
function useModal<P extends ModalProps>(
  initialState = false,
  CustomModal: React.FC<P> = Modal
) {
  const [StatefulModal, , showModal, hideModal] = useConditionalComponent<P>(
    initialState,
    CustomModal
  );

  return {
    Modal: StatefulModal,
    showModal,
    hideModal,
  };
}

export default useModal;
