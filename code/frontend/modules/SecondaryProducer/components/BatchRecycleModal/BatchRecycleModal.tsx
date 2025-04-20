import Button from '@/common/components/Button';
import Modal, { ModalProps } from '@/common/components/Modal';
import { toast } from 'react-toastify';
import SecondaryProducerServices from '../../services';
import { RecycleBaseBottlesPayload } from '../../types';
import useForm from '@/common/hooks/useForm';
import { RECYCLE_FORM_INPUTS, RECYCLE_FORM_STRUCT } from '../../constants';

interface Props extends ModalProps {
  handleCancel: () => any;
  editingId: number | null;
  handleSuccess: () => void;
}

const BatchRecycleModal: React.FC<Props> = ({
  editingId,
  handleCancel,
  handleSuccess,
  ...props
}) => {
  const { form, submitEnabled, formBuilder } = useForm(RECYCLE_FORM_STRUCT);

  const handleRecycle = async () => {
    const payload: RecycleBaseBottlesPayload = {
      productBatchId: editingId as number,
      quantity: form.quantity,
    };
    const { ok } = await SecondaryProducerServices.recycleBatch(payload);
    if (ok) {
      toast.success('Envases enviados para reciclaje correctamente');
      handleCancel();
      handleSuccess();
    } else {
      toast.error(
        'No se pudo completar el retiro de circulación. Por favor, inténtelo de nuevo más tarde'
      );
    }
  };

  return (
    <Modal handleCancel={handleCancel} {...props}>
      <h2 className="w-full bg-n0">Reciclaje de lote #{editingId}</h2>
      <div className="w-full flex flex-col gap-m my-xl">
        {formBuilder(RECYCLE_FORM_INPUTS)}
      </div>
      <Button
        handleClick={handleRecycle}
        disabled={!submitEnabled}
        width="full"
        label="Enviar para reciclaje"
      />
    </Modal>
  );
};

export default BatchRecycleModal;
