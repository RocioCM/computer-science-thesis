import Modal, { ModalProps } from '@/common/components/Modal';

interface Props extends ModalProps {
  handleCancel: () => any;
  editingId: number | null;
  handleSuccess: () => void;
}

const BatchSaleModal: React.FC<Props> = ({
  editingId,
  handleCancel,
  handleSuccess,
  ...props
}) => {
  return (
    <Modal handleCancel={handleCancel} big skippable={false} {...props}>
      <h2 className="w-full bg-n0">Vender lote de botellas #{editingId}</h2>
    </Modal>
  );
};

export default BatchSaleModal;
