import Modal, { ModalProps } from '@/common/components/Modal';

interface Props extends ModalProps {
  handleCancel: () => any;
  editingId: number | null;
  handleSuccess: () => void;
}

const BatchDetailModal: React.FC<Props> = ({
  editingId,
  handleCancel,
  handleSuccess,
  ...props
}) => {
  return (
    <Modal handleCancel={handleCancel} big skippable={false} {...props}>
      <h2 className="w-full bg-n0">Lote de botellas #{editingId}</h2>
    </Modal>
  );
};

export default BatchDetailModal;
