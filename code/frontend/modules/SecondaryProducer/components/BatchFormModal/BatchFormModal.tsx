import Modal, { ModalProps } from '@/common/components/Modal';
import { UpdateTrackingCodePayload } from '../../types';
import SecondaryProducerServices from '../../services';
import { toast } from 'react-toastify';
import useForm from '@/common/hooks/useForm';
import { BATCH_CODE_FORM_INPUTS, BATCH_FORM_STRUCT } from '../../constants';
import Button from '@/common/components/Button';
import { HTTP_STATUS } from '@/common/constants';

export interface Props extends ModalProps {
  handleCancel: () => any;
  editingId: number | null;
  handleSuccess: () => void;
}

const BatchFormModal = ({
  editingId,
  handleCancel,
  handleSuccess,
  ...props
}: Props) => {
  const { form, formBuilder, submitEnabled } = useForm(BATCH_FORM_STRUCT);

  const handleUpdateCode = async () => {
    if (!editingId) return;
    const payload: UpdateTrackingCodePayload = {
      id: editingId,
      trackingCode: form.trackingCode,
    };
    const { ok, status } = await SecondaryProducerServices.updateTrackingCode(
      payload
    );
    if (ok) {
      toast.success('Código de seguimiento actualizado correctamente');
      handleCancel();
      handleSuccess();
    } else if (status === HTTP_STATUS.conflict) {
      toast.error(
        'El código de seguimiento ya está asociado a otro lote. Por favor, verifique el código ingresado'
      );
    } else {
      toast.error('Ocurrió un error al asociar el código de seguimiento');
    }
  };

  return (
    <Modal handleCancel={handleCancel} {...props}>
      <h2 className="w-full bg-n0">Seguimiento del lote #{editingId}</h2>
      <div className="w-full flex flex-col gap-m my-xl">
        {formBuilder(BATCH_CODE_FORM_INPUTS)}
      </div>
      <Button
        handleClick={handleUpdateCode}
        disabled={!submitEnabled}
        width="full"
        label="Guardar"
      />
    </Modal>
  );
};

export default BatchFormModal;
